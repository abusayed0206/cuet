import { apiGet, ApiError } from './api-client';
import { deptByCode, type Department } from './departments';

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

// The shape the API returns.
interface ApiStudent {
  id: string;
  name: string;
  department: { code: string; slug: string; short: string; name: string } | null;
  batch: string;
  session: string;
  class_roll: number | null;
  admission_roll: string | null;
  admission_merit: string | null;
}

/** The student ID is the URL key and nothing else: the batch, the department
 * and the class roll are columns of their own. */
export const ID_RE = /^\d{2}(\d{5}|\d{2}[a-z]{3}|[a-z]{5})$/;

function toStudent(s: ApiStudent): Student {
  return {
    name: s.name,
    studentid: s.id,
    dept_code: s.department?.code ?? '00',
    class_roll: s.class_roll === null ? null : String(s.class_roll).padStart(3, '0'),
    admission_roll: s.admission_roll,
    admission_merit: s.admission_merit,
    batch: s.batch,
    session: s.session,
  };
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
  try {
    const { data } = await apiGet<{ data: ApiStudent }>(`/api/v1/students/${encodeURIComponent(id)}`);
    return toStudent(data);
  } catch (err) {
    // A missing student is a page 404, not an upstream outage.
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

/** Previous/next student in the same class plus class size, in one call. */
export async function getNeighbours(student: Student) {
  const { data } = await apiGet<{ data: ApiStudent & { neighbours: { prev: { id: string; name: string } | null; next: { id: string; name: string } | null; class_size: number } } }>(
    `/api/v1/students/${encodeURIComponent(student.studentid)}`,
    { include: 'neighbours' },
  );
  return {
    prev: data.neighbours.prev,
    next: data.neighbours.next,
    classSize: data.neighbours.class_size,
  };
}

// ---------- a class (batch + department) ----------

export async function getClass(batch: string, code: string) {
  const dept = deptByCode(code);
  if (!dept) return [];
  try {
    const { data } = await apiGet<{ data: ApiStudent[] }>(`/api/v1/batches/${batch}/${dept.slug}`);
    return data.map(toStudent);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return [];
    throw err;
  }
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

interface ApiOverview {
  total: number;
  batches: { batch: string; session: string; count: number; classes: ClassSummary[] }[];
  departments: { code: string; slug: string; short: string; name: string; count: number; classes: ClassSummary[] }[];
}

export async function getOverview(): Promise<Overview> {
  const { data } = await apiGet<{ data: ApiOverview }>('/api/v1/overview');
  const batches = data.batches.map((b) => ({
    batch: b.batch,
    session: b.session,
    count: b.count,
    classes: b.classes.map((c) => ({ ...c, dept: deptByCode(c.code) as Department })),
  }));
  const departments = data.departments.map((d) => ({
    dept: deptByCode(d.code) ?? { code: d.code, slug: d.slug, short: d.short, name: d.name },
    count: d.count,
    classes: d.classes,
  }));
  return { total: data.total, batches, departments };
}

// ---------- search ----------

export interface SearchOptions {
  batch?: string;
  code?: string;
  limit?: number;
}

/**
 * Name search, or an ID prefix when the query is digits ("25" -> batch 25,
 * "2504" -> CSE '25'). The search itself lives in the API, next to the data.
 */
export async function searchStudents(q: string, { batch, code, limit = 100 }: SearchOptions = {}) {
  const dept = code ? deptByCode(code) : undefined;
  try {
    const { data, meta } = await apiGet<{ data: ApiStudent[]; meta: { count: number; has_more: boolean } }>(
      '/api/v1/search',
      { q, batch, dept: dept?.slug, limit },
    );
    return { results: data.map(toStudent), more: meta.has_more };
  } catch (err) {
    // No matches is an empty result set, not an upstream failure.
    if (err instanceof ApiError && err.status === 404) return { results: [], more: false };
    throw err;
  }
}

// ---------- sitemap ----------

export interface SitemapRow {
  studentid: string;
  batch: string;
  updated: string; // YYYY-MM-DD
}

/** One batch only. */
export async function getSitemapRows(batch: string) {
  const { data } = await apiGet<{ data: { id: string; updated: string }[] }>(`/api/v1/sitemap/${batch}`);
  return data.map((r) => ({ studentid: r.id, batch, updated: r.updated }));
}
