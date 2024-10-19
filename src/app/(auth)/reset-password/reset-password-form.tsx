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

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

type ResetPasswordValuesType = z.infer<typeof resetPasswordSchema>;

const defaultValues: ResetPasswordValuesType = {
  email: "",
};

const ResetPasswordForm = () => {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<ResetPasswordValuesType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
  });

  async function handlePasswordReset(values: ResetPasswordValuesType) {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email);

    if (error) return toast.error(error.message);

    toast.success("Password reset email sent");

    router.push("/login");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handlePasswordReset)}
        className="w-full flex flex-col gap-y-4"
      >
        <InputForm
          label="Email"
          name="email"
          placeholder="hello@sayed.page"
          description=""
          required
        />


        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md transition duration-200">
          Send Password Reset Email
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
