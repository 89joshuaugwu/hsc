import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { sendEmail } from "@/lib/nodemailer";
import { paymentReceiptEmail } from "@/lib/email-templates";
import { formatNaira } from "@/lib/utils";
import crypto from "crypto";

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
 * POST /api/paystack/webhook
 *
 * Paystack sends webhook events here. We verify the signature,
 * then auto-mark the transaction as verified and send a receipt email.
 *
 * Only processes 'charge.success' events.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // 1. Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.warn("Paystack webhook: Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // 2. Only process successful charges
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const reference = event.data?.reference;
    if (!reference) {
      return NextResponse.json({ received: true });
    }

    // 3. Find matching transaction in Firestore
    const q = query(
      collection(db, "transactions"),
      where("paystackReference", "==", reference),
      where("status", "==", "pending")
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      // Transaction already verified or doesn't exist
      return NextResponse.json({ received: true });
    }

    const txDoc = snap.docs[0];
    const txData = txDoc.data();

    // 4. Update to verified
    await updateDoc(txDoc.ref, {
      status: "verified",
      updatedAt: Timestamp.now(),
      receiptEmailSent: true,
    });

    // 5. Send receipt email
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

      await sendEmail({ to: txData.donorEmail, subject, html });
    } catch (emailErr) {
      console.error("Webhook receipt email failed:", emailErr);
    }

    return NextResponse.json({ received: true, verified: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
