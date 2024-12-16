"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface StudentDetailsProps {
  data?: {
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
  const [imageSrc, setImageSrc] = useState(data?.dplink || 'https://cdn.abusayed.dev/demo.png');

  useEffect(() => {
    if (data?.dplink) {
      setImageSrc(data.dplink);
    }
  }, [data]);

  const handleError = () => {
    setImageSrc('https://cdn.abusayed.dev/demo.png');
  };

  if (!data) {
    return (
      <div className="text-center p-4 bg-white/10 text-red-400 rounded-lg">
        <p>Student data is unavailable.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-white/10 rounded-lg shadow-lg backdrop-blur-xl">
      {/* Profile Picture */}
      {imageSrc && (
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gradient-to-r from-violet-500 to-cyan-500 shadow-lg">
            <img
              src={imageSrc}
              alt={`${data.name}'s DP`}
              className="w-full h-full object-contain"
              onError={handleError}
            />
          </div>
        </div>
      )}

      <div className="space-y-2 text-white">
        <div>
          <span className="text-gray-300">Name: </span>
          <span className="font-bold text-white">{data.name}</span>
        </div>
        <div>
          <span className="text-gray-300">Student ID: </span>
          <span className="font-bold text-white">
            <a href={`/${data.studentid}`} className="text-cyan-400 hover:underline">
              {data.studentid}
            </a>
          </span>
        </div>
        <div>
          <span className="text-gray-300">Batch: </span>
          <span className="font-bold text-white">{data.batch}</span>
        </div>
        <div>
          <span className="text-gray-300">Session: </span>
          <span className="font-bold text-white">{data.session}</span>
        </div>
        <div>
          <span className="text-gray-300">Department: </span>
          <span className="font-bold text-white">{data.department}</span>
        </div>
        <div>
          <span className="text-gray-300">Hall: </span>
          <span className="font-bold text-white">{data.hall}</span>
        </div>
        <div>
          <span className="text-gray-300">Public Email: </span>
          <span className="font-bold text-white">
            {data.public_email ? (
              <a href={`mailto:${data.public_email}`} className="text-cyan-400 hover:underline">
                {data.public_email}
              </a>
            ) : (
              'N/A'
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-300">LinkedIn: </span>
          <span className="font-bold text-white">
            {data.linkedin ? (
              <a
                href={`https://www.linkedin.com/in/${data.linkedin}`}
                className="text-cyan-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
              </a>
            ) : (
              'N/A'
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-300">Current Status: </span>
          <span className="font-bold text-white">{data.currentstatus}</span>
        </div>
      </div>
      <div className="mt-4 text-center rounded-md">
        <p className="mt-4 text-center text-white">
          Note: For extended info of this student click <Link href={`/extended/${data.studentid}`} className="text-cyan-400 hover:underline">
            here</Link> . You must be logged in with your CUET Email.
        </p>
      </div>

    </div>

  );
};

export default StudentDetails;
