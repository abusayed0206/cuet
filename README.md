# CUET Students Directory

An independent index of Chittagong University of Engineering & Technology students: search by name or ID, browse every
batch and department, or use the public JSON API.

**Site** https://cuet.sayed.app · **API docs** https://cuet.sayed.app/api

## Stack

- **Astro 7** (server-rendered) on **Cloudflare Workers** via `@astrojs/cloudflare`
- **Cloudflare D1** (`CUET_students`): the single source of truth for student data; no data files live in this repo
- **Tailwind CSS 4**, almost no client JavaScript
- Edge cache per deploy (`src/middleware.ts`), API rate limit via the Workers rate-limiting binding

## Project layout

```
src/
  lib/departments.ts   department table, keyed by the ID's department digits
  lib/db.ts            all D1 queries
  lib/api.ts           JSON helpers, rate limiting, API response shapes
  pages/               routes (pages + /api endpoints)
  components/, layouts/
migrations/            D1 schema and data fixes (data imports are gitignored)
scripts/csv-to-sql.mjs CSV → D1 migration for importing a new batch
scripts/refresh-derived.sql  rebuilds class_counts / name_words (see below)
```

D1 bills every row a query *reads*, and `students` has ~17K rows, so no request
path may scan it. Counts come from `class_counts` (one row per class) and name
search goes through the indexed `name_words` table. After changing `students`
by hand, run `npm run db:refresh` (imports made with csv-to-sql do it already).

### Student IDs

IDs are `YY DD RRR`: batch, department code, class roll. The site and API take the department from `DD`, not from the
`department` text column. Code `12` shows as MSE for batches ≤ 22 and MME after that.

## Routes

| Page | URL |
|---|---|
| Home | `/` |
| Search | `/search?q=…&batch=25&dept=cse` (a full ID redirects to the profile) |
| Batches | `/batch`, `/batch/25`, `/batch/25/cse` |
| Departments | `/department`, `/department/cse` |
| Student | `/2504001` |
| API docs | `/api` |

Old URLs (`/batch?department=…&batch=…`, `/search?name=…`, `sitemap_N.xml`) redirect.

## API

Read-only, no key, CORS `*`, 60 requests/minute per IP, responses cached up to 24 h.

| Endpoint | Returns |
|---|---|
| `GET /api/v1/students/{id}` | one student |
| `GET /api/v1/search?q=&batch=&dept=&limit=` | name search, or ID prefix if `q` is digits |
| `GET /api/v1/batches` | batches with per-department counts |
| `GET /api/v1/batches/{batch}/{dept}` | full class list |
| `GET /api/v1/departments` | departments with their batches |

The legacy `/api/student/{id}` and `/api/student/search?query=` endpoints still answer in the old flat format. Full
reference with a live console: [/api](https://cuet.sayed.app/api).

## Development

Node 22.12+ (`.nvmrc` pins 24).

```sh
npm install
npm run dev       # http://localhost:4321 with a local D1
npm run check     # wrangler types + astro check
npm run preview   # build and run the real Worker locally
```

The local D1 starts empty. Copy production into it:

```sh
npx wrangler d1 export CUET_students --remote --output prod.sql
npx wrangler d1 execute CUET_students --local --file prod.sql
```

## Deployment

Cloudflare Workers Builds watches this repo:

- push to **`main`** → `npm run build` → `npx wrangler deploy` (production)
- push to any other branch (except `redirect`) → preview version only

`npm run deploy` deploys manually. Every deploy also clears the edge cache.

## Search engines

- `/sitemap.xml` is a sitemap index: `/sitemap-pages.xml` (home, listings, batch/class/department pages) plus one
  `/sitemap-batch-YY.xml` per batch with every profile. All entries carry `<lastmod>` from D1's `updated_at`.
- `robots.txt` allows everything except `/search?…` (search result pages are also `noindex`).
- Pages have canonical URLs, Open Graph tags and JSON-LD (`WebSite` + search action, `Person`, `BreadcrumbList`).
- **Google**: the sitemap is submitted in Search Console (property `cuet.sayed.app`).
- **Bing, Yandex, Seznam, Naver**: `node scripts/indexnow.mjs` pushes every sitemap URL via IndexNow;
  `--since YYYY-MM-DD` sends only changed pages. Key file: `public/1144afef155385c08e4aca5b16ec8642.txt`.

## Adding a new batch

1. Prepare a CSV with headers `studentid,name,admission_roll,admission_merit`.
2. `node scripts/csv-to-sql.mjs batch26.csv migrations/0005_import_batch_26.sql`
3. `npm run db:migrate` (applies new migrations to production D1)
4. Push to `main` so the edge cache refreshes, then `node scripts/indexnow.mjs --since <today>`.

Import migrations contain personal data and are gitignored; keep the CSV outside the repo.

## Backups

D1 keeps 30 days of point-in-time history (Time Travel). For an offline copy:

```sh
npx wrangler d1 export CUET_students --remote --output cuet-backup.sql
```

## Branches

- `main`: this site
- `redirect`: the `cuet.pages.dev` Pages project, which redirects to cuet.sayed.app
- `archive/*` tags: the old Next.js versions

## Data and terms

Data was compiled from publicly available sources and may contain errors. Personal use is free; commercial use or
integration into another system requires acknowledgment. See [privacy](https://cuet.sayed.app/privacy) and
[terms](https://cuet.sayed.app/terms). Contact: hello@sayed.page.

Built by [Sayed](https://sayed.dev/).
