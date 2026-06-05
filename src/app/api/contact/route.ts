import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
      await adminDb.collection("contact_messages").add({ name, email, subject: subject || "General", message, isRead: false, createdAt: FieldValue.serverTimestamp() });
    } catch (dbError) {
      console.error("Firestore write failed:", dbError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    try {
      const settingsSnap = await adminDb.collection("admin_settings").doc("config").get();
      const contactEmails = settingsSnap.exists ? settingsSnap.data()?.contactEmails || [] : [];

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
