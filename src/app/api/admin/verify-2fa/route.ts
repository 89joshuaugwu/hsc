import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { uid, code } = await req.json();

    if (!uid || !code) {
      return NextResponse.json({ error: "Missing uid or code" }, { status: 400 });
    }

    const cookieHash = req.cookies.get("2fa_hash")?.value;
    if (!cookieHash) {
      return NextResponse.json({ error: "No 2FA code found or expired. Please request a new one." }, { status: 404 });
    }

    const [hash, expiresAtStr] = cookieHash.split(".");
    if (!hash || !expiresAtStr) {
      return NextResponse.json({ error: "Invalid 2FA token. Request a new one." }, { status: 400 });
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }

    const secret = process.env.ADMIN_SECRET || "fallback_secret_123";
    const expectedHash = crypto.createHmac("sha256", secret).update(code).digest("hex");

    if (hash !== expectedHash) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    
    // Clear 2FA hash cookie and set admin verified cookie
    response.cookies.delete("2fa_hash");
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
