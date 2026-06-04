import { NextRequest, NextResponse } from "next/server";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

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
 * POST /api/admin/verify-2fa
 * Validates the 6-digit code against Firestore.
 * Body: { uid, code }
 */
export async function POST(req: NextRequest) {
  try {
    const { uid, code } = await req.json();

    if (!uid || !code) {
      return NextResponse.json({ error: "Missing uid or code" }, { status: 400 });
    }

    const docRef = doc(db, "admin_2fa", uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: "No 2FA code found. Please request a new one." }, { status: 404 });
    }

    const data = snap.data();

    // Check if already used
    if (data.used) {
      return NextResponse.json({ error: "Code already used. Request a new one." }, { status: 400 });
    }

    // Check expiry
    const expiresAt = data.expiresAt?.toDate?.();
    if (expiresAt && expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }

    // Check code match
    if (data.code !== code) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    // Mark as used
    await updateDoc(docRef, { used: true });

    // Set admin verified cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify 2FA error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
