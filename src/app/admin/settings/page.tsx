"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Save,
  Plus,
  Trash2,
  TestTube,
  Shield,
  CreditCard,
  Church,
  Mail,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GalleryUpload } from "@/components/admin/upload/GalleryUpload";
import Image from "next/image";

/* ─── Types ─── */
interface SettingsForm {
  chapelName: string;
  tagline: string;
  address: string;
  phones: { value: string }[];
  email: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
    tiktok: string;
    youtube: string;
    threads: string;
  };
  serviceTimes: { label: string; day: string; time: string }[];
  heroImages: { url: string; publicId: string; order: number }[];
  fellowshipImages: { url: string; publicId: string; order: number }[];
  missionStatement: string;
  visionStatement: string;
  scriptureVerse: string;
  scriptureReference: string;
  mapUrl: string;
}

interface EmailConfigForm {
  contactEmails: string;
  prayerEmail: string;
  paymentEmail: string;
}

/**
 * Admin Settings — Chapel Info, Email, 2FA, Paystack, Admin Users.
 */
export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Chapel Info form
  const chapelForm = useForm<SettingsForm>({
    defaultValues: {
      chapelName: "",
      tagline: "",
      address: "",
      phones: [{ value: "" }],
      email: "",
      socials: { facebook: "", instagram: "", twitter: "", whatsapp: "", tiktok: "", youtube: "", threads: "" },
      serviceTimes: [{ label: "", day: "", time: "" }],
      heroImages: [],
      fellowshipImages: [],
      missionStatement: "",
      visionStatement: "",
      scriptureVerse: "",
      scriptureReference: "",
      mapUrl: "",
    },
  });

  const { fields: phoneFields, append: addPhone, remove: removePhone } =
    useFieldArray({ control: chapelForm.control, name: "phones" });
  const { fields: stFields, append: addServiceTime, remove: removeServiceTime } =
    useFieldArray({ control: chapelForm.control, name: "serviceTimes" });
  const { fields: heroImageFields, append: addHeroImage, remove: removeHeroImage, swap: swapHeroImage } =
    useFieldArray({ control: chapelForm.control, name: "heroImages" });
  const { fields: fellowshipImageFields, append: addFellowshipImage, remove: removeFellowshipImage, swap: swapFellowshipImage } =
    useFieldArray({ control: chapelForm.control, name: "fellowshipImages" });

  // Email form
  const emailForm = useForm<EmailConfigForm>({
    defaultValues: { contactEmails: "", prayerEmail: "", paymentEmail: "" },
  });

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  // Paystack state
  const [paystackPublicKey, setPaystackPublicKey] = useState("");
  const [paystackMode, setPaystackMode] = useState<"test" | "live">("test");

  /* ── Load data ── */
  useEffect(() => {
    async function load() {
      try {
        // Chapel Info
        const infoSnap = await getDoc(doc(db, "chapel_info", "main"));
        if (infoSnap.exists()) {
          const d = infoSnap.data();
          chapelForm.reset({
            chapelName: d.chapelName || "",
            tagline: d.tagline || "",
            address: d.address || "",
            phones: (d.phone || [""]).map((p: string) => ({ value: p })),
            email: d.email || "",
            socials: { facebook: "", instagram: "", twitter: "", whatsapp: "", tiktok: "", youtube: "", threads: "", ...d.socials },
            serviceTimes: d.serviceTimes || [{ label: "", day: "", time: "" }],
            heroImages: d.heroImages || (d.heroImageUrl ? [{ url: d.heroImageUrl, publicId: d.heroImagePublicId || "", order: 0 }] : []),
            fellowshipImages: d.fellowshipImages || [],
            missionStatement: d.missionStatement || "",
            visionStatement: d.visionStatement || "",
            scriptureVerse: d.scriptureVerse || "",
            scriptureReference: d.scriptureReference || "",
            mapUrl: d.mapUrl || d.mapEmbedUrl || d.mapDirectionsUrl || "",
          });
        }

        // Admin Settings
        const settingsSnap = await getDoc(doc(db, "admin_settings", "config"));
        if (settingsSnap.exists()) {
          const s = settingsSnap.data();
          emailForm.reset({
            contactEmails: (s.contactEmails || []).join(", "),
            prayerEmail: s.prayerEmail || "",
            paymentEmail: s.paymentEmail || "",
          });
          setTwoFAEnabled(s.twoFAEnabled || false);
          setPaystackPublicKey(s.paystackPublicKey || "");
          setPaystackMode(s.paystackMode || "test");
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Save Chapel Info ── */
  const saveChapelInfo = async (data: SettingsForm) => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, "chapel_info", "main"),
        {
          chapelName: data.chapelName,
          tagline: data.tagline,
          address: data.address,
          phone: data.phones.map((p) => p.value).filter(Boolean),
          email: data.email,
          socials: data.socials,
          serviceTimes: data.serviceTimes,
          heroImages: data.heroImages.map((img, i) => ({ ...img, order: i })),
          fellowshipImages: data.fellowshipImages.map((img, i) => ({ ...img, order: i })),
          missionStatement: data.missionStatement,
          visionStatement: data.visionStatement,
          scriptureVerse: data.scriptureVerse,
          scriptureReference: data.scriptureReference,
          mapUrl: data.mapUrl,
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      );
      toast.success("Chapel info saved!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };



  /* ── Save Email Config ── */
  const saveEmailConfig = async (data: EmailConfigForm) => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, "admin_settings", "config"),
        {
          contactEmails: data.contactEmails.split(",").map((e) => e.trim()).filter(Boolean),
          prayerEmail: data.prayerEmail,
          paymentEmail: data.paymentEmail,
        },
        { merge: true }
      );
      toast.success("Email config saved!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Toggle 2FA ── */
  const toggle2FA = async () => {
    const newVal = !twoFAEnabled;
    try {
      await setDoc(doc(db, "admin_settings", "config"), { twoFAEnabled: newVal }, { merge: true });
      setTwoFAEnabled(newVal);
      toast.success(newVal ? "2FA enabled" : "2FA disabled");
    } catch {
      toast.error("Failed to update 2FA setting.");
    }
  };

  /* ── Save Paystack ── */
  const savePaystack = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, "admin_settings", "config"),
        { paystackPublicKey, paystackMode },
        { merge: true }
      );
      toast.success("Paystack config saved!");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Test Email ── */
  const [testingEmail, setTestingEmail] = useState(false);
  const sendTestEmail = async () => {
    setTestingEmail(true);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailForm.getValues("contactEmails").split(",")[0]?.trim() }),
      });
      if (res.ok) toast.success("Test email sent!");
      else toast.error("Failed to send test email.");
    } catch {
      toast.error("Failed to send test email.");
    } finally {
      setTestingEmail(false);
    }
  };

  const TABS = [
    { label: "Chapel Info", icon: Church },
    { label: "Email", icon: Mail },
    { label: "Two-Factor", icon: Shield },
    { label: "Paystack", icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-chapel-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Tab Bar ── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-body text-sm font-semibold whitespace-nowrap transition-all",
                activeTab === i
                  ? "bg-chapel-400 text-white"
                  : "bg-white border border-border/60 text-text-muted hover:text-navy-500"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab 0: Chapel Info ── */}
      {activeTab === 0 && (
        <form onSubmit={chapelForm.handleSubmit(saveChapelInfo)} className="bg-white rounded-xl border border-border/60 p-6 space-y-6">
          <h3 className="font-heading text-base font-bold text-navy-500">Chapel Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Chapel Name</label>
              <input {...chapelForm.register("chapelName")} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Tagline</label>
              <input {...chapelForm.register("tagline")} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-1">Address</label>
            <input {...chapelForm.register("address")} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>

          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-1">Google Maps URL</label>
            <input {...chapelForm.register("mapUrl")} placeholder="https://maps.google.com/maps?q=ESUT+Agbani+Enugu" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            <p className="font-body text-[11px] text-text-light mt-1">Used for both the embedded map and &quot;Get Directions&quot; button on the Contact page.</p>
          </div>

          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-1">Email</label>
            <input {...chapelForm.register("email")} type="email" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>

          {/* Phone numbers */}
          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-2">Phone Numbers</label>
            {phoneFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input {...chapelForm.register(`phones.${idx}.value`)} placeholder="Phone number" className="flex-1 px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
                {phoneFields.length > 1 && (
                  <button type="button" onClick={() => removePhone(idx)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addPhone({ value: "" })} className="inline-flex items-center gap-1 text-chapel-400 font-body text-xs font-semibold hover:text-chapel-500">
              <Plus size={12} /> Add Phone
            </button>
          </div>

          {/* Social Links */}
          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-2">Social Media</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input {...chapelForm.register("socials.facebook")} placeholder="Facebook URL" className="px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
              <input {...chapelForm.register("socials.instagram")} placeholder="Instagram URL" className="px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
              <input {...chapelForm.register("socials.tiktok")} placeholder="TikTok URL" className="px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
              <input {...chapelForm.register("socials.youtube")} placeholder="YouTube URL" className="px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
              <input {...chapelForm.register("socials.twitter")} placeholder="X/Twitter URL" className="px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
              <input {...chapelForm.register("socials.threads")} placeholder="Threads URL" className="px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
              <input {...chapelForm.register("socials.whatsapp")} placeholder="WhatsApp number" className="px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
          </div>

          {/* Service Times */}
          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-2">Service Times</label>
            {stFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input {...chapelForm.register(`serviceTimes.${idx}.label`)} placeholder="Label (e.g. Sunday Service)" className="flex-1 px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
                <input {...chapelForm.register(`serviceTimes.${idx}.day`)} placeholder="Day" className="w-28 px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
                <input {...chapelForm.register(`serviceTimes.${idx}.time`)} placeholder="Time" className="w-24 px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
                {stFields.length > 1 && (
                  <button type="button" onClick={() => removeServiceTime(idx)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addServiceTime({ label: "", day: "", time: "" })} className="inline-flex items-center gap-1 text-chapel-400 font-body text-xs font-semibold hover:text-chapel-500">
              <Plus size={12} /> Add Service Time
            </button>
          </div>

          {/* Hero Images */}
          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-2">Hero Images (Max 5)</label>
            <div className="space-y-3">
              {heroImageFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-3 bg-ivory/50 border border-border/40 p-2 rounded-lg">
                  <div className="relative w-24 h-14 bg-ivory-dark rounded overflow-hidden">
                    <Image src={chapelForm.watch(`heroImages.${idx}.url`)} alt={`Hero ${idx + 1}`} fill className="object-cover" />
                  </div>
                  <div className="flex-1 font-body text-xs text-text-muted font-semibold">Slide {idx + 1}</div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => swapHeroImage(idx, idx - 1)} disabled={idx === 0} className="p-1.5 rounded bg-white text-text-muted hover:text-chapel-400 disabled:opacity-30"><ArrowUp size={14}/></button>
                    <button type="button" onClick={() => swapHeroImage(idx, idx + 1)} disabled={idx === heroImageFields.length - 1} className="p-1.5 rounded bg-white text-text-muted hover:text-chapel-400 disabled:opacity-30"><ArrowDown size={14}/></button>
                    <button type="button" onClick={() => {
                      const publicId = chapelForm.getValues(`heroImages.${idx}.publicId`);
                      if (publicId) fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId }) });
                      removeHeroImage(idx);
                    }} className="p-1.5 rounded bg-white text-red-400 hover:text-red-600 ml-2"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>

            {heroImageFields.length < 5 && (
              <div className="mt-4">
                <GalleryUpload 
                  onUploadComplete={(items) => {
                    const remaining = 5 - heroImageFields.length;
                    items.slice(0, remaining).forEach(item => {
                      addHeroImage({ url: item.url, publicId: item.publicId, order: 0 });
                    });
                  }} 
                />
              </div>
            )}
            {heroImageFields.length === 0 && (
              <p className="font-body text-xs text-red-500 mt-2">At least 1 hero image is required.</p>
            )}
          </div>

          {/* Fellowship Images */}
          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-2">Fellowship Section Backgrounds (Max 5)</label>
            <div className="space-y-3">
              {fellowshipImageFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-3 bg-ivory/50 border border-border/40 p-2 rounded-lg">
                  <div className="relative w-24 h-14 bg-ivory-dark rounded overflow-hidden">
                    <Image src={chapelForm.watch(`fellowshipImages.${idx}.url`)} alt={`Fellowship ${idx + 1}`} fill className="object-cover" />
                  </div>
                  <div className="flex-1 font-body text-xs text-text-muted font-semibold">Image {idx + 1}</div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => swapFellowshipImage(idx, idx - 1)} disabled={idx === 0} className="p-1.5 rounded bg-white text-text-muted hover:text-chapel-400 disabled:opacity-30"><ArrowUp size={14}/></button>
                    <button type="button" onClick={() => swapFellowshipImage(idx, idx + 1)} disabled={idx === fellowshipImageFields.length - 1} className="p-1.5 rounded bg-white text-text-muted hover:text-chapel-400 disabled:opacity-30"><ArrowDown size={14}/></button>
                    <button type="button" onClick={() => {
                      const publicId = chapelForm.getValues(`fellowshipImages.${idx}.publicId`);
                      if (publicId) fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId }) });
                      removeFellowshipImage(idx);
                    }} className="p-1.5 rounded bg-white text-red-400 hover:text-red-600 ml-2"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>

            {fellowshipImageFields.length < 5 && (
              <div className="mt-4">
                <GalleryUpload 
                  onUploadComplete={(items) => {
                    const remaining = 5 - fellowshipImageFields.length;
                    items.slice(0, remaining).forEach(item => {
                      addFellowshipImage({ url: item.url, publicId: item.publicId, order: 0 });
                    });
                  }} 
                />
              </div>
            )}
          </div>

          {/* Mission / Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Mission Statement</label>
              <textarea {...chapelForm.register("missionStatement")} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Vision Statement</label>
              <textarea {...chapelForm.register("visionStatement")} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
          </div>

          {/* Scripture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Scripture Verse</label>
              <textarea {...chapelForm.register("scriptureVerse")} rows={2} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Reference</label>
              <input {...chapelForm.register("scriptureReference")} placeholder="e.g. Isaiah 60:1" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 transition-colors disabled:opacity-60">
            <Save size={16} />
            {saving ? "Saving..." : "Save Chapel Info"}
          </button>
        </form>
      )}

      {/* ── Tab 1: Email Config ── */}
      {activeTab === 1 && (
        <form onSubmit={emailForm.handleSubmit(saveEmailConfig)} className="bg-white rounded-xl border border-border/60 p-6 space-y-6">
          <h3 className="font-heading text-base font-bold text-navy-500">Email Configuration</h3>

          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-1">Contact Notification Emails (comma-separated)</label>
            <input {...emailForm.register("contactEmails")} placeholder="admin@church.com, pastor@church.com" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>
          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-1">Prayer Request Email</label>
            <input {...emailForm.register("prayerEmail")} type="email" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>
          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-1">Payment Notification Email</label>
            <input {...emailForm.register("paymentEmail")} type="email" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 transition-colors disabled:opacity-60">
              <Save size={16} />
              {saving ? "Saving..." : "Save Email Config"}
            </button>
            <button type="button" onClick={sendTestEmail} disabled={testingEmail} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-text-muted font-body text-sm font-semibold rounded-lg hover:bg-ivory transition-colors disabled:opacity-60">
              <TestTube size={16} />
              {testingEmail ? "Sending..." : "Test Email"}
            </button>
          </div>
        </form>
      )}

      {/* ── Tab 2: Two-Factor Auth ── */}
      {activeTab === 2 && (
        <div className="bg-white rounded-xl border border-border/60 p-6 space-y-6">
          <h3 className="font-heading text-base font-bold text-navy-500">Two-Factor Authentication</h3>
          <p className="font-body text-sm text-text-muted">
            When enabled, a 6-digit code will be sent to your admin email each time you log in.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={toggle2FA}
              className={cn(
                "relative w-14 h-7 rounded-full transition-colors",
                twoFAEnabled ? "bg-chapel-400" : "bg-gray-300"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
                  twoFAEnabled ? "left-8" : "left-1"
                )}
              />
            </button>
            <span className="font-body text-sm font-semibold text-navy-500">
              {twoFAEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      )}

      {/* ── Tab 3: Paystack ── */}
      {activeTab === 3 && (
        <div className="bg-white rounded-xl border border-border/60 p-6 space-y-6">
          <h3 className="font-heading text-base font-bold text-navy-500">Paystack Configuration</h3>
          <p className="font-body text-xs text-text-light">
            Note: The secret key is stored securely in environment variables and cannot be changed here.
          </p>

          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-1">Public Key</label>
            <input value={paystackPublicKey} onChange={(e) => setPaystackPublicKey(e.target.value)} placeholder="pk_test_..." className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm font-mono focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>

          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-2">Mode</label>
            <div className="flex gap-2">
              {(["test", "live"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaystackMode(mode)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-body text-sm font-semibold capitalize transition-all",
                    paystackMode === mode
                      ? mode === "live" ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                      : "bg-ivory-dark text-text-muted"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <button onClick={savePaystack} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 transition-colors disabled:opacity-60">
            <Save size={16} />
            {saving ? "Saving..." : "Save Paystack Config"}
          </button>
        </div>
      )}
    </div>
  );
}
