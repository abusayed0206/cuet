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
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter student name (minimum 2 characters)"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all text-slate-800 placeholder-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !searchQuery || searchQuery.length < 2}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isPending ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
}
