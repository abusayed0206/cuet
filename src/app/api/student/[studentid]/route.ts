import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { studentid: string } }
) {
  const studentId = params.studentid;

  try {
    const { data, error } = await supabaseServer
      .from('apidata')
      .select('name', 'studentid', 'uniqueid', 'batch', 'session', 'department', 'admissionroll', 'admissionmerit', 'hall', 'email', 'phonenumber', 'bloodgroup', 'linkedin') // Specify columns explicitly
      .eq('studentid', studentId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
