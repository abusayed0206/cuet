import { env } from 'cloudflare:workers';
import { DEPARTMENTS, deptByCode, type Department } from './departments';

export interface Student {
  name: string;
  studentid: string;
  admission_roll: string | null;
  admission_merit: string | null;
  batch: string;
  session: string;
}

const COLS = 'name, studentid, admission_roll, admission_merit, batch, session';

export const ID_RE = /^\d{7}$/;

/** "2504001" -> { batch: "25", code: "04", roll: "001" } */
export function parseId(id: string) {
  return { batch: id.slice(0, 2), code: id.slice(2, 4), roll: id.slice(4) };
}

export function cleanName(name: string) {
  return name.replace(/\s+/g, ' ').trim();
}

/** Merit is free text ("123", "T-5", "632(T KHA-02)"); "" and "A FAILURE" mean unknown. */
export function meritText(m: string | null) {
  const v = (m ?? '').trim();
  return v && v !== 'A FAILURE' ? v : '';
}

export function meritSortKey(m: string | null) {
  const n = parseInt(meritText(m), 10);
  return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
}

// ---------- single student ----------

export async function getStudent(id: string) {
  return env.DB.prepare(`SELECT ${COLS} FROM students WHERE studentid = ?`).bind(id).first<Student>();
}

/** Previous/next student in the same class plus class size, in one round trip. */
export async function getNeighbours(id: string) {
  const { batch, code } = parseId(id);
  const lo = `${batch}${code}000`;
  const hi = `${batch}${code}999`;
  const [prev, next, count] = await env.DB.batch([
    env.DB.prepare('SELECT studentid, name FROM students WHERE studentid >= ? AND studentid < ? ORDER BY studentid DESC LIMIT 1').bind(lo, id),
    env.DB.prepare('SELECT studentid, name FROM students WHERE studentid > ? AND studentid <= ? ORDER BY studentid ASC LIMIT 1').bind(id, hi),
    env.DB.prepare('SELECT COUNT(*) AS n FROM students WHERE studentid BETWEEN ? AND ?').bind(lo, hi),
  ]);
  type Row = { studentid: string; name: string };
  return {
    prev: (prev.results[0] as Row | undefined) ?? null,
    next: (next.results[0] as Row | undefined) ?? null,
    classSize: (count.results[0] as { n: number }).n,
  };
}

// ---------- a class (batch + department) ----------

export async function getClass(batch: string, code: string) {
  const { results } = await env.DB.prepare(`SELECT ${COLS} FROM students WHERE studentid BETWEEN ? AND ? ORDER BY studentid`)
    .bind(`${batch}${code}000`, `${batch}${code}999`)
    .all<Student>();
  return results;
}

// ---------- overview: counts per batch x department ----------

export interface ClassSummary {
  batch: string;
  code: string;
  session: string;
  count: number;
}

export interface BatchSummary {
  batch: string;
  session: string;
  count: number;
  classes: (ClassSummary & { dept: Department })[];
}

export interface DeptSummary {
  dept: Department;
  count: number;
  classes: ClassSummary[]; // newest first
}

export interface Overview {
  total: number;
  batches: BatchSummary[]; // newest first
  departments: DeptSummary[]; // in code order, only those with students
}

// The data changes only when a new batch is imported, so keep the overview in
// isolate memory for a while instead of scanning the table on every request.
let cached: { at: number; data: Overview } | null = null;
const TTL_MS = 10 * 60 * 1000;

export async function getOverview(): Promise<Overview> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;

  const { results } = await env.DB.prepare(
    `SELECT batch, substr(studentid, 3, 2) AS code, MIN(session) AS session, COUNT(*) AS count
     FROM students GROUP BY batch, code ORDER BY batch DESC, code ASC`,
  ).all<ClassSummary>();

  const batches = new Map<string, BatchSummary>();
  const depts = new Map<string, DeptSummary>();
  let total = 0;

  for (const row of results) {
    const dept = deptByCode(row.code);
    if (!dept) continue;
    total += row.count;

    let b = batches.get(row.batch);
    if (!b) batches.set(row.batch, (b = { batch: row.batch, session: row.session, count: 0, classes: [] }));
    b.count += row.count;
    b.classes.push({ ...row, dept });

    let d = depts.get(row.code);
    if (!d) depts.set(row.code, (d = { dept, count: 0, classes: [] }));
    d.count += row.count;
    d.classes.push(row);
  }

  const data: Overview = {
    total,
    batches: [...batches.values()],
    departments: DEPARTMENTS.map((d) => depts.get(d.code)).filter((d): d is DeptSummary => !!d),
  };
  cached = { at: Date.now(), data };
  return data;
}

// ---------- search ----------

export interface SearchOptions {
  batch?: string;
  code?: string;
  limit?: number;
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/**
 * Name search: every word must appear somewhere in the name (case-insensitive).
 * Digit-only queries match student IDs by prefix ("25" -> batch 25, "2504" -> CSE '25).
 */
export async function searchStudents(q: string, { batch, code, limit = 100 }: SearchOptions = {}) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  const query = q.trim();

  if (/^\d{1,7}$/.test(query)) {
    where.push('studentid BETWEEN ? AND ?');
    params.push(query.padEnd(7, '0'), query.padEnd(7, '9'));
  } else {
    for (const word of query.split(/\s+/).filter(Boolean).slice(0, 6)) {
      where.push("name LIKE ? ESCAPE '\\'");
      params.push(`%${escapeLike(word)}%`);
    }
  }
  if (batch) {
    where.push('batch = ?');
    params.push(batch);
  }
  if (code) {
    where.push('substr(studentid, 3, 2) = ?');
    params.push(code);
  }
  if (!where.length) return { results: [] as Student[], more: false };

  params.push(limit + 1);
  const { results } = await env.DB.prepare(
    `SELECT ${COLS} FROM students WHERE ${where.join(' AND ')} ORDER BY batch DESC, studentid ASC LIMIT ?`,
  )
    .bind(...params)
    .all<Student>();

  return { results: results.slice(0, limit), more: results.length > limit };
}

// ---------- sitemap ----------

export async function getAllIds() {
  const { results } = await env.DB.prepare('SELECT studentid FROM students ORDER BY studentid').all<{ studentid: string }>();
  return results.map((r) => r.studentid);
}
