import { env } from 'cloudflare:workers';
import { cleanName, meritText, parseId, type Student } from './db';
import { deptByCode, deptLabel, type Department } from './departments';

const SITE = 'https://cuet.sayed.app';

const baseHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
};

/** JSON response. Cacheable at the edge unless `edgeSeconds` is 0. */
export function json(body: unknown, { status = 200, edgeSeconds = 86400 } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...baseHeaders,
      'Cache-Control': edgeSeconds ? `public, max-age=300, s-maxage=${edgeSeconds}` : 'no-store',
    },
  });
}

export function apiError(status: number, code: string, message: string) {
  return json({ error: { code, message } }, { status, edgeSeconds: 0 });
}

export function preflight() {
  return new Response(null, { status: 204, headers: { ...baseHeaders, 'Access-Control-Max-Age': '86400' } });
}

/** Returns a 429 response when the caller is over the limit, otherwise null. */
export async function rateLimit(request: Request) {
  const limiter = (env as unknown as { API_RATE_LIMITER?: RateLimit }).API_RATE_LIMITER;
  if (!limiter) return null; // not bound in local dev
  const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await limiter.limit({ key });
  return success ? null : apiError(429, 'rate_limited', 'Too many requests. The limit is 60 per minute per IP; please slow down or cache responses.');
}

export function apiDept(d: Department, batch?: string) {
  const label = deptLabel(d, batch);
  return { code: d.code, slug: d.slug, short: label.short, name: label.name };
}

export function apiStudent(s: Student) {
  const { batch, code, roll } = parseId(s.studentid);
  const d = deptByCode(code);
  return {
    id: s.studentid,
    name: cleanName(s.name),
    department: d ? apiDept(d, batch) : null,
    batch,
    session: s.session,
    class_roll: Number(roll),
    admission_roll: s.admission_roll || null,
    admission_merit: meritText(s.admission_merit) || null,
    url: `${SITE}/${s.studentid}`,
  };
}

export type ApiStudent = ReturnType<typeof apiStudent>;
