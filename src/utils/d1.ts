// D1 database utility functions
// This replaces the Supabase client

export interface Student {
  id?: number;
  name: string;
  studentid: string;
  department: string;
  admission_roll: string | null;
  admission_merit: string | null;
  batch: string;
  session: string;
}

export interface D1Binding {
  prepare(query: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(colName?: string): Promise<T | null>;
  run<T = any>(): Promise<D1Result<T>>;
  all<T = any>(): Promise<D1Result<T>>;
  raw<T = any[]>(): Promise<T[]>;
}

export interface D1Result<T = any> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    rows_read: number;
    rows_written: number;
  };
}

// Department code mapping
export const departmentMap: { [key: string]: string } = {
  ce: "Department of Civil Engineering",
  eee: "Department of Electrical & Electronic Engineering",
  me: "Department of Mechanical Engineering",
  cse: "Department of Computer Science & Engineering",
  urp: "Department of Urban & Regional Planning",
  arch: "Department of Architecture",
  pme: "Department of Petroleum & Mining Engineering",
  ete: "Department of Electronics & Telecommunication Engineering",
  bme: "Department of Biomedical Engineering",
  mie: "Department of Mechatronics & Industrial Engineering",
  wrp: "Department of Water Resources Engineering",
  mse: "Department of Materials Science & Engineering",
  mme: "Department of Materials & Metallurgical Engineering",
};

/**
 * Get a student by their student ID
 */
export async function getStudentById(
  db: D1Binding,
  studentId: string
): Promise<Student | null> {
  const stmt = db.prepare(
    "SELECT name, studentid, department, admission_roll, admission_merit, batch, session FROM students WHERE studentid = ?"
  );

  const result = await stmt.bind(studentId).first<Student>();
  return result;
}

/**
 * Get all students from a specific department and batch
 */
export async function getStudentsByDepartmentAndBatch(
  db: D1Binding,
  departmentCode: string,
  batch: string
): Promise<Student[]> {
  // Convert department code to full department name
  const fullDepartmentName = departmentMap[departmentCode.toLowerCase()];
  
  if (!fullDepartmentName) {
    console.error(`Invalid department code: ${departmentCode}`);
    return [];
  }

  const stmt = db.prepare(
    "SELECT name, studentid, department, admission_roll, admission_merit, batch, session FROM students WHERE department = ? AND batch = ? ORDER BY studentid ASC"
  );

  const result = await stmt.bind(fullDepartmentName, batch).all<Student>();
  return result.results;
}

/**
 * Search students by name (case-insensitive)
 */
export async function searchStudentsByName(
  db: D1Binding,
  searchName: string,
  limit: number = 50
): Promise<Student[]> {
  const stmt = db.prepare(
    `SELECT name, studentid, department, admission_roll, admission_merit, batch, session 
     FROM students 
     WHERE name LIKE ? COLLATE NOCASE 
     ORDER BY batch DESC, CAST(admission_merit AS INTEGER) ASC 
     LIMIT ?`
  );

  const searchPattern = `%${searchName}%`;
  const result = await stmt.bind(searchPattern, limit).all<Student>();
  return result.results;
}

/**
 * Get all unique batches from the database
 */
export async function getAllBatches(db: D1Binding): Promise<string[]> {
  const stmt = db.prepare(
    "SELECT DISTINCT batch FROM students ORDER BY batch DESC"
  );

  const result = await stmt.all<{ batch: string }>();
  return result.results.map((row) => row.batch);
}

/**
 * Get all unique departments from the database
 */
export async function getAllDepartments(db: D1Binding): Promise<string[]> {
  const stmt = db.prepare(
    "SELECT DISTINCT department FROM students ORDER BY department ASC"
  );

  const result = await stmt.all<{ department: string }>();
  return result.results.map((row) => row.department);
}

/**
 * Get student count by department and batch
 */
export async function getStudentCount(
  db: D1Binding,
  department?: string,
  batch?: string
): Promise<number> {
  let query = "SELECT COUNT(*) as count FROM students";
  const params: any[] = [];

  if (department && batch) {
    query += " WHERE department = ? AND batch = ?";
    params.push(department, batch);
  } else if (department) {
    query += " WHERE department = ?";
    params.push(department);
  } else if (batch) {
    query += " WHERE batch = ?";
    params.push(batch);
  }

  const stmt = db.prepare(query);
  const result = await stmt.bind(...params).first<{ count: number }>();

  return result?.count || 0;
}
