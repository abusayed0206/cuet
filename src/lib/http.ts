import type { AstroGlobal } from 'astro';

/**
 * Mark a page as cacheable. Browsers keep it briefly; the edge cache in
 * middleware.ts keeps it for `edgeSeconds` (data only changes on new imports).
 */
export function cachePage(Astro: AstroGlobal, edgeSeconds = 86400, browserSeconds = 300) {
  Astro.response.headers.set('Cache-Control', `public, max-age=${browserSeconds}, s-maxage=${edgeSeconds}`);
}

export const fmt = (n: number) => n.toLocaleString('en-US');

/** "2025-26" -> "2025–26" */
export const sessionLabel = (s: string) => s.replace('-', '–');

/** plural(1, 'batch') -> "1 batch", plural(3, 'batch') -> "3 batches" */
export const plural = (n: number, word: string) =>
  `${fmt(n)} ${n === 1 ? word : /(s|sh|ch|x)$/.test(word) ? `${word}es` : `${word}s`}`;
