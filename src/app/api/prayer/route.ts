import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { sendEmail } from "@/lib/nodemailer";

const cfg = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
const app = getApps().length ? getApps()[0] : initializeApp(cfg);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { name, email, topic, request, isPrivate } = await req.json();
    if (!name || !email || !request) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
      await addDoc(collection(db, "prayer_requests"), { name, email, topic: topic || "", request, isPrivate: isPrivate || false, createdAt: Timestamp.now() });
    } catch (dbError) {
      console.error("Firestore write failed:", dbError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    try {
      const settingsSnap = await getDoc(doc(db, "admin_settings", "config"));
      const prayerEmail = settingsSnap.exists() ? settingsSnap.data()?.prayerEmail : null;

      if (prayerEmail) {
        await sendEmail({ to: prayerEmail, subject: `Prayer Request from ${name}${isPrivate ? " [PRIVATE]" : ""}`, html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;"><h2 style="color:#0A2D52;">New Prayer Request${isPrivate ? " 🔒" : ""}</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Topic:</strong> ${topic || "N/A"}</p><hr/><p>${request.replace(/\n/g, "<br/>")}</p></div>` });
      }

      await sendEmail({ to: email, subject: "Your prayer has been received | Holy Spirit Chapel", html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;text-align:center;"><div style="padding:16px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;"><h2 style="color:#F0B429;margin:0;">HOLY SPIRIT CHAPEL</h2></div><p style="margin-top:20px;">Dear ${name},</p><p>Your prayer request has been received. Our prayer team will intercede for you.</p><p style="font-style:italic;color:#64748B;">"The prayer of a righteous person is powerful and effective." — James 5:16</p></div>` });
    } catch (emailError) {
      console.error("Email failed (non-fatal):", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) { 
    console.error("Prayer API:", error); 
    return NextResponse.json({ error: "Server error" }, { status: 500 }); 
  }
}
