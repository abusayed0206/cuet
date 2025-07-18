import React from 'react';
import Link from 'next/link';

interface Student {
  studentid: string;
  name: string;
  dplink: string;
}

interface BatchwiseDepartmentProps {
  departmentName: string;
  batch: string;
  students: number;
  studentList: Student[];
}

const BatchwiseDepartment: React.FC<BatchwiseDepartmentProps> = ({
  departmentName,
  batch,
  students,
  studentList,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://cdn.abusayed.dev/demo.png';
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-black">{departmentName}</h1>
        <p className="text-lg mb-4 text-black">Batch: {batch}</p>
        <p className="text-lg mb-4 text-black">Total Students: {students}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {studentList.map((student) => (
            <div key={student.studentid} className="flex items-center p-4 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img
                  src={student.dplink}
                  alt={student.name}
                  onError={handleImageError}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <Link
                  href={`/${student.studentid}`}
                  className="text-lg font-semibold text-black"

                  rel="noopener noreferrer"
                >
                  {student.studentid}
                </Link>
                <Link
                  href={`/${student.studentid}`}
                  className="text-lg font-semibold text-black"

                  rel="noopener noreferrer"
                >
                  <p className="text-lg text-black">{student.name}</p>
                </Link>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchwiseDepartment;
