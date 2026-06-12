import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";
import { paymentRejected } from "@/lib/email-templates/paymentRejected";

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
      const amountNaira = `₦${Number(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
      const { subject, html } = paymentRejected({
        name: tx.donorName,
        amount: amountNaira,
        reason,
      });
      await sendEmail({ to: tx.donorEmail, subject, html });
    } catch { /* don't fail */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject payment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
