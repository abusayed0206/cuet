import { createClient } from "@/utils/supabase/server"; 
import UploadForm from "./UploadForm"; 
import { redirect } from "next/navigation"; 

const DpUploadPage = async () => {
  const supabase = createClient(); // Create Supabase client with cookies

  const {
    data: { user },
  } = await supabase.auth.getUser(); // Get the authenticated user

  if (!user) {
    // Redirect to login page if no user is found
    redirect('/login');
    return null;
  }

  // Fetch the user's student ID from the database
  const { data, error } = await supabase
    .from("apidata")
    .select("studentid")
    .eq("email", user.email) // Use the email from the authenticated user
    .single();

  // If there's an error fetching the student ID, handle it
  if (error || !data) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <p>Error fetching your student ID.</p>
      </div>
    );
  }

  const studentId = data.studentid;

  return (
    <UploadForm initialStudentId={studentId} /> // Pass the student ID to the form component
  );
};

export default DpUploadPage;
