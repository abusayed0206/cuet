import type { APIRoute } from 'astro';
import { ID_RE, getStudent } from '../../../../lib/db';
import { apiError, apiStudent, json, preflight, rateLimit } from '../../../../lib/api';

export const GET: APIRoute = async ({ params, request }) => {
  const limited = await rateLimit(request);
  if (limited) return limited;

  const id = params.id ?? '';
  if (!ID_RE.test(id)) return apiError(400, 'invalid_id', 'A student ID is exactly 7 digits, e.g. 2504001.');
  const s = await getStudent(id);
  if (!s) return apiError(404, 'not_found', `No student with ID ${id}.`);
  return json({ data: apiStudent(s) });
};

export const OPTIONS: APIRoute = () => preflight();
