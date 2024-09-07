// src/app/api/check-student-id/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { studentid } = await req.json();

  if (!studentid) {
    return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from('apidata')
    .select('email')
    .eq('studentid', studentid)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: 'Student ID not found' }, { status: 404 });
  }

  // Prepare the response with CORS headers
  const response = NextResponse.json({ email: data.email }, { status: 200 });

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://cuetprofile.vercel.app'); // Replace with your front-end origin
  response.headers.set('Access-Control-Allow-Methods', 'POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}
