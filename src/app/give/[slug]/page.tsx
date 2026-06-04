"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Copy, Check, Upload, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";
import type { GiveOption, BankAccount } from "@/types/chapel.types";

/* ─── Quick amount pills ─── */
const QUICK_AMOUNTS = [1000, 2000, 5000, 10000];

/* ─── Payment method tabs ─── */
type PaymentTab = "paystack" | "bank_transfer";

export default function GiveSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [option, setOption] = useState<GiveOption | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [activeTab, setActiveTab] = useState<PaymentTab>("paystack");
  const [processing, setProcessing] = useState(false);

  // Bank transfer state
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [screenshotPublicId, setScreenshotPublicId] = useState("");
  const [uploading, setUploading] = useState(false);

  // Success state
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Clipboard state
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  /* ── Fetch give option by slug ── */
  useEffect(() => {
    async function fetchOption() {
      try {
        const q = query(
          collection(db, "give_options"),
          where("slug", "==", slug),
          where("isActive", "==", true)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setOption({ id: snap.docs[0].id, ...snap.docs[0].data() } as GiveOption);
        }
      } catch (error) {
        console.error("Failed to fetch give option:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchOption();
  }, [slug]);

  /* ── Set default tab based on enabled methods ── */
  useEffect(() => {
    if (option) {
      if (option.paystackEnabled) setActiveTab("paystack");
      else if (option.bankTransferEnabled) setActiveTab("bank_transfer");
    }
  }, [option]);

  /* ── Validate form ── */
  const isFormValid = name.trim() && email.trim() && phone.trim() && amount && Number(amount) >= 100;

  /* ── Copy account number ── */
  const copyToClipboard = useCallback((text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Account number copied!");
    setTimeout(() => setCopiedIdx(null), 2000);
  }, []);

  /* ── Upload screenshot to Cloudinary ── */
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "hsc_uploads");
      formData.append("folder", "hsc/payment-proofs");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        setScreenshotUrl(data.secure_url);
        setScreenshotPublicId(data.public_id);
        toast.success("Screenshot uploaded!");
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      toast.error("Failed to upload screenshot. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ── Pay with Paystack ── */
  const handlePaystack = async () => {
    if (!isFormValid || !option) return;
    setProcessing(true);

    try {
      // 1. Initiate transaction in Firestore
      const initRes = await fetch("/api/give/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giveOptionId: option.id,
          giveOptionTitle: option.title,
          donorName: name.trim(),
          donorEmail: email.trim(),
          donorPhone: phone.trim(),
          amount: Number(amount),
          method: "paystack",
        }),
      });
      const initData = await initRes.json();
      if (!initRes.ok) throw new Error(initData.error);

      const txId = initData.transactionId;
      const reference = `hsc_${txId}_${Date.now()}`;

      // Update transaction with reference
      await fetch("/api/give/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giveOptionId: option.id,
          giveOptionTitle: option.title,
          donorName: name.trim(),
          donorEmail: email.trim(),
          donorPhone: phone.trim(),
          amount: Number(amount),
          method: "paystack",
          paystackReference: reference,
        }),
      });

      // 2. Open Paystack popup
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: email.trim(),
        amount: Number(amount) * 100, // Convert naira to kobo
        currency: "NGN",
        ref: reference,
        metadata: {
          custom_fields: [
            { display_name: "Donor Name", variable_name: "donor_name", value: name.trim() },
            { display_name: "Phone", variable_name: "phone", value: phone.trim() },
            { display_name: "Give Type", variable_name: "give_type", value: option.title },
          ],
        },
        onSuccess: async (transaction: { reference: string }) => {
          // 3. Verify with backend
          try {
            await fetch("/api/give/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: transaction.reference,
                transactionId: txId,
              }),
            });
            setTransactionId(txId);
            setSuccess(true);
            toast.success("Payment successful! God bless you.");
          } catch {
            toast.error("Payment received but verification pending.");
          }
          setProcessing(false);
        },
        onCancel: () => {
          toast.info("Payment cancelled.");
          setProcessing(false);
        },
      });
    } catch (error) {
      console.error("Paystack error:", error);
      toast.error("Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  /* ── Submit bank transfer ── */
  const handleBankTransfer = async () => {
    if (!isFormValid || !option || !screenshotUrl) return;
    setProcessing(true);

    try {
      const res = await fetch("/api/give/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giveOptionId: option.id,
          giveOptionTitle: option.title,
          donorName: name.trim(),
          donorEmail: email.trim(),
          donorPhone: phone.trim(),
          amount: Number(amount),
          method: "bank_transfer",
          screenshotUrl,
          screenshotPublicId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTransactionId(data.transactionId);
      setSuccess(true);
      toast.success("Submission received! We'll verify shortly.");
    } catch (error) {
      console.error("Bank transfer error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 animate-pulse space-y-8">
          <div className="h-8 w-40 bg-ivory-dark rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="aspect-video bg-ivory-dark rounded-xl" />
              <div className="h-8 w-64 bg-ivory-dark rounded" />
              <div className="h-4 w-full bg-ivory-dark rounded" />
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-ivory-dark rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── 404 state ── */
  if (!option) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl text-navy-500">Not Found</h1>
          <p className="font-body text-text-muted">This give option doesn&apos;t exist.</p>
          <button
            onClick={() => router.push("/give")}
            className="font-body text-sm font-semibold text-chapel-400 hover:text-chapel-500"
          >
            ← Back to Give
          </button>
        </div>
      </div>
    );
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-chapel"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="font-heading text-2xl text-navy-500 font-bold">
            {activeTab === "paystack" ? "Payment Successful!" : "Submission Received!"}
          </h2>
          <p className="font-body text-sm text-text-muted">
            {activeTab === "paystack"
              ? "Your offering has been received and verified. A receipt has been sent to your email."
              : "Your bank transfer proof has been submitted. You'll receive a confirmation email once verified."}
          </p>
          <div className="bg-ivory rounded-xl p-4 space-y-2 text-left">
            <div className="flex justify-between">
              <span className="font-body text-xs text-text-light">Amount</span>
              <span className="font-body text-sm font-bold text-navy-500">{formatNaira(Number(amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-xs text-text-light">Type</span>
              <span className="font-body text-sm text-navy-500">{option.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-xs text-text-light">Tracking ID</span>
              <span className="font-body text-xs text-text-muted font-mono">{transactionId}</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/give")}
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-chapel-400 hover:text-chapel-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Give
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* ── Back link ── */}
      <div className="pt-24 md:pt-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/give")}
          className="inline-flex items-center gap-2 font-body text-sm font-semibold text-text-muted hover:text-chapel-400 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          All Give Options
        </button>
      </div>

      {/* ── Two-column layout ── */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger(0.15)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
          >
            {/* ── LEFT: Form (60%) ── */}
            <motion.div variants={fadeUp} className="lg:col-span-3 space-y-8">
              {/* Cover image */}
              {option.coverImageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={option.coverImageUrl}
                    alt={option.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                </div>
              )}

              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-navy-500">
                  {option.title}
                </h1>
                <p className="font-body text-sm text-text-muted mt-2 leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* ── Quick amount pills ── */}
              <div>
                <label className="block font-body text-sm font-semibold text-navy-500 mb-3">
                  Select Amount
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={cn(
                        "px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-all",
                        amount === amt
                          ? "bg-gold-500 text-navy-700 shadow-gold"
                          : "bg-ivory-dark text-text-muted hover:bg-gold-500/20 hover:text-navy-500"
                      )}
                    >
                      {formatNaira(amt)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom amount (₦)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  min={100}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border border-border",
                    "font-body text-sm text-text placeholder-text-light",
                    "focus:outline-none focus:ring-2 focus:ring-chapel-400/30 focus:border-chapel-400",
                    "transition-all bg-white"
                  )}
                />
              </div>

              {/* ── Donor form ── */}
              <div className="space-y-4">
                <label className="block font-body text-sm font-semibold text-navy-500">
                  Your Information
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-chapel-400/30 focus:border-chapel-400 transition-all bg-white"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-chapel-400/30 focus:border-chapel-400 transition-all bg-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border font-body text-sm text-text placeholder-text-light focus:outline-none focus:ring-2 focus:ring-chapel-400/30 focus:border-chapel-400 transition-all bg-white"
                />
              </div>

              {/* ── Payment Method Tabs ── */}
              <div>
                <label className="block font-body text-sm font-semibold text-navy-500 mb-3">
                  Payment Method
                </label>
                <div className="flex gap-2 mb-6">
                  {option.paystackEnabled && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("paystack")}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-body text-sm font-semibold transition-all text-center",
                        activeTab === "paystack"
                          ? "bg-chapel-400 text-white shadow-sm"
                          : "bg-ivory-dark text-text-muted hover:bg-chapel-50"
                      )}
                    >
                      Pay with Paystack
                    </button>
                  )}
                  {option.bankTransferEnabled && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("bank_transfer")}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-body text-sm font-semibold transition-all text-center",
                        activeTab === "bank_transfer"
                          ? "bg-chapel-400 text-white shadow-sm"
                          : "bg-ivory-dark text-text-muted hover:bg-chapel-50"
                      )}
                    >
                      Bank Transfer
                    </button>
                  )}
                </div>

                {/* ── PAYSTACK TAB ── */}
                {activeTab === "paystack" && option.paystackEnabled && (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handlePaystack}
                      disabled={!isFormValid || processing}
                      className={cn(
                        "w-full py-4 rounded-xl font-body font-bold text-base transition-all",
                        "bg-gradient-to-r from-chapel-400 to-chapel-500 text-white",
                        "hover:shadow-chapel active:scale-[0.98]",
                        (!isFormValid || processing) && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      {processing ? "Processing..." : `Pay ${amount ? formatNaira(Number(amount)) : ""} with Paystack`}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-text-light">
                      <Shield size={14} />
                      <span className="font-body text-xs">Secured by Paystack</span>
                    </div>
                  </div>
                )}

                {/* ── BANK TRANSFER TAB ── */}
                {activeTab === "bank_transfer" && option.bankTransferEnabled && (
                  <div className="space-y-6">
                    {/* Bank accounts */}
                    <div className="space-y-3">
                      <p className="font-body text-sm text-text-muted">
                        Transfer to any of the following accounts:
                      </p>
                      {option.bankAccounts?.map((acc: BankAccount, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-ivory rounded-xl border border-border/60 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-body text-xs text-text-light uppercase tracking-wider">
                              {acc.bankName}
                            </span>
                            <button
                              onClick={() => copyToClipboard(acc.accountNumber, idx)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-border text-xs font-body font-semibold text-text-muted hover:text-chapel-400 transition-colors"
                            >
                              {copiedIdx === idx ? (
                                <>
                                  <Check size={12} className="text-green-500" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <p className="font-body text-lg font-bold text-navy-500 font-mono tracking-wider">
                            {acc.accountNumber}
                          </p>
                          <p className="font-body text-sm text-text-muted">
                            {acc.accountName}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Screenshot upload */}
                    <div>
                      <label className="block font-body text-sm font-semibold text-navy-500 mb-2">
                        Upload Payment Proof
                      </label>
                      {screenshotUrl ? (
                        <div className="relative rounded-xl overflow-hidden border border-green-200 bg-green-50 p-4">
                          <div className="flex items-center gap-3">
                            <Check size={20} className="text-green-600 flex-shrink-0" />
                            <span className="font-body text-sm text-green-700 font-semibold">
                              Screenshot uploaded successfully
                            </span>
                          </div>
                          <button
                            onClick={() => { setScreenshotUrl(""); setScreenshotPublicId(""); }}
                            className="mt-2 font-body text-xs text-green-600 hover:text-green-800 underline"
                          >
                            Replace screenshot
                          </button>
                        </div>
                      ) : (
                        <label
                          className={cn(
                            "flex flex-col items-center justify-center gap-3 p-8",
                            "border-2 border-dashed border-border rounded-xl cursor-pointer",
                            "hover:border-chapel-400 hover:bg-chapel-50/30 transition-all",
                            uploading && "opacity-60 pointer-events-none"
                          )}
                        >
                          <Upload size={24} className="text-text-light" />
                          <span className="font-body text-sm text-text-muted text-center">
                            {uploading ? "Uploading..." : "Click to upload payment screenshot"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleScreenshotUpload}
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>

                    {/* Submit bank transfer */}
                    <button
                      type="button"
                      onClick={handleBankTransfer}
                      disabled={!isFormValid || !screenshotUrl || processing}
                      className={cn(
                        "w-full py-4 rounded-xl font-body font-bold text-base transition-all",
                        "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-700",
                        "hover:shadow-gold active:scale-[0.98]",
                        (!isFormValid || !screenshotUrl || processing) && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      {processing ? "Submitting..." : "Submit for Verification"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── RIGHT: Summary sidebar (40%) ── */}
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <div className="sticky top-28 space-y-6">
                {/* Summary card */}
                <div className="bg-white rounded-xl border border-border/60 p-6 space-y-4 shadow-sm">
                  <h3 className="font-heading text-base font-bold text-navy-500">
                    Give Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-text-muted">Type</span>
                      <span className="font-body text-sm font-semibold text-navy-500">{option.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-text-muted">Amount</span>
                      <span className="font-body text-lg font-bold text-gold-600">
                        {amount ? formatNaira(Number(amount)) : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-text-muted">Method</span>
                      <span className="font-body text-sm text-navy-500 capitalize">
                        {activeTab === "paystack" ? "Paystack" : "Bank Transfer"}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center gap-2 text-text-light">
                    <Shield size={14} />
                    <span className="font-body text-xs">Your information is secure</span>
                  </div>
                </div>

                {/* Progress bar (if goal set) */}
                {option.goalAmount && option.goalAmount > 0 && (
                  <div className="bg-white rounded-xl border border-border/60 p-6 space-y-3">
                    <h3 className="font-heading text-sm font-bold text-navy-500">
                      Progress
                    </h3>
                    <div className="h-3 bg-ivory-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            (option.totalReceived / option.goalAmount) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between font-body text-xs text-text-muted">
                      <span>₦{option.totalReceived.toLocaleString()} raised</span>
                      <span>₦{option.goalAmount.toLocaleString()} goal</span>
                    </div>
                  </div>
                )}

                {/* Scripture */}
                <div className="bg-ivory-dark rounded-xl p-6">
                  <p className="font-quote text-base italic text-navy-500/70 leading-relaxed">
                    &ldquo;Remember this: Whoever sows sparingly will also reap
                    sparingly, and whoever sows generously will also reap
                    generously.&rdquo;
                  </p>
                  <p className="font-display text-xs text-gold-600 mt-3 tracking-widest">
                    — 2 CORINTHIANS 9:6
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
