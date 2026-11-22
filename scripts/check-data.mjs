#!/usr/bin/env node
/**
 * Check the data in D1 against the rules the site relies on.
 *
 *   node scripts/check-data.mjs [--remote] [--json]
 *
 * It runs the checks against the database with wrangler, so it needs no copy
 * of the data and nothing personal ends up on disk. It exits non-zero when a
 * rule is broken, so it can be run after an import and in CI.
 *
 * The rules:
 *   1. students == SUM(class_counts) == students in name_words
 *   2. class_counts matches the students it counts
 *   3. every student ID has the shape the site accepts
 *   4. every student has a department code, and a class roll only when the
 *      ID carries one
 *   5. the session matches the batch
 *   6. no student ID is used by two different names
 *   7. no two students in a batch share a name, unless the source says so
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const args = process.argv.slice(2);
const remote = args.includes('--remote');
const asJson = args.includes('--json');
const local = args.includes('--local');
if (!remote && !local) {
  console.error('Usage: node scripts/check-data.mjs --remote | --local [--json]');
  process.exit(2);
}

// Wrangler is called through node directly: npx is a .cmd on Windows and
// cannot be spawned without a shell, which would mangle the SQL.
const WRANGLER = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
if (!existsSync(WRANGLER)) {
  console.error('wrangler is not installed - run npm install first');
  process.exit(2);
}

/** Run a query and return the rows. */
function query(sql) {
  const out = execFileSync(
    process.execPath,
    [WRANGLER, 'd1', 'execute', 'CUET_students', local ? '--local' : '--remote', '--command', sql, '--json'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );
  return JSON.parse(out)[0].results;
}

const checks = [];
const warnings = [];
const check = (name, ok, detail) => {
  checks.push({ name, ok, detail });
  return ok;
};
/** Something worth knowing that is not wrong - the source has such rows. */
const warn = (name, detail) => {
  warnings.push({ name, detail });
};

// ---------- 1. the three numbers have to agree ----------
const counts = query(
  `SELECT (SELECT COUNT(*) FROM students) AS students,
          (SELECT SUM(count) FROM class_counts) AS class_sum,
          (SELECT COUNT(DISTINCT studentid) FROM name_words) AS words`,
)[0];
check(
  'students, class_counts and name_words agree',
  counts.students === counts.class_sum && counts.students === counts.words,
  `students=${counts.students} class_counts=${counts.class_sum} name_words=${counts.words}`,
);

// ---------- 2. class_counts matches the students ----------
const mismatched = query(
  `SELECT COUNT(*) AS n FROM (
     SELECT batch, dept_code, COUNT(*) AS c FROM students GROUP BY batch, dept_code
   ) s LEFT JOIN class_counts c
     ON c.batch = s.batch AND c.code = s.dept_code
   WHERE c.count IS NULL OR c.count <> s.c`,
)[0].n;
check('class_counts matches the students', mismatched === 0, `${mismatched} classes differ`);

// ---------- 3. the shape of the student IDs ----------
const badId = query(
  `SELECT COUNT(*) AS n FROM students
   WHERE studentid NOT GLOB '[0-9][0-9][0-9][0-9][0-9][0-9][0-9]'
     AND studentid NOT GLOB '[0-9][0-9][0-9][0-9][a-z][a-z][a-z]'
     AND studentid NOT GLOB '[0-9][0-9][a-z][a-z][a-z][a-z][a-z]'`,
)[0].n;
check('every student ID has an accepted shape', badId === 0, `${badId} rows`);

// ---------- 4. department and class roll ----------
const badDept = query(`SELECT COUNT(*) AS n FROM students WHERE dept_code IS NULL OR dept_code NOT GLOB '[0-9][0-9]'`)[0].n;
check('every student has a department code', badDept === 0, `${badDept} rows`);

const badRoll = query(
  `SELECT COUNT(*) AS n FROM students
   WHERE (class_roll IS NULL AND studentid GLOB '[0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
      OR (class_roll IS NOT NULL AND class_roll NOT GLOB '[0-9][0-9][0-9]')`,
)[0].n;
check('a class roll only where the ID has one', badRoll === 0, `${badRoll} rows`);

const rollMismatch = query(
  `SELECT COUNT(*) AS n FROM students
   WHERE class_roll IS NOT NULL AND class_roll <> substr(studentid, 5, 3)`,
)[0].n;
check('the class roll matches the student ID', rollMismatch === 0, `${rollMismatch} rows`);

// ---------- 5. the session follows the batch ----------
const badSession = query(
  `SELECT COUNT(*) AS n FROM students
   WHERE session <> '20' || batch || '-' || substr('0' || (CAST(batch AS INTEGER) + 1), -2)`,
)[0].n;
check('the session matches the batch', badSession === 0, `${badSession} rows`);

// ---------- 6. no ID with two names ----------
const twoNames = query(
  `SELECT COUNT(*) AS n FROM (
     SELECT studentid FROM students GROUP BY studentid
     HAVING COUNT(DISTINCT lower(replace(name, '.', ' '))) > 1
   )`,
)[0].n;
check('no student ID carries two names', twoNames === 0, `${twoNames} rows`);

// ---------- 7. names that are used twice in a batch ----------
// The source really does have students with the same name - they are
// different people, so this is reported, not treated as an error.
const sameName = query(
  `SELECT batch, lower(replace(replace(name, '.', ' '), '  ', ' ')) AS n, COUNT(*) AS c,
          group_concat(studentid) AS ids
   FROM students GROUP BY batch, n HAVING COUNT(*) > 1 ORDER BY batch`,
);
warn(
  'two students in a batch share a name',
  `${sameName.length} names, e.g. ${sameName.slice(0, 3).map((r) => `${r.batch}: ${r.ids}`).join(' | ')}`,
);

const failed = checks.filter((c) => !c.ok);

if (asJson) {
  console.log(JSON.stringify({ checks, warnings, ok: failed.length === 0 }, null, 2));
} else {
  for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'}  ${c.name}${c.detail ? `  (${c.detail})` : ''}`);
  for (const w of warnings) console.log(`warn  ${w.name}  (${w.detail})`);
  console.log(failed.length ? `\n${failed.length} check(s) failed` : '\nall checks passed');
}
process.exit(failed.length ? 1 : 0);
