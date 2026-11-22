-- The `department` text column is gone: the department is now dept_code, and
-- the name that goes with it is in the code (departments.ts). The column had
-- already drifted from the ID once (batch 19 read "Materials Science &
-- Engineering" while the ID said 12 = MME).
DROP INDEX IF EXISTS idx_department;
DROP INDEX IF EXISTS idx_department_batch;
ALTER TABLE students DROP COLUMN department;
