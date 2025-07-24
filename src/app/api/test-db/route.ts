import { supabase } from "@/utils/supabase";
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    // Get total student count
    const { count: totalStudents, error: countError } = await supabase
      .from('cuet')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting total count:', countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Get all unique departments with counts
    const { data: departmentData, error: deptError } = await supabase
      .from('cuet')
      .select('department')
      .order('department');

    if (deptError) {
      console.error('Error getting departments:', deptError);
      return NextResponse.json({ error: deptError.message }, { status: 500 });
    }

    // Process departments
    const departmentCounts = departmentData.reduce((acc: any, student: any) => {
      const dept = student.department;
      const deptCode = dept.split(' ').pop()?.replace(/[^A-Z]/g, '') || dept;
      
      if (!acc[dept]) {
        acc[dept] = { 
          department: dept, 
          departmentCode: deptCode, 
          count: 0 
        };
      }
      acc[dept].count++;
      return acc;
    }, {});

    const departments = Object.values(departmentCounts);

    // Get all unique batches with counts
    const { data: batchData, error: batchError } = await supabase
      .from('cuet')
      .select('batch')
      .order('batch');

    if (batchError) {
      console.error('Error getting batches:', batchError);
      return NextResponse.json({ error: batchError.message }, { status: 500 });
    }

    const batchCounts = batchData.reduce((acc: any, student: any) => {
      const batch = student.batch;
      if (!acc[batch]) {
        acc[batch] = { batch, count: 0 };
      }
      acc[batch].count++;
      return acc;
    }, {});

    const batches = Object.values(batchCounts).sort((a: any, b: any) => 
      parseInt(b.batch) - parseInt(a.batch)
    );

    // Get all unique sessions with counts
    const { data: sessionData, error: sessionError } = await supabase
      .from('cuet')
      .select('session')
      .order('session');

    if (sessionError) {
      console.error('Error getting sessions:', sessionError);
      return NextResponse.json({ error: sessionError.message }, { status: 500 });
    }

    const sessionCounts = sessionData.reduce((acc: any, student: any) => {
      const session = student.session;
      if (!acc[session]) {
        acc[session] = { session, count: 0 };
      }
      acc[session].count++;
      return acc;
    }, {});

    const sessions = Object.values(sessionCounts);

    // Get department-batch combinations
    const { data: comboData, error: comboError } = await supabase
      .from('cuet')
      .select('department, batch, session')
      .order('department, batch');

    if (comboError) {
      console.error('Error getting combinations:', comboError);
      return NextResponse.json({ error: comboError.message }, { status: 500 });
    }

    const comboCounts = comboData.reduce((acc: any, student: any) => {
      const key = `${student.department}-${student.batch}-${student.session}`;
      const dept = student.department;
      const deptCode = dept.split(' ').pop()?.replace(/[^A-Z]/g, '') || dept;
      
      if (!acc[key]) {
        acc[key] = {
          department: dept,
          departmentCode: deptCode,
          batch: student.batch,
          session: student.session,
          count: 0
        };
      }
      acc[key].count++;
      return acc;
    }, {});

    const deptBatchCombinations = Object.values(comboCounts).sort((a: any, b: any) => {
      if (a.departmentCode !== b.departmentCode) {
        return a.departmentCode.localeCompare(b.departmentCode);
      }
      return parseInt(b.batch) - parseInt(a.batch);
    });

    // Get sample students (first 20)
    const { data: sampleData, error: sampleError } = await supabase
      .from('cuet')
      .select('name, studentid, department, batch, session, admission_roll, admission_merit')
      .order('studentid')
      .limit(20);

    if (sampleError) {
      console.error('Error getting sample students:', sampleError);
      return NextResponse.json({ error: sampleError.message }, { status: 500 });
    }

    const stats = {
      totalStudents: totalStudents || 0,
      departments,
      batches,
      sessions,
      deptBatchCombinations,
      sampleStudents: sampleData || []
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error in test-db API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
