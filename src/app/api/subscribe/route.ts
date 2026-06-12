import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";
import { subscribeWelcome } from "@/lib/email-templates/subscribeWelcome";
import crypto from "crypto";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
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
      const welcomeEmail = subscribeWelcome({
        name,
        unsubscribeUrl: `${appUrl}/api/unsubscribe/${token}`,
      });
      await sendEmail({ to: email, subject: welcomeEmail.subject, html: welcomeEmail.html });
    } catch (emailError) {
      console.error("Welcome email failed (non-fatal):", emailError);
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully!" });
  } catch (error) { 
    console.error("Subscribe API:", error); 
    return NextResponse.json({ error: "Server error" }, { status: 500 }); 
  }
}
