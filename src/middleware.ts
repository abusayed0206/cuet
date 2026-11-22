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
  if (hit) return hit;

  let res: Response;
  try {
    res = await next();
  } catch (err) {
    // D1 refuses queries when the free tier's daily row-read limit is spent.
    // That is temporary: say so with a 503, not a 404 - a 404 tells the search
    // engines that the page does not exist.
    console.error('request failed', err);
    return new Response('The directory is temporarily unavailable. Please try again in a few minutes.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '900' },
    });
  }

  if (res.status === 200 && /s-maxage=\d+/.test(res.headers.get('Cache-Control') ?? '')) {
    ctx.locals.cfContext?.waitUntil(cache.put(cacheKey, res.clone()));
  }
  return res;
});
