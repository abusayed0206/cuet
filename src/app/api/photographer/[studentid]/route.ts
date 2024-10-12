import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { studentid: string } }
) {
  const studentId = params.studentid;

  try {
    // Explicitly List Columns (Best Practice)
    const { data, error } = await supabaseServer
      .from("apidata")
      .select(
        "name, studentid, batch, session, department, hall, public_email, dplink, currentstatus, linkedin, photographer, intro, portfolio, instagram, facebook, playbook, playboard" 
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

    // Check if the photographer value is 'yes'
    if (data.photographer === "yes") {
      const photographerData = {
        name: data.name,
        studentid: data.studentid,
        dplink: data.dplink,
        linkedin: data.linkedin,
        intro: data.intro,
        portfolio: data.portfolio,
        instagram: data.instagram,
        facebook: data.facebook,
        playbook: data.playbook,
        playboard: data.playboard,
      };
      return NextResponse.json(photographerData);
    } else {
      return NextResponse.json(
        { message: "You are not a member of CUETPS" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
