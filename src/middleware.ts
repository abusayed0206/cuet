import { defineMiddleware } from 'astro:middleware';

/**
 * Edge cache for server-rendered pages. Pages opt in by sending
 * `Cache-Control: ... s-maxage=N` (see lib/http.ts). The key includes the
 * build id so every deploy starts with a fresh cache.
 */
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (!import.meta.env.PROD || ctx.request.method !== 'GET' || typeof caches === 'undefined') {
    return next();
  }

  const key = new URL(ctx.url);
  key.searchParams.set('__v', __BUILD_ID__);
  const cacheKey = new Request(key.href);
  const cache = (caches as unknown as { default: Cache }).default;

  const hit = await cache.match(cacheKey);
  if (hit) return withSecurityHeaders(hit);

  let res: Response;
  try {
    res = await next();
  } catch (err) {
    // The directory is backed by the VPS API. Report upstream failures with
    // a 503 rather than a 404, so search engines do not remove valid pages.
    console.error('request failed', err);
    return new Response('The directory is temporarily unavailable. Please try again in a few minutes.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '900' },
    });
  }

  if (res.status === 200 && /s-maxage=\d+/.test(res.headers.get('Cache-Control') ?? '')) {
    ctx.locals.cfContext?.waitUntil(cache.put(cacheKey, res.clone()));
  }
  return withSecurityHeaders(res);
});

function withSecurityHeaders(res: Response) {
  const headers = new Headers(res.headers);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
