import React from 'react';

interface Student {
  studentid: string;
  name: string;
}

interface BatchwiseDepartmentProps {
  departmentName: string;
  batch: string;
  students: number;
  studentList: Student[];
}

const BatchwiseDepartment: React.FC<BatchwiseDepartmentProps> = ({ departmentName, batch, students, studentList }) => {
  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-black">{departmentName}</h1>
        <p className="text-lg mb-4 text-black">Batch: {batch}</p>
        <p className="text-lg mb-4 text-black">Total Students: {students}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <ul className="divide-y divide-gray-200">
          {studentList.map(student => (
            <li key={student.studentid} className="p-4 text-black">
              <a
                href={`https://cuet.sayed.page/${student.studentid}`}
                className="block hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                [{student.studentid}]➡️{student.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BatchwiseDepartment;
