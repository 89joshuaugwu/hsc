import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { sendEmail } from "@/lib/nodemailer";

const cfg = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
const app = getApps().length ? getApps()[0] : initializeApp(cfg);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { subject, message, recipientIds } = await req.json();
    if (!subject || !message) return NextResponse.json({ error: "Subject and message required" }, { status: 400 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    let subscribers: { name: string; email: string; unsubscribeToken: string }[] = [];

    if (recipientIds === "all") {
      const q = query(collection(db, "subscribers"), where("isActive", "==", true));
      const snap = await getDocs(q);
      subscribers = snap.docs.map((d) => d.data() as { name: string; email: string; unsubscribeToken: string });
    } else if (Array.isArray(recipientIds)) {
      for (const id of recipientIds) {
        const snap = await getDoc(doc(db, "subscribers", id));
        if (snap.exists() && snap.data().isActive) subscribers.push(snap.data() as { name: string; email: string; unsubscribeToken: string });
      }
    }

    let sent = 0;
    for (const sub of subscribers) {
      try {
        await sendEmail({
          to: sub.email,
          subject,
          html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
            <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;">
              <h2 style="color:#F0B429;margin:0;">HOLY SPIRIT CHAPEL</h2>
            </div>
            <div style="margin-top:20px;">
              <p>Dear ${sub.name},</p>
              <div style="margin:16px 0;">${message.replace(/\n/g, "<br/>")}</div>
              <hr style="border:1px solid #eee;margin:24px 0;"/>
              <p style="color:#94A3B8;font-size:11px;">Holy Spirit Chapel, ESUT Agbani</p>
              <p style="font-size:10px;color:#CBD5E1;"><a href="${appUrl}/api/unsubscribe/${sub.unsubscribeToken}" style="color:#94A3B8;">Unsubscribe</a></p>
            </div>
          </div>`,
        });
        sent++;
      } catch { /* continue to next */ }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Send to subscribers:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
