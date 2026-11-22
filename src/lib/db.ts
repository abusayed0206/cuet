import { env } from 'cloudflare:workers';
import { DEPARTMENTS, deptByCode, type Department } from './departments';

export interface Student {
  name: string;
  studentid: string;
  dept_code: string;
  class_roll: string | null;
  admission_roll: string | null;
  admission_merit: string | null;
  batch: string;
  session: string;
}

const COLS = 'name, studentid, dept_code, class_roll, admission_roll, admission_merit, batch, session';

// The student ID is the URL key and nothing else: the batch, the department
// and the class roll are columns. Real CUET IDs are seven digits (YY DD RRR);
// the pre-2012 intakes carry a hash, either after the department code or -
// when the source published no department - right after the batch.
export const ID_RE = /^\d{2}(\d{5}|\d{2}[a-z]{3}|[a-z]{5})$/;

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

/**
 * What the printed merit means in a batch. The scales are not comparable:
 * batch 03 is the admission merit position, batch 11 the department
 * allotment merit, batch 16 the admission-test merit, batches 04 and 08 the
 * merit value as published.
 */
const MERIT_LABEL: Record<string, string> = {
  '03': 'Admission merit',
  '04': 'Published merit',
  '08': 'Published merit',
  '11': 'Department merit',
  '16': 'Admission-test merit',
};

export function meritLabel(batch: string) {
  return MERIT_LABEL[batch] ?? 'Merit';
}

// ---------- single student ----------

export async function getStudent(id: string) {
  return env.DB.prepare(`SELECT ${COLS} FROM students WHERE studentid = ?`).bind(id).first<Student>();
}

/** Previous/next student in the same class plus class size (from the overview). */
export async function getNeighbours(student: Student) {
  const { studentid: id, batch, dept_code: code } = student;
  const [[prev, next], overview] = await Promise.all([
    env.DB.batch([
      env.DB.prepare('SELECT studentid, name FROM students WHERE batch = ? AND dept_code = ? AND studentid < ? ORDER BY studentid DESC LIMIT 1').bind(batch, code, id),
      env.DB.prepare('SELECT studentid, name FROM students WHERE batch = ? AND dept_code = ? AND studentid > ? ORDER BY studentid ASC LIMIT 1').bind(batch, code, id),
    ]),
    getOverview(),
  ]);
  type Row = { studentid: string; name: string };
  return {
    prev: (prev.results[0] as Row | undefined) ?? null,
    next: (next.results[0] as Row | undefined) ?? null,
    classSize: overview.batches.find((b) => b.batch === batch)?.classes.find((c) => c.code === code)?.count ?? 0,
  };
}

// ---------- a class (batch + department) ----------

export async function getClass(batch: string, code: string) {
  const { results } = await env.DB.prepare(`SELECT ${COLS} FROM students WHERE batch = ? AND dept_code = ? ORDER BY studentid`)
    .bind(batch, code)
    .all<Student>();
  return results;
}

// ---------- overview: counts per batch x department ----------

export interface ClassSummary {
  batch: string;
  code: string;
  session: string;
  count: number;
  updated: string; // YYYY-MM-DD, latest student change in the class
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
  departments: DeptSummary[]; // only those with students, in table order
}

// class_counts is precomputed by scripts/refresh-derived.sql (one row per class
// instead of scanning every student). Data only changes on imports, so also
// keep it in isolate memory.
let cached: { at: number; data: Overview } | null = null;
const TTL_MS = 60 * 60 * 1000;

export async function getOverview(): Promise<Overview> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;

  const { results } = await env.DB.prepare(
    'SELECT batch, code, session, count, updated FROM class_counts ORDER BY batch DESC, code ASC',
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

/** Typographic dashes are stored as '-', so a query has to be folded too. */
export function normalizeQuery(q: string) {
  return q.replace(/[\u2010-\u2015\u2212]/g, '-');
}

/**
 * Words that are written in more than one way. A name is searched with the
 * way it is written and with the ways it is often written, so "mohammad
 * kawsarul" finds "Md. Kawsarul Islam" and the other way round.
 */
const SYNONYMS: Record<string, string[]> = {
  md: ['mohammad', 'muhammad'],
  mohammad: ['md'],
  muhammad: ['md'],
  mst: ['most', 'musammat'],
  most: ['mst'],
  min: ['minur'],
  minim: ['minur'],
};

/** The next word after "rah" in the index: "rai". */
const nextWord = (w: string) => w.slice(0, -1) + String.fromCharCode(w.charCodeAt(w.length - 1) + 1);

/**
 * Name search: every word must appear somewhere in the name (case-insensitive),
 * and the longest word must also start a word of the name. That word is looked
 * up in the indexed name_words table so only candidates are read, not every row.
 * Digit-only queries match student IDs by prefix ("25" -> batch 25, "2504" -> CSE '25).
 */
export async function searchStudents(q: string, { batch, code, limit = 100 }: SearchOptions = {}) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  const query = normalizeQuery(q.trim());

  if (/^\d{1,7}$/.test(query)) {
    // An ID prefix ("25" -> batch 25, "2504" -> CSE '25'). The pre-2012 IDs
    // carry a hash instead of a class roll and are not IDs, so they are left
    // out - those students are found by name.
    where.push('studentid BETWEEN ? AND ?');
    params.push(query.padEnd(7, '0'), query.padEnd(7, '9'));
    where.push('class_roll IS NOT NULL');
  } else if (ID_RE.test(query)) {
    // A pre-2012 student ID, e.g. "0301kqm" - there is only one.
    where.push('studentid = ?');
    params.push(query);
  } else {
    // Same separators and lowercasing as scripts/refresh-derived.sql.
    const words = query.toLowerCase().split(/[\s.\-()]+/).filter(Boolean);
    const key = words.reduce((a, w) => (w.length > a.length ? w : a), '');
    if (!key) return { results: [] as Student[], more: false };
    // Prefix range: "rah" -> word >= 'rah' AND word < 'rai'. The longest word
    // (and the words it can also be written as) picks the candidates.
    const keyVariants = [key, ...(SYNONYMS[key] ?? [])];
    where.push(`studentid IN (SELECT studentid FROM name_words WHERE ${keyVariants.map(() => '(word >= ? AND word < ?)').join(' OR ')})`);
    for (const v of keyVariants) params.push(v, nextWord(v));
    // Every word has to appear in the name, written the way it is written or
    // the way it is often written ("mohammad" also finds "Md.").
    for (const word of words.slice(0, 6)) {
      const variants = [word, ...(SYNONYMS[word] ?? [])];
      where.push(`(${variants.map(() => "name LIKE ? ESCAPE '\\'").join(' OR ')})`);
      for (const v of variants) params.push(`%${escapeLike(v)}%`);
    }
  }
  if (batch) {
    where.push('batch = ?');
    params.push(batch);
  }
  if (code) {
    where.push('dept_code = ?');
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

export interface SitemapRow {
  studentid: string;
  batch: string;
  code: string;
  updated: string; // YYYY-MM-DD
}

/** One batch only, via the batch index. */
export async function getSitemapRows(batch: string) {
  const { results } = await env.DB.prepare(
    `SELECT studentid, batch, dept_code AS code, date(COALESCE(updated_at, created_at)) AS updated
     FROM students WHERE batch = ? ORDER BY studentid`,
  )
    .bind(batch)
    .all<SitemapRow>();
  return results;
}
