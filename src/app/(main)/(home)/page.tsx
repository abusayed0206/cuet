'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SearchType = 'Student ID' | 'Name' | 'Batch';

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('Student ID');
  const [error, setError] = useState<string>('');

  const validateStudentId = (id: string): boolean => {
    const regex = /^[0-9]{7}$/;
    return regex.test(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchType !== 'Batch' && !inputValue.trim()) {
      setError('Please enter a value.');
      return;
    }

    if (searchType === 'Student ID') {
      if (!validateStudentId(inputValue)) {
        setError('Please enter a valid CUET ID.');
        return;
      }
      router.push(`/${inputValue}`);
      return;
    }

    if (searchType === 'Batch') {
      router.push('/batch');
      return;
    }

    if (searchType === 'Name') {
      if (inputValue.length < 4) {
        setError('Name must be at least 4 characters long.');
        return;
      }
      router.push(`/search?name=${encodeURIComponent(inputValue.trim())}`);
    }
  };


  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-between p-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-600/20"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg relative mt-20">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent mb-8">
            CUET Student Information
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Search Type Selector */}
            <div className="relative">
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value as SearchType);
                  setInputValue('');
                  setError('');
                }}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="Student ID" className="bg-[#0f172a] text-white">Student ID</option>
                <option value="Name" className="bg-[#0f172a] text-white">Name</option>
                <option value="Batch" className="bg-[#0f172a] text-white">Batch</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Input Field */}
            {(searchType === 'Student ID' || searchType === 'Name') && (
              <input
                id="inputValue"
                name="inputValue"
                type={searchType === 'Student ID' ? 'number' : 'text'}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-white/50"
                placeholder={searchType === 'Student ID' ? 'Enter Student ID' : 'Enter Name'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-center text-sm">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              Search
            </button>
          </form>

          {/* Extended Info Link */}
          <div className="mt-8 text-center">
            <span className="text-white/70">For extended student info, </span>
            <a
              href="/extended"
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-4 hover:underline"
            >
              login here
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center space-x-4">
        <Image
          src="/sayed.webp"
          alt="সাঈদ"
          width={48}
          height={48}
          className="rounded-full object-contain"
        />
        <div className="flex flex-col space-y-1">
          <p className="text-white">
            <Link href="https://sayed.page/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">সাঈদ</Link> |{' '}
            <Link href="https://cuet.sayed.page/1901049" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">১৯০১০৪৯</Link>
          </p>
          <a href="https://cuet.sayed.page/privacy" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
            গোপনীয়তা নীতি
          </a>
          <p className="text-white/70">Made with ❤️ in Cumilla🇧🇩</p>
        </div>
      </div>
    </div >
  );
}