import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { sendEmail } from "@/lib/nodemailer";
import { paymentReceiptEmail } from "@/lib/email-templates";
import { formatNaira } from "@/lib/utils";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

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
      await updateDoc(doc(db, "transactions", transactionId), {
        status: "failed",
        updatedAt: Timestamp.now(),
      });
      return NextResponse.json(
        { error: "Payment verification failed", details: paystackData.message },
        { status: 400 }
      );
    }

    // 2. Update Firestore transaction as verified
    const txRef = doc(db, "transactions", transactionId);
    const txSnap = await getDoc(txRef);

    if (!txSnap.exists()) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    const txData = txSnap.data();

    await updateDoc(txRef, {
      status: "verified",
      paystackReference: reference,
      updatedAt: Timestamp.now(),
      receiptEmailSent: true,
    });

    // 3. Send receipt email
    try {
      const { subject, html } = paymentReceiptEmail({
        name: txData.donorName,
        amount: formatNaira(txData.amount),
        giveTitle: txData.giveOptionTitle,
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
