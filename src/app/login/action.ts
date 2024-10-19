'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message); // Log the error for debugging
    redirect('/error'); // Redirect to error page as per your existing setup
  }

  // Revalidate the necessary paths and then redirect to /profile
  await revalidatePath('/');
  redirect('/profile');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Signup error:', error.message); // Log the error for debugging
    redirect('/error'); // Redirect to error page as per your existing setup
  }

  // Revalidate the necessary paths and then redirect to /profile
  await revalidatePath('/');
  redirect('/profile');
}
