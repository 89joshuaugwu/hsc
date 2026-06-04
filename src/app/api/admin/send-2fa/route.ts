import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { sendEmail } from "@/lib/nodemailer";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * POST /api/admin/send-2fa
 * Generates a 6-digit code, stores it in Firestore, and emails it.
 * Body: { uid, email }
 */
export async function POST(req: NextRequest) {
  try {
    const { uid, email } = await req.json();

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
    }

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Store in Firestore with 10-minute TTL
    const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));
    await setDoc(doc(db, "admin_2fa", uid), {
      code,
      expiresAt,
      used: false,
    });

    // Send email
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
