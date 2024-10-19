"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function signOut() {
  console.log("Sign out function called");
  const supabase = createClient();
  console.log("Supabase client created");
  
  // Sign out the user
  const { error } = await supabase.auth.signOut();
  
  // Handle any errors during sign out
  if (error) {
    console.error("Error signing out:", error.message);
    throw new Error("Sign out failed");
  } else {
    console.log("Sign out successful");
  }
  
  // Revalidate the home page or any other path that needs revalidation
  revalidatePath("/");
  console.log("Path revalidated");
}