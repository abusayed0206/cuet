import type { APIRoute } from 'astro';
import { getAllIds, getOverview } from '../lib/db';

export const GET: APIRoute = async ({ site }) => {
  const base = site!.origin;
  const [ids, { batches, departments }] = await Promise.all([getAllIds(), getOverview()]);

  const paths = [
    '/',
    '/batch',
    '/department',
    '/privacy',
    '/terms',
    ...batches.map((b) => `/batch/${b.batch}`),
    ...batches.flatMap((b) => b.classes.map((c) => `/batch/${b.batch}/${c.dept.slug}`)),
    ...departments.map((d) => `/department/${d.dept.slug}`),
    ...ids.map((id) => `/${id}`),
  ];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((p) => `<url><loc>${base}${p}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
