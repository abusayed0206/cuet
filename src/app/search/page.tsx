import { getCloudflareContext } from '@opennextjs/cloudflare';
import Link from 'next/link';
import { searchStudentsByName, type Student } from '@/utils/d1';
import SearchClient from './SearchClient';

interface PageProps {
  searchParams: Promise<{ name?: string }>;
}

async function getSearchResults(query: string): Promise<{ students: Student[]; error: string }> {
  try {
    if (!query || query.length < 2) {
      return { students: [], error: 'Please enter at least 2 characters' };
    }

    const { env } = await getCloudflareContext();
    const students = await searchStudentsByName(env.DB, query);
    
    return { students: students || [], error: '' };
  } catch (error) {
    console.error('Error searching students:', error);
    return { students: [], error: 'Failed to search students' };
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.name || '';
  
  const { students, error } = searchQuery ? await getSearchResults(searchQuery) : { students: [], error: '' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-5xl">
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
              Search Students
            </h1>
            <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Find CUET students by their name. Search is case-insensitive and matches partial names.
            </p>
          </div>

          {/* Search Form - Client Component */}
          <SearchClient initialQuery={searchQuery} />

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
          {students.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                  Search Results 
                  <span className="ml-2 text-blue-600">({students.length} found)</span>
                </h2>
              </div>
              
              <div className="grid gap-4 sm:gap-5">
                {students.map((student) => (
                  <Link
                    key={student.studentid}
                    href={`/${student.studentid}`}
                    className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-5 sm:p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                    aria-label={`View details for ${student.name}, student ID ${student.studentid}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                          {student.name}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-slate-700 text-sm sm:text-base flex items-center">
                            <span className="font-medium mr-2">ID:</span>
                            {student.studentid}
                          </p>
                          <p className="text-slate-700 text-sm sm:text-base line-clamp-1">
                            {student.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-3 sm:gap-2 sm:text-right">
                        <div className="flex-1 sm:flex-none">
                          <p className="text-sm text-slate-600">Batch</p>
                          <p className="text-base sm:text-lg font-semibold text-slate-900">{student.batch}</p>
                        </div>
                        <div className="flex-1 sm:flex-none">
                          <p className="text-sm text-slate-600">Merit</p>
                          <p className="text-base sm:text-lg font-semibold text-blue-600">#{student.admission_merit}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && students.length === 0 && !error && (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No students found</h3>
              <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto">
                Try adjusting your search term or check the spelling.
              </p>
            </div>
          )}

          {/* Initial State */}
          {!searchQuery && students.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">Start searching</h3>
              <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto">
                Enter a student name above to begin searching.
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
