import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const file = formData.get("file") as File;

    if (!id || !file) {
      console.error("Missing ID or file");
      return NextResponse.json(
        { error: "ID and file are required" },
        { status: 400 }
      );
    }

    // Validate file size and type
    if (file.size > 300 * 1024) {
      console.error("File size exceeds limit", file.size);
      return NextResponse.json(
        { error: "File size exceeds 300KB" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type", file.type);
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    console.log("Forwarding request to Cloudflare Worker");
    const workerResponse = await fetch("https://dplink.lrsayed.workers.dev/", {
      method: "POST",
      body: formData,
    });

    if (!workerResponse.ok) {
      const result = await workerResponse.json();
      console.error("Worker error:", result);
      return NextResponse.json(
        { error: result.error || "Failed to upload file" },
        { status: workerResponse.status }
      );
    }

    const { url } = await workerResponse.json();
    console.log("File uploaded successfully, URL:", url);

    // Create a new Supabase client for this request
    const supabase = createClient();

    // Update the Supabase database with the new dp link
    const updatePromise = supabase
      .from("apidata")
      .update({ dplink: url })
      .eq("studentid", id)
      .select();

    // Set a timeout for the database update
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database update timed out")), 5000)
    );

    // Race the update against the timeout
    const { data, error } = await Promise.race([updatePromise, timeoutPromise])
      .then((result) => result as { data: any; error: any })
      .catch((error) => ({ data: null, error }));

    if (error) {
      console.error("Supabase update error:", error.message);
      return NextResponse.json(
        {
          error: "Failed to update profile picture URL",
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.error("No matching student record found");
      return NextResponse.json(
        { error: "No matching student record found" },
        { status: 404 }
      );
    }

    console.log("Database updated successfully");
    return NextResponse.json({
      message: "File uploaded and URL updated successfully",
      url,
    });
  } catch (error: unknown) {
    console.error("Unexpected error in API route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
