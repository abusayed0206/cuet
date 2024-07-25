import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name || name.length < 4) {
    return NextResponse.json(
      { error: 'Search term must be at least 4 characters long' },
      { status: 400 }
    );
  }

  try {
    let { data, error } = await supabaseServer
      .from('apidata')
      .select('name, studentid, department')
      .ilike('name', `%${name}%`)
      .order('name', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No students found' }, { status: 404 });
    }

    // Ensure data is an array
    const results = Array.isArray(data) ? data : [data];

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching student data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
