import { Metadata } from 'next';
import TeacherDetails from '../../components/TeacherDetails'; // Correct path

async function getTeacherData(id: string) {
  const url = `https://cuet.sayed.page/api/teacher/${id}`;
  console.log('Fetching URL:', url); // Debug log
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error('Failed to fetch teacher data');
    }
    const data = await response.json();
    if (!data || !data.id) {
      throw new Error('Wrong ID!');
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch error:', error.message); // Debug log
      throw new Error(error.message);
    } else {
      console.error('Fetch error:', 'An unknown error occurred'); // Debug log
      throw new Error('An unknown error occurred');
    }
  }
}

type Props = {
  params: { id: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  
  try {
    const teacherData = await getTeacherData(id);
    
    return {
      title: `${teacherData.name} | ${teacherData.department}`,
      description: `From ${teacherData.department},  CUET`,
      openGraph: {
        siteName: 'CUET Teacher Directory',
        url: `/teacher/${id}`,
        images: [
          {
            url: teacherData.photo || '/CUETOG.png',
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Teacher Not Found',
      description: 'The requested teacher information could not be found.',
      openGraph: {
        siteName: 'CUET Teacher Directory',
        url: '/teacher',
        images: [
          {
            url: '/CUETOG.png',
          },
        ],
      },
    };
  }
}

export default async function TeacherPage({ params }: Props) {
  const { id } = params;

  try {
    const teacherData = await getTeacherData(id);

    return (
      <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-6 flex flex-col justify-center items-center">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-slate-300 shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <TeacherDetails data={teacherData} />
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
