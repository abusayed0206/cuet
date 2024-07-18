import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

type DepartmentCount = { [department: string]: number };
type BatchSummary = { [batch: string]: DepartmentCount };

export async function GET(request: Request) {
  try {
    // Get all batch and department data
    const { data, error } = await supabaseServer
      .from('apidata')
      .select('batch, department');

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process the data
    const batchSummary: BatchSummary = {};

    data.forEach((student) => {
      const { batch, department } = student;
      if (!batchSummary[batch]) {
        batchSummary[batch] = {};
      }
      batchSummary[batch][department] = (batchSummary[batch][department] || 0) + 1;
    });

    // Sort batches in descending order
    const sortedBatchSummary = Object.entries(batchSummary)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .reduce<BatchSummary>((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Prepare the response
    const response = Object.entries(sortedBatchSummary).map(([batch, departments]) => ({
      batch,
      departments: Object.entries(departments as DepartmentCount).map(([dept, count]) => ({
        name: dept,
        students: count
      }))
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching batch summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
