import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { transactionId } = await req.json();
    if (!transactionId) return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });

    const txRef = adminDb.collection("transactions").doc(transactionId);
    const txSnap = await txRef.get();
    if (!txSnap.exists) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const tx = txSnap.data()!;
    await txRef.update({ status: "verified", adminVerifiedAt: FieldValue.serverTimestamp() });

    const amountNaira = (tx.amount / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 });

    try {
      await sendEmail({
        to: tx.donorEmail,
        subject: "Payment Verified — Holy Spirit Chapel Receipt",
        html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;">
            <h2 style="color:#F0B429;margin:0;">HOLY SPIRIT CHAPEL</h2>
            <p style="color:#fff;font-size:12px;margin:4px 0 0;">Payment Receipt</p>
          </div>
          <div style="margin-top:20px;">
            <p>Dear ${tx.donorName},</p>
            <p>Your payment has been <strong style="color:#16a34a;">verified</strong>. Thank you for your generous giving!</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#64748B;">Amount</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">₦${amountNaira}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#64748B;">Give Type</td><td style="padding:8px;border-bottom:1px solid #eee;">${tx.giveType || "Offering"}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#64748B;">Method</td><td style="padding:8px;border-bottom:1px solid #eee;">${tx.method}</td></tr>
              <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#64748B;">Transaction ID</td><td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;">${transactionId}</td></tr>
              <tr><td style="padding:8px;color:#64748B;">Date</td><td style="padding:8px;">${new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</td></tr>
            </table>
            <p style="color:#64748B;font-size:12px;margin-top:24px;">God bless you for your faithfulness. — Holy Spirit Chapel, ESUT Agbani</p>
          </div>
        </div>`,
      });
    } catch { /* email failure shouldn't break verification */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
