import React from 'react';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { SiResearchgate } from 'react-icons/si';

interface TeacherDetailsProps {
  data: {
    id: number;
    name: string;
    department: string;
    role: string;
    email: string;
    phone: string;
    profilelink: string;
    researchgate?: string;
    facebook?: string;
    linkedin?: string;
    photo: string;
  };
}

const TeacherDetails: React.FC<TeacherDetailsProps> = ({ data }) => {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      {/* Profile Picture */}
      <div className="flex justify-center mb-4">
        <img
          src={data.photo}
          alt={`${data.name}'s photo`}
          className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://cdn.abusayed.dev/demo.png';
          }}
        />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-center text-gray-800">{data.name}</h2>
        <p className="text-center text-gray-600 font-medium">{data.role}</p>
        <p className="text-center text-gray-600">{data.department}</p>
        
        <div className="flex justify-center space-x-4 my-4">
          {data.researchgate && (
            <a href={data.researchgate} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
              <SiResearchgate size={24} />
            </a>
          )}
          {data.facebook && (
            <a href={data.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
              <FaFacebookF size={24} />
            </a>
          )}
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
              <FaLinkedinIn size={24} />
            </a>
          )}
        </div>
        
        <div className="space-y-2 text-gray-700">
          <div>
            <span className="font-semibold">Email: </span>
            <a href={`mailto:${data.email}`} className="text-blue-500 hover:underline">{data.email}</a>
          </div>
          <div>
            <span className="font-semibold">Phone: </span>
            <span>{data.phone}</span>
          </div>
          <div>
            <span className="font-semibold">Profile: </span>
            <a href={data.profilelink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
