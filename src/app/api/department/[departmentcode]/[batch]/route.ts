import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

const departmentMap: { [key: string]: string } = {
  "ce": "Department of Civil Engineering",
  "eee": "Department of Electrical & Electronic Engineering",
  "me": "Department of Mechanical Engineering",
  "cse": "Department of Computer Science & Engineering",
  "urp": "Department of Urban & Regional Planning",
  "arch": "Department of Architecture",
  "pme": "Department of Petroleum & Mining Engineering",
  "ete": "Department of Electronics & Telecommunication Engineering",
  "bme": "Department of Biomedical Engineering",
  "mie": "Department of Mechatronics & Industrial Engineering",
  "wre": "Department of Water Resources Engineering",
  "mse": "Department of Materials Science & Engineering"
};

export async function GET(
  request: Request,
  { params }: { params: { departmentcode: string; batch: string } }
) {
  const departmentCode = params.departmentcode;
  const batch = params.batch;
  const departmentName = departmentMap[departmentCode];

  if (!departmentName) {
    return NextResponse.json({ error: 'Invalid department code' }, { status: 400 });
  }

  try {
    // Get all students for the department and batch
    const { data: studentsData, error: studentsError } = await supabaseServer
      .from('apidata')
      .select('studentid, name, dplink')
      .eq('department', departmentName)
      .eq('batch', batch)
      .order('studentid', { ascending: true });

    if (studentsError) {
      console.error('Supabase query error:', studentsError);
      return NextResponse.json({ error: studentsError.message }, { status: 500 });
    }

    if (studentsData.length === 0) {
      return NextResponse.json({ error: 'No students found for this department and batch' }, { status: 404 });
    }

    // Prepare the response
    const response = {
      name: departmentName,
      batch: batch,
      students: studentsData.length,
      studentList: studentsData
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching department and batch data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export const runtime = 'edge';