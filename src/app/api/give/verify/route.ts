import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendEmail } from "@/lib/nodemailer";
import { paymentReceiptVerified } from "@/lib/email-templates/paymentReceiptVerified";
import { formatNaira } from "@/lib/utils";



/**
 * POST /api/give/verify
 *
 * Called after Paystack popup success. Verifies the transaction with
 * Paystack API, updates Firestore status, and sends receipt email.
 *
 * Body: { reference, transactionId }
 */
export async function POST(req: NextRequest) {
  try {
    const { reference, transactionId } = await req.json();

    if (!reference || !transactionId) {
      return NextResponse.json(
        { error: "Missing reference or transactionId" },
        { status: 400 }
      );
    }

    // 1. Verify with Paystack API
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== "success") {
      // Update Firestore as failed
      await adminDb.collection("transactions").doc(transactionId).update({
        status: "failed",
        updatedAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json(
        { error: "Payment verification failed", details: paystackData.message },
        { status: 400 }
      );
    }

    // 2. Update Firestore transaction as verified
    const txRef = adminDb.collection("transactions").doc(transactionId);
    const txSnap = await txRef.get();

    if (!txSnap.exists) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const txData = txSnap.data()!;

    if (txData.status === "verified") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
      });
    }

    await txRef.update({
      status: "verified",
      paystackReference: reference,
      updatedAt: FieldValue.serverTimestamp(),
      receiptEmailSent: true,
    });

    if (txData.giveOptionId) {
      try {
        await adminDb.collection("give_options").doc(txData.giveOptionId).update({
          totalReceived: FieldValue.increment(Number(txData.amount))
        });
      } catch (e) {
        console.error("Failed to increment goal amount:", e);
      }
    }

    // 3. Send receipt email
    try {
      const { subject, html } = paymentReceiptVerified({
        name: txData.donorName,
        amount: formatNaira(txData.amount),
        giveTitle: txData.giveOptionTitle,
        method: "paystack",
        reference,
        date: new Date().toLocaleDateString("en-NG", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      await sendEmail({
        to: txData.donorEmail,
        subject,
        html,
      });
    } catch (emailErr) {
      console.error("Receipt email failed:", emailErr);
      // Don't fail the request — payment is still verified
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Give verify error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
