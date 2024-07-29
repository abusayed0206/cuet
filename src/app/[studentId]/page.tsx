"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentDetails from '../components/StudentDetails';

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

const StudentPage = ({ params }: { params: { studentId: string } }) => {
  const router = useRouter();
  const { studentId } = params;
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentId) {
      if (!validateStudentId(studentId)) {
        setError('Type the right CUET ID on the link. Not just random number');
        setIsLoading(false);
        return;
      }

      const fetchStudentData = async () => {
        try {
          const response = await fetch(`/api/student/${studentId}`);
          if (!response.ok) {
            throw new Error('There is no student by this ID');
          }
          const data = await response.json();
          setStudentData(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [studentId]);

  useEffect(() => {
    if (error) {
      router.push('/');
    }
  }, [error, router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-6 flex flex-col justify-center items-center">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-slate-300 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            
            {isLoading && <p className="text-black text-center">CUET: Centre of Excellency</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {studentData && <StudentDetails data={studentData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
