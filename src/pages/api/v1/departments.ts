import type { APIRoute } from 'astro';
import { getOverview } from '../../../lib/db';
import { apiDept, json, preflight, rateLimit } from '../../../lib/api';

export const GET: APIRoute = async ({ request }) => {
  const limited = await rateLimit(request);
  if (limited) return limited;

  const { departments } = await getOverview();
  return json({
    data: departments.map(({ dept, count, classes }) => ({
      ...apiDept(dept),
      students: count,
      batches: classes.map((c) => ({ batch: c.batch, session: c.session, students: c.count })),
    })),
  });
};

export const OPTIONS: APIRoute = () => preflight();
