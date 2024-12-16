import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function GET(request: Request) {
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
    // Fetch members where cuetps is other than "No"
    const { data, error } = await supabaseServer
      .from("apidata")
      .select("name, studentid, cuetps, dplink, facebook, instagram, portfolio")
      .neq("cuetps", "No"); // Exclude members with "No"

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: responseHeaders }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "No CUETPS members found." },
        { status: 404, headers: responseHeaders }
      );
    }

    // Format data to include the designation
    const members = data.map((member) => {
      const designation = member.cuetps.includes("\n")
        ? member.cuetps.split("\n")[1] // Extract designation after newline
        : member.cuetps; // Use the value as designation if no newline

      return {
        name: member.name,
        studentid: member.studentid,
        designation,
        dplink: member.dplink,
        facebook: member.facebook,
        instagram: member.instagram,
        portfolio: member.portfolio,
      };
    });

    return NextResponse.json({ members }, { headers: responseHeaders });
  } catch (error) {
    console.error("Error fetching members data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: responseHeaders }
    );
  }
}

export const runtime = "edge";
