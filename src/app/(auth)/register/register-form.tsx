"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { InputForm } from "@/components/input/input-form";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export const registerFormSchema = z.object({
  email: z.string().email(),
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
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<RegisterValuesType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
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
    const isValidEmail = await checkEmailExists(values.email);
    if (!isValidEmail) return;

    const { error, data } = await supabase.auth.signUp({
      ...values,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      },
    });

    if (error) return toast.error(error.message);

    console.log({ data });
    toast.success("Verification email sent. Check your mail.");
    router.replace("/email-verify");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="w-full flex flex-col gap-y-4"
      >
        <InputForm
          label="Email"
          name="email"
          placeholder="u1901049@student.cuet.ac.bd"
          description=""
          required
        />
        <div className="relative flex items-center">
          <label className="flex-1 text-sm font-medium text-gray-700">
          </label>
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-500 h-6 w-6" />
            ) : (
              <FaEye className="text-gray-500 h-6 w-6" />
            )}
          </button>
          <InputForm
            type={showPassword ? "text" : "password"}
            name="password"
            description=""
            required
            label="Password"
            className="pl-12" // Add padding to the left to make space for the icon
          />
        </div>
        <Button  disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md transition duration-200">
        {loading ? "Checking..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
