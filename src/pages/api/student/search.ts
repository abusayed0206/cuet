import type { APIRoute } from 'astro';
import { cleanName, searchStudents } from '../../../lib/db';
import { deptByCode, deptLabel } from '../../../lib/departments';
import { apiError, json, preflight, rateLimit } from '../../../lib/api';

/** Legacy endpoint from the old site, kept for existing integrations. Prefer /api/v1/search. */
export const GET: APIRoute = async ({ url, request }) => {
  const limited = await rateLimit(request);
  if (limited) return limited;

  const q = (url.searchParams.get('query') ?? '').trim().slice(0, 80);
  if (q.length < 2) return apiError(400, 'invalid_query', 'Pass query with at least 2 characters.');
  const { results } = await searchStudents(q, { limit: 50 });
  return json(
    {
      results: results.map((s) => {
        const d = deptByCode(s.studentid.slice(2, 4));
        return {
          name: cleanName(s.name),
          studentid: s.studentid,
          department: d ? `Department of ${deptLabel(d, s.batch).name}` : null,
          batch: s.batch,
        };
      }),
    },
    { edgeSeconds: 3600 },
  );
};

export const OPTIONS: APIRoute = () => preflight();
