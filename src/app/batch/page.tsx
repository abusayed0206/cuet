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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          {/* Back button */}
          <div className="mb-6 text-center">
            <Link 
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Browse by Department & Batch
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {batchData && (
            <div>
              {/* Batch Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {batchData.department}
                    </h2>
                    <p className="text-slate-600">
                      Batch {batchData.batch} • Session {batchData.session}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-3xl font-bold text-blue-600">{batchData.totalStudents}</p>
                    <p className="text-slate-600 text-sm">Total Students</p>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Students (Ordered by Student ID)
                  </h3>
                </div>
                
                <div className="divide-y divide-slate-200">
                  {batchData.students.map((student, index) => (
                    <Link
                      key={student.studentid}
                      href={`/${student.studentid}`}
                      className="block p-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                              {student.name}
                            </h4>
                            <p className="text-slate-600 text-sm">ID: {student.studentid}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-800 font-medium">Merit #{student.admission_merit}</p>
                          <p className="text-slate-600 text-sm">Roll: {student.admission_roll}</p>
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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Select Department & Batch</h3>
              <p className="text-slate-600">Choose a department and batch above to view students.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm">
            Developed by <span className="font-semibold text-slate-800">Sayed</span> • ID: <span className="font-semibold text-slate-800">1901049</span>
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Department of Civil Engineering • Batch 19 • Session 2019-20
          </p>
        </div>
      </footer>
    </div>
  );
}
