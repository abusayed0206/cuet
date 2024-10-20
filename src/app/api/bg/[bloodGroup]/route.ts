import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { bloodGroup: string } }
) {
  const bloodGroup = params.bloodGroup;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1; // Default to page 1 if not provided
  const pageSize = 20; // Maximum number of rows per page

  try {
    // Query for students with the specified blood group
    const { data, error, count } = await supabaseServer
      .from("apidata")
      .select("name, studentid, phonenumber", { count: "exact" }) // Include phonenumber in the select
      .eq("bloodgroup", bloodGroup) // Filter by bloodgroup
      .range((page - 1) * pageSize, page * pageSize - 1); // Pagination logic

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, count }); // Return data and count for pagination
  } catch (error) {
    console.error("Error fetching blood group data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
