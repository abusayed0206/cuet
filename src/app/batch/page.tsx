'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Student {
  name: string;
  studentid: string;
  department: string;
  admission_roll: string;
  admission_merit: string;
  batch: string;
  session: string;
}

interface BatchData {
  department: string;
  departmentCode: string;
  batch: string;
  session: string;
  totalStudents: number;
  students: Student[];
}

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

export default function BatchPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [batchData, setBatchData] = useState<BatchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBatchData = async () => {
    if (!selectedDepartment || !selectedBatch) {
      setError('Please select both department and batch');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/${selectedDepartment}/${selectedBatch}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch batch data');
      }

      setBatchData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBatchData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBatchData();
  };

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

          {/* Selection Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-800"
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept.code} value={dept.code}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-slate-700 mb-2">
                  Batch
                </label>
                <select
                  id="batch"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-800"
                >
                  <option value="">Select Batch</option>
                  {Array.from({ length: 13 }, (_, i) => 24 - i).map((batch) => (
                    <option key={batch} value={batch.toString().padStart(2, '0')}>
                      {batch.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading || !selectedDepartment || !selectedBatch}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </div>
                  ) : (
                    'View Students'
                  )}
                </button>
              </div>
            </form>
          </div>

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
          {!loading && !batchData && !error && (
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
