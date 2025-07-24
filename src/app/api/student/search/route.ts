import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const searchName = searchParams.get("name");

  if (!searchName || searchName.length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters long" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("cuet")
      .select("name, studentid, department, admission_roll, admission_merit, batch, session")
      .ilike("name", `%${searchName}%`)
      .order("batch", { ascending: false })
      .order("admission_merit", { ascending: true })
      .limit(50);

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
      { status: 500 }
    );
  }
}

export const runtime = "edge";
