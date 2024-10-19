import { createClient } from "@/utils/supabase/server";
import ProfileImage from "@/components/ProfileImage";
import Link from "next/link";
import EditProfileClientComponent from "@/components/EditProfileClientComponent";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
    return null;
  }

  const { data, error } = await supabase
    .from("apidata")
    .select("name, studentid, uniqueid, email, public_email, dplink, linkedin, batch, session, department, admissionroll, admissionmerit, hall, bloodgroup, phonenumber, currentstatus, photographer, intro, portfolio, instagram, facebook, images")
    .eq("email", user.email)
    .single();

  if (error || !data) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <p>Error fetching profile data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">

      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="relative mb-4">
          <strong className="block text-lg text-black mb-2">Profile Picture:</strong>
          <ProfileImage src={data.dplink} />
          <Link href="/dpupload" target="_blank" className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300">
            Edit DP
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
          <InfoItem label="Name" value={data.name} />
          <InfoItem label="Student ID" value={data.studentid} />
          <InfoItem label="Email" value={data.email} />
          <InfoItem label="Batch" value={data.batch} />
          <InfoItem label="Session" value={data.session} />
          <InfoItem label="Department" value={data.department} />
          <InfoItem label="Admission Roll" value={data.admissionroll} />
          <InfoItem label="Admission Merit" value={data.admissionmerit} />
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">Edit Your Data</h2>
        <EditProfileClientComponent initialData={data} />
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <p className="mb-2">
    <strong className="font-semibold text-gray-700">{label}:</strong> {value}
  </p>
);

export default ProfilePage;