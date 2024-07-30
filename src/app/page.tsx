'use client';
import { useState } from 'react';
import StudentDetails from './components/StudentDetails';
import NameSearch from './components/NameSearch'; // Make sure to import NameSearch

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [searchType, setSearchType] = useState('Student ID');
  const [studentData, setStudentData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateStudentId = (id: string) => {
    const regex = /^[0-9]{7}$/;
    if (!regex.test(id)) return false;

    const batchYear = parseInt(id.slice(0, 2), 10);
    const departmentCode = parseInt(id.slice(2, 4), 10);
    const classRoll = parseInt(id.slice(4, 7), 10);

    if (batchYear < 0 || batchYear > 99) return false;
    if (departmentCode < 1 || departmentCode > 12) return false;
    if (classRoll < 1 || classRoll > 200) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('Please enter a value.');
      return;
    }

    if (searchType === 'Student ID') {
      if (!validateStudentId(inputValue)) {
        setError('Please enter a valid CUET ID.');
        return;
      }

      setIsLoading(true);
      setError('');
      setStudentData(null);
      setSearchResults([]);
      try {
        const response = await fetch(`/api/student/${inputValue}`);
        if (!response.ok) {
          throw new Error('No student found with this ID.');
        }
        const data = await response.json();
        setStudentData(data);
      } catch (err) {
        setError('There is no student by this ID');
      } finally {
        setIsLoading(false);
      }
    } else if (searchType === 'Name') {
      if (inputValue.length < 4) {
        setError('Name must be at least 4 characters long.');
        return;
      }

      setIsLoading(true);
      setError('');
      setStudentData(null);
      try {
        const response = await fetch(`/api/student/search?name=${inputValue}`);
        if (!response.ok) {
          throw new Error('No student found with this name.');
        }
        const data = await response.json();
        setSearchResults(data.results);
      } catch (err) {
        setError('No students found with this name');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-6 flex flex-col justify-center items-center">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-slate-300 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center text-black">CUET Student Information</h1>
            <div className="divide-y divide-gray-200">
              <form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex items-center space-x-4">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="border-b-2 border-gray-300 py-2 px-4 rounded-md"
                  >
                    <option value="Student ID">Student ID</option>
                    <option value="Name">Name</option>
                  </select>
                  <input
                    id="inputValue"
                    name="inputValue"
                    type="text"
                    className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 text-center"
                    placeholder={searchType === 'Student ID' ? 'Enter Student ID' : 'Enter Name'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md px-4 py-2 hover:from-pink-500 hover:to-yellow-500 transition-all">
                    Submit
                  </button>
                </div>
              </form>
            </div>
            {isLoading && (
              <div className="flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            {studentData && searchType === 'Student ID' && <StudentDetails data={studentData} />}
            {searchResults.length > 0 && searchType === 'Name' && <NameSearch results={searchResults} />}
          </div>
        </div>
      </div>
    </div>
  );
}
