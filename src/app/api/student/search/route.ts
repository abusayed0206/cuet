import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchName = searchParams.get("name");

  // Input Validation
  if (!searchName || searchName.length < 4) {
    return NextResponse.json({ error: "Invalid search query" }, { status: 400 });
  }

  try {
   await supabaseServer
      .from("apidata")
      .select("name, studentid, department, batch")  // Include 'batch' for sorting
      .ilike('name', `%${searchName}%`)
      .order("batch", { ascending: false })       // Sort by batch descending
      .limit(10)
      .then(({data,error})=>
      {if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return NextResponse.json({ results: data });}
      );

   
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
