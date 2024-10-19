import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";
import LoginForm from "./login-form";

const LoginPage = () => {
  return (
    <section className="flex h-screen flex-col items-center justify-center px-4 py-10 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <Button variant="outline" asChild>
        <Link href="/" className={cn("absolute left-4 top-4 text-white hover:text-gray-300")}>
          <ChevronLeftCircle className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      {/* Add horizontal padding for better spacing on small devices */}
      <div className="mx-auto max-w-md flex flex-col justify-center space-y-6 p-6 bg-white rounded-lg shadow-lg text-gray-900 opacity-90 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-gray-600">
            Before editing your profile or viewing other profiles, please login. Thank you!
          </p>
        </div>

        <LoginForm />

        {/* Buttons for Registration, and Forgot Password */}
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
