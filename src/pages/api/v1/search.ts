import type { APIRoute } from 'astro';
import { searchStudents } from '../../../lib/db';
import { deptBySlug } from '../../../lib/departments';
import { apiError, apiStudent, json, preflight, rateLimit } from '../../../lib/api';

export const GET: APIRoute = async ({ url, request }) => {
  const limited = await rateLimit(request);
  if (limited) return limited;

  const q = (url.searchParams.get('q') ?? '').trim().slice(0, 80);
  const batch = url.searchParams.get('batch') ?? '';
  const deptParam = url.searchParams.get('dept') ?? '';
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') ?? '20', 10) || 20, 1), 100);

  if (!q || (q.length < 2 && !/^\d$/.test(q))) {
    return apiError(400, 'invalid_query', 'Pass q with at least 2 characters (a name) or digits (an ID prefix).');
  }
  if (batch && !/^\d{2}$/.test(batch)) return apiError(400, 'invalid_batch', 'batch is two digits, e.g. 25.');
  const dept = deptParam ? deptBySlug(deptParam) : undefined;
  if (deptParam && !dept) return apiError(400, 'invalid_dept', 'Unknown dept. See /api/v1/departments for slugs.');

  const { results, more } = await searchStudents(q, { batch: batch || undefined, code: dept?.code, limit });
  return json(
    {
      data: results.map(apiStudent),
      meta: { query: q, batch: batch || null, dept: dept?.slug ?? null, count: results.length, limit, has_more: more },
    },
    { edgeSeconds: 3600 },
  );
};

export const OPTIONS: APIRoute = () => preflight();
