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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex mb-4">
              <img
                src="/CUET_Vector_ogo.svg"
                alt="CUET Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 opacity-90"
                loading="eager"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-slate-800 tracking-tight">
              CUET Students Directory
            </h1>
            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
              Search the official unofficial database to find peers and alumni.
            </p>
          </div>

          {/* Search Card */}
          <div className="w-full max-w-lg mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-slate-600 mb-2">
                    Enter Student ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 1901049"
                      className="w-full px-4 py-3 text-lg bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all text-slate-800 placeholder-slate-400"
                      maxLength={7}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 flex items-start">
                    <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-6 rounded-xl transition-colors duration-200 focus:ring-4 focus:ring-blue-100 shadow-sm"
                >
                  Find Student
                </button>
              </form>
            </div>
          </div>

          {/* Quick Actions Grid - Highlighted */}
          <div className="w-full max-w-3xl">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wide text-center mb-6">Or explore directories</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link href="/batch" className="group bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-2xl p-5 transition-all duration-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg mb-0.5">Browse by Batch</h3>
                  <p className="text-slate-500 text-sm">Filter students by their admission year and department.</p>
                </div>
              </Link>

              <Link href="/search" className="group bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-2xl p-5 transition-all duration-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg mb-0.5">Search by Name</h3>
                  <p className="text-slate-500 text-sm">Look up any student by typing their full or partial name.</p>
                </div>
              </Link>

            </div>

            {/* Smaller secondary links */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-slate-500 text-sm">
          Designed & Developed by{" "}
          <a 
            href="https://sayed.page/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            Sayed
          </a>
          <span className="mx-2 text-slate-300">•</span>
          ID: 1901049
        </p>
      </footer>
    </div>
  );
}
