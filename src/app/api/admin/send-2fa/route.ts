import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { uid, email } = await req.json();

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await adminDb.collection("admin_2fa").doc(uid).set({
      code,
      expiresAt,
      used: false,
    });

    await sendEmail({
      to: email,
      subject: "Your Login Code — Holy Spirit Chapel",
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:400px;margin:0 auto;padding:32px;background:#ffffff;border-radius:16px;text-align:center;">
          <h2 style="color:#0A2D52;margin-bottom:8px;">Login Verification</h2>
          <p style="color:#64748B;font-size:14px;margin-bottom:24px;">Your 6-digit login code for Holy Spirit Chapel Admin:</p>
          <div style="font-size:36px;font-weight:700;letter-spacing:12px;color:#0A2D52;padding:16px 24px;background:#F8F7F3;border-radius:12px;display:inline-block;">
            ${code}
          </div>
          <p style="color:#94A3B8;font-size:12px;margin-top:24px;">This code expires in 10 minutes. Do not share it.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send 2FA error:", error);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
