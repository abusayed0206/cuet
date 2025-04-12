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
import { motion } from "framer-motion";
import { MailIcon } from "lucide-react";

export const resetPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

type ResetPasswordValuesType = z.infer<typeof resetPasswordSchema>;

const defaultValues: ResetPasswordValuesType = {
  email: "",
};

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ResetPasswordValuesType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: "onChange",
  });

  async function handlePasswordReset(values: ResetPasswordValuesType) {
    if (loading) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password reset email sent");
      setEmailSent(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col gap-6 items-center justify-center p-4 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <MailIcon size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Email Sent!</h3>
        <p className="text-gray-600 mb-2">
          We've sent password reset instructions to your email address. Please check your inbox.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to login page...
        </p>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={form.handleSubmit(handlePasswordReset)}
        className="w-full flex flex-col gap-y-5"
      >
        <InputForm
          label="Email"
          name="email"
          placeholder="Enter your email address"
          description=""
          required
          className="border rounded-md bg-white/80 focus:ring-2 focus:ring-purple-600 transition-all duration-200"
          disabled={loading}
        />

        <Button
          className={`w-full mt-3 ${
            loading 
              ? "bg-purple-500" 
              : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
          } text-white rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 h-11`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <span>Sending email...</span>
            </div>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </motion.form>
    </Form>
  );
};

export default ResetPasswordForm;
