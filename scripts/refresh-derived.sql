-- Rebuild class_counts and add name_words for students not indexed yet.
-- Run after any change to `students`: npm run db:refresh
-- (csv-to-sql.mjs also appends this to each import migration).

DELETE FROM class_counts;
INSERT INTO class_counts (batch, code, session, count, updated)
SELECT batch, substr(studentid, 3, 2), MIN(session), COUNT(*), MAX(date(COALESCE(updated_at, created_at)))
FROM students GROUP BY batch, substr(studentid, 3, 2);

-- Incremental: a full rebuild would cost ~100K row writes (the free daily cap).
-- Renamed students keep their old words; for those, delete their rows first.
-- Separators (space . - ( )) must match searchStudents() in src/lib/db.ts.
INSERT OR IGNORE INTO name_words (word, studentid)
WITH RECURSIVE split(studentid, rest, word) AS (
  SELECT studentid, lower(replace(replace(replace(replace(name, '.', ' '), '-', ' '), '(', ' '), ')', ' ')) || ' ', ''
  FROM students WHERE studentid NOT IN (SELECT studentid FROM name_words)
  UNION ALL
  SELECT studentid, substr(rest, instr(rest, ' ') + 1), substr(rest, 1, instr(rest, ' ') - 1)
  FROM split WHERE rest <> ''
)
SELECT word, studentid FROM split WHERE word <> '';
