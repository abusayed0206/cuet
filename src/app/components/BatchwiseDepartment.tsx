import React from 'react';

interface Student {
  studentid: string;
  name: string;
  dplink: string; // Added dplink to the Student interface
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
      
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <ul className="divide-y divide-gray-200">
          {studentList.map((student) => (
            <li key={student.studentid} className="flex items-center p-4">
              <img
                src={student.dplink}
                alt={student.name}
                onError={handleImageError}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <a href={`https://cuet.sayed.page/${student.studentid}`} className="text-lg font-semibold text-black" target="_blank" rel="noopener noreferrer">
                  {student.studentid}
                </a>
                <p className="text-lg text-black">{student.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BatchwiseDepartment;
