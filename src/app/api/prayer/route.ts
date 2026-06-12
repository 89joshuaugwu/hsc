import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";
import { prayerAdminNotification } from "@/lib/email-templates/prayerAdminNotification";
import { prayerUserConfirmation } from "@/lib/email-templates/prayerUserConfirmation";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
  try {
    const { name, email, topic, request, isPrivate } = await req.json();
    if (!name || !email || !request) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    try {
      await adminDb.collection("prayer_requests").add({ name, email, topic: topic || "", request, isPrivate: isPrivate || false, createdAt: FieldValue.serverTimestamp() });
    } catch (dbError) {
      console.error("Firestore write failed:", dbError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    try {
      const settingsSnap = await adminDb.collection("admin_settings").doc("config").get();
      const prayerEmail = settingsSnap.exists ? settingsSnap.data()?.prayerEmail : null;

      if (prayerEmail) {
        const adminEmail = prayerAdminNotification({
          name,
          email,
          topic: topic || "",
          request,
          isPrivate: isPrivate || false,
          date: new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        });
        await sendEmail({ to: prayerEmail, subject: adminEmail.subject, html: adminEmail.html });
      }

      const userConfirm = prayerUserConfirmation({ name });
      await sendEmail({ to: email, subject: userConfirm.subject, html: userConfirm.html });
    } catch (emailError) {
      console.error("Email failed (non-fatal):", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) { 
    console.error("Prayer API:", error); 
    return NextResponse.json({ error: "Server error" }, { status: 500 }); 
  }
}
