import type { APIRoute } from 'astro';

// Kept because search consoles were given this URL by the old site.
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap><loc>${site!.origin}/sitemap.xml</loc></sitemap>\n</sitemapindex>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } },
  );
