-- The student ID stays the URL key, but the department and the class roll
-- become columns of their own: the code never has to be read out of the ID
-- again, and "this intake published no department" is a value, not a guess.
--
-- dept_code   '01'..'12', or '00' when the source published no department
-- class_roll  the class roll, NULL when it was never published (the pre-2012
--             intakes carry a hash in the ID instead)
-- source      where the row came from, for the rows that were compiled from
--             the archive
-- inferred    1 when a field of the row was inferred rather than printed
-- note        what was inferred
ALTER TABLE students ADD COLUMN dept_code TEXT;
ALTER TABLE students ADD COLUMN class_roll TEXT;
ALTER TABLE students ADD COLUMN source TEXT;
ALTER TABLE students ADD COLUMN inferred INTEGER NOT NULL DEFAULT 0;
ALTER TABLE students ADD COLUMN note TEXT;

UPDATE students SET
  dept_code = CASE WHEN substr(studentid, 3, 2) GLOB '[0-9][0-9]' THEN substr(studentid, 3, 2) ELSE '00' END,
  class_roll = CASE WHEN studentid GLOB '[0-9][0-9][0-9][0-9][0-9][0-9][0-9]' THEN substr(studentid, 5, 3) END;

-- One class (batch + department) and one batch, both ordered by student ID.
CREATE INDEX IF NOT EXISTS idx_students_class ON students(batch, dept_code, studentid);
CREATE INDEX IF NOT EXISTS idx_students_batch ON students(batch, studentid);
