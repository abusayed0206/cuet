'use client';
import { useState } from 'react';
import StudentDetails from '@/components/ExtendedStudentDetails';
interface Student {
  name: string;
  studentid: string;
  uniqueid: string;
  batch: string;
  session: string;
  department: string;
  admissionroll: string;
  admissionmerit: string;
  hall: string;
  public_email: string;
  bloodgroup: string;
  phonenumber: string;
  linkedin: string;
  dplink: string;
  currentstatus: string;
}

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateStudentId = (id: string): boolean => {
    const regex = /^[0-9]{7}$/;
    if (!regex.test(id)) return false;

    const batchYear = parseInt(id.slice(0, 2), 10);
    const departmentCode = parseInt(id.slice(2, 4), 10);
    const classRoll = parseInt(id.slice(4, 7), 10);

    return batchYear >= 0 && batchYear <= 99 && departmentCode >= 1 && departmentCode <= 12 && classRoll >= 1 && classRoll <= 200;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setError('Please enter a value.');
      return;
    }

    if (!validateStudentId(inputValue)) {
      setError('Please enter a valid CUET ID.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStudentData(null);

    try {
      const response = await fetch(`/api/student/extended/${inputValue}`);
      if (!response.ok) throw new Error('No student found with this ID.');
      const data = await response.json();
      setStudentData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="pt-16 py-6 flex flex-col justify-center items-center">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">


          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-slate-300 shadow-lg rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-semibold text-center text-black">Extended Information</h1>
              <div className="divide-y divide-gray-200">
                <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7 flex flex-col items-center">
                  <input
                    id="inputValue"
                    name="inputValue"
                    type="number"
                    className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 text-center rounded-md mb-4"
                    placeholder="Enter Student ID"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md px-4 py-2 hover:from-pink-500 hover:to-yellow-500 transition-all">
                    Submit
                  </button>
                </form>
              </div>
              {isLoading && (
                <div className="flex justify-center items-center">
                  <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              {error && <p className="text-center text-red-500">{error}</p>}
              {studentData && <StudentDetails data={studentData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
