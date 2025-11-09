/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");

  const validateStudentId = (id: string): boolean => {
    const regex = /^[0-9]{7}$/;
    if (!regex.test(id)) return false;
    const batchYear = parseInt(id.slice(0, 2), 10);
    const departmentCode = parseInt(id.slice(2, 4), 10);
    const classRoll = parseInt(id.slice(4, 7), 10);
    if (batchYear < 0 || batchYear > 99) return false;
    if (departmentCode < 1 || departmentCode > 13) return false;
    if (classRoll < 1 || classRoll > 999) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!studentId.trim()) {
      setError("Please enter a student ID.");
      return;
    }

    if (!validateStudentId(studentId)) {
      setError("Please enter a valid 7-digit CUET student ID.");
      return;
    }

    router.push(`/${studentId}`);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="w-full max-w-5xl">
          {/* Hero Section - Compact */}
          <div className="mb-8 text-center">
            <div className="inline-block mb-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
              <img
                src="/CUET_Vector_ogo.svg"
                alt="CUET Logo"
                className="w-12 h-12 sm:w-14 sm:h-14"
                loading="eager"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight text-slate-900">
              CUET Student Directory
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Search student information by ID, name, department, or batch
            </p>
          </div>

          {/* Search Card - Compact */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-10 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6 text-center">
              Find Student
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="1234567"
                  className="w-full px-4 py-3 text-base bg-slate-50 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 focus:bg-white outline-none transition-all text-slate-800 placeholder-slate-400"
                  maxLength={7}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label="Student ID input"
                  aria-describedby={error ? "error-message" : undefined}
                  autoComplete="off"
                />
              </div>

              {error && (
                <div 
                  id="error-message"
                  role="alert"
                  className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 flex items-start"
                  aria-live="polite"
                >
                  <svg className="w-5 h-5 text-red-500 mr-2 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 shadow-sm"
                aria-label="Search for student"
              >
                Search Student
              </button>
            </form>
          </div>

          {/* Quick Actions - Compact Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/search"
                className="bg-white hover:bg-slate-50 rounded-xl shadow-md border border-slate-200 p-5 transition-all duration-200 hover:shadow-lg group"
                aria-label="Search students by name"
              >
                <div className="flex items-center gap-3 sm:flex-col sm:text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-base mb-1">
                      Search by Name
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Find students by name
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/batch"
                className="bg-white hover:bg-slate-50 rounded-xl shadow-md border border-slate-200 p-5 transition-all duration-200 hover:shadow-lg group"
                aria-label="Browse students by batch"
              >
                <div className="flex items-center gap-3 sm:flex-col sm:text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-base mb-1">
                      Browse by Batch
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Filter by department and batch
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/privacy"
                className="bg-white hover:bg-slate-50 rounded-xl shadow-md border border-slate-200 p-5 transition-all duration-200 hover:shadow-lg group"
                aria-label="View privacy policy"
              >
                <div className="flex items-center gap-3 sm:flex-col sm:text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-slate-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-base mb-1">
                      Privacy Policy
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Data protection info
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Compact */}
      <footer className="relative z-10 bg-white/80 border-t border-slate-200 py-6 mt-8">
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
