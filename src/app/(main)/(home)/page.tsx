'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type SearchType = 'Student ID' | 'Name' | 'Batch';

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('Student ID');
  const [error, setError] = useState<string>('');

  // Validate CUET ID
  const validateStudentId = (id: string): boolean => {
    const regex = /^[0-9]{7}$/;
    return regex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input based on search type
    if (searchType !== 'Batch' && !inputValue.trim()) {
      setError('Please enter a value.');
      return;
    }

    // Handle Student ID search
    if (searchType === 'Student ID') {
      if (!validateStudentId(inputValue)) {
        setError('Please enter a valid CUET ID.');
        return;
      }
      window.open(`/${inputValue}`, '_blank');
      return;
    }

    // Handle Batch search
    if (searchType === 'Batch') {
      router.push('/batch');
      return;
    }

    // Handle Name search
    if (searchType === 'Name') {
      if (inputValue.length < 4) {
        setError('Name must be at least 4 characters long.');
        return;
      }

      // Redirect to /search with the name query parameter
      router.push(`/search?name=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>

        <div className="relative px-4 py-8 md:p-12 bg-slate-300 shadow-lg rounded-3xl">
          <h1 className="text-2xl font-semibold text-center text-black mb-6">CUET Student Information</h1>

          <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value as SearchType);
                setInputValue('');
                setError('');
              }}
              className="w-full border-b-2 border-gray-300 py-2 px-4 rounded-md"
            >
              <option value="Student ID">Student ID</option>
              <option value="Name">Name</option>
              <option value="Batch">Batch</option>
            </select>

            {(searchType === 'Student ID' || searchType === 'Name') && (
              <input
                id="inputValue"
                name="inputValue"
                type={searchType === 'Student ID' ? 'number' : 'text'}
                className="w-full h-10 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600 text-center rounded-md"
                placeholder={searchType === 'Student ID' ? 'Enter Student ID' : 'Enter Name'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md px-4 py-2 hover:from-pink-500 hover:to-yellow-500 transition-all"
            >
              Submit
            </button>
          </form>

          <div className="mt-6 text-center text-black">
            For extended student info, you must login and click{' '}
            <a href="/extended" className="text-blue-500 hover:underline">here</a>.
          </div>
        </div>


        <div className="fixed bottom-4 left-4 right-4 flex justify-center">
          <div className="w-full max-w-xs p-4 rounded-lg shadow-lg bg-white flex items-center">
            <div className="w-1/4 flex justify-center">
              <Image
                src="/sayed.webp"
                alt="সাঈদ"
                width={48}
                height={48}
                className="rounded-full object-contain"
              />
            </div>
            <div className="w-3/4 flex flex-col">
              <p className="text-sm font-semibold text-black text-center">
                <a href="https://sayed.page/" target="_blank" rel="noopener noreferrer">সাঈদ</a> |{' '}
                <a href="https://cuet.sayed.page/1901049" target="_blank" rel="noopener noreferrer">১৯০১০৪৯</a>
              </p>
              <a href="https://cuet.sayed.page/privacy" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-black text-center">
                গোপনীয়তা নীতি
              </a>
              <p className="text-sm font-semibold text-black text-center">Made with ❤️ in Cumilla🇧🇩</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}