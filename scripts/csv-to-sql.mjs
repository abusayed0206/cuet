#!/usr/bin/env node
/**
 * Turn a CSV of new students into a D1 migration.
 *
 *   node scripts/csv-to-sql.mjs students-2026.csv migrations/0005_import_batch_26.sql
 *
 * The CSV needs a header row with at least `studentid` and `name`; optional
 * `admission_roll` and `admission_merit`. Batch, session and department are
 * derived from the 7-digit ID (YY DD RRR). Existing IDs are skipped.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DEPARTMENTS = {
  '01': 'Civil Engineering',
  '02': 'Electrical & Electronic Engineering',
  '03': 'Mechanical Engineering',
  '04': 'Computer Science & Engineering',
  '05': 'Urban & Regional Planning',
  '06': 'Architecture',
  '07': 'Petroleum & Mining Engineering',
  '08': 'Electronics & Telecommunication Engineering',
  '09': 'Mechatronics & Industrial Engineering',
  '10': 'Water Resources Engineering',
  '11': 'Biomedical Engineering',
  '12': 'Materials & Metallurgical Engineering',
};

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: node scripts/csv-to-sql.mjs <input.csv> <output.sql>');
  process.exit(1);
}

/** Minimal RFC 4180 parser (quoted fields, escaped quotes, CRLF). */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim()));
}

const [header, ...records] = parseCsv(readFileSync(input, 'utf8').replace(/^﻿/, ''));
const col = Object.fromEntries(header.map((h, i) => [h.trim().toLowerCase(), i]));
if (col.studentid === undefined || col.name === undefined) {
  console.error('CSV header must include "studentid" and "name".');
  process.exit(1);
}

const sql = (v) => (v === null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const lines = [];
const problems = [];

for (const [n, r] of records.entries()) {
  const id = (r[col.studentid] ?? '').trim();
  const name = (r[col.name] ?? '').replace(/\s+/g, ' ').trim();
  const dept = DEPARTMENTS[id.slice(2, 4)];
  if (!/^\d{7}$/.test(id) || !name || !dept) {
    problems.push(`row ${n + 2}: ${JSON.stringify(r)}`);
    continue;
  }
  const yy = Number(id.slice(0, 2));
  const deptName = id.slice(2, 4) === '12' && yy <= 22 ? 'Materials Science & Engineering' : dept;
  const session = `20${String(yy).padStart(2, '0')}-${String((yy + 1) % 100).padStart(2, '0')}`;
  const roll = col.admission_roll !== undefined ? r[col.admission_roll]?.trim() : '';
  const merit = col.admission_merit !== undefined ? r[col.admission_merit]?.trim() : '';
  lines.push(
    `INSERT OR IGNORE INTO students (name, studentid, department, admission_roll, admission_merit, batch, session) VALUES (${sql(name)}, ${sql(id)}, ${sql(`Department of ${deptName}`)}, ${sql(roll)}, ${sql(merit)}, ${sql(id.slice(0, 2))}, ${sql(session)});`,
  );
}

// Keep the precomputed tables (class_counts, name_words) in step with the import.
const refresh = readFileSync(new URL('./refresh-derived.sql', import.meta.url), 'utf8');
writeFileSync(output, lines.join('\n') + '\n\n' + refresh);
console.log(`Wrote ${lines.length} rows to ${output}`);
if (problems.length) {
  console.warn(`Skipped ${problems.length} invalid rows:\n  ${problems.join('\n  ')}`);
  process.exitCode = 1;
}
