"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [id, setId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !file) return;

    setUploading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append('id', id);
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        setId('');
        setFile(null);
        setPreview(null);
        setTimeout(() => {
          router.push(`/${id}`);
        }, 3000);
      } else {
        const result = await response.json();
        alert(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 md:p-6 mx-2 mb-3">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Upload Image</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="id" className="text-sm font-medium text-gray-700">
              CUET ID
            </label>
            <input
              type="text"
              id="id"
              placeholder="Enter your CUET Student ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="mt-1 text-black block w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="file" className="text-sm font-medium text-gray-700">
              Photo (WebP format, max 200KB, square image)
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/webp"
              required
              className="mt-1 block w-auto text-sm text-gray-500
                file:mr-2 file:py-1 file:px-2
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg" />
            </div>
          )}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${uploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300`}
          >
            {uploading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              </div>
            ) : 'Upload'}
          </button>
          {success && (
            <div className="mt-4 text-center text-green-600">
              <p>Upload successful! Redirecting...</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
