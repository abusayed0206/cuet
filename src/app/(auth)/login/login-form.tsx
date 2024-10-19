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
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const loginFormSchema = z.object({
  email: z.string().email(),
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
  const router = useRouter();

  const supabase = createClient();

  const form = useForm<LoginValuesType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  async function handleLogin(values: LoginValuesType) {
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      return toast.error(error.message);
    }

    toast.success("Login successful");

    // Redirect to the profile page after successful login
    router.push("/profile");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className="w-full flex flex-col gap-y-6 p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <InputForm
          label="Email"
          name="email"
          placeholder="hello@sayed.page"
          description=""
          required
          className="border rounded-md focus:ring-2 focus:ring-purple-600"
        />

        <div className="relative">
          <InputForm
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            description=""
            required
            className="border rounded-md focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md transition duration-200">
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
