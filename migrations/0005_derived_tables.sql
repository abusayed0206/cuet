-- Precomputed tables so pages never scan all of `students` (D1 bills every
-- row a query reads). Filled and kept current by scripts/refresh-derived.sql,
-- which csv-to-sql.mjs appends to every import migration.

-- One row per class (batch x department): overview, class sizes, sitemap lastmod.
CREATE TABLE IF NOT EXISTS class_counts (
  batch TEXT NOT NULL,
  code TEXT NOT NULL,
  session TEXT NOT NULL,
  count INTEGER NOT NULL,
  updated TEXT NOT NULL,
  PRIMARY KEY (batch, code)
) WITHOUT ROWID;

-- Each lowercased word of each name, for indexed prefix search.
CREATE TABLE IF NOT EXISTS name_words (
  word TEXT NOT NULL,
  studentid TEXT NOT NULL,
  PRIMARY KEY (word, studentid)
) WITHOUT ROWID;
