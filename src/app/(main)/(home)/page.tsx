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
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-between p-4 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-violet-700/40 via-cyan-700/30 to-blue-900/40"></div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.12)_0%,transparent_70%)]"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg relative mt-24 z-10">
        <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-10 shadow-2xl border border-white/20 ring-2 ring-cyan-400/10 transition-all duration-300 hover:ring-violet-400/20">
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent mb-10 tracking-tight drop-shadow-lg">
            CUET Student&apos;s Directory
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Search Type Selector with Icon */}
            <div className="relative">
              <label htmlFor="searchType" className="absolute left-4 top-2 text-xs text-cyan-300/80 pointer-events-none">Search by</label>
              <select
                id="searchType"
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value as SearchType);
                  setInputValue('');
                  setError('');
                }}
                className="w-full bg-white/10 border border-cyan-400/20 text-white rounded-xl px-4 pt-7 pb-3 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/40 shadow-md"
              >
                <option value="Student ID" className="bg-[#0f172a] text-white">Student ID</option>
                <option value="Name" className="bg-[#0f172a] text-white">Name</option>
                <option value="Batch" className="bg-[#0f172a] text-white">Batch</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Input Field with Icon */}
            {(searchType === 'Student ID' || searchType === 'Name') && (
              <div className="relative">
                <input
                  id="inputValue"
                  name="inputValue"
                  type={searchType === 'Student ID' ? 'number' : 'text'}
                  className="w-full bg-white/10 border border-cyan-400/20 text-white rounded-xl px-4 pt-7 pb-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 placeholder-white/50 shadow-md"
                  placeholder={searchType === 'Student ID' ? 'Enter Student ID' : 'Enter Name'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <span className="absolute left-4 top-2 text-xs text-cyan-300/80 pointer-events-none">
                  {searchType === 'Student ID' ? (
                    <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 inline text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-2 2-2 2-2-.896-2-2z" /></svg>Student ID</span>
                  ) : (
                    <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 inline text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>Name</span>
                  )}
                </span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-center text-sm animate-pulse">
                {error}
              </p>
            )}

            {/* Submit Button with Icon */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 via-cyan-500 to-pink-500 text-white rounded-xl px-4 py-3 font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" /></svg>
              Search
            </button>
          </form>

          {/* Extended Info Link */}
          <div className="mt-10 text-center">
            <span className="text-white/70">For extended student info, </span>
            <a
              href="/extended"
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-4 hover:underline font-semibold"
            >
              login here
            </a>
          </div>
        </div>
      </div>

      {/* Footer with Gradient Border and Social Icon */}
      <footer className="mt-12 p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-gradient-to-r from-cyan-400/30 via-violet-400/30 to-pink-400/30 shadow-lg flex items-center space-x-5 z-10">
        <Image
          src="/sayed.webp"
          alt="সাঈদ"
          width={56}
          height={56}
          className="rounded-full object-contain border-2 border-cyan-400/40 shadow-md"
        />
        <div className="flex flex-col space-y-1">
          <p className="text-white text-lg font-medium flex items-center gap-2">
            <Link href="https://sayed.page/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors underline underline-offset-2">সাঈদ</Link>
            <span className="text-white/40">|</span>
            <Link href="https://cuet.sayed.app/1901049" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors underline underline-offset-2">১৯০১০৪৯</Link>
            <a href="https://github.com/abusayed0206" target="_blank" rel="noopener noreferrer" className="ml-2 text-cyan-400 hover:text-pink-400 transition-colors">
              <svg className="w-5 h-5 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.09-.646.35-1.088.636-1.34-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.382.202 2.402.099 2.656.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.19 22 16.437 22 12.012 22 6.484 17.523 2 12 2z" /></svg>
            </a>
          </p>
          <a href="https://cuet.sayed.app/privacy" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors text-sm underline underline-offset-2">
            গোপনীয়তা নীতি
          </a>
          <p className="text-white/70 text-xs">Made with <span className="animate-pulse text-pink-400">❤️</span> in Cumilla 🇧🇩</p>
        </div>
      </footer>
    </div>
  );
}