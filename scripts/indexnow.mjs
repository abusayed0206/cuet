#!/usr/bin/env node
/**
 * Notify IndexNow search engines (Bing, Yandex, Seznam, Naver, …) about pages.
 * Google does not use IndexNow; it reads the sitemap via Search Console.
 *
 *   node scripts/indexnow.mjs                    # every URL in the live sitemap
 *   node scripts/indexnow.mjs --since 2026-11-01 # only pages with lastmod >= date
 *
 * The key file lives at public/<KEY>.txt and must be deployed first.
 */
const SITE = 'https://cuet.sayed.app';
const KEY = '1144afef155385c08e4aca5b16ec8642';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const CHUNK = 10_000; // IndexNow maximum per request

const sinceIdx = process.argv.indexOf('--since');
const since = sinceIdx > -1 ? process.argv[sinceIdx + 1] : '';

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

/** [{ loc, lastmod }] from a urlset or (recursively) a sitemap index. */
async function readSitemap(url) {
  const xml = await fetchText(url);
  const entries = [...xml.matchAll(/<(url|sitemap)>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)];
  if (xml.includes('<sitemapindex')) {
    const nested = await Promise.all(entries.map((m) => readSitemap(m[2])));
    return nested.flat();
  }
  return entries.map((m) => ({ loc: m[2].replace(/&amp;/g, '&'), lastmod: m[3] ?? '' }));
}

const keyCheck = await fetch(`${SITE}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file ${SITE}/${KEY}.txt is not live yet; deploy first.`);
  process.exit(1);
}

const urls = (await readSitemap(`${SITE}/sitemap.xml`)).filter((e) => !since || e.lastmod >= since).map((e) => e.loc);
console.log(`Submitting ${urls.length} URLs${since ? ` changed since ${since}` : ''}…`);

for (let i = 0; i < urls.length; i += CHUNK) {
  const urlList = urls.slice(i, i + CHUNK);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  // 200 = accepted, 202 = accepted (key validation pending)
  console.log(`  ${i + 1}-${i + urlList.length}: HTTP ${res.status} ${res.ok ? 'ok' : await res.text()}`);
  if (!res.ok) process.exitCode = 1;
}
