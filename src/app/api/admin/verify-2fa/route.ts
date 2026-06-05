import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { uid, code } = await req.json();

    if (!uid || !code) {
      return NextResponse.json({ error: "Missing uid or code" }, { status: 400 });
    }

    const docRef = adminDb.collection("admin_2fa").doc(uid);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "No 2FA code found. Please request a new one." }, { status: 404 });
    }

    const data = snap.data();

    if (data?.used) {
      return NextResponse.json({ error: "Code already used. Request a new one." }, { status: 400 });
    }

    const expiresAt = data?.expiresAt?.toDate?.() || new Date(data?.expiresAt?._seconds * 1000);
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }

    if (data?.code !== code) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    await docRef.update({ used: true });

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
