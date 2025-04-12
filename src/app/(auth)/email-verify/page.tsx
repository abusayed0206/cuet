"use client";

import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { ChevronLeftCircle, MailCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EmailSuccessPage = () => {
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
        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/20"
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
          <Link href="/login" className={cn("text-white hover:text-blue-300 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0f172a]")}>
            <ChevronLeftCircle className="mr-2 h-4 w-4" />
            Back to Login
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
          priority
          className="rounded-full border-2 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        />
      </div>
      
      {/* Card Wrapper with enhanced shadow and animations */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 mx-auto max-w-md w-full flex flex-col justify-center space-y-6 p-8 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_10px_45px_rgba(59,130,246,0.3)]"
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              delay: 0.4,
              duration: 0.6 
            }}
            className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <MailCheck size={48} className="text-blue-600" />
          </motion.div>
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Check your email
            </h1>
            <p className="mt-4 text-gray-600">
              To confirm your email address, tap the link in the email we sent to you.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col w-full space-y-4"
          >
            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p>
                <span className="font-semibold">Tip:</span> If you don't see the email in your inbox, check your spam or junk folder.
              </p>
            </div>
            
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 h-11">
              <Link href="/login">
                Return to Login
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

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

export default EmailSuccessPage;
