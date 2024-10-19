import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { ChevronLeftCircle } from "lucide-react";
import Link from "next/link";
import RegisterForm from "./register-form";

const RegisterPage = () => {
  return (
    <section className="flex h-screen flex-col items-center justify-center px-4 py-10 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <Button variant="outline" asChild>
        <Link
          href="/"
          className={cn("absolute left-4 top-4 text-white hover:text-gray-300")}
        >
          <ChevronLeftCircle className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <div className="mx-auto max-w-md flex flex-col justify-center space-y-6 p-6 bg-white rounded-lg shadow-lg text-gray-900 opacity-90 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-gray-600">
            Enter your email and password to create your account
          </p>
        </div>

        <RegisterForm />

        <p className="px-8 text-center text-sm text-gray-600">
        <Link href="/login">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Already registered? Login here
            </Button>
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
