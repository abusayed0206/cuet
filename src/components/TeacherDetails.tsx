"use client"
import React from 'react';
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
  const { name, department, role, email, phone, profilelink, researchgate, facebook, linkedin, photo } = data;

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      {/* Profile Picture */}
      {photo && (
        <div className="flex justify-center mb-4">
          <img
            src={photo}
            alt={`${name}'s Photo`}
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>
      )}

      <div className="space-y-2">
        <div>
          <span className="text-gray-700">Name: </span>
          <span className="font-bold text-black">{name}</span>
        </div>
        <div>
          <span className="text-gray-700">Department: </span>
          <span className="font-bold text-black">{department}</span>
        </div>
        <div>
          <span className="text-gray-700">Role: </span>
          <span className="font-bold text-black">{role}</span>
        </div>
        <div>
          <span className="text-gray-700">Email: </span>
          <span className="font-bold text-black">
            {email && (
              <a href={`mailto:${email}`} className="text-blue-500">
                {email}
              </a>
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-700">Phone Number: </span>
          <span className="font-bold text-black">{phone}</span>
        </div>
        <div>
          <span className="text-gray-700">Profile Link: </span>
          <span className="font-bold text-black">
            {profilelink && (
              <a
                href={profilelink}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Profile
              </a>
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-700">ResearchGate: </span>
          <span className="font-bold text-black">
            {researchgate && (
              <a
                href={researchgate}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaResearchgate className="inline mr-1" />
                ResearchGate
              </a>
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-700">Facebook: </span>
          <span className="font-bold text-black">
            {facebook && (
              <a
                href={facebook}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="inline mr-1" />
                Facebook
              </a>
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-700">LinkedIn: </span>
          <span className="font-bold text-black">
            {linkedin && (
              <a
                href={linkedin}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="inline mr-1" />
                LinkedIn
              </a>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
