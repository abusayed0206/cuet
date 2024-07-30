"use client";
import React, { useState } from 'react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {results.map((student) => (
        <div key={student.studentid} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            <img
              src={student.dplink}
              alt={`${student.name}'s DP`}
              className="w-full h-48 object-cover rounded-t-lg"
              onError={(e) => (e.currentTarget.src = 'https://cdn.abusayed.dev/demo.png')}
            />
            <a
              href={`https://cuet.sayed.page/${student.studentid}`}
              className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              ID: {student.studentid}
            </a>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{student.name}</h2>
            <p className="text-gray-600 mb-1">{student.department}</p>
            <p className="text-gray-600">{student.batch}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NameSearch;
