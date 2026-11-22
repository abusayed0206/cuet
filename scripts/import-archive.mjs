#!/usr/bin/env node
/**
 * Import the pre-2012 CUET archive into D1 as regular students.
 *
 *   node scripts/import-archive.mjs <archive.csv> <live-students.json> <out.sql> [--replace <ids.txt>]
 *
 * The archive CSV is the one described in the archive's HANDOVER.md:
 *
 *   batch,session,dept,studentid,class_roll,name,admission_roll,merit,source
 *
 * Imported columns: name, studentid, department, batch, session, admission_roll
 * and admission_merit. Students that are already in the database are left alone.
 *
 * Student IDs
 * -----------
 * A CUET student ID is YY DD RRR: batch, department code, class roll. Most of
 * the archive never had one - the pre-2012 pages printed admission-test rolls,
 * and the 2016 department allotment PDFs print only "serial, merit, roll, name",
 * where the serial is a merit-ordered row number, not a class roll. Those rows
 * get an ID of the same shape, but with a hash where the class roll would be,
 * so nobody mistakes it for a real CUET ID:
 *
 *   YYDDxxx    the department is known, xxx is a 3 letter hash
 *   YYxxxxx    the department was not published, xxxxx is a 5 letter hash
 *
 * The batch and the department are real; the last part is a hash of the row's
 * own key (batch, admission roll, name), so it is stable and unique. Real
 * student IDs - the CSE thesis registers and the laptop list print them - are
 * used as they are.
 *
 * <live-students.json> is a `wrangler d1 execute --json` dump of
 * `SELECT studentid, name, batch FROM students`. <ids.txt> (optional) lists
 * the student IDs of an earlier import of the same archive: those rows are
 * replaced, so the script can be re-run after the ID scheme changes.
 */
import { readFileSync, writeFileSync } from 'node:fs';

// Archive dept code -> the site's two-digit department code.
const DEPTS = {
  CE: '01', EEE: '02', ME: '03', CSE: '04', URP: '05', ARCH: '06',
  PME: '07', ETE: '08', MIE: '09', CWR: '10', BME: '11', MME: '12',
};
const DEPT_NAME = {
  '01': 'Civil Engineering', '02': 'Electrical & Electronic Engineering',
  '03': 'Mechanical Engineering', '04': 'Computer Science & Engineering',
  '05': 'Urban & Regional Planning', '06': 'Architecture',
  '07': 'Petroleum & Mining Engineering', '08': 'Electronics & Telecommunication Engineering',
  '09': 'Mechatronics & Industrial Engineering', '10': 'Water Resources Engineering',
  '11': 'Biomedical Engineering', '12': 'Materials & Metallurgical Engineering',
};
const UNKNOWN_DEPT = '00';

// Sources that print a real student ID. Everything else gets a generated one.
const ID_IS_PRINTED = /thesis_register|LaptopList/i;

const args = process.argv.slice(2);
const replaceIdx = args.indexOf('--replace');
const replaceFile = replaceIdx >= 0 ? args.splice(replaceIdx, 2)[1] : null;
const [input, liveFile, output] = args;
if (!input || !liveFile || !output) {
  console.error('Usage: node scripts/import-archive.mjs <archive.csv> <live-students.json> <out.sql> [--replace <ids.txt>]');
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

/** Collapse whitespace and turn the archive's typographic dashes into '-'. */
function cleanName(name) {
  return name
    .replace(/\uFFFD/g, ' ') // extraction artefact; the source page has plain text
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Case- and punctuation-insensitive form, for matching two lists of names. */
const normName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

/** FNV-1a, 32 bit. */
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** len lowercase letters derived from the seed - the "unknown roll" part of an ID. */
function alphaHash(seed, len) {
  let out = '';
  let h = fnv1a(seed);
  while (out.length < len) {
    h = fnv1a(`${h}:${out.length}`);
    out += String.fromCharCode(97 + (h % 26));
  }
  return out.slice(0, len);
}

const [header, ...records] = parseCsv(readFileSync(input, 'utf8').replace(/^\uFEFF/, ''));
const col = Object.fromEntries(header.map((h, i) => [h.trim().toLowerCase(), i]));

// ---- what is already in the database ----
const live = JSON.parse(readFileSync(liveFile, 'utf8'))[0].results;
const liveById = new Map(live.map((r) => [r.studentid, r]));
// Students per (batch, name). A name can belong to several students, so the
// list is consumed one entry at a time.
const liveByName = new Map();
for (const r of live) {
  const k = `${r.batch}|${normName(r.name)}`;
  if (!liveByName.has(k)) liveByName.set(k, []);
  liveByName.get(k).push(r);
}
// Student IDs of an earlier import of this archive: those rows get replaced.
const replaceIds = new Set(
  replaceFile ? readFileSync(replaceFile, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [],
);

const taken = new Set(liveById.keys());
const sql = (v) => (v === null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);

const stats = {
  total: records.length, inserted: 0, replaced: 0, skipped: 0,
  printedId: 0, generatedId: 0, withMerit: 0, withRoll: 0,
  byBatch: new Map(),
};

/**
 * A generated ID: YY DD xxx, or YY xxxxx when the department is unknown.
 * The hash part is probed so the ID is unique.
 */
function generatedId(batch, code, seed) {
  const len = code === UNKNOWN_DEPT ? 5 : 3;
  for (let i = 0; i < 4000; i++) {
    const tail = alphaHash(`${batch}|${seed}|${i}`, len);
    const id = code === UNKNOWN_DEPT ? `${batch}${tail}` : `${batch}${code}${tail}`;
    if (!taken.has(id)) {
      taken.add(id);
      return id;
    }
  }
  throw new Error(`no free ID left for ${batch}/${code}`);
}

const lines = [];
for (const r of records) {
  const batch = String(r[col.batch]).trim().padStart(2, '0');
  const session = r[col.session].trim();
  const name = cleanName(r[col.name] ?? '');
  const dept = r[col.dept].trim();
  const code = DEPTS[dept] ?? UNKNOWN_DEPT;
  const archiveId = (r[col.studentid] ?? '').trim();
  const admissionRoll = (r[col.admission_roll] ?? '').trim();
  const merit = (r[col.merit] ?? '').trim();
  const source = r[col.source] ?? '';
  if (!name || !/^\d{2}$/.test(batch)) continue;

  const b = stats.byBatch.get(batch) ?? { inserted: 0, replaced: 0, skipped: 0 };
  stats.byBatch.set(batch, b);

  const printed = ID_IS_PRINTED.test(source) && /^\d{7}$/.test(archiveId);
  const key = `${batch}|${normName(name)}`;

  // A printed student ID is exact: if the database already has that ID, the
  // student is there and this row is redundant - hand-organised data wins.
  if (printed && liveById.has(archiveId)) {
    stats.skipped++;
    b.skipped++;
    continue;
  }

  // Otherwise match on the name. A hand-organised student is left alone, an
  // earlier import of this archive is replaced.
  const same = liveByName.get(key) ?? [];
  const handOrganised = same.find((x) => !replaceIds.has(x.studentid));
  const existing = handOrganised ?? same.find((x) => replaceIds.has(x.studentid));
  if (handOrganised) {
    same.splice(same.indexOf(handOrganised), 1);
    stats.skipped++;
    b.skipped++;
    continue;
  }
  if (existing) same.splice(same.indexOf(existing), 1);

  // Which ID? A printed one when the source prints one, else a generated one.
  let targetId;
  if (printed) {
    targetId = archiveId;
    taken.add(archiveId);
    stats.printedId++;
  } else {
    targetId = generatedId(batch, code, admissionRoll || name);
    stats.generatedId++;
  }

  if (existing) {
    // An earlier import of this archive: drop it, it comes back with the new ID.
    lines.push(`DELETE FROM name_words WHERE studentid = ${sql(existing.studentid)};`);
    lines.push(`DELETE FROM students WHERE studentid = ${sql(existing.studentid)};`);
    stats.replaced++;
    b.replaced++;
  } else {
    stats.inserted++;
    b.inserted++;
  }

  if (targetId === archiveId) stats.printedId++;
  else stats.generatedId++;
  if (merit) stats.withMerit++;
  if (admissionRoll) stats.withRoll++;

  const deptColumn = code === UNKNOWN_DEPT ? 'Department not published' : `Department of ${DEPT_NAME[code]}`;
  lines.push(
    `INSERT OR IGNORE INTO students (name, studentid, department, admission_roll, admission_merit, batch, session) ` +
      `VALUES (${sql(name)}, ${sql(targetId)}, ${sql(deptColumn)}, ${sql(admissionRoll)}, ${sql(merit)}, ${sql(batch)}, ${sql(session)});`,
  );
}

// Keep the precomputed tables (class_counts, name_words) in step with the import.
const refresh = readFileSync(new URL('./refresh-derived.sql', import.meta.url), 'utf8');
writeFileSync(output, lines.join('\n') + '\n\n' + refresh);

console.log(`archive rows       ${stats.total}`);
console.log(`inserted           ${stats.inserted}`);
console.log(`replaced           ${stats.replaced}`);
console.log(`already in the db  ${stats.skipped}`);
console.log(`printed studentid  ${stats.printedId}`);
console.log(`generated id       ${stats.generatedId}`);
console.log(`with merit         ${stats.withMerit}`);
console.log(`with admission roll${stats.withRoll}`);
console.log('\nper batch:');
for (const batch of [...stats.byBatch.keys()].sort()) {
  const b = stats.byBatch.get(batch);
  console.log(`  ${batch}  inserted ${String(b.inserted).padStart(4)}   replaced ${String(b.replaced).padStart(4)}   skipped ${String(b.skipped).padStart(4)}`);
}
console.log(`\nWrote ${lines.length} statements to ${output}`);
