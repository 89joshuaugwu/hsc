import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";

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

    await sendEmail({
      to,
      subject: "Test Email — Holy Spirit Chapel Admin",
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#ffffff;border-radius:16px;">
          <div style="text-align:center;padding:20px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;margin-bottom:24px;">
            <h1 style="color:#F0B429;font-size:18px;margin:0;">HOLY SPIRIT CHAPEL</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:11px;margin:4px 0 0;">ESUT Agbani</p>
          </div>
          <h2 style="color:#0A2D52;text-align:center;">✓ Email Configuration Working!</h2>
          <p style="color:#64748B;text-align:center;font-size:14px;">This test email confirms that your SMTP settings are properly configured.</p>
          <p style="color:#94A3B8;text-align:center;font-size:12px;margin-top:24px;">Sent from Holy Spirit Chapel Admin Panel</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 });
  }
}
