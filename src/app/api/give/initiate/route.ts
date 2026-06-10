import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { rateLimit } from "@/lib/rateLimit";

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
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
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

    const docRef = adminDb.collection("transactions").doc();
    const generatedReference = method === "paystack" ? `hsc_${docRef.id}_${Date.now()}` : null;

    await docRef.set({
      giveOptionId,
      giveOptionTitle: giveOptionTitle || "",
      donorName,
      donorEmail,
      donorPhone,
      amount: Number(amount), // stored in naira
      method,
      status: "pending",
      paystackReference: generatedReference,
      screenshotUrl: screenshotUrl || null,
      screenshotPublicId: screenshotPublicId || null,
      receiptEmailSent: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      transactionId: docRef.id,
      paystackReference: generatedReference,
    });
  } catch (error) {
    console.error("Give initiate error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
