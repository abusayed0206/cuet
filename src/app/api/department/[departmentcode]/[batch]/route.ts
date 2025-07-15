import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // Update path if different

const departmentMap: { [key: string]: string } = {
  ce: "Department of Civil Engineering",
  eee: "Department of Electrical & Electronic Engineering",
  me: "Department of Mechanical Engineering",
  cse: "Department of Computer Science & Engineering",
  urp: "Department of Urban & Regional Planning",
  arch: "Department of Architecture",
  pme: "Department of Petroleum & Mining Engineering",
  ete: "Department of Electronics & Telecommunication Engineering",
  bme: "Department of Biomedical Engineering",
  mie: "Department of Mechatronics & Industrial Engineering",
  wre: "Department of Water Resources Engineering",
  mse: "Department of Materials Science & Engineering",
  mme: "Department of Materials and Metallurgical Engineering",
};

export async function GET(
  request: Request,
  { params }: { params: { departmentcode: string; batch: string } }
) {
  const supabase = createClient(); // ✅ SSR-safe client

  const departmentCode = params.departmentcode;
  const batch = params.batch;
  const departmentName = departmentMap[departmentCode];

  if (!departmentName) {
    return NextResponse.json(
      { error: "Invalid department code" },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = 100;
  const offset = (page - 1) * pageSize;

  try {
    const { data: studentsData, error: studentsError } = await supabase
      .from("apidata")
      .select("studentid, name, dplink")
      .eq("department", departmentName)
      .eq("batch", batch)
      .order("studentid", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (studentsError) {
      console.error("Supabase query error:", studentsError);
      return NextResponse.json(
        { error: studentsError.message },
        { status: 500 }
      );
    }

    if (!studentsData || studentsData.length === 0) {
      return NextResponse.json(
        { error: "No students found for this department and batch" },
        { status: 404 }
      );
    }

    const { count, error: countError } = await supabase
      .from("apidata")
      .select("studentid", { count: "exact" })
      .eq("department", departmentName)
      .eq("batch", batch);

    if (countError) {
      console.error("Count query error:", countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    return NextResponse.json({
      name: departmentName,
      batch: batch,
      totalStudents: count,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
      studentList: studentsData,
    });
  } catch (error) {
    console.error("Error fetching department and batch data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
