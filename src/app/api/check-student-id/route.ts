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

  // If student ID exists, return the associated email
  return NextResponse.json({ email: data.email }, { status: 200 });
}
