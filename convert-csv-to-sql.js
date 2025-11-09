/**
 * CSV to SQL Converter
 * 
 * This script converts the CUET CSV file into SQL INSERT statements
 * for importing into Cloudflare D1 database.
 * 
 * Usage: node convert-csv-to-sql.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CSV_FILE = path.join(__dirname, 'public', 'cuet.csv');
const OUTPUT_DIR = path.join(__dirname, 'migrations');
const BATCH_SIZE = 500; // Records per SQL file

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read CSV file
console.log('Reading CSV file...');
const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
const lines = csvContent.split('\n');

// Skip header line
const header = lines[0];
console.log('CSV Header:', header);
console.log(`Total records: ${lines.length - 1}`);

// Process records
let batchNumber = 2; // Start from 0002 (0001 is the schema)
let recordCount = 0;
let batchRecords = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Parse CSV line (handles commas in quoted fields)
  const values = parseCSVLine(line);
  
  if (values.length < 7) {
    console.warn(`Skipping invalid line ${i}: ${line}`);
    continue;
  }

  const [name, studentid, department, admission_roll, admission_merit, batch, session] = values;

  // Escape single quotes in strings
  const escapedName = name.replace(/'/g, "''");
  
  // Create SQL VALUES entry
  const sqlValue = `  ('${escapedName}', '${studentid}', '${department}', '${admission_roll}', '${admission_merit}', '${batch}', '${session}')`;
  
  batchRecords.push(sqlValue);
  recordCount++;

  // Write batch when it reaches BATCH_SIZE or is the last record
  if (batchRecords.length === BATCH_SIZE || i === lines.length - 1) {
    writeBatch(batchNumber, batchRecords);
    batchNumber++;
    batchRecords = [];
  }
}

console.log(`\nConversion complete!`);
console.log(`Total records converted: ${recordCount}`);
console.log(`SQL files created: ${batchNumber - 2}`);
console.log(`\nNext steps:`);
console.log(`1. Review generated SQL files in the migrations/ directory`);
console.log(`2. Import to D1 database:`);
for (let i = 2; i < batchNumber; i++) {
  const fileNum = String(i).padStart(4, '0');
  console.log(`   npx wrangler d1 execute cuet-students --remote --file=./migrations/${fileNum}_import_batch_${i - 1}.sql`);
}

/**
 * Parse a CSV line handling quoted fields with commas
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      // Escaped quote
      current += '"';
      i++; // Skip next quote
    } else if (char === '"') {
      // Toggle quote state
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // Field separator
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  values.push(current.trim());

  return values;
}

/**
 * Write a batch of records to a SQL file
 */
function writeBatch(batchNumber, records) {
  const fileNum = String(batchNumber).padStart(4, '0');
  const filename = path.join(OUTPUT_DIR, `${fileNum}_import_batch_${batchNumber - 1}.sql`);

  const sql = `-- Batch ${batchNumber - 1}: ${records.length} records
-- Generated: ${new Date().toISOString()}

INSERT INTO students (name, studentid, department, admission_roll, admission_merit, batch, session)
VALUES
${records.join(',\n')};
`;

  fs.writeFileSync(filename, sql, 'utf-8');
  console.log(`Created: ${filename} (${records.length} records)`);
}
