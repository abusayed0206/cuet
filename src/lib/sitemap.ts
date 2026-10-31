import { getSitemapRows, type SitemapRow } from './db';
import { deptByCode } from './departments';

export const SITE = 'https://cuet.sayed.app';

// Date the static pages last changed meaningfully. Bump when they do.
const STATIC_LASTMOD = '2026-10-31';

const xmlHeaders = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
  'X-Robots-Tag': 'noindex',
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const max = (a: string, b: string) => (a > b ? a : b);

export interface Entry {
  path: string;
  lastmod: string;
}

export function urlset(entries: Entry[]) {
  const body = entries.map((e) => `<url><loc>${esc(SITE + e.path)}</loc><lastmod>${e.lastmod}</lastmod></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: xmlHeaders },
  );
}

export function sitemapIndex(entries: Entry[]) {
  const body = entries.map((e) => `<sitemap><loc>${esc(SITE + e.path)}</loc><lastmod>${e.lastmod}</lastmod></sitemap>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`,
    { headers: xmlHeaders },
  );
}

/**
 * Everything the sitemaps need, with lastmod rolled up from student rows:
 * a batch/class/department page changes when any of its students does.
 */
export async function sitemapData() {
  const rows = await getSitemapRows();
  const byBatch = new Map<string, SitemapRow[]>();
  const classMod = new Map<string, string>(); // "25/cse" -> date
  const deptMod = new Map<string, string>(); // "cse" -> date
  let latest = STATIC_LASTMOD;

  for (const r of rows) {
    const updated = r.updated || STATIC_LASTMOD;
    latest = max(latest, updated);
    if (!byBatch.has(r.batch)) byBatch.set(r.batch, []);
    byBatch.get(r.batch)!.push(r);
    const slug = deptByCode(r.code)?.slug;
    if (!slug) continue;
    const k = `${r.batch}/${slug}`;
    classMod.set(k, max(classMod.get(k) ?? '', updated));
    deptMod.set(slug, max(deptMod.get(slug) ?? '', updated));
  }

  const batchMod = new Map([...byBatch].map(([b, rs]) => [b, rs.reduce((m, r) => max(m, r.updated || STATIC_LASTMOD), '')]));
  const batches = [...byBatch.keys()].sort().reverse();

  const pages: Entry[] = [
    { path: '/', lastmod: latest },
    { path: '/batch', lastmod: latest },
    { path: '/department', lastmod: latest },
    { path: '/api', lastmod: STATIC_LASTMOD },
    { path: '/privacy', lastmod: '2026-04-01' },
    { path: '/privacy/v1', lastmod: '2025-07-25' },
    { path: '/terms', lastmod: '2026-04-01' },
    ...batches.map((b) => ({ path: `/batch/${b}`, lastmod: batchMod.get(b)! })),
    ...[...classMod].map(([k, d]) => ({ path: `/batch/${k}`, lastmod: d })),
    ...[...deptMod].map(([slug, d]) => ({ path: `/department/${slug}`, lastmod: d })),
  ];

  return { rows, byBatch, batches, batchMod, pages, latest };
}
