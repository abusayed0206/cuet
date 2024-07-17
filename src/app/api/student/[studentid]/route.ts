import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'  // Changed this line

export async function GET(
  request: Request,
  { params }: { params: { studentid: string } }
) {
  const studentId = params.studentid

  try {
    const { data, error } = await supabaseServer  // Changed this line
      .from('apidata')
      .select('*')
      .eq('studentid', studentId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching student data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
