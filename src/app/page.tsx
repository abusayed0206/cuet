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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl text-center">
          {/* Hero Section */}
          <div className="mb-8">
            <img
              src="/CUET_Vector_ogo.svg"
              alt="CUET Logo"
              className="mx-auto mb-4 w-16 h-16 sm:w-20 sm:h-20"
            />
            <div className="text-center mb-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                CUET Student
                <span className="text-blue-600"> Directory</span>
              </h3>
            </div>

            <p className="text-base sm:text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Search and find CUET student information by ID, name, department,
              or batch. Access academic details and connect with your peers.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-12 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6">
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
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter 7-digit student ID"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-800 placeholder-slate-500"
                  maxLength={7}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link
              href="/search"
              className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-green-200 transition-colors">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Search by Name
              </h3>
              <p className="text-slate-600 text-sm">
                Find students by their name
              </p>
            </Link>

            <Link
              href="/batch"
              className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Browse by Batch
              </h3>
              <p className="text-slate-600 text-sm">
                Explore students by department and batch
              </p>
            </Link>

            <Link
              href="/privacy"
              className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow group sm:col-span-2 lg:col-span-1"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Privacy Policy
              </h3>
              <p className="text-slate-600 text-sm">
                Learn about data usage and privacy
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 text-sm">
            Developed by{" "}
            <span className="font-semibold text-slate-800">Sayed</span> • ID:{" "}
            <span className="font-semibold text-slate-800">1901049</span>
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Department of Civil Engineering • Batch 19 • Session 2019-20
          </p>
        </div>
      </footer>
    </div>
  );
}
