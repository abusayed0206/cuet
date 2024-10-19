import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { studentid: string } }
) {
  const studentId = params.studentid;

  try {
    // Explicitly List Columns (Best Practice)
    const client = createClient();
    const { data, error } = await client
      .from('apidata')
      .select(
        'name, studentid, uniqueid, batch, session, department, admissionroll, admissionmerit, hall, phonenumber, public_email, bloodgroup, dplink, currentstatus, linkedin'
      ) 
      .eq('studentid', studentId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // No need for type assertion since we have explicit select
    return NextResponse.json(data); 
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
