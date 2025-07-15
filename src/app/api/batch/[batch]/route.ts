import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; 

export async function GET(
  request: Request,
  { params }: { params: { batch: string } }
) {
  const batchNumber = params.batch;

  // Create a new Supabase client instance for this request
  const supabase = createClient();

  try {
    // Use the new client instance for your query
    const { data: batchData, error: batchError } = await supabase
      .from("apidata")
      .select("department, session")
      .eq("batch", batchNumber);

    if (batchError) {
      console.error("Supabase batch error:", batchError);
      return NextResponse.json({ error: batchError.message }, { status: 500 });
    }

    if (!batchData || batchData.length === 0) {
      return NextResponse.json(
        { error: "No data found for this batch" },
        { status: 404 }
      );
    }

    const totalStudents = batchData.length;
    const session = batchData[0].session; // Assuming same session for whole batch

    // Count students by department
    const departmentCounts: Record<string, number> = {};
    batchData.forEach((student: { department: string }) => {
      departmentCounts[student.department] = (departmentCounts[student.department] || 0) + 1;
    });

    return NextResponse.json({
      batch: batchNumber,
      session,
      totalStudents,
      departmentWiseStudents: departmentCounts,
    });
  } catch (error) {
    console.error("Error fetching batch data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
