import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { testEmail } from "@/lib/email-templates/testEmail";

/**
 * POST /api/admin/test-email
 * Sends a test email to verify SMTP configuration.
 * Body: { to }
 */
export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json({ error: "Missing 'to' address" }, { status: 400 });
    }

    const { subject, html } = testEmail();
    await sendEmail({ to, subject, html });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 });
  }
}
