import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

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
  wrp: "Department of Water Resources Engineering",
  mse: "Department of Materials Science & Engineering",
  mme: "Department of Materials and Metallurgical Engineering",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ department: string; batch: string }> }
) {
  const { department, batch } = await params;
  const departmentCode = department.toLowerCase();
  const batchNumber = batch;
  const departmentName = departmentMap[departmentCode];

  if (!departmentName) {
    return NextResponse.json(
      { error: "Invalid department code" },
      { status: 400 }
    );
  }

  try {
    const { data: students, error } = await supabase
      .from("cuet")
      .select("name, studentid, department, admission_roll, admission_merit, batch, session")
      .eq("department", departmentName)
      .eq("batch", batchNumber)
      .order("studentid", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!students || students.length === 0) {
      return NextResponse.json(
        { error: "No students found for this department and batch" },
        { status: 404 }
      );
    }

    const session = students[0].session;

    return NextResponse.json({
      department: departmentName,
      departmentCode: departmentCode.toUpperCase(),
      batch: batchNumber,
      session,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
