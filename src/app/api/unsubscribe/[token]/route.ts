import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const cfg = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
const app = getApps().length ? getApps()[0] : initializeApp(cfg);
const db = getFirestore(app);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const q = query(collection(db, "subscribers"), where("unsubscribeToken", "==", token));
    const snap = await getDocs(q);

    if (snap.empty) {
      return new NextResponse("<html><body style='font-family:sans-serif;text-align:center;padding:60px;'><h2>Link not found</h2><p>This unsubscribe link may have already been used.</p></body></html>", { headers: { "Content-Type": "text/html" } });
    }

    await updateDoc(doc(db, "subscribers", snap.docs[0].id), { isActive: false });

    return new NextResponse(`<html><body style="font-family:sans-serif;text-align:center;padding:60px;max-width:500px;margin:0 auto;"><div style="padding:16px;background:linear-gradient(135deg,#0A2D52,#1E9FD8);border-radius:12px;margin-bottom:24px;"><h2 style="color:#F0B429;margin:0;">HOLY SPIRIT CHAPEL</h2></div><h2 style="color:#0A2D52;">You have been unsubscribed</h2><p style="color:#64748B;">You will no longer receive emails from us. God bless you.</p><a href="/" style="color:#1E9FD8;">Return to website</a></body></html>`, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse("<html><body style='font-family:sans-serif;text-align:center;padding:60px;'><h2>Something went wrong</h2></body></html>", { headers: { "Content-Type": "text/html" }, status: 500 });
  }
}
