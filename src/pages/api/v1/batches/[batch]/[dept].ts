import type { APIRoute } from 'astro';
import { getClass } from '../../../../../lib/db';
import { deptBySlug } from '../../../../../lib/departments';
import { apiDept, apiError, apiStudent, json, preflight, rateLimit } from '../../../../../lib/api';

export const GET: APIRoute = async ({ params, request }) => {
  const limited = await rateLimit(request);
  if (limited) return limited;

  const batch = params.batch ?? '';
  const dept = deptBySlug(params.dept ?? '');
  if (!/^\d{2}$/.test(batch)) return apiError(400, 'invalid_batch', 'batch is two digits, e.g. 25.');
  if (!dept) return apiError(400, 'invalid_dept', 'Unknown dept. See /api/v1/departments for slugs.');

  const students = await getClass(batch, dept.code);
  if (!students.length) return apiError(404, 'not_found', `No students in ${dept.short} batch ${batch}.`);
  return json({
    data: students.map(apiStudent),
    meta: { batch, session: students[0]!.session, department: apiDept(dept, batch), count: students.length },
  });
};

export const OPTIONS: APIRoute = () => preflight();
