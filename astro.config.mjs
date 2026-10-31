// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// Old sitemap files that search engines may still request.
const legacySitemaps = Object.fromEntries(
  ['/sitemap_index.xml', ...[1, 2, 3, 4, 5].map((n) => `/sitemap_${n}.xml`)].map((p) => [p, '/sitemap.xml']),
);

export default defineConfig({
  site: 'https://cuet.sayed.app',
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
  trailingSlash: 'never',
  // Prerendered pages as /terms.html (served at /terms) instead of /terms/index.html.
  build: { format: 'file' },
  redirects: legacySitemaps,
  vite: {
    plugins: [tailwindcss()],
    define: {
      __BUILD_ID__: JSON.stringify(Date.now().toString(36)),
    },
  },
});
