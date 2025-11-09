import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase"; 

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentid: string }> }
) {
  const { studentid } = await params;
  const studentId = studentid;

  // Create server-side Supabase client

  try {
    const { data, error } = await supabase
      .from("cuet")
      .select("name, studentid, department, admission_roll, admission_merit, batch, session")
      .eq("studentid", studentId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
