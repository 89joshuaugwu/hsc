"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * FooterSubscribe — Name + Email subscribe form.
 * Used in Footer and Contact page.
 * On submit: POST /api/subscribe → Firestore write to `subscribers` collection.
 */
export function FooterSubscribe({ className }: { className?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), source: "footer" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setName("");
      setEmail("");

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to subscribe");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  if (status === "success") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 text-green-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-body font-semibold text-sm">You&apos;re in! God bless you.</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-colors"
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "w-full px-4 py-2.5 rounded-lg font-body font-bold text-sm transition-all",
          "bg-gold-500 text-navy-700 hover:bg-gold-400 active:scale-[0.98]",
          status === "loading" && "opacity-70 cursor-not-allowed"
        )}
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>

      {status === "error" && (
        <p className="text-red-400 text-xs font-body">{errorMsg}</p>
      )}
    </form>
  );
}
