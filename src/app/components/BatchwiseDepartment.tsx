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
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">{departmentName}</h1>
        <p className="text-lg mb-4">Batch: {batch}</p>
        <p className="text-lg mb-4">Total Students: {students}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {studentList.map(student => (
            <li key={student.studentid} className="p-4">
              <a
                href={`https://cuet.sayed.page/${student.studentid}`}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {student.name} (ID: {student.studentid})
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BatchwiseDepartment;
