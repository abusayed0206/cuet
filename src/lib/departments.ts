// Departments keyed by the two digits in a CUET student ID (YY DD RRR).
// The ID is the reliable source: the `department` text column in D1 is
// inconsistent between imports ("Department of CSE…" vs "CSE").

export interface Department {
  code: string; // "04"
  slug: string; // "cse"
  short: string; // "CSE"
  name: string; // "Computer Science & Engineering"
}

export const DEPARTMENTS: Department[] = [
  { code: '01', slug: 'ce', short: 'CE', name: 'Civil Engineering' },
  { code: '02', slug: 'eee', short: 'EEE', name: 'Electrical & Electronic Engineering' },
  { code: '03', slug: 'me', short: 'ME', name: 'Mechanical Engineering' },
  { code: '04', slug: 'cse', short: 'CSE', name: 'Computer Science & Engineering' },
  { code: '05', slug: 'urp', short: 'URP', name: 'Urban & Regional Planning' },
  { code: '06', slug: 'arch', short: 'ARCH', name: 'Architecture' },
  { code: '07', slug: 'pme', short: 'PME', name: 'Petroleum & Mining Engineering' },
  { code: '08', slug: 'ete', short: 'ETE', name: 'Electronics & Telecommunication Engineering' },
  { code: '09', slug: 'mie', short: 'MIE', name: 'Mechatronics & Industrial Engineering' },
  { code: '10', slug: 'wre', short: 'WRE', name: 'Water Resources Engineering' },
  { code: '11', slug: 'bme', short: 'BME', name: 'Biomedical Engineering' },
  { code: '12', slug: 'mme', short: 'MME', name: 'Materials & Metallurgical Engineering' },
];

// Old slugs used by the previous site.
const ALIASES: Record<string, string> = { wrp: 'wre', mse: 'mme' };

const byCode = new Map(DEPARTMENTS.map((d) => [d.code, d]));
const bySlug = new Map(DEPARTMENTS.map((d) => [d.slug, d]));

export function deptByCode(code: string): Department | undefined {
  return byCode.get(code);
}

export function deptBySlug(slug: string): Department | undefined {
  const s = slug.toLowerCase();
  return bySlug.get(ALIASES[s] ?? s);
}

/** Canonical slug if `slug` is an old alias, otherwise undefined. */
export function aliasTarget(slug: string): string | undefined {
  return ALIASES[slug.toLowerCase()];
}

/** Department 12 was "Materials Science & Engineering" up to batch 22. */
export function deptLabel(d: Department, batch?: string): { short: string; name: string } {
  if (d.code === '12' && batch && Number(batch) <= 22) {
    return { short: 'MSE', name: 'Materials Science & Engineering' };
  }
  return { short: d.short, name: d.name };
}
