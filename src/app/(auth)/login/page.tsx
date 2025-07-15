"use client";

import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";
import LoginForm from "./login-form";

const LoginPage = () => {
  return (
    <section className="relative min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-600/20"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
      </div>

      {/* Back Button */}
      <Button variant="outline" asChild>
        <Link href="/" className={cn("absolute left-4 top-4 text-white hover:text-gray-300")}>
          <ChevronLeftCircle className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
      {/* Card Wrapper */}
      <div className="relative z-10 mx-auto max-w-md flex flex-col justify-center space-y-6 p-6 bg-white/90 rounded-lg shadow-2xl text-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600">
            Before editing your profile or viewing other profiles, please login. Thank you!
          </p>
        </div>

        <LoginForm />

        {/* Additional Buttons */}
        <div className="flex flex-col space-y-4">
          <Link href="/register">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Register
            </Button>
          </Link>
          <Link href="/reset-password">
            <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
              Forgot Password?
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
