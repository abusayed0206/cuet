import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { batch: string } }
) {
  const batch = params.batch;

  try {
    // Fetch total number of students in the batch
    const { data: totalStudentsData, error: totalStudentsError } = await supabaseServer
      .from('apidata')
      .select('studentid', { count: 'exact' })
      .eq('batch', batch);

    if (totalStudentsError) {
      console.error('Supabase error:', totalStudentsError);
      return NextResponse.json({ error: totalStudentsError.message }, { status: 500 });
    }

    const totalStudents = totalStudentsData.length;

    // Fetch department wise student count
    const { data: departmentData, error: departmentError } = await supabaseServer
      .from('apidata')
      .select('department, count(*)', { head: true })
      .eq('batch', batch)
      .group('department');

    if (departmentError) {
      console.error('Supabase error:', departmentError);
      return NextResponse.json({ error: departmentError.message }, { status: 500 });
    }

    const departmentWiseCount = departmentData.reduce((acc: any, item: any) => {
      acc[item.department] = item.count;
      return acc;
    }, {});

    return NextResponse.json({
      totalStudents,
      departmentWiseCount,
    });
  } catch (error) {
    console.error('Error fetching batch data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
