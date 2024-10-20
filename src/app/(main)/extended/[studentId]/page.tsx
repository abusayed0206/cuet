import { Metadata } from 'next';
import { createClient } from "@/utils/supabase/server";
interface StudentData {
  name: string;
  studentid: string;
  uniqueid: string;
  batch: string;
  session: string;
  department: string;
  admissionroll: string;
  admissionmerit: string;
  hall: string;
  public_email: string;
  phonenumber: string;
  bloodgroup: string;
  linkedin: string;
  dplink: string;
  currentstatus: string;
}

interface StudentDetailsProps {
  data: StudentData;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ data }) => {
  const profileImage = data.dplink || 'https://cdn.abusayed.dev/demo.png';

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
      {data.dplink && (
        <div className="flex justify-center mb-4">
          <img
            src={profileImage}
            alt={`${data.name}'s DP`}
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>
      )}

      <div className="space-y-2">
        <div>
          <span className="text-gray-700">Name: </span>
          <span className="font-bold text-black">{data.name}</span>
        </div>
        {/* Render other student details */}
        {/* Example */}
        <div>
          <span className="text-gray-700">Student ID: </span>
          <span className="font-bold text-black">{data.studentid}</span>
        </div>
      </div>
    </div>
  );
};

const validateStudentId = (id: string) => {
  const regex = /^[0-9]{7}$/;
  if (!regex.test(id)) return false;
  const batchYear = parseInt(id.slice(0, 2), 10);
  const departmentCode = parseInt(id.slice(2, 4), 10);
  const classRoll = parseInt(id.slice(4, 7), 10);
  if (batchYear < 0 || batchYear > 99) return false;
  if (departmentCode < 1 || departmentCode > 12) return false;
  if (classRoll < 1 || classRoll > 200) return false;
  return true;
};

async function getStudentData(studentId: string): Promise<StudentData> {
  if (!validateStudentId(studentId)) {
    throw new Error('Invalid student ID');
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('apidata')
    .select('*')
    .eq('studentid', studentId)
    .single();

  if (error) {
    throw new Error(`Error fetching student data: ${error.message}`);
  }

  return data as StudentData;
}

type Props = {
  params: { studentId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const studentId = params.studentId;
  try {
    const studentData = await getStudentData(studentId);
    return {
      title: `${studentData.name} | ID: ${studentData.studentid}`,
      description: `From ${studentData.department} and ${studentData.batch} batch`,
      openGraph: {
        siteName: 'CUET Student Directory',
        url: `https://cuet.sayed.page/${studentId}`,
        images: [
          { url: '/CUETOG.png' },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Student Not Found',
      description: 'The requested student information could not be found.',
      openGraph: {
        siteName: 'CUET Student Directory',
        url: 'https://cuet.sayed.page',
        images: [
          { url: '/CUETOG.png' },
        ],
      },
    };
  }
}

export default async function StudentPage({ params }: Props) {
  const { studentId } = params;

  try {
    const studentData = await getStudentData(studentId);
    return (
      <div className="min-h-screen py-6 flex flex-col justify-center items-center">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-slate-300 shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <StudentDetails data={studentData} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-6 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500 text-center">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }
}
export const runtime = 'edge';
