import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(request: Request) {
  const supabaseClient = createClient();

  const { searchParams } = new URL(request.url);
  const searchName = searchParams.get("name");

  if (!searchName || searchName.length < 4) {
    return NextResponse.json(
      { error: "Search query must be at least 4 characters long" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseClient
      .from("apidata")
      .select("name, studentid, department, batch, dplink")
      .textSearch("name", searchName, {
        type: "websearch",
        config: "english",
      })
      .order("batch", { ascending: false })
      .limit(30);

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
