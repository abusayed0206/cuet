import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
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
  { params }: { params: { departmentcode: string } }
) {
  const departmentCode = params.departmentcode;
  const departmentName = departmentMap[departmentCode];

  if (!departmentName) {
    return NextResponse.json(
      { error: "Invalid department code" },
      { status: 400 }
    );
  }

  const supabase = createClient(); // SSR Supabase client

  try {
    const { data: departmentData, error: deptError } = await supabase
      .from("apidata")
      .select("batch")
      .eq("department", departmentName);

    if (deptError) {
      console.error("Supabase department error:", deptError);
      return NextResponse.json({ error: deptError.message }, { status: 500 });
    }

    const batchCounts: { [key: string]: number } = {};
    interface DepartmentStudent {
      batch: string;
    }

    const departmentDataTyped = departmentData as DepartmentStudent[];

    departmentDataTyped.forEach((student: DepartmentStudent) => {
      const batch: string = student.batch;
      batchCounts[batch] = (batchCounts[batch] || 0) + 1;
    });

    const sortedBatches = Object.entries(batchCounts)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    return NextResponse.json({
      name: departmentName,
      batchwiseStudents: sortedBatches,
    });
  } catch (error) {
    console.error("Error fetching department data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
