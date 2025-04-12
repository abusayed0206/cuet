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

export const registerFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid CUET email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type RegisterValuesType = z.infer<typeof registerFormSchema>;

const defaultValues: RegisterValuesType = {
  email: "",
  password: "",
};

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<RegisterValuesType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const checkEmailExists = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("apidata")
        .select("email")
        .eq("email", email)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error("You are not a CUET student.");
        form.setError("email", { message: "You are not a CUET student." });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("An error occurred while checking your email.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  async function handleRegister(values: RegisterValuesType) {
    if (loading) return;
    
    setLoading(true);
    try {
      const isValidEmail = await checkEmailExists(values.email);
      if (!isValidEmail) return;

      const { error, data } = await supabase.auth.signUp({
        ...values,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Verification email sent. Check your mail.");
      router.replace("/email-verify");
    } catch (error) {
      console.error("Registration error:", error);
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
        onSubmit={form.handleSubmit(handleRegister)}
        className="w-full flex flex-col gap-y-5"
      >
        <InputForm
          label="Email"
          name="email"
          placeholder="u1901049@student.cuet.ac.bd"
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
              <span>{form.formState.isSubmitting ? "Registering..." : "Checking email..."}</span>
            </div>
          ) : (
            "Register"
          )}
        </Button>
      </motion.form>
    </Form>
  );
};

export default RegisterForm;
