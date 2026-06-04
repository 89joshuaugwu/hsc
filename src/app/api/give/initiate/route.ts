import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

/* ── Ensure Firebase is initialized server-side ── */
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
 * POST /api/give/initiate
 *
 * Creates a pending transaction in Firestore before Paystack popup opens
 * or after bank transfer form submission.
 *
 * Body: { giveOptionId, giveOptionTitle, donorName, donorEmail, donorPhone,
 *         amount, method, paystackReference?, screenshotUrl?, screenshotPublicId? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      giveOptionId,
      giveOptionTitle,
      donorName,
      donorEmail,
      donorPhone,
      amount,
      method,
      paystackReference,
      screenshotUrl,
      screenshotPublicId,
    } = body;

    // Basic validation
    if (!giveOptionId || !donorName || !donorEmail || !donorPhone || !amount || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["paystack", "bank_transfer"].includes(method)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { error: "Minimum amount is ₦100" },
        { status: 400 }
      );
    }

    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, "transactions"), {
      giveOptionId,
      giveOptionTitle: giveOptionTitle || "",
      donorName,
      donorEmail,
      donorPhone,
      amount: Number(amount), // stored in naira
      method,
      status: "pending",
      paystackReference: paystackReference || null,
      screenshotUrl: screenshotUrl || null,
      screenshotPublicId: screenshotPublicId || null,
      receiptEmailSent: false,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      transactionId: docRef.id,
    });
  } catch (error) {
    console.error("Give initiate error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
