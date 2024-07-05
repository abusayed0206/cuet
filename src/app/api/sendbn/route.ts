// send.ts (or whatever your API route file is named)
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactEmailTemplate } from "@/components/ui/ContactEmailTemplatebn";

export async function POST(req: NextRequest) {
  const { fullName, email, phoneNumber, message } = await req.json();

  // Initialize Resend with your API key
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `সাঈদ<hello@email.abusayed.dev>`,
      reply_to: "hello@sayed.page",
      bcc: ["abusayed0206@gmail.com"],
      to: [email],
      subject: `যোগাযোগ করার জন্য ধন্যবাদ(সাঈদ)`,
      text: "fixed test",
      react: ContactEmailTemplate({ fullName, email, phoneNumber, message }),
    });

    if (error) {
      return NextResponse.json(
        { message: "Email sending failed", error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error },
      { status: 500 }
    );
  }
}
