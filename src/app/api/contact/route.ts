import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";
import { contactAdminNotification } from "@/lib/email-templates/contactAdminNotification";
import { contactUserAutoReply } from "@/lib/email-templates/contactUserAutoReply";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
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
        const adminEmail = contactAdminNotification({
          name,
          email,
          subject: subject || "General",
          message,
          date: new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        });
        await sendEmail({ to: contactEmails.join(", "), subject: adminEmail.subject, html: adminEmail.html });
      }

      const userReply = contactUserAutoReply({ name, subject: subject || "General", message });
      await sendEmail({ to: email, subject: userReply.subject, html: userReply.html });
    } catch (emailError) {
      console.error("Email failed (non-fatal):", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) { 
    console.error("Contact API:", error); 
    return NextResponse.json({ error: "Server error" }, { status: 500 }); 
  }
}
