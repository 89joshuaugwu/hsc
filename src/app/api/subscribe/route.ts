import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { sendEmail } from "@/lib/nodemailer";
import crypto from "crypto";

const cfg = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
const app = getApps().length ? getApps()[0] : initializeApp(cfg);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { name, email, source } = await req.json();
    if (!name || name.length < 2 || !email) return NextResponse.json({ error: "Name (min 2 chars) and email required" }, { status: 400 });

    const q = query(collection(db, "subscribers"), where("email", "==", email));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const existing = snap.docs[0];
      const data = existing.data();
      if (data.isActive) return NextResponse.json({ error: "Already subscribed!" }, { status: 409 });
      await updateDoc(doc(db, "subscribers", existing.id), { isActive: true, name, reactivatedAt: Timestamp.now() });
      return NextResponse.json({ success: true, message: "Welcome back! Re-subscribed." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await addDoc(collection(db, "subscribers"), { name, email, source: source || "website", isActive: true, unsubscribeToken: token, createdAt: Timestamp.now() });

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      await sendEmail({ to: email, subject: "Welcome to the Holy Spirit Chapel family!", html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;"><div style="text-align:center;padding:16px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;"><h2 style="color:#F0B429;margin:0;">HOLY SPIRIT CHAPEL</h2></div><p style="margin-top:20px;">Dear ${name},</p><p>Welcome! You&apos;re now part of our community. You&apos;ll receive updates on events, announcements, and more.</p><p style="color:#94A3B8;font-size:11px;margin-top:30px;"><a href="${appUrl}/api/unsubscribe/${token}">Unsubscribe</a></p></div>` });
    } catch { /* don't fail */ }

    return NextResponse.json({ success: true, message: "Subscribed!" });
  } catch (error) { console.error("Subscribe API:", error); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
