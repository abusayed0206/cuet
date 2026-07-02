import { useState } from "react";

export default function HomeClient() {
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

    window.location.href = `/${studentId}`;
  };

  return (
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
  );
}
