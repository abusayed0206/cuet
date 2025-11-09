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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
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
              Search Students
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Find CUET students by their name. Search is case-insensitive and matches partial names.
            </p>
          </div>

          {/* Search Form - Client Component */}
          <SearchClient initialQuery={searchQuery} />

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
          {students.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">
                  Search Results ({students.length} found)
                </h2>
              </div>
              
              <div className="grid gap-4">
                {students.map((student) => (
                  <Link
                    key={student.studentid}
                    href={`/${student.studentid}`}
                    className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {student.name}
                        </h3>
                        <p className="text-slate-600 text-sm">ID: {student.studentid}</p>
                        <p className="text-slate-600 text-sm">{student.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-600 text-sm">Batch {student.batch}</p>
                        <p className="text-slate-600 text-sm">Merit #{student.admission_merit}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && students.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No students found</h3>
              <p className="text-slate-600">Try adjusting your search term or check the spelling.</p>
            </div>
          )}

          {/* Initial State */}
          {!searchQuery && students.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Start searching</h3>
              <p className="text-slate-600">Enter a student name above to begin searching.</p>
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
