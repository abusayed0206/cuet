import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { studentid: string } }
) {
  const studentId = params.studentid;

  // CORS handling
  const allowedOrigins = [
    "https://cuetps.pages.dev",
    "https://cuetps.sayed.page",
    "http://localhost:3000", // Temporary for localhost
  ];
  
  const origin = request.headers.get("Origin");
  const responseHeaders: Record<string, string> = {};

  if (allowedOrigins.includes(origin || "")) {
    responseHeaders["Access-Control-Allow-Origin"] = origin!;
    responseHeaders["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    responseHeaders["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization";
  }

  try {
    // Explicitly List Columns (Best Practice)
    const { data, error } = await supabaseServer
      .from("apidata")
      .select(
        "name, studentid, batch, session, department, hall, public_email, dplink, currentstatus, linkedin, cuetps, intro, portfolio, instagram, facebook, images"
      )
      .eq("studentid", studentId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500, headers: responseHeaders });
    }

    if (!data) {
      return NextResponse.json({ error: "Student not found" }, { status: 404, headers: responseHeaders });
    }

    // Check if the cuetps value is 'yes'
    if (data.cuetps === "yes") {
      // Process the images field by splitting it using regex to handle commas, spaces, and new lines
      const imagesArray = data.images
        ? data.images.split(/[\s,]+/).filter(Boolean) // Split by comma, space, or newline
        : [];

      // Map the images into a numbered object
      const numberedImages = imagesArray.reduce(
        (acc: { [key: string]: string }, img: string, index: number) => {
          acc[`image${index + 1}`] = img;
          return acc;
        },
        {} as { [key: string]: string }
      );

      const cuetpsData = {
        name: data.name,
        studentid: data.studentid,
        dplink: data.dplink,
        linkedin: data.linkedin,
        intro: data.intro,
        portfolio: data.portfolio,
        instagram: data.instagram,
        facebook: data.facebook,
        images: numberedImages,
      };

      return NextResponse.json(cuetpsData, { headers: responseHeaders });
    } else {
      return NextResponse.json(
        { message: "You are not a member of CUETPS" },
        { status: 403, headers: responseHeaders }
      );
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: responseHeaders }
    );
  }
}

export const runtime = 'edge';
