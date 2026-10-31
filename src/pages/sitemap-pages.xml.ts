import type { APIRoute } from 'astro';
import { sitemapData, urlset } from '../lib/sitemap';

// Home, listings, batch/class/department pages and static pages.
export const GET: APIRoute = async () => urlset((await sitemapData()).pages);
