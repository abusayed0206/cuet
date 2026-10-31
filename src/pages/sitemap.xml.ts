import type { APIRoute } from 'astro';
import { sitemapData, sitemapIndex } from '../lib/sitemap';

// Sitemap index: one file for site pages, one per batch of student profiles.
export const GET: APIRoute = async () => {
  const { batches, batchMod, latest } = await sitemapData();
  return sitemapIndex([
    { path: '/sitemap-pages.xml', lastmod: latest },
    ...batches.map((b) => ({ path: `/sitemap-batch-${b}.xml`, lastmod: batchMod.get(b)! })),
  ]);
};
