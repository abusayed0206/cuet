"use client";
import React, { useState } from 'react';
import { FaFacebook, FaLinkedin, FaResearchgate } from 'react-icons/fa';

interface TeacherDetailsProps {
  data: {
    id: number;
    name: string;
    department: string;
    role: string;
    email: string;
    phone: string;
    profilelink: string;
    researchgate: string;
    facebook: string;
    linkedin: string;
    photo: string;
  };
}

const TeacherDetails: React.FC<TeacherDetailsProps> = ({ data }) => {
  const [imageSrc, setImageSrc] = useState(data.photo);

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
            alt={`${data.name}'s Profile`}
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
          <span className="text-gray-700">Department: </span>
          <span className="font-bold text-black">{data.department}</span>
        </div>
        <div>
          <span className="text-gray-700">Role: </span>
          <span className="font-bold text-black">{data.role}</span>
        </div>
        <div>
          <span className="text-gray-700">Email: </span>
          <span className="font-bold text-black">
            {data.email && (
              <a href={`mailto:${data.email}`} className="text-blue-500">
                {data.email}
              </a>
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-700">Phone: </span>
          <span className="font-bold text-black">{data.phone}</span>
        </div>
        <div>
          <span className="text-gray-700">Profile Link: </span>
          <span className="font-bold text-black">
            {data.profilelink && (
              <a
                href={data.profilelink}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
              </a>
            )}
          </span>
        </div>
        <div className="flex space-x-4 mt-2">
          {data.researchgate && (
            <a
              href={data.researchgate}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <FaResearchgate size={24} />
            </a>
          )}
          {data.facebook && (
            <a
              href={data.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <FaFacebook size={24} />
            </a>
          )}
          {data.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <FaLinkedin size={24} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
