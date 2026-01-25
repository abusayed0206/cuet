-- Create students table based on CSV schema
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  studentid TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  admission_roll TEXT,
  admission_merit TEXT,
  batch TEXT NOT NULL,
  session TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_studentid ON students(studentid);
CREATE INDEX IF NOT EXISTS idx_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_batch ON students(batch);
CREATE INDEX IF NOT EXISTS idx_name ON students(name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_department_batch ON students(department, batch);
