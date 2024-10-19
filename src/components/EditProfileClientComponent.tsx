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
    intro?: string;
    portfolio?: string;
    instagram?: string;
    facebook?: string;
    images?: string;
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
    intro: initialData.intro || '',
    portfolio: initialData.portfolio || '',
    instagram: initialData.instagram || '',
    facebook: initialData.facebook || '',
    images: initialData.images || '',
  });

  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    'Sheikh Russel Hall',
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
          LinkedIn:
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

      {/* Intro */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Intro:
          <textarea
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            rows={3}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Portfolio */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Portfolio Link:
          <input
            type="text"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Instagram */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Instagram Username:
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

      {/* Facebook */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Facebook Username:
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>


      {/* Playbook Board Link */}
      <div className="flex flex-col items-center w-full">
        <label className="mb-2 text-black font-semibold text-center">
          Images Link(Max 10, not more than 2 MB each, separated by comma,space or new line,):
          <textarea
            name="images"
            value={formData.images}
            onChange={handleChange}
            rows={5}
            placeholder='https://example.com/image1.jpg, https://example.com/image2.jpg'
            className="mt-1 p-2 border border-gray-400 rounded-lg w-full bg-white text-black font-medium text-center"
          />
        </label>
      </div>

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