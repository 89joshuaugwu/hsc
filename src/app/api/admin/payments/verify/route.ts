import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";
import { paymentReceiptVerified } from "@/lib/email-templates/paymentReceiptVerified";

export async function POST(req: NextRequest) {
  try {
    const { transactionId } = await req.json();
    if (!transactionId) return NextResponse.json({ error: "Missing transactionId" }, { status: 400 });

    const txRef = adminDb.collection("transactions").doc(transactionId);
    const txSnap = await txRef.get();
    if (!txSnap.exists) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const tx = txSnap.data()!;
    await txRef.update({ status: "verified", adminVerifiedAt: FieldValue.serverTimestamp() });

    if (tx.giveOptionId) {
      try {
        await adminDb.collection("give_options").doc(tx.giveOptionId).update({
          totalReceived: FieldValue.increment(Number(tx.amount))
        });
      } catch (e) {
        console.error("Failed to increment goal amount:", e);
      }
    }

    const amountNaira = `₦${Number(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

    try {
      const { subject, html } = paymentReceiptVerified({
        name: tx.donorName,
        amount: amountNaira,
        giveTitle: tx.giveOptionTitle || tx.giveType || "Offering",
        method: tx.method || "bank_transfer",
        reference: transactionId,
        date: new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" }),
      });
      await sendEmail({ to: tx.donorEmail, subject, html });
    } catch { /* email failure shouldn't break verification */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify payment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
