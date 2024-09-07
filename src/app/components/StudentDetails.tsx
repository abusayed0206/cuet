"use client"
import React, { useState } from 'react';

interface StudentDetailsProps {
  data: {
    name: string;
    studentid: string;
    batch: string;
    session: string;
    department: string;
    hall: string;
    public_email: string;
    linkedin: string;
    dplink: string;
    currentstatus: string;
  };
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ data }) => {
  const [imageSrc, setImageSrc] = useState(data.dplink);

  const handleError = () => {
    setImageSrc('https://cdn.abusayed.dev/demo.png');
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      {/* Profile Picture */}
      {imageSrc && (
        <div className="flex justify-center mb-4">
          <img
            src={imageSrc}
            alt={`${data.name}'s DP`}
            className="w-24 h-24 rounded-full border-2 border-gray-300"
            onError={handleError}
          />
        </div>
      )}

      <div className="space-y-2">
        <div>
          <span className="text-gray-700">Name: </span>
          <span className="font-bold text-black">{data.name}</span>
        </div>
        <div>
          <span className="text-gray-700">Student ID: </span>
          <span className="font-bold text-black">{data.studentid}</span>
        </div>

        <div>
          <span className="text-gray-700">Batch: </span>
          <span className="font-bold text-black">{data.batch}</span>
        </div>
        <div>
          <span className="text-gray-700">Session: </span>
          <span className="font-bold text-black">{data.session}</span>
        </div>
        <div>
          <span className="text-gray-700">Department: </span>
          <span className="font-bold text-black">{data.department}</span>
        </div>

        <div>
          <span className="text-gray-700">Hall: </span>
          <span className="font-bold text-black">{data.hall}</span>
        </div>
        <div>
          <span className="text-gray-700">Public Email: </span>
          <span className="font-bold text-black">
            {data.public_email && (
              <a href={`mailto:${data.public_email}`} className="text-blue-500">
                {data.public_email}
              </a>
            )}
          </span>
        </div>
       {data.public_email } 
        <div>
          <span className="text-gray-700">LinkedIn: </span>
          <span className="font-bold text-black">
            {data.linkedin && (
              <a
                href={data.linkedin}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
              </a>
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-700">Current Status: </span>
          <span className="font-bold text-black">{data.currentstatus}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
