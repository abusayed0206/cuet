"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RedirectPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const predefinedRoutes = ['/dark', '/got', '/advice', '/foryou'];
      const lastRoute = localStorage.getItem('lastRoute');
      const availableRoutes = predefinedRoutes.filter(route => route !== lastRoute);
      const randomRoute = availableRoutes[Math.floor(Math.random() * availableRoutes.length)];
      localStorage.setItem('lastRoute', randomRoute);
      router.push(randomRoute);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        Redirecting to your destination/ আপনার গন্তব্যে পাঠানো হচ্ছে।
      </div>
    </div>
  );
};

export default RedirectPage;
