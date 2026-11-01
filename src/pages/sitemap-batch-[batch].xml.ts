import type { APIRoute } from 'astro';
import { batchSitemapRows, urlset } from '../lib/sitemap';

// Every student profile in one batch, e.g. /sitemap-batch-25.xml.
export const GET: APIRoute = async ({ params }) => {
  const entries = await batchSitemapRows(params.batch ?? '');
  if (!entries) return new Response('Not found', { status: 404 });
  return urlset(entries);
};
