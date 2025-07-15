import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; 
export async function GET(
  request: Request,
  { params }: { params: { bloodGroup: string } }
) {
  const bloodGroup = params.bloodGroup;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 20;

  // Instantiate Supabase SSR client
  const supabase = createClient();

  try {
    const { data, error, count } = await supabase
      .from("apidata")
      .select("name, studentid, phonenumber", { count: "exact" })
      .eq("bloodgroup", bloodGroup)
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, count });
  } catch (error) {
    console.error("Error fetching blood group data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
