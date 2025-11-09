import Link from 'next/link';
import type { Student } from '@/utils/d1';

interface StudentDetailsProps {
  student: Student;
}

export default function StudentDetails({ student }: StudentDetailsProps) {
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Student Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Clean up merit position display
  const displayMerit = !student.admission_merit || student.admission_merit === "A FAILURE" 
    ? "Not Available" 
    : student.admission_merit;
  
  const displayRoll = student.admission_roll || "Not Available";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
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

          {/* Student Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{student.name}</h1>
              <p className="text-slate-600 text-lg">Student ID: {student.studentid}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Department</h3>
                  <p className="text-slate-800 font-medium text-base sm:text-lg break-words">{student.department}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Admission Roll</h3>
                  <p className="text-slate-800 font-medium text-base sm:text-lg">{displayRoll}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Merit Position</h3>
                  <p className="text-slate-800 font-medium text-base sm:text-lg">{displayMerit}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Batch</h3>
                  <p className="text-slate-800 font-medium text-base sm:text-lg">{student.batch}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Session</h3>
                  <p className="text-slate-800 font-medium text-base sm:text-lg">{student.session}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/search"
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-center"
                >
                  Search More Students
                </Link>
                <Link 
                  href="/batch"
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors text-center"
                >
                  Browse by Batch
                </Link>
              </div>
            </div>
          </div>
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
