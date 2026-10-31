import type { APIRoute } from 'astro';
import { ID_RE, cleanName, getStudent } from '../../../lib/db';
import { deptByCode, deptLabel } from '../../../lib/departments';
import { apiError, json, preflight, rateLimit } from '../../../lib/api';

/** Legacy endpoint from the old site, kept for existing integrations. Prefer /api/v1/students/:id. */
export const GET: APIRoute = async ({ params, request }) => {
  const limited = await rateLimit(request);
  if (limited) return limited;

  const id = params.studentid ?? '';
  if (!ID_RE.test(id)) return apiError(400, 'invalid_id', 'A student ID is exactly 7 digits.');
  const s = await getStudent(id);
  if (!s) return apiError(404, 'not_found', `No student with ID ${id}.`);
  const d = deptByCode(id.slice(2, 4));
  return json({
    name: cleanName(s.name),
    studentid: s.studentid,
    department: d ? `Department of ${deptLabel(d, s.batch).name}` : null,
    admission_roll: s.admission_roll,
    admission_merit: s.admission_merit,
    batch: s.batch,
    session: s.session,
  });
};

export const OPTIONS: APIRoute = () => preflight();
