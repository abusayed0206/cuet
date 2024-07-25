// File: app/api/student/search/route.ts

import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchName = searchParams.get("name");

  // Enhanced Input Validation
  if (!searchName || searchName.trim().length < 4) {
    return NextResponse.json(
      { error: "Search query must be at least 4 characters long" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseServer
      .from("apidata")
      .select("name, studentid, department, batch")
      .textSearch("name", searchName.trim(), { // Using textSearch here
        type: "websearch",
        config: "english"
      }) // Use 'websearch' type with 'english' config
      .order("batch", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json({ results: data });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 });
  }
}
