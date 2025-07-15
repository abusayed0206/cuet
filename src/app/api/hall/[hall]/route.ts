import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

const hallMap: { [key: string]: string } = {
  bbh: "Bangabandhu Hall",
  smsh: "Shaheed Mohammad Shah Hall",
  sthh: "Shaheed Tareq Huda Hall",
  qkh: "Dr. Qudrat-E-Khuda Hall",
  ash: "Abu Sayed Hall",
  skh: "Sufia Kamal Hall",
  snkh: "Shamsunnahar Khan Hall",
  trh: "Tapashi Rabeya Hall",
};

export async function GET(
  request: Request,
  { params }: { params: { hall: string } }
) {
  const hallShortForm = params.hall;
  const hallName = hallMap[hallShortForm];

  if (!hallName) {
    return NextResponse.json({ error: "Invalid hall code" }, { status: 400 });
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1; // Default to page 1
  const pageSize = 100;
  const offset = (page - 1) * pageSize;

  try {
    // Fetch students from the specified hall with pagination
    const { data: studentsData, error: studentsError } = await supabaseServer
      .from("apidata")
      .select("studentid, dplink, name, batch, department")
      .eq("hall", hallName)
      .order("studentid", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (studentsError) {
      console.error("Supabase query error:", studentsError);
      return NextResponse.json({ error: studentsError.message }, { status: 500 });
    }

    if (studentsData.length === 0) {
      return NextResponse.json({ error: "No students found for this hall" }, { status: 404 });
    }

    // Get the total count of students in the hall
    const { count, error: countError } = await supabaseServer
      .from("apidata")
      .select("studentid", { count: "exact" })
      .eq("hall", hallName);

    if (countError) {
      console.error("Count query error:", countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Construct response
    const response = {
      hall: hallName,
      totalStudents: count,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
      studentList: studentsData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching hall data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const runtime = "edge";
