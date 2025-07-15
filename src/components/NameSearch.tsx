import React from 'react';

interface Student {
  name: string;
  studentid: string;
  department: string;
  batch: string;
  dplink: string;
}

interface NameSearchProps {
  results: Student[];
}

const NameSearch: React.FC<NameSearchProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      {results.map((student) => (
        <div key={student.studentid} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col items-center text-center relative">
          <div className="w-24 h-24 rounded-full overflow-hidden mt-4">
            <img
              src={student.dplink}
              alt={`${student.name}'s DP`}
              className="w-full h-full object-contain"
              onError={(e) => (e.currentTarget.src = 'https://cdn.abusayed.dev/demo.png')}
            />
          </div>

          <a
            href={`https://cuet.sayed.app/${student.studentid}`}
            className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            ID: {student.studentid}
          </a>
          <div className="p-4 flex flex-col items-center">
            <a
              href={`https://cuet.sayed.app/${student.studentid}`}
              className="text-xl font-bold text-black mb-2"
            >
              {student.name}
            </a>
            <p className="text-gray-600">Batch: {student.batch}</p>
            <p className="text-gray-600 mb-1">{student.department}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NameSearch;
