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
  lib/departments.ts   department table, keyed by the two-digit department code
  lib/db.ts            all D1 queries
  lib/api.ts           JSON helpers, rate limiting, API response shapes
  pages/               routes (pages + /api endpoints)
  components/, layouts/
migrations/            D1 schema and data fixes (data imports are gitignored)
scripts/csv-to-sql.mjs CSV → D1 migration for importing a new batch
scripts/import-archive.mjs  the pre-2012 archive (see below)
scripts/check-data.mjs      checks the data in D1 against the rules (see below)
scripts/refresh-derived.sql  rebuilds class_counts / name_words (see below)
```

D1 bills every row a query *reads*, and `students` has ~12.8K rows (a full scan
counts as ~26K reads), so no request path may scan it. Counts come from `class_counts` (one row per class) and name
search goes through the indexed `name_words` table. After changing `students`
by hand, run `npm run db:refresh` (imports made with csv-to-sql do it already).

### Student IDs

A student ID is the URL key and nothing else. The batch, the department and
the class roll are columns of their own, so the code is never read out of the
ID:

| column | meaning |
|---|---|
| `studentid` | the URL key, unique |
| `batch` | two digits, `03` … `25` |
| `dept_code` | two digits, `01` … `12`, or `00` when the source published no department |
| `class_roll` | three digits, or NULL when it was never published |
| `admission_roll`, `admission_merit` | as published, may be empty |
| `source`, `inferred`, `note` | where the row came from, and what was inferred |

Real CUET IDs are seven digits (`YY DD RRR`). Batches 03–11 come from the
pre-2012 CUET site, which published merit lists instead of student IDs, and
the 2016 department allotment PDFs print only "serial, merit, roll, name",
where the serial is a merit-ordered row number, not a class roll. Those
students carry a hash where the class roll would be:

```
2504001    a real CUET student ID
0301dpt    batch 03, CE, hash instead of a class roll
04zmvle    batch 04, hash instead of department and class roll (none published)
```

The batch and the department are real, the hash is derived from the row's own
key (batch, admission roll, name), so it is stable and unique. Only the CSE
thesis registers and the laptop list print a real student ID; those are used as
they are. Because the hash is not a class roll, the pre-2012 students are found
by name, and `searchStudents()` leaves them out of an ID-prefix search.

Department code `00` means the source published no department (batches 04 and
08); their student IDs carry the hash right after the batch. Code `12` shows as
MSE for batches ≤ 22 and MME after that.

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
2. `node scripts/csv-to-sql.mjs batch26.csv migrations/0011_import_batch_26.sql`
   (use the next free migration number; the script appends `scripts/refresh-derived.sql`,
   so `class_counts` and `name_words` update in the same migration)
3. `npm run db:migrate` (applies new migrations to production D1)
4. `npm run db:check` - the rules the site relies on, see below
5. Push to `main` so the edge cache and the in-memory overview refresh, then
   `node scripts/indexnow.mjs --since <today>`.

Import migrations contain personal data and are gitignored; keep the CSV outside the repo.

### Checking the data

`npm run db:check` runs the rules the site depends on against D1 and exits
non-zero when one is broken:

1. `students` == `SUM(class_counts)` == the students in `name_words`
2. `class_counts` matches the students it counts
3. every student ID has a shape the site accepts
4. every student has a department code, and a class roll only where the ID has one
5. the session matches the batch
6. no student ID carries two names

It also reports (without failing) the names that two students in a batch
share - the source really has those, they are different people.

Run it after every import, and `node scripts/check-data.mjs --local` against a
local copy of the database before applying a migration.

### Importing the pre-2012 archive

The `cuet-archive` package (batches 03–16, CUET's old HTML pages and the 2016
department allotment PDFs) has its own importer, because its CSV has a
different shape and most of its rows have no student ID:

```sh
npx wrangler d1 execute CUET_students --remote --command "SELECT studentid, name, batch, dept_code FROM students" --json > live.json
node scripts/import-archive.mjs "C:/Users/abusa/cuet-archive/clean/cuet_students_03-16.csv" live.json migrations/0012_import_archive.sql
npm run db:migrate
```

It imports name, student ID, department, class roll, batch, session, admission
roll and merit, and skips students that are already in the database.

- `--replace ids.txt` - the student IDs of an earlier import of the same
  archive: those rows are dropped and inserted again, for when the ID scheme
  changes.
- `--inferred inferred.csv` - the archive's list of rows with an inferred
  field; those rows get `inferred = 1` and the reason in `note`.
- `--provenance` - only write the `source`, `inferred` and `note` columns of
  rows that are already in the database.

### Editing existing students

Any hand-made change to `students` (a fix migration, `d1 execute`, the dashboard) must be
followed by `npm run db:refresh`, or counts and search go stale:

- Added/removed students or changed batch/session: `db:refresh` is enough.
- **Renamed** a student: the refresh only indexes students it hasn't seen, so delete their
  old words first: `DELETE FROM name_words WHERE studentid = '2504001';` then `db:refresh`.
- Deleted a student: also `DELETE FROM name_words WHERE studentid = ...` (stale rows are
  harmless for results, but waste reads).

Don't rebuild `name_words` from scratch (`DELETE FROM name_words` + refresh): that is
~50K row writes, half the free daily limit.

### D1 budget (free plan)

D1 bills every row a query *reads*: 5M/day, then all queries fail until 00:00 UTC. A
query without an index on its `WHERE` reads all ~12.8K students (plus index rows). Before
adding a query, check its plan in `wrangler d1 execute --local` with `EXPLAIN QUERY PLAN`:
it must say `SEARCH ... USING INDEX`, never `SCAN students`. Usage per database:
dashboard → D1 → CUET_students → Metrics.

Avoid `node scripts/indexnow.mjs` without `--since`: it makes crawlers fetch every
profile at once (that, plus full-table scans, caused the Nov 2026 outage).

## Backups

D1 keeps 30 days of point-in-time history (Time Travel). For an offline copy:

```sh
npx wrangler d1 export CUET_students --remote --output cuet-backup.sql
```

Keep the export outside the repository - it holds every student's name.

## Branches

- `main`: this site
- `redirect`: the `cuet.pages.dev` Pages project, which redirects to cuet.sayed.app
- `archive/*` tags: the old Next.js versions

## Data and terms

Data was compiled from publicly available sources and may contain errors. The batches from
2003-04 to 2011-12 come from CUET's pre-2012 site, which published merit lists rather than
student IDs, so those students have no student ID here - only a name, a batch, the
department where it was published, and the admission roll. Personal use is free; commercial use or
integration into another system requires acknowledgment. See [privacy](https://cuet.sayed.app/privacy) and
[terms](https://cuet.sayed.app/terms). Contact: hello@sayed.page.

Built by [Sayed](https://sayed.dev/).
