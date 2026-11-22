# CUET students API

The CUET students directory as a read-only JSON API, served as one more
service of **api.sayed.app** under `/cuet`.

**Live:** https://api.sayed.app/cuet/api/v1/batches

| endpoint | returns |
|---|---|
| `GET /cuet/api/v1/students/{id}` | one student |
| `GET /cuet/api/v1/search?q=&batch=&dept=&limit=` | name search, or an ID prefix if `q` is digits |
| `GET /cuet/api/v1/batches` | batches with per-department counts |
| `GET /cuet/api/v1/batches/{batch}/{dept}` | full class list |
| `GET /cuet/api/v1/departments` | departments with their batches |
| `GET /cuet/api/student/{id}` | legacy, flat shape |
| `GET /cuet/api/student/search?query=` | legacy, flat shape |
| `GET /cuet/health` | status and the number of students |

The responses are the ones https://cuet.sayed.app returns — the same fields,
the same names, the same search behaviour (`md`/`mohammad`, `bin`/`ibn`), the
same error shapes. CORS `*`, like the site.

## How it is deployed

It is a Flask blueprint of the existing api.sayed.app app (Flask + gunicorn,
`/home/sayed-api/htdocs/api.sayed.app/`), registered the same way as every
other service:

```python
_try_register('cuet_api', 'cuet_bp', 'CUET Students API (/cuet/...)')
```

So it needs no new process, no new port and no nginx change: the gateway's
own `location /` already proxies to gunicorn, and `/cuet/` is a more specific
route inside the app.

| file | what it is |
|---|---|
| `cuet_api.py` | the blueprint - Flask plus the standard library, no new dependencies |
| `cuet/cuet.sqlite` | the database, one SQLite file, a copy of the site's D1 database |

The database is opened **read-only** (`file:...?mode=ro`), so the API can never
change the data. The connection is per thread, like the other blueprints of
that app.

## Installing it on another server

```sh
scp -r cuet_api.py cuet/cuet.sqlite user@HOST:/home/sayed-api/htdocs/api.sayed.app/
```

then add the registration line to `app.py` and restart the service:

```sh
systemctl restart api-sayed-app
```

The blueprint is registered through the app's own `_try_register` helper, so a
failure to import it is caught and logged — it can never take the other
services down with it.

## Checking the data

```sql
SELECT (SELECT COUNT(*) FROM students) students,
       (SELECT SUM(count) FROM class_counts) class_sum,
       (SELECT COUNT(DISTINCT studentid) FROM name_words) words;   -- all three equal
```

The full schema, the data dictionary and the whole API reference are in
[API.md](../API.md).
