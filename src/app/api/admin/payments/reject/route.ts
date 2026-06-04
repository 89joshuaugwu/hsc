import { NextRequest, NextResponse } from "next/server";
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { sendEmail } from "@/lib/nodemailer";

const cfg = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
const app = getApps().length ? getApps()[0] : initializeApp(cfg);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { transactionId, reason } = await req.json();
    if (!transactionId || !reason) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const txRef = doc(db, "transactions", transactionId);
    const txSnap = await getDoc(txRef);
    if (!txSnap.exists()) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const tx = txSnap.data();
    await updateDoc(txRef, { status: "rejected", rejectionReason: reason, rejectedAt: Timestamp.now() });

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
