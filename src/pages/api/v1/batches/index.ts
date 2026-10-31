import type { APIRoute } from 'astro';
import { getOverview } from '../../../../lib/db';
import { apiDept, json, preflight, rateLimit } from '../../../../lib/api';

export const GET: APIRoute = async ({ request }) => {
  const limited = await rateLimit(request);
  if (limited) return limited;

  const { total, batches } = await getOverview();
  return json({
    data: batches.map((b) => ({
      batch: b.batch,
      session: b.session,
      students: b.count,
      departments: b.classes.map((c) => ({ ...apiDept(c.dept, b.batch), students: c.count })),
    })),
    meta: { students: total, batches: batches.length },
  });
};

export const OPTIONS: APIRoute = () => preflight();
