import { Metadata } from 'next';
import Link from 'next/link';
import StudentDetails from '../../components/StudentDetails';

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
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://cuet.sayed.app' : 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/student/${studentId}`, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error('Failed to fetch student data');
  }
  return response.json();
}

type Props = {
  params: Promise<{ studentId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { studentId } = await params;

  try {
    const studentData = await getStudentData(studentId);
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://cuet.sayed.app' : 'http://localhost:3000';

    return {
      title: `${studentData.name} | ID: ${studentData.studentid}`,
      description: ` ${studentData.department} and ${studentData.batch} batch`,
      openGraph: {
        siteName: `${studentData.name} | ID: ${studentData.studentid}`,
        url: `${baseUrl}/${studentId}`,
        images: [
          {
            url: '/CUETOG.png',
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
        images: ['/CUETOG.png'],
      },
    };
  } catch (error) {
    return {
      title: 'Student Not Found',
      description: 'The requested student information could not be found.',
      openGraph: {
        siteName: 'CUET Student Directory',
        url: 'http://localhost:3000',
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
  const { studentId } = await params;

  try {
    const studentData = await getStudentData(studentId);

    return <StudentDetails student={studentData} />;
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Student Not Found</h2>
          <p className="text-slate-600 mb-6">
            {error instanceof Error ? error.message : 'The requested student information could not be found.'}
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
}

export const runtime = 'edge';
