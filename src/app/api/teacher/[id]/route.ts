import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; 
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const teacherId = params.id;

  // Instantiate Supabase SSR client
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('teachers')
      .select(
        'id, name, department, role, email, phone, profilelink, researchgate, facebook, linkedin, photo'
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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching teacher data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const runtime = 'edge';
