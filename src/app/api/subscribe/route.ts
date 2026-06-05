import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, source } = await req.json();
    if (!name || name.length < 2 || !email) return NextResponse.json({ error: "Name (min 2 chars) and email required" }, { status: 400 });

    const token = crypto.randomBytes(32).toString("hex");

    try {
      const emailDocId = email.toLowerCase();
      const subscriberRef = adminDb.collection("subscribers").doc(emailDocId);
      const snap = await subscriberRef.get();

      if (snap.exists) {
        const data = snap.data();
        if (data?.isActive) return NextResponse.json({ success: false, message: "Already subscribed!" });
        await subscriberRef.update({ isActive: true, name, reactivatedAt: FieldValue.serverTimestamp() });
      } else {
        await subscriberRef.set({ name, email, source: source || "website", isActive: true, unsubscribeToken: token, createdAt: FieldValue.serverTimestamp() });
      }
    } catch (dbError) {
      console.error("Firestore write failed:", dbError);
      return NextResponse.json({ success: false, error: "Failed to subscribe" }, { status: 500 });
    }

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      await sendEmail({ to: email, subject: "Welcome to the Holy Spirit Chapel family!", html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;"><div style="text-align:center;padding:16px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;"><h2 style="color:#F0B429;margin:0;">HOLY SPIRIT CHAPEL</h2></div><p style="margin-top:20px;">Dear ${name},</p><p>Welcome! You&apos;re now part of our community. You&apos;ll receive updates on events, announcements, and more.</p><p style="color:#94A3B8;font-size:11px;margin-top:30px;"><a href="${appUrl}/api/unsubscribe/${token}">Unsubscribe</a></p></div>` });
    } catch (emailError) {
      console.error("Welcome email failed (non-fatal):", emailError);
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully!" });
  } catch (error) { 
    console.error("Subscribe API:", error); 
    return NextResponse.json({ error: "Server error" }, { status: 500 }); 
  }
}
