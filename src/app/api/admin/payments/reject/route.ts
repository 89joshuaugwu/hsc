import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { transactionId, reason } = await req.json();
    if (!transactionId || !reason) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const txRef = adminDb.collection("transactions").doc(transactionId);
    const txSnap = await txRef.get();
    if (!txSnap.exists) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const tx = txSnap.data()!;
    await txRef.update({ status: "rejected", rejectionReason: reason, rejectedAt: FieldValue.serverTimestamp() });

    try {
      await sendEmail({
        to: tx.donorEmail,
        subject: "Payment Update — Holy Spirit Chapel",
        html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <div style="text-align:center;padding:16px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;">
            <h2 style="color:#F0B429;margin:0;">HOLY SPIRIT CHAPEL</h2>
          </div>
          <div style="margin-top:20px;">
            <p>Dear ${tx.donorName},</p>
            <p>We were unable to verify your payment of <strong>₦${(tx.amount / 100).toLocaleString("en-NG")}</strong>.</p>
            <div style="background:#FEF2F2;border-left:4px solid #EF4444;padding:12px;border-radius:8px;margin:16px 0;">
              <p style="margin:0;color:#991B1B;font-size:14px;"><strong>Reason:</strong> ${reason}</p>
            </div>
            <p>If you believe this is an error, please contact us with your payment details and we will be happy to assist.</p>
            <p style="color:#64748B;font-size:12px;margin-top:24px;">— Holy Spirit Chapel, ESUT Agbani</p>
          </div>
        </div>`,
      });
    } catch { /* don't fail */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject payment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
