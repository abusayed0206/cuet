-- Batch 25 was imported with short department codes ("CSE") while older
-- batches use full names ("Department of Computer Science & Engineering").
-- The site derives the department from the student ID, but keep the column
-- consistent for exports. Also collapse stray whitespace in names.
UPDATE students SET department = 'Department of Civil Engineering' WHERE department = 'CE';
UPDATE students SET department = 'Department of Electrical & Electronic Engineering' WHERE department = 'EEE';
UPDATE students SET department = 'Department of Mechanical Engineering' WHERE department = 'ME';
UPDATE students SET department = 'Department of Computer Science & Engineering' WHERE department = 'CSE';
UPDATE students SET department = 'Department of Urban & Regional Planning' WHERE department = 'URP';
UPDATE students SET department = 'Department of Architecture' WHERE department = 'ARCH';
UPDATE students SET department = 'Department of Petroleum & Mining Engineering' WHERE department = 'PME';
UPDATE students SET department = 'Department of Electronics & Telecommunication Engineering' WHERE department = 'ETE';
UPDATE students SET department = 'Department of Mechatronics & Industrial Engineering' WHERE department = 'MIE';
UPDATE students SET department = 'Department of Water Resources Engineering' WHERE department = 'WRE';
UPDATE students SET department = 'Department of Biomedical Engineering' WHERE department = 'BME';
UPDATE students SET department = 'Department of Materials & Metallurgical Engineering' WHERE department = 'MME';
UPDATE students
SET name = trim(replace(replace(replace(replace(replace(name, char(9), ' '), '  ', ' '), '  ', ' '), '  ', ' '), '  ', ' '))
WHERE name <> trim(name) OR name LIKE '%  %' OR instr(name, char(9)) > 0;
