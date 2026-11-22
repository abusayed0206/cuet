# CUET Students Directory

An independent index of Chittagong University of Engineering & Technology students: search by name or ID, browse every
batch and department, or use the public JSON API.

**Site** https://cuet.sayed.app · **API docs** [/api](https://cuet.sayed.app/api) · **[API.md](API.md)**

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
api/
  cuet_api.py          the same API as a Flask blueprint of api.sayed.app
scripts/indexnow.mjs   pushes the sitemap to the search engines
```

D1 bills every row a query *reads*, and `students` has ~12.8K rows (a full scan
counts as ~26K reads), so no request path may scan it. Counts come from `class_counts` (one row per class) and name
search goes through the indexed `name_words` table.

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

The legacy `/api/student/{id}` and `/api/student/search?query=` endpoints still answer in the old flat format. The
complete reference, with examples and the data model, is in **[API.md](API.md)**.

## Development

Node 22.12+ (`.nvmrc` pins 24).

```sh
npm install
npm run dev       # http://localhost:4321 with a local D1
npm run check     # wrangler types + astro check
npm run preview   # build and run the real Worker locally
```

The local D1 starts empty. To work against the real data, put a copy of the
database in the local D1 state:

```sh
npx wrangler d1 export CUET_students --remote --output prod.sql
npx wrangler d1 execute CUET_students --local --file prod.sql
```

`.wrangler/state/v3/d1/miniflare-D1DatabaseObject/<hash>.sqlite` is the file
the local Worker opens - a single SQLite file can be copied straight into it.

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

## The database

The schema, the indexes and the data dictionary are in [API.md](API.md). Two
tables are derived and have to be rebuilt after any change to `students`:
`class_counts` (one row per batch × department) and `name_words` (the
lowercased words of every name, the search index).

```sql
DELETE FROM class_counts;
INSERT INTO class_counts (batch, code, session, count, updated)
SELECT batch, dept_code, MIN(session), COUNT(*), MAX(date(COALESCE(updated_at, created_at)))
FROM students GROUP BY batch, dept_code;

DELETE FROM name_words;
INSERT OR IGNORE INTO name_words (word, studentid)
WITH RECURSIVE split(studentid, rest, word) AS (
  SELECT studentid, lower(replace(replace(replace(replace(name, '.', ' '), '-', ' '), '(', ' '), ')', ' ')) || ' ', ''
  FROM students
  UNION ALL
  SELECT studentid, substr(rest, instr(rest, ' ') + 1), substr(rest, 1, instr(rest, ' ') - 1)
  FROM split WHERE rest <> ''
)
SELECT word, studentid FROM split WHERE word <> '';
```

The separators (space `.` `-` `(` `)`) must match `searchStudents()` in `src/lib/db.ts`.

### The name_words trap

`name_words` is `WITHOUT ROWID` with the key `(word, studentid)`, so `studentid`
on its own is not indexed. `DELETE FROM name_words WHERE studentid = '…'` scans the
whole table - ~36K rows. An import that deletes one row per student does that
4,000 times: 148 million row reads, 29 times the daily limit, and the site goes
down. Keep `idx_name_words_studentid` (so the delete is a seek) and delete in
one statement (`WHERE studentid IN (…)`).

### Checks

After any change to the data, these three numbers have to agree, and the rest
of the rules should hold:

```sql
SELECT (SELECT COUNT(*) FROM students) students,
       (SELECT SUM(count) FROM class_counts) class_sum,
       (SELECT COUNT(DISTINCT studentid) FROM name_words) words;          -- all three equal

SELECT COUNT(*) FROM students WHERE dept_code IS NULL;                    -- 0
SELECT COUNT(*) FROM students WHERE class_roll IS NOT NULL
   AND class_roll <> substr(studentid, 5, 3);                            -- 0
SELECT COUNT(*) FROM students WHERE session <> '20' || batch || '-'      -- 0
   || substr('0' || (CAST(batch AS INTEGER) + 1), -2);
```

### D1 budget (free plan)

D1 bills every row a query *reads*: 5M/day, then all queries fail until 00:00 UTC. A
query without an index on its `WHERE` reads all ~12.8K students (plus index rows). Before
adding a query, check its plan in `wrangler d1 execute --local` with `EXPLAIN QUERY PLAN`:
it must say `SEARCH ... USING INDEX`, never `SCAN students`. Usage per database:
dashboard → D1 → CUET_students → Metrics.

Check what a migration or a batch of queries costs before running it:

```sh
npx wrangler d1 insights CUET_students --time-period 1d --sort-by reads --limit 20
```

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
