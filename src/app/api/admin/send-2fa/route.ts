import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/nodemailer";
import { adminDb } from "@/lib/firebase-admin";
import { send2FACode } from "@/lib/email-templates/otpEmail";

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

    const { subject, html } = send2FACode(code, 10);
    await sendEmail({ to: email, subject, html });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send 2FA error:", error);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
