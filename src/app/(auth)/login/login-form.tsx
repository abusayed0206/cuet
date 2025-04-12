"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { InputForm } from "@/components/input/input-form";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type LoginValuesType = z.infer<typeof loginFormSchema>;

const defaultValues: LoginValuesType = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Ensure hydration is complete before rendering interactive elements
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<LoginValuesType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: "onChange", // Validate on input change for immediate feedback
  });

  async function handleLogin(values: LoginValuesType) {
    if (loading) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(values);

      if (error) {
        toast.error("Login failed: " + error.message);
        return;
      }

      toast.success("Login successful");
      router.push("/profile");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="w-full h-[280px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={form.handleSubmit(handleLogin)}
        className="w-full flex flex-col gap-y-5"
      >
        <InputForm
          label="Email"
          name="email"
          placeholder="hello@example.com"
          description=""
          required
          className="border rounded-md bg-white/80 focus:ring-2 focus:ring-purple-600 transition-all duration-200"
          disabled={loading}
        />

        <div className="relative">
          <InputForm
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            description=""
            required
            className="border rounded-md bg-white/80 focus:ring-2 focus:ring-purple-600 transition-all duration-200 pr-10"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] transform text-gray-600 hover:text-purple-600 transition-colors duration-200 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <Button
          className={`w-full mt-2 ${
            loading 
              ? "bg-purple-500" 
              : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
          } text-white rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 h-11`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </div>
          ) : (
            "Log In"
          )}
        </Button>
      </motion.form>
    </Form>
  );
};

export default LoginForm;
