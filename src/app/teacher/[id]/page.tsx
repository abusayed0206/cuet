import { Metadata } from 'next'
import TeacherDetails from '../../components/TeacherDetails'

async function getTeacherData(teacherId: string) {
  const response = await fetch(`/api/teacher/${teacherId}`, { next: { revalidate: 3600 } })
  if (!response.ok) {
    throw new Error('Failed to fetch teacher data')
  }
  return response.json()
}

type Props = {
  params: { teacherId: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const teacherId = params.teacherId
  
  try {
    const teacherData = await getTeacherData(teacherId)
    
    return {
      title: `${teacherData.name} | ID: ${teacherData.id}`,
      description: `${teacherData.role} at ${teacherData.department}`,
      openGraph: {
        siteName: 'CUET Teacher Directory',
        url: `https://cuet.sayed.page/teacher/${teacherId}`,
        images: [
          {
            url: '/CUETOG.png', // Your image URL
          },
        ],
      },
    }
  } catch (error) {
    return {
      title: 'Teacher Not Found',
      description: 'The requested teacher information could not be found.',
      openGraph: {
        siteName: 'CUET Teacher Directory',
        url: 'https://cuet.sayed.page/teacher',
        images: [
          {
            url: '/CUETOG.png', // Default image URL
          },
        ],
      },
    }
  }
}

export default async function TeacherPage({ params }: Props) {
  const { teacherId } = params

  try {
    const teacherData = await getTeacherData(teacherId)

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 py-6 flex flex-col justify-center items-center">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-slate-100 shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <TeacherDetails data={teacherData} />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 py-6 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500 text-center">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    )
  }
}
