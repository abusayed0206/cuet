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

-- Insert sample data for testing
INSERT INTO students (name, studentid, department, admission_roll, admission_merit, batch, session) VALUES
  ('MD. JASHEDUL ALAM', '2308020', 'Department of Electronics & Telecommunication Engineering', '115629', '3901', '23', '2023-24'),
  ('MD. TANBIR HASAN', '2002048', 'Department of Electrical & Electronic Engineering', '52080', '1126', '20', '2020-21'),
  ('Kazi naimul Noque', '1204056', 'Department of Computer Science & Engineering', NULL, NULL, '12', '2012-13'),
  ('MD. RIMON HOWLADER', '2301076', 'Department of Civil Engineering', '113582', '3529', '23', '2023-24'),
  ('TANISHA FAIRUZ', '1708026', 'Department of Electronics & Telecommunication Engineering', '9482', '1510', '17', '2017-18'),
  ('MD. MEHERAB HOSSAIN TAJIM', '2201013', 'Department of Civil Engineering', '153506', '2450', '22', '2022-23'),
  ('TASNIM SULTANA', '2301082', 'Department of Civil Engineering', '110849', '3573', '23', '2023-24'),
  ('JANNATUL NAJAH', '2302151', 'Department of Electrical & Electronic Engineering', '120712', '2294', '23', '2023-24'),
  ('MD. ABID HASSAN', '2310002', 'Department of Water Resources Engineering', '114411', '4469', '23', '2023-24'),
  ('Ajoy Das Antu', '1503025', 'Department of Mechanical Engineering', NULL, NULL, '15', '2015-16'),
  ('Abdulla Hill Bakki', '1603022', 'Department of Mechanical Engineering', NULL, NULL, '16', '2016-17'),
  ('MOHAMMAD SABRAJ HOSSEN', '1902025', 'Department of Electrical & Electronic Engineering', '17832', '276', '19', '2019-20'),
  ('NAIESHA HAQ', '2301028', 'Department of Civil Engineering', '111860', '3013', '23', '2023-24'),
  ('NUZHAT JAHAN', '2001017', 'Department of Civil Engineering', '55144', '2044', '20', '2020-21'),
  ('Abu Raihan Ibna Ali', '1503073', 'Department of Mechanical Engineering', NULL, NULL, '15', '2015-16'),
  ('MD. ASADUL ISLAM', '2302160', 'Department of Electrical & Electronic Engineering', '312900', '2327', '23', '2023-24'),
  ('MOHAMMAD MUJIBUR RAHMAN MARUF', '1702026', 'Department of Electrical & Electronic Engineering', '7566', '117', '17', '2017-18'),
  ('BABU MARMA KAYWANG', '1802181', 'Department of Electrical & Electronic Engineering', '7183', '552', '18', '2018-19'),
  ('S.M. SHAFKATUL ISLAM RISHAD', '2002016', 'Department of Electrical & Electronic Engineering', '52318', '560', '20', '2020-21'),
  ('SYEDA RAMISA TAHIYAT', '2202065', 'Department of Electrical & Electronic Engineering', '170016', '1496', '22', '2022-23');
