'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface SearchClientProps {
  initialQuery: string;
}

export default function SearchClient({ initialQuery }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery || searchQuery.length < 2) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('name', searchQuery);
    
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search student by name
          </label>
          <input
            id="search-input"
            type="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter student name (minimum 2 characters)"
            className="w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg bg-slate-50 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-900 placeholder-slate-500"
            aria-label="Search student by name"
            aria-describedby="search-hint"
            autoComplete="off"
            minLength={2}
          />
          <p id="search-hint" className="sr-only">
            Enter at least 2 characters to search
          </p>
        </div>
        <button
          type="submit"
          disabled={isPending || !searchQuery || searchQuery.length < 2}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl text-base sm:text-lg whitespace-nowrap"
          aria-label={isPending ? 'Searching...' : 'Search'}
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : 'Search'}
        </button>
      </form>
    </div>
  );
}
