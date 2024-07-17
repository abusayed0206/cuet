import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { studentid: string } }
) {
  const studentId = params.studentid

  try {
    const { data, error } = await supabase
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

    // Return all data, including the 'id' column
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching student data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
