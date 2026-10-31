# CUET Students Directory

Search and browse students of Chittagong University of Engineering & Technology by name, ID, batch and department.

**Live:** https://cuet.sayed.app

- Search by name (words in any order) or by full/partial student ID
- Browse batch → department → full class list, with filtering and sorting
- Department pages across all batches; student profiles with classmates navigation
- Light/dark theme, mobile-first, almost no client-side JavaScript

## Stack

| | |
|---|---|
| Framework | [Astro 7](https://astro.build), server-rendered |
| Hosting | Cloudflare Workers via `@astrojs/cloudflare` |
| Database | Cloudflare D1 (`CUET_students`) |
| Styling | Tailwind CSS 4 |

Pages are cached at the edge for a day (`src/middleware.ts`); every deploy gets a fresh cache.

## Routes

| URL | Page |
|---|---|
| `/` | Search + batches + departments |
| `/search?q=…&batch=25&dept=cse` | Search (a full ID jumps to the profile) |
| `/batch`, `/batch/25`, `/batch/25/cse` | Batches, one batch, one class list |
| `/department`, `/department/cse` | Departments, one department across batches |
| `/2504001` | Student profile |
| `/sitemap.xml` | Generated from D1 |

Old URLs (`/batch?department=cse&batch=24`, `/search?name=…`, `sitemap_N.xml`) redirect to the new ones.

## How departments are resolved

A CUET ID is `YY DD RRR`: batch, department code, class roll. The site derives the department from
`DD` (see `src/lib/departments.ts`) rather than the `department` text column, which has been
imported inconsistently. Code `12` is shown as MSE for batches ≤ 22 and MME afterwards.

## Develop

Requires Node 22.12+ (see `.nvmrc`).

```sh
npm install
npm run dev          # http://localhost:4321, uses a local D1 copy
npm run check        # type-check
npm run build
npm run preview      # run the built Worker locally
npm run deploy       # build + wrangler deploy (manual; normally not needed)
```

## Deploys

Cloudflare Workers Builds is connected to this repo:

- Push to `main` → `npm run build` + `npx wrangler deploy` (production, cuet.sayed.app)
- Push to any other branch (except `redirect`) → `npx wrangler versions upload` (preview version, not live)

Build status and logs: Cloudflare dashboard → Workers & Pages → `cuet` → Deployments.

Local D1 starts empty. To copy production data locally:

```sh
npx wrangler d1 export CUET_students --remote --output prod.sql
npx wrangler d1 execute CUET_students --local --file prod.sql
```

## Adding a new batch

1. Put the rows in a SQL migration (`migrations/000N_*.sql`) using the full department name, e.g.
   `Department of Computer Science & Engineering`. `scripts/convert-csv-to-sql.js` converts a CSV.
2. `npm run db:migrate` to apply it to production D1.
3. Push to `main` (or `npm run deploy`); a new deploy also clears the edge cache.

## Branches

- `main`: this site, deployed to the `cuet` Worker (cuet.sayed.app).
- `redirect`: tiny site for the `cuet` Cloudflare Pages project (cuet.pages.dev) that redirects to cuet.sayed.app.

## Data & license

Data was compiled from publicly available sources; see [/privacy](https://cuet.sayed.app/privacy) and
[/terms](https://cuet.sayed.app/terms). Code is under the license in `LICENSE.md`.

Built by [Sayed](https://sayed.dev/).
