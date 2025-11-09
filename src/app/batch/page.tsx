import { getCloudflareContext } from '@opennextjs/cloudflare';
import Link from 'next/link';
import { getStudentsByDepartmentAndBatch, type Student } from '@/utils/d1';
import BatchClient from './BatchClient';

const departmentOptions = [
  { code: 'ce', name: 'Civil Engineering' },
  { code: 'eee', name: 'Electrical & Electronic Engineering' },
  { code: 'me', name: 'Mechanical Engineering' },
  { code: 'cse', name: 'Computer Science & Engineering' },
  { code: 'urp', name: 'Urban & Regional Planning' },
  { code: 'arch', name: 'Architecture' },
  { code: 'pme', name: 'Petroleum & Mining Engineering' },
  { code: 'ete', name: 'Electronics & Telecommunication Engineering' },
  { code: 'bme', name: 'Biomedical Engineering' },
  { code: 'mie', name: 'Mechatronics & Industrial Engineering' },
  { code: 'wrp', name: 'Water Resources Engineering' },
  { code: 'mse', name: 'Materials Science & Engineering' },
  { code: 'mme', name: 'Materials and Metallurgical Engineering' },
];

interface BatchData {
  department: string;
  departmentCode: string;
  batch: string;
  session: string;
  totalStudents: number;
  students: Student[];
}

async function getBatchData(departmentCode: string, batch: string): Promise<BatchData | null> {
  try {
    const { env } = await getCloudflareContext();
    const students = await getStudentsByDepartmentAndBatch(env.DB, departmentCode, batch);
    
    if (!students || students.length === 0) {
      return null;
    }

    const department = departmentOptions.find(d => d.code === departmentCode)?.name || departmentCode.toUpperCase();
    const session = students[0]?.session || '';

    return {
      department,
      departmentCode,
      batch,
      session,
      totalStudents: students.length,
      students
    };
  } catch (error) {
    console.error('Error fetching batch data:', error);
    return null;
  }
}

interface PageProps {
  searchParams: Promise<{ department?: string; batch?: string }>;
}

export default async function BatchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedDepartment = params.department || '';
  const selectedBatch = params.batch || '';
  
  let batchData: BatchData | null = null;
  let error = '';

  if (selectedDepartment && selectedBatch) {
    batchData = await getBatchData(selectedDepartment, selectedBatch);
    if (!batchData) {
      error = 'No students found for the selected department and batch.';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Back button */}
          <div className="mb-6 text-center">
            <Link 
              href="/"
              className="inline-flex items-center text-slate-700 hover:text-slate-900 transition-colors font-medium"
              aria-label="Go back to home page"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Browse by Department & Batch
            </h1>
            <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Select a department and batch to view all students with their academic details.
            </p>
          </div>

          {/* Selection Form - Client Component */}
          <BatchClient 
            initialDepartment={selectedDepartment} 
            initialBatch={selectedBatch} 
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-5 mb-6 shadow-md" role="alert" aria-live="polite">
              <div className="flex">
                <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {batchData && (
            <div>
              {/* Batch Info */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                      {batchData.department}
                    </h2>
                    <p className="text-base sm:text-lg text-slate-700">
                      Batch <span className="font-semibold">{batchData.batch}</span> • Session <span className="font-semibold">{batchData.session}</span>
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-4xl sm:text-5xl font-bold text-blue-600">{batchData.totalStudents}</p>
                    <p className="text-slate-700 text-base sm:text-lg">Total Students</p>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
                    Students (Ordered by Student ID)
                  </h3>
                </div>
                
                <div className="divide-y divide-slate-200">
                  {batchData.students.map((student, index) => (
                    <Link
                      key={student.studentid}
                      href={`/${student.studentid}`}
                      className="block p-5 sm:p-6 hover:bg-slate-50 transition-all duration-200 group"
                      aria-label={`View details for ${student.name}, student ID ${student.studentid}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <span className="text-blue-700 font-semibold text-sm sm:text-base">
                              {index + 1}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-base sm:text-lg truncate">
                              {student.name}
                            </h4>
                            <p className="text-slate-600 text-sm sm:text-base">ID: {student.studentid}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-slate-900 font-semibold text-base sm:text-lg">Merit #{student.admission_merit}</p>
                          <p className="text-slate-600 text-sm sm:text-base">Roll: {student.admission_roll}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!batchData && !error && (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">Select Department & Batch</h3>
              <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto">
                Choose a department and batch above to view students.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-700 text-sm">
            Developed by{" "}
            <a 
              href="https://sayed.page/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-slate-900 hover:text-slate-600 transition-colors"
            >
              Sayed
            </a>
            {" "}• ID: <span className="font-semibold text-slate-900">1901049</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
