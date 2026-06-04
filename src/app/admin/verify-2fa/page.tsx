"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;

export default function AdminVerify2FAPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1); // take only last char
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newDigits.every((d) => d) && newDigits.join("").length === CODE_LENGTH) {
      handleVerify(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (pasted.length === CODE_LENGTH) {
      const newDigits = pasted.split("");
      setDigits(newDigits);
      handleVerify(pasted);
      e.preventDefault();
    }
  };

  const handleVerify = async (code: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Session expired. Please log in again.");
      router.push("/admin/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, code }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Verified! Welcome back.");
        router.push("/admin");
      } else {
        toast.error(data.error || "Invalid code.");
        setDigits(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await fetch("/api/admin/send-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });
      toast.success("New code sent to your email!");
      setResendCooldown(60);
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-700 px-4">
      <div className="w-full max-w-sm text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-chapel-400/20 flex items-center justify-center mb-6">
          <Mail size={36} className="text-chapel-300" />
        </div>

        <h1 className="font-display text-xl font-bold text-white mb-2">
          Check Your Email
        </h1>
        <p className="font-body text-sm text-white/50 mb-8">
          Enter the 6-digit code sent to your admin email
        </p>

        {/* Code inputs */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={loading}
              className={cn(
                "w-12 h-14 text-center text-xl font-bold rounded-xl",
                "bg-white/10 border border-white/15 text-white",
                "focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50",
                "transition-all font-mono",
                loading && "opacity-50"
              )}
            />
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-white/50 mb-4">
            <Loader2 size={16} className="animate-spin" />
            <span className="font-body text-sm">Verifying...</span>
          </div>
        )}

        {/* Resend */}
        <div className="mb-6">
          {resendCooldown > 0 ? (
            <p className="font-body text-xs text-white/30">
              Resend code in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="font-body text-sm text-chapel-300 hover:text-chapel-200 font-semibold transition-colors"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Back to login */}
        <button
          onClick={() => router.push("/admin/login")}
          className="font-body text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
