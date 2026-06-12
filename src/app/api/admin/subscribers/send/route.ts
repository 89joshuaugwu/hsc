import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendEmail } from "@/lib/nodemailer";
import { subscriberBroadcast } from "@/lib/email-templates/subscriberBroadcast";

export async function POST(req: NextRequest) {
  try {
    const { subject, message, recipientIds } = await req.json();
    if (!subject || !message) return NextResponse.json({ error: "Subject and message required" }, { status: 400 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    let subscribers: { name: string; email: string; unsubscribeToken: string }[] = [];

    if (recipientIds === "all") {
      const snap = await adminDb.collection("subscribers").where("isActive", "==", true).get();
      subscribers = snap.docs.map((d) => d.data() as { name: string; email: string; unsubscribeToken: string });
    } else if (Array.isArray(recipientIds)) {
      for (const id of recipientIds) {
        const snap = await adminDb.collection("subscribers").doc(id).get();
        if (snap.exists && snap.data()?.isActive) subscribers.push(snap.data() as { name: string; email: string; unsubscribeToken: string });
      }
    }

    let sent = 0;
    for (const sub of subscribers) {
      try {
        const email = subscriberBroadcast({
          name: sub.name,
          subject,
          message,
          unsubscribeUrl: `${appUrl}/api/unsubscribe/${sub.unsubscribeToken}`,
        });
        await sendEmail({ to: sub.email, subject: email.subject, html: email.html });
        sent++;
      } catch { /* continue to next */ }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Send to subscribers:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
