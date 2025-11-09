'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export const runtime = 'edge';

export default function CatchAllPage() {
  const params = useParams();
  const slug = params.slug as string[];

  useEffect(() => {
    // Build the URL path from the slug
    const path = slug ? slug.join('/') : '';
    const targetUrl = `https://cuet.sayed.app/${path}`;
    
    // Redirect immediately
    window.location.href = targetUrl;
  }, [slug]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-4">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-700 mb-6">
          The website has moved to{' '}
          <a
            href="https://cuet.sayed.app"
            className="text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            https://cuet.sayed.app
          </a>
        </p>
        <p className="text-gray-600 text-sm">
          You will be redirected there in a moment!
        </p>
      </div>
    </div>
  );
}
