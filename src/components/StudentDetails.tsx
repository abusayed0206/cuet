import Link from 'next/link';
import type { Student } from '@/utils/d1';

interface StudentDetailsProps {
  student: Student;
}

export default function StudentDetails({ student }: StudentDetailsProps) {
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Student Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-3xl">
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

          {/* Student Card */}
          <article className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 md:p-10">
            <div className="mb-8 text-center pb-8 border-b border-slate-200">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3">{student.name}</h1>
              <p className="text-slate-700 text-base sm:text-lg">
                Student ID: <span className="font-semibold text-blue-600">{student.studentid}</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-xl">
                  <h2 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Department</h2>
                  <p className="text-slate-900 font-semibold text-base sm:text-lg break-words leading-snug">{student.department}</p>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl">
                  <h2 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Admission Roll</h2>
                  <p className="text-slate-900 font-semibold text-base sm:text-lg">{displayRoll}</p>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl">
                  <h2 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Merit Position</h2>
                  <p className="text-blue-600 font-bold text-base sm:text-lg">
                    {displayMerit !== "Not Available" ? `#${displayMerit}` : displayMerit}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-5 rounded-xl">
                  <h2 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Batch</h2>
                  <p className="text-slate-900 font-semibold text-base sm:text-lg">{student.batch}</p>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl">
                  <h2 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Session</h2>
                  <p className="text-slate-900 font-semibold text-base sm:text-lg">{student.session}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-8 border-t border-slate-200">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4 text-center">Quick Actions</h2>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  href="/search"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-3 rounded-xl transition-all duration-200 text-center font-semibold shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300"
                  aria-label="Search for more students"
                >
                  Search More Students
                </Link>
                <Link 
                  href="/batch"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-3 rounded-xl transition-all duration-200 text-center font-semibold shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-300"
                  aria-label="Browse students by batch"
                >
                  Browse by Batch
                </Link>
              </div>
            </div>
          </article>
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
