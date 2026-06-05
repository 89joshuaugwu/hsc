import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
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
