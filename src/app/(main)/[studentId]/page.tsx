import { Metadata } from 'next';
import StudentDetails from '../../../components/StudentDetails';

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

async function getStudentData(studentId: string) {
  if (!validateStudentId(studentId)) {
    throw new Error('Invalid student ID of CUET');
  }
  const response = await fetch(`https://cuet.sayed.page/api/student/${studentId}`, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error('Failed to fetch student data');
  }
  return response.json();
}

type Props = {
  params: { studentId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const studentId = params.studentId;

  try {
    const studentData = await getStudentData(studentId);

    return {
      title: `${studentData.name} | ID: ${studentData.studentid}`,
      description: ` ${studentData.department} and ${studentData.batch} batch`,
      openGraph: {
        siteName: `${studentData.name} | ID: ${studentData.studentid}`,
        url: `https://cuet.sayed.page/${studentId}`,
        images: [
          {
            url: `/api/og/${studentId}.png`,
            width: 1200,
            height: 630,
            alt: `${studentData.name}'s profile card`,
          },
          {
            url: `/api/og/${studentId}.svg`,
            width: 1200,
            height: 630,
            alt: `${studentData.name}'s profile card`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${studentData.name} | ID: ${studentData.studentid}`,
        description: `${studentData.department} and ${studentData.batch} batch`,
        images: [`/api/og/${studentId}.svg`],
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
          {
            url: '/CUETOG.png',
          },
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
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-between p-4">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
        </div>

        {/* Main Content */}


        <StudentDetails data={studentData} />

        {/* Footer */}

        <p className="text-white/70 text-center">
          Data fetched for <span className="text-cyan-400">{studentData.studentid}</span>
        </p>

      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
        {/* Error Message */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20">
          <p className="text-red-400 text-center text-sm">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }
}

export const runtime = 'edge';
