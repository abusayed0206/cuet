import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { bloodGroup: string } }
) {
  // Normalize the blood group input
  const bloodGroup = params.bloodGroup.toUpperCase().trim();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 20;

  try {
    // Use ilike for case-insensitive matching
    const { data, error, count } = await supabaseServer
      .from("apidata")
      .select("name, studentid, phonenumber", { count: "exact" })
      .ilike("bloodgroup", bloodGroup) // Changed from eq to ilike
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add logging to help debug production issues
    console.log({
      bloodGroup,
      page,
      resultCount: data?.length,
      totalCount: count,
      firstResult: data?.[0],
    });

    return NextResponse.json({
      data,
      count,
      debug: {
        queryParams: { bloodGroup, page },
        resultCount: data?.length,
      },
    });
  } catch (error) {
    console.error("Error fetching blood group data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
