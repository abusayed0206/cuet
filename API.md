# CUET Students Directory — API

A free, read-only JSON API over the CUET students directory.

- **Base URL:** `https://cuet.sayed.app`
- **Format:** JSON, UTF-8
- **CORS:** `Access-Control-Allow-Origin: *` — usable from any origin
- **Auth:** none, no key, no registration
- **Rate limit:** 60 requests per minute per IP; over that you get `429`
- **Caching:** responses carry `Cache-Control: public, max-age=300, s-maxage=86400`
  (search: 1 hour at the edge). Cache them; do not poll.
- **Preflight:** every endpoint answers `OPTIONS` with `204` and the CORS headers

All responses are `application/json; charset=utf-8`.

---

## Two places to call it

The same API, served from two hosts. The responses are identical.

| | |
|---|---|
| **https://cuet.sayed.app/api/v1/…** | the main site (Cloudflare Workers + D1) |
| **https://api.sayed.app/cuet/api/v1/…** | the same API as one more service of the api.sayed.app gateway (Flask + gunicorn + SQLite) |

The gateway version lives in [`api/`](api/README.md) and is registered as a
Flask blueprint, so it needs no process, no port and no nginx change of its
own. Use either; both are the same data.

---

## Endpoints

### `GET /api/v1/students/{id}`

One student.

```json
{
  "data": {
    "id": "2504001",
    "name": "TASNIM FARIHA",
    "department": { "code": "04", "slug": "cse", "short": "CSE", "name": "Computer Science & Engineering" },
    "batch": "25",
    "session": "2025-26",
    "class_roll": 1,
    "admission_roll": "24367",
    "admission_merit": "119",
    "url": "https://cuet.sayed.app/2504001"
  }
}
```

`{id}` is the student ID. It is 7 characters:

| form | meaning |
|---|---|
| `2504001` | a real CUET student ID — batch `25`, department `04` (CSE), class roll `001` |
| `0301dpt` | batch 03, CE, hash instead of a class roll (see below) |
| `04zmvle` | batch 04, hash instead of department and class roll |

Batches 03–11 come from CUET's pre-2012 site, which published merit lists instead
of student IDs. Those students have no student ID here: the batch and the
department are real, the last part is a hash. They are found by name.

`class_roll` is `null` for them. `department` is `null` only if the ID is
unknown.

```sh
curl https://cuet.sayed.app/api/v1/students/2504001
```

### `GET /api/v1/search`

Name search, or an ID prefix when the query is digits.

| parameter | default | meaning |
|---|---|---|
| `q` | — | the query. At least 2 characters, or 1+ digits |
| `batch` | — | two digits, e.g. `25` |
| `dept` | — | a department slug, e.g. `cse` |
| `limit` | `20` | 1–100 |

```sh
curl "https://cuet.sayed.app/api/v1/search?q=roksana&limit=5"
curl "https://cuet.sayed.app/api/v1/search?q=2504"          # every CSE of batch 25
curl "https://cuet.sayed.app/api/v1/search?q=mohammad%20kawsarul"  # also finds "Md. Kawsarul Islam"
```

```json
{
  "data": [ { "id": "0301dpt", "name": "Roksana Rashid Tonny", "…": "…" } ],
  "meta": { "query": "roksana", "batch": null, "dept": null, "count": 1, "limit": 20, "has_more": false }
}
```

- Every word of the query has to appear in the name, in any order and in any
  case; the longest word also has to start a word of the name.
- Words are matched the way they are written and the way they are often
  written: `md`/`mohammad`/`muhammad`, `mst`/`most`, `min`/`minur`,
  `bin`/`ibn`.
- A digits-only query is an **ID prefix**: `25` is all of batch 25, `2504` is
  CSE of batch 25. The pre-2012 IDs carry a hash instead of a class roll, so
  they are not returned by an ID search — use the name.
- `meta.has_more` is `true` when there are more matches than `limit`.

### `GET /api/v1/batches`

Every batch with its session and the per-department counts.

```json
{
  "data": [
    {
      "batch": "25",
      "session": "2025-26",
      "students": 931,
      "departments": [
        { "code": "01", "slug": "ce", "short": "CE", "name": "Civil Engineering", "students": 132 }
      ]
    }
  ]
}
```

### `GET /api/v1/batches/{batch}/{dept}`

The full class list of one department in one batch, ordered by student ID.

```sh
curl https://cuet.sayed.app/api/v1/batches/03/ce
```

```json
{
  "data": [ { "id": "0301dpt", "name": "Roksana Rashid Tonny", "…": "…" } ],
  "meta": {
    "batch": "03",
    "session": "2003-04",
    "department": { "code": "01", "slug": "ce", "short": "CE", "name": "Civil Engineering" },
    "count": 120
  }
}
```

`{dept}` is a slug: `ce`, `eee`, `me`, `cse`, `urp`, `arch`, `pme`, `ete`,
`mie`, `wre`, `bme`, `mme`, and `unknown` (the intakes whose source published
no department — batches 04 and 08).

### `GET /api/v1/departments`

Every department with its batches.

```json
{
  "data": [
    {
      "code": "04", "slug": "cse", "short": "CSE", "name": "Computer Science & Engineering",
      "students": 3716,
      "batches": [ { "batch": "25", "session": "2025-26", "students": 132 } ]
    }
  ]
}
```

`code` `12` shows as `mme` / "Materials & Metallurgical Engineering" for batches
after 22 and as `MSE` / "Materials Science & Engineering" for batches up to 22.

---

## Legacy endpoints

Kept for existing integrations. Same data, the old flat shape.

### `GET /api/student/{id}`

```json
{
  "name": "TASNIM FARIHA",
  "studentid": "2504001",
  "department": "Department of Computer Science & Engineering",
  "admission_roll": "24367",
  "admission_merit": "119",
  "batch": "25",
  "session": "2025-26"
}
```

### `GET /api/student/search?query=…`

```json
{ "results": [ { "name": "…", "studentid": "…", "department": "…", "batch": "…" } ] }
```

`query` needs at least two characters. Up to 50 results.

---

## Objects

### Student

| field | type | meaning |
|---|---|---|
| `id` | string | the student ID, also the path of the profile page |
| `name` | string | the name as published |
| `department` | object \| null | `{ code, slug, short, name }`, taken from the ID |
| `batch` | string | two digits, `"03"` … `"25"` |
| `session` | string | `"2025-26"` |
| `class_roll` | number \| null | the class roll; `null` when it was never published |
| `admission_roll` | string \| null | the admission-test roll |
| `admission_merit` | string \| null | the merit as published; may contain quota notes like `"T-5"` |
| `url` | string | the profile page |

### Department

| field | type | meaning |
|---|---|---|
| `code` | string | the two digits of the department code in a student ID |
| `slug` | string | the URL part, e.g. `cse` |
| `short` | string | the short code, e.g. `CSE` |
| `name` | string | the full name |
| `students` | number | only on `/api/v1/departments` and `/api/v1/batches` |
| `batches` | array | only on `/api/v1/departments`: `{ batch, session, students }` |

---

## Errors

Every error has the same shape:

```json
{ "error": { "code": "not_found", "message": "No student with ID 9999999." } }
```

| status | codes | when |
|---|---|---|
| 400 | `invalid_id`, `invalid_query`, `invalid_batch`, `invalid_dept` | a parameter is missing or malformed |
| 404 | `not_found` | no such student, class or endpoint |
| 429 | `rate_limited` | over 60 requests per minute from one IP |

---

## The data

The site is a directory of CUET students compiled from public sources.

| batch | session | students | note |
|---|---|---|---|
| 03 | 2003-04 | 420 | pre-2012 site, no student IDs |
| 04 | 2004-05 | 420 | pre-2012 site, no student IDs, no department published |
| 05 | 2005-06 | 422 | pre-2012 site, no student IDs |
| 06 | 2006-07 | — | nothing was ever published for this cycle |
| 07 | 2007-08 | 337 | pre-2012 site, no student IDs |
| 08 | 2008-09 | 420 | pre-2012 site, no student IDs, no department published |
| 09 | 2009-10 | 565 | pre-2012 site, no student IDs |
| 10 | 2010-11 | 574 | pre-2012 site, no student IDs |
| 11 | 2011-12 | 598 | pre-2012 site, no student IDs |
| 12 | 2012-13 | 108 | CSE thesis register, laptop list |
| 13 | 2013-14 | 107 | + EEE and ETE from the laptop list |
| 14 | 2014-15 | 120 | + EEE and ETE |
| 15 | 2015-16 | 226 | + ME |
| 16 | 2016-17 | 611 | the 2016 department allotment lists |
| 17–25 | 2017-18 … 2025-26 | 8,706 | CUET's own roll lists |

### The table

```sql
CREATE TABLE students (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  studentid       TEXT UNIQUE NOT NULL,   -- the URL key
  dept_code       TEXT NOT NULL,           -- '01'..'12', '00' = no department published
  class_roll      TEXT,                    -- '001'.., NULL when it was never published
  admission_roll  TEXT,
  admission_merit TEXT,
  batch           TEXT NOT NULL,           -- '03'..'25'
  session         TEXT NOT NULL,           -- '2025-26'
  source          TEXT,                    -- the document the row was read from
  inferred        INTEGER NOT NULL DEFAULT 0,
  note            TEXT,                    -- what was inferred, when inferred = 1
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class_counts (          -- one row per batch x department
  batch   TEXT NOT NULL,
  code    TEXT NOT NULL,
  session TEXT NOT NULL,
  count   INTEGER NOT NULL,
  updated TEXT NOT NULL,
  PRIMARY KEY (batch, code)
) WITHOUT ROWID;

CREATE TABLE name_words (            -- the search index: the lowercased words of a name
  word       TEXT NOT NULL,
  studentid  TEXT NOT NULL,
  PRIMARY KEY (word, studentid)
) WITHOUT ROWID;

CREATE INDEX idx_name_words_studentid ON name_words(studentid);
CREATE INDEX idx_students_class ON students(batch, dept_code, studentid);
CREATE INDEX idx_students_batch ON students(batch, studentid);
```

`name_words` and `class_counts` are derived: after changing `students`, rebuild
them (see the repository README).

### Migrating it to another server

The SQL is plain SQLite and the queries are indexed, so a copy of the database
is enough — no export format to keep in sync:

```sh
sqlite3 cuet.sqlite "SELECT COUNT(*) FROM students;"
```

The site code talks to the database through the D1 binding (`env.DB`). On a
server with SQLite directly, that is the only part that has to change: a thin
wrapper that offers `prepare(sql).bind(...).all()` / `.first()` / `batch()`
over `better-sqlite3` (or node:sqlite) keeps `src/lib/db.ts` unchanged.

Two things to keep:

- `name_words` is `WITHOUT ROWID` with the key `(word, studentid)`, so
  `studentid` on its own is not indexed. Keep `idx_name_words_studentid`,
  otherwise a delete by student scans the whole table.
- Every query must use an index. The server bills the database by the rows a
  query reads; a scan of `students` is 12,788 rows.

---

## Terms

Free for personal use. Using the data in another product needs a mention.
See [privacy](https://cuet.sayed.app/privacy) and
[terms](https://cuet.sayed.app/terms). The data was compiled from publicly
available sources and may contain errors. Contact: hello@sayed.page.
