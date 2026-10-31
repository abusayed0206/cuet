import type { APIRoute } from 'astro';
import { sitemapData, urlset } from '../lib/sitemap';

// Every student profile in one batch, e.g. /sitemap-batch-25.xml.
export const GET: APIRoute = async ({ params }) => {
  const rows = (await sitemapData()).byBatch.get(params.batch ?? '');
  if (!rows) return new Response('Not found', { status: 404 });
  return urlset(rows.map((r) => ({ path: `/${r.studentid}`, lastmod: r.updated })));
};
