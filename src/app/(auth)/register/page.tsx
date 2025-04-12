"use client";

import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";

// Dynamic import with loading fallback for better performance
const RegisterForm = dynamic(() => import("./register-form"), {
  loading: () => (
    <div className="w-full flex justify-center animate-pulse">
      <div className="w-full h-[280px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-md"></div>
    </div>
  ),
  ssr: false,
});

const RegisterPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add a slight delay to ensure smooth animations
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 text-white overflow-hidden">
      {/* Improved layered background with subtle animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-emerald-600/20"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-70">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-1000",
        mounted && "opacity-30"
      )}>
        {mounted && Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 6 + 1}px`,
              height: `${Math.random() * 6 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Back Button with improved hover animations */}
      <div className={cn(
        "absolute left-4 top-4 opacity-0 transform -translate-y-4 transition-all duration-500",
        mounted && "opacity-100 translate-y-0"
      )}>
        <Button variant="outline" asChild>
          <Link href="/" className={cn("text-white hover:text-indigo-300 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0f172a]")}>
            <ChevronLeftCircle className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      
      {/* Logo */}
      <div className={cn(
        "relative z-10 mb-6 opacity-0 transform -translate-y-4 transition-all duration-500 delay-200",
        mounted && "opacity-100 translate-y-0"
      )}>
        <Image 
          src="/cuet.png" 
          alt="CUET Logo" 
          width={80} 
          height={80} 
          className="rounded-full border-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        />
      </div>
      
      {/* Card Wrapper with enhanced shadow and animations */}
      <div className={cn(
        "relative z-10 mx-auto max-w-md w-full flex flex-col justify-center space-y-6 p-8 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_10px_45px_rgba(79,70,229,0.3)] transition-all duration-500 opacity-0 scale-95",
        mounted && "opacity-100 scale-100"
      )}>
        <div className="flex flex-col space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 animate-fade-in">
            Create Account
          </h1>
          <p className="text-sm text-gray-600">
            Join the CUET community by creating your account
          </p>
        </div>

        <Suspense fallback={
          <div className="w-full h-[280px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <RegisterForm />
        </Suspense>

        {/* Additional Buttons with improved styling and animations */}
        <div className={cn(
          "flex flex-col space-y-4 opacity-0 transform translate-y-4 transition-all duration-500 delay-300",
          mounted && "opacity-100 translate-y-0"
        )}>
          <div className="relative flex items-center justify-center text-sm text-gray-500 my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative px-4 bg-white text-sm">
              Already have an account?
            </div>
          </div>

          <Link href="/login">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 h-11">
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Add global animation styles */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
};

export default RegisterPage;
