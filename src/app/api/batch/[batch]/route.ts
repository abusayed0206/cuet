import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { batch: string } }
) {
  const batchNumber = params.batch;

  try {
    // Get all students for the batch
    const { data: batchData, error: batchError } = await supabaseServer
      .from('apidata')
      .select('department, session')
      .eq('batch', batchNumber);

    if (batchError) {
      console.error('Supabase batch error:', batchError);
      return NextResponse.json({ error: batchError.message }, { status: 500 });
    }

    if (batchData.length === 0) {
      return NextResponse.json({ error: 'No data found for this batch' }, { status: 404 });
    }

    const totalStudents = batchData.length;
    const session = batchData[0].session; // All records in a batch will have the same session

    // Count students by department
    const departmentCounts: { [key: string]: number } = {};
    batchData.forEach((student) => {
      const dept = student.department;
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    // Prepare the response
    const response = {
      batch: batchNumber,
      session: session,
      totalStudents: totalStudents,
      departmentWiseStudents: departmentCounts,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching batch data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
