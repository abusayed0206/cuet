/**
 * The site's data comes from the CUET API on the VPS, not from D1.
 *
 *   https://api.sayed.app/cuet/api/v1/...
 *
 * A page should cost as few API calls as possible, so responses are cached in
 * the isolate for an hour - the data only changes when a batch is imported.
 */

const BASE = import.meta.env.CUET_API_URL ?? 'https://api.sayed.app/cuet';
const TTL = 60 * 60 * 1000; // one hour
const MAX_ENTRIES = 2000;
const TIMEOUT_MS = 8000;

interface Entry {
  at: number;
  body: unknown;
}

const cache = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

function validateOrigin(url: URL) {
  if (url.protocol !== 'https:' || url.hostname !== 'api.sayed.app') {
    throw new Error('invalid CUET API origin');
  }
  if (url.pathname !== '/cuet' && !url.pathname.startsWith('/cuet/')) {
    throw new Error('invalid CUET API path');
  }
}

/** Non-2xx answer from the API. `status` lets callers turn a 404 into a page 404. */
export class ApiError extends Error {
  status: number;
  constructor(path: string, status: number) {
    super(`the CUET API answered ${status} for ${path}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** GET a path of the API, with the response cached in the isolate. */
export async function apiGet<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }
  const key = url.toString();
  validateOrigin(url);

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.body as T;

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const request = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(key, {
        headers: { accept: 'application/json', 'user-agent': 'cuet-worker/1' },
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new ApiError(path, res.status);
      }
      const body = (await res.json()) as T;

      if (cache.size >= MAX_ENTRIES) {
        let oldestKey = '';
        let oldest = Infinity;
        for (const [k, v] of cache) {
          if (v.at < oldest) {
            oldest = v.at;
            oldestKey = k;
          }
        }
        cache.delete(oldestKey);
      }
      cache.set(key, { at: Date.now(), body });
      return body;
    } finally {
      clearTimeout(timer);
    }
  })();
  inflight.set(key, request);
  try {
    return await request as T;
  } finally {
    inflight.delete(key);
  }
}
