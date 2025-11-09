// Extend the CloudflareEnv interface from @opennextjs/cloudflare
// with our D1 database binding from wrangler.jsonc

import '@cloudflare/workers-types';

declare global {
  // Extend the CloudflareEnv interface that @opennextjs/cloudflare uses
  interface CloudflareEnv {
    DB: D1Database;
    ASSETS: Fetcher;
  }
}

export {};
