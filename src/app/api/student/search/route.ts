import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name');

  if (!name || name.length < 4) {
    return NextResponse.json({ error: 'Name must be at least 4 characters long' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseServer
      .from('apidata')
      .select('name, studentid, department')
      .ilike('name', `%${name}%`)
      .limit(5);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No matching students found' }, { status: 404 });
    }

    return NextResponse.json(data); 
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
