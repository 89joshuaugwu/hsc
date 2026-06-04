"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Check if 2FA is enabled
      const settingsSnap = await getDoc(doc(db, "admin_settings", "config"));
      const twoFAEnabled = settingsSnap.exists() && settingsSnap.data()?.twoFAEnabled;

      if (twoFAEnabled) {
        // Send 2FA code
        await fetch("/api/admin/send-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: cred.user.uid, email: cred.user.email }),
        });
        router.push("/admin/verify-2fa");
      } else {
        router.push("/admin");
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Login error:", error?.code, error?.message);
      if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password" || error?.code === "auth/user-not-found") {
        toast.error("Invalid credentials. Please try again.");
      } else if (error?.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error(`Login failed: ${error?.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-700 px-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #1E9FD8 1px, transparent 1px), radial-gradient(circle at 75% 75%, #1E9FD8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/clogo.png"
            alt="Chapel Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="font-display text-2xl font-bold text-gold-500">
            Chapel Admin
          </h1>
          <p className="font-body text-sm text-white/40 mt-1">
            Holy Spirit Chapel · ESUT Agbani
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleLogin}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-5"
        >
          <div>
            <label className="block font-body text-xs font-semibold text-white/60 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@hsc.org"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white font-body text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block font-body text-xs font-semibold text-white/60 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white font-body text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-3.5 rounded-xl font-body font-bold text-sm transition-all",
              "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-700",
              "hover:shadow-gold active:scale-[0.98]",
              loading && "opacity-60 cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center font-body text-[0.65rem] text-white/20 mt-6">
          Dominus Regnant · Arise, Shine
        </p>
      </div>
    </div>
  );
}
