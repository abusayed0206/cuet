import { getOverview, getSitemapRows } from './db';

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
 * Index and page sitemaps, with lastmod from class_counts (via the overview):
 * a batch/class/department page changes when any of its students does.
 */
export async function sitemapData() {
  const { batches: all, departments } = await getOverview();
  const newest = (dates: string[]) => dates.reduce(max, STATIC_LASTMOD);
  const batchMod = new Map(all.map((b) => [b.batch, newest(b.classes.map((c) => c.updated))]));
  const batches = all.map((b) => b.batch);
  const latest = newest([...batchMod.values()]);

  const pages: Entry[] = [
    { path: '/', lastmod: latest },
    { path: '/batch', lastmod: latest },
    { path: '/department', lastmod: latest },
    { path: '/api', lastmod: STATIC_LASTMOD },
    { path: '/privacy', lastmod: '2026-04-01' },
    { path: '/privacy/v1', lastmod: '2025-07-25' },
    { path: '/terms', lastmod: '2026-04-01' },
    ...all.map((b) => ({ path: `/batch/${b.batch}`, lastmod: batchMod.get(b.batch)! })),
    ...all.flatMap((b) => b.classes.map((c) => ({ path: `/batch/${b.batch}/${c.dept.slug}`, lastmod: newest([c.updated]) }))),
    ...departments.map((d) => ({ path: `/department/${d.dept.slug}`, lastmod: newest(d.classes.map((c) => c.updated)) })),
  ];

  return { batches, batchMod, pages, latest };
}

/** Every student profile in one batch; null if the batch is unknown. */
export async function batchSitemapRows(batch: string) {
  if (!/^\d{2}$/.test(batch)) return null;
  const rows = await getSitemapRows(batch);
  return rows.length ? rows.map((r) => ({ path: `/${r.studentid}`, lastmod: r.updated || STATIC_LASTMOD })) : null;
}
