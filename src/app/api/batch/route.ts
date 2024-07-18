import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

type DepartmentCount = { [department: string]: number };
type BatchSummary = { [batch: string]: DepartmentCount };

export async function GET(request: Request) {
  try {
    // Get all unique batches
    const { data: batchesData, error: batchesError } = await supabaseServer
      .from('apidata')
      .select('batch')
      .order('batch', { ascending: false });

    if (batchesError) {
      console.error('Supabase batches query error:', batchesError);
      return NextResponse.json({ error: batchesError.message }, { status: 500 });
    }

    const batches = [...new Set(batchesData.map(item => item.batch))];

    // Get all unique departments
    const { data: deptsData, error: deptsError } = await supabaseServer
      .from('apidata')
      .select('department')
      .order('department');

    if (deptsError) {
      console.error('Supabase departments query error:', deptsError);
      return NextResponse.json({ error: deptsError.message }, { status: 500 });
    }

    const departments = [...new Set(deptsData.map(item => item.department))];

    // Prepare the response
    const response = await Promise.all(batches.map(async (batch) => {
      const departmentCounts = await Promise.all(departments.map(async (dept) => {
        const { count, error } = await supabaseServer
          .from('apidata')
          .select('*', { count: 'exact', head: true })
          .eq('batch', batch)
          .eq('department', dept);

        if (error) {
          console.error(`Error fetching count for batch ${batch}, department ${dept}:`, error);
          return { name: dept, students: 0 };
        }

        return { name: dept, students: count || 0 };
      }));

      return {
        batch,
        departments: departmentCounts.filter(dept => dept.students > 0)
      };
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching batch summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
