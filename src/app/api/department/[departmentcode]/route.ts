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
  "wrp": "Department of Water Resources Engineering",
  "mse": "Department of Materials Science & Engineering"
};

export async function GET(
  request: Request,
  { params }: { params: { departmentcode: string } }
) {
  const departmentCode = params.departmentcode;
  const departmentName = departmentMap[departmentCode];

  if (!departmentName) {
    return NextResponse.json({ error: 'Invalid department code' }, { status: 400 });
  }

  try {
    // Get all students for the department
    const { data: departmentData, error: deptError } = await supabaseServer
      .from('apidata')
      .select('batch')
      .eq('department', departmentName);

    if (deptError) {
      console.error('Supabase department error:', deptError);
      return NextResponse.json({ error: deptError.message }, { status: 500 });
    }

    // Count students by batch
    const batchCounts: { [key: string]: number } = {};
    departmentData.forEach((student) => {
      const batch = student.batch;
      batchCounts[batch] = (batchCounts[batch] || 0) + 1;
    });

    // Sort batches in descending order
    const sortedBatches = Object.entries(batchCounts)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Prepare the response
    const response = {
      name: departmentName,
      batchwiseStudents: sortedBatches
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching department data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
