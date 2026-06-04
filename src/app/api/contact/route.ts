import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { sendEmail } from "@/lib/nodemailer";

const cfg = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
const app = getApps().length ? getApps()[0] : initializeApp(cfg);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
      await addDoc(collection(db, "contact_messages"), { name, email, subject: subject || "General", message, isRead: false, createdAt: Timestamp.now() });
    } catch (dbError) {
      console.error("Firestore write failed:", dbError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    try {
      const settingsSnap = await getDoc(doc(db, "admin_settings", "config"));
      const contactEmails = settingsSnap.exists() ? settingsSnap.data()?.contactEmails || [] : [];

      if (contactEmails.length > 0) {
        await sendEmail({ to: contactEmails.join(", "), subject: `New Message from ${name}`, html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;"><h2 style="color:#0A2D52;">New Contact Message</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><hr style="border:1px solid #eee;"/><p>${message.replace(/\n/g, "<br/>")}</p></div>` });
      }

      await sendEmail({ to: email, subject: "We received your message | Holy Spirit Chapel", html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;"><div style="text-align:center;padding:16px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;"><h2 style="color:#F0B429;margin:0;">HOLY SPIRIT CHAPEL</h2></div><p style="margin-top:20px;">Dear ${name},</p><p>Thank you for reaching out! We&apos;ve received your message and will respond within 24 hours.</p><p style="color:#94A3B8;font-size:12px;">— Holy Spirit Chapel, ESUT Agbani</p></div>` });
    } catch (emailError) {
      console.error("Email failed (non-fatal):", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) { 
    console.error("Contact API:", error); 
    return NextResponse.json({ error: "Server error" }, { status: 500 }); 
  }
}
