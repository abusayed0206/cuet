'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EditProfileClientComponentProps {
  initialData: {
    currentstatus: string;
    phonenumber: string;
    bloodgroup: string;
    hall: string;
    linkedin: string;
    uniqueid: string;
    public_email: string;
    lastdonated: string;
  };
}

const EditProfileClientComponent: React.FC<EditProfileClientComponentProps> = ({ initialData }) => {
  const [formData, setFormData] = useState({
    currentStatus: initialData.currentstatus || '',
    phoneNumber: initialData.phonenumber || '',
    bloodGroup: initialData.bloodgroup || '',
    hall: initialData.hall || '',
    linkedin: initialData.linkedin || '',
    uniqueId: initialData.uniqueid || '',
    public_email: initialData.public_email || '',
    lastdonated: initialData.lastdonated || '',
  });

  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading animation
    const response = await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    setLoading(false); // Stop loading animation
    if (response.ok) {
      alert('Profile updated successfully');
      router.refresh();
    } else {
      alert('Error updating profile');
    }
  };

  const halls = [
    'Shaheed Mohammad Shah Hall',
    'Dr. Qudrat-E-Khuda Hall',
    'Bangabandhu Hall',
    'Shaheed Tareq Huda Hall',
    'Abu Sayed Hall',
    'Sufia Kamal Hall',
    'Shamsunnahar Khan Hall',
    'Tapashi Rabeya Hall',
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center space-y-6 bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto"
    >
      {/* Current Status */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Current Status:
          <input
            type="text"
            name="currentStatus"
            value={formData.currentStatus}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Phone Number */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Blood Group */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Blood Group:
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          >
            <option value="">Select your Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/*Last Donated*/}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Last Donated:
          <input
            type="date"
            name="lastdonated"
            value={formData.lastdonated}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Hall */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Hall:
          <select
            name="hall"
            value={formData.hall}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          >
            <option value="">Select your Hall</option>
            {halls.map((hall) => (
              <option key={hall} value={hall}>
                {hall}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* LinkedIn */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          LinkedIn Username
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Unique ID */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Unique ID (Student ID Card):
          <input
            type="text"
            name="uniqueId"
            value={formData.uniqueId}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Public Email */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Public Email:
          <input
            type="email"
            name="public_email"
            value={formData.public_email}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Submit Button */}

      {!loading ? (
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold w-full text-center"
        >
          Update Profile
        </button>
      ) : (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-blue-500 font-semibold">Updating...</span>
        </div>
      )}
    </form>
  );
};

export default EditProfileClientComponent;