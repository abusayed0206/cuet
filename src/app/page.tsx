'use client';
import { useState } from 'react';
import StudentDetails from './components/StudentDetails';
import NameSearch from './components/NameSearch';
import BatchwiseDepartment from './components/BatchwiseDepartment';
import Card from './components/Credit';

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
  email: string;
  phonenumber: string;
  bloodgroup: string;
  linkedin: string;
  dplink: string;
  currentstatus: string;
}

interface DepartmentData {
  name: string;
  batch: string;
  students: number;
  studentList: Student[];
}

type SearchType = 'Student ID' | 'Name' | 'Batch';

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('Student ID');
  const [department, setDepartment] = useState<string>('ce');
  const [batch, setBatch] = useState<string>('17');
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentData | null>(null);
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

    if (searchType !== 'Batch' && !inputValue.trim()) {
      setError('Please enter a value.');
      return;
    }

    if (searchType === 'Student ID' && !validateStudentId(inputValue)) {
      setError('Please enter a valid CUET ID.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStudentData(null);
    setSearchResults([]);
    setDepartmentData(null);

    try {
      let response: Response;
      let data: any;

      switch (searchType) {
        case 'Student ID':
          response = await fetch(`/api/student/${inputValue}`);
          if (!response.ok) throw new Error('No student found with this ID.');
          data = await response.json();
          setStudentData(data);
          break;

        case 'Name':
          if (inputValue.length < 4) {
            setError('Name must be at least 4 characters long.');
            return;
          }
          response = await fetch(`/api/student/search?name=${inputValue}`);
          if (!response.ok) throw new Error('No student found with this name.');
          data = await response.json();
          setSearchResults(data.results);
          break;

        case 'Batch':
          response = await fetch(`/api/department/${department}/${batch}`);
          if (!response.ok) throw new Error('No students found for this batch and department.');
          data = await response.json();
          setDepartmentData(data);
          break;
      }
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
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-6 flex flex-col justify-center items-center">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-slate-300 shadow-lg rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-center text-black">CUET Student Information</h1>
            <div className="divide-y divide-gray-200">
<form onSubmit={handleSubmit} className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7 flex flex-col items-center">
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value as SearchType);
                    setInputValue('');
                    setDepartmentData(null);
                  }}
                  className="border-b-2 border-gray-300 py-2 px-4 rounded-md mb-4"
                >
                  <option value="Student ID">Student ID</option>
                  <option value="Name">Name</option>
                  <option value="Batch">Batch</option>
                </select>

                {searchType === 'Batch' && (
                <div className="flex space-x-4 mb-4">
  <div>
    <select
      value={batch}
      onChange={(e) => setBatch(e.target.value)}
      className="border-b-2 border-gray-300 py-2 px-4 rounded-md"
    >
      <option value="17">17</option>
      <option value="18">18</option>
      <option value="19">19</option>
      <option value="20">20</option>
      <option value="21">21</option>
      <option value="22">22</option>
    </select>
  </div>

  <div>
    <select
      value={department}
      onChange={(e) => setDepartment(e.target.value.toLowerCase())}
      className="border-b-2 border-gray-300 py-2 px-4 rounded-md"
    >
      <option value="ce">CE</option>
      <option value="me">ME</option>
      <option value="cse">CSE</option>
      <option value="eee">EEE</option>
      <option value="ete">ETE</option>
      <option value="bme">BME</option>
      <option value="arch">ARCH</option>
      <option value="pme">PME</option>
      <option value="urp">URP</option>
      <option value="mse">MSE</option>
      <option value="mie">MIE</option>
      <option value="wre">WRE</option>
    </select>
  </div>
</div>
                )}

                {(searchType === 'Student ID' || searchType === 'Name') && (
                  <input
  id="inputValue"
  name="inputValue"
  type={searchType === 'Student ID' ? 'number' : 'text'}
  className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 text-center rounded-md mb-4"
  placeholder={searchType === 'Student ID' ? 'Enter Student ID' : 'Enter Name'}
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>
                )}

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
            {studentData && searchType === 'Student ID' && <StudentDetails data={studentData} />}
            {searchResults.length > 0 && searchType === 'Name' && <NameSearch results={searchResults} />}
            {departmentData && searchType === 'Batch' && (
              <BatchwiseDepartment
                departmentName={departmentData.name}
                batch={departmentData.batch}
                students={departmentData.students}
                studentList={departmentData.studentList}
              />
            )}
          </div>
        </div>
      </div>
      <Card/>
    </div>
  );
                    }
