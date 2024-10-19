import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import UploadForm from './UploadForm'

export default async function DpUploadPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  let studentId = ''
  if (user) {
    const { data, error } = await supabase
      .from('apidata')
      .select('studentid')
      .eq('email', user.email)
      .single()
    
    if (data && !error) {
      studentId = data.studentid
    }
  }

  return <UploadForm initialStudentId={studentId} />
}