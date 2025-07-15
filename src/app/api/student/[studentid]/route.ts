import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; 

export async function GET(
  request: Request,
  { params }: { params: { studentid: string } }
) {
  const studentId = params.studentid;

  // Create server-side Supabase client with cookie support
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("apidata")
      .select(
        "name, studentid, batch, session, department, hall, public_email, dplink, currentstatus, linkedin"
      )
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
