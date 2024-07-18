import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { batch: string } }
) {
  const batchNumber = params.batch;

  try {
    // Get total number of students in the batch
    const { count: totalStudents, error: countError } = await supabaseServer
      .from('apidata')
      .select('*', { count: 'exact', head: true })
      .eq('batch', batchNumber);

    if (countError) {
      console.error('Supabase count error:', countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Get department-wise student count
    const { data: departmentData, error: deptError } = await supabaseServer
      .from('apidata')
      .select('department')
      .eq('batch', batchNumber);

    if (deptError) {
      console.error('Supabase department error:', deptError);
      return NextResponse.json({ error: deptError.message }, { status: 500 });
    }

    // Count students by department
    const departmentCounts: { [key: string]: number } = {};
    departmentData.forEach((student) => {
      const dept = student.department;
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    // Prepare the response
    const response = {
      totalStudents,
      departmentWiseCount: departmentCounts,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching batch data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
