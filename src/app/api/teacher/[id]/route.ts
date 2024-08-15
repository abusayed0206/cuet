// src/app/api/teacher/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const teacherId = params.id;

  try {
    // Explicitly List Columns (Best Practice)
    const { data, error } = await supabaseServer
      .from('teachers')
      .select(
        'id, name, department, role, email, phone, profilelink, facebook, linkedin, photo'
      ) 
      .eq('id', teacherId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // No need for type assertion since we have explicit select
    return NextResponse.json(data); 
  } catch (error) {
    console.error('Error fetching teacher data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
