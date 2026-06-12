"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail as MailIcon, ExternalLink, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

interface ChapelContact { address: string; phone: string[]; email: string; socials: Record<string, string>; serviceTimes: { label: string; day: string; time: string }[]; mapUrl?: string; mapEmbedUrl?: string; mapDirectionsUrl?: string; }

/* ─── Inline SVG Social Icons ─── */
function FacebookIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>; }
function InstagramIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>; }
function TikTokIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.48a8.2 8.2 0 004.77 1.52V7.56a4.84 4.84 0 01-1-.87z"/></svg>; }
function YouTubeIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>; }
function TwitterIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function ThreadsIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007C5.461 23.956.057 18.529.006 11.806c-.003-.438.029-.879.087-1.313C.676 5.506 5.04 1.18 10.027.096c.544-.118 1.096-.053 1.553.178.458.232.817.622 1.005 1.1a1.69 1.69 0 01-.77 2.099 1.67 1.67 0 01-1.21.14 6.33 6.33 0 00-7.284 5.053 6.323 6.323 0 005.037 7.394 6.302 6.302 0 005.55-1.507 6.3 6.3 0 002.052-4.322 1.686 1.686 0 013.365.16c-.054.91-.24 1.807-.556 2.66a9.681 9.681 0 01-6.583 6.449Z"/></svg>; }
function WhatsAppIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>; }

/* Social icon config — ordered as requested */
const SOCIAL_CONFIG: { key: string; icon: React.FC; label: string; isWhatsApp?: boolean }[] = [
  { key: "facebook", icon: FacebookIcon, label: "Facebook" },
  { key: "instagram", icon: InstagramIcon, label: "Instagram" },
  { key: "tiktok", icon: TikTokIcon, label: "TikTok" },
  { key: "youtube", icon: YouTubeIcon, label: "YouTube" },
  { key: "twitter", icon: TwitterIcon, label: "X" },
  { key: "threads", icon: ThreadsIcon, label: "Threads" },
  { key: "whatsapp", icon: WhatsAppIcon, label: "WhatsApp", isWhatsApp: true },
];

export default function ContactPage() {
  const [tab, setTab] = useState(0);
  const [info, setInfo] = useState<ChapelContact | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await getDoc(doc(db, "chapel_info", "main"));
        if (s.exists()) setInfo(s.data() as ChapelContact);
      } catch (e) { console.error("Contact info:", e); }
    })();
  }, []);

  /* Derive map URLs from a single mapUrl field */
  const rawMapUrl = info?.mapUrl || info?.mapEmbedUrl || info?.mapDirectionsUrl || "";
  const embedUrl = rawMapUrl
    ? (rawMapUrl.includes("output=embed") ? rawMapUrl : `${rawMapUrl}${rawMapUrl.includes("?") ? "&" : "?"}output=embed`)
    : "https://maps.google.com/maps?q=ESUT+Agbani+Enugu&output=embed";
  const directionsUrl = rawMapUrl
    ? rawMapUrl.replace("&output=embed", "").replace("?output=embed", "")
    : "https://maps.google.com/?q=ESUT+Agbani+Enugu";

  return (
    <>
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-gradient-to-br from-navy-500 to-chapel-400 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white">We&apos;d Love to Hear From You</h1>
        <p className="font-body text-base text-white/60 mt-3">Reach out — we&apos;re here for you</p>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* LEFT: Forms */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-2 overflow-x-auto">
              {["Send a Message", "Prayer Request", "Subscribe"].map((t, i) => (
                <button key={t} onClick={() => setTab(i)} className={cn("px-4 py-2 rounded-lg font-body text-sm font-semibold whitespace-nowrap transition-all", tab === i ? "bg-chapel-400 text-white" : "bg-white border border-border/60 text-text-muted hover:text-navy-500")}>{t}</button>
              ))}
            </div>
            {tab === 0 && <ContactForm />}
            {tab === 1 && <PrayerForm />}
            {tab === 2 && <SubscribeForm />}
          </div>

          {/* RIGHT: Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-xl border border-border/60 p-6 space-y-4">
              <h3 className="font-heading text-base font-bold text-navy-500">Contact Details</h3>
              <div className="space-y-3 font-body text-sm text-text-muted">
                <div className="flex items-start gap-3"><MapPin size={16} className="text-chapel-400 mt-0.5 flex-shrink-0" /><span>{info?.address || "Holy Spirit Chapel, ESUT Agbani, Enugu State"}</span></div>
                {(info?.phone || []).map((p, i) => <div key={i} className="flex items-center gap-3"><Phone size={16} className="text-chapel-400 flex-shrink-0" /><a href={`tel:${p}`} className="hover:text-chapel-400 transition-colors">{p}</a></div>)}
                {info?.email && <div className="flex items-center gap-3"><MailIcon size={16} className="text-chapel-400 flex-shrink-0" /><a href={`mailto:${info.email}`} className="hover:text-chapel-400 transition-colors">{info.email}</a></div>}
              </div>

              {/* Social Icons */}
              {info?.socials && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SOCIAL_CONFIG.map(({ key, icon: Icon, label, isWhatsApp }) => {
                    const url = info.socials[key];
                    if (!url) return null;
                    const href = isWhatsApp ? `https://wa.me/${url}` : url;
                    return (
                      <a key={key} href={href} target="_blank" rel="noopener noreferrer" title={label} className="p-2.5 rounded-lg bg-chapel-400/10 text-chapel-400 hover:bg-chapel-400 hover:text-white transition-all duration-200">
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {info?.serviceTimes && info.serviceTimes.length > 0 && (
              <div className="bg-white rounded-xl border border-border/60 p-6">
                <h3 className="font-heading text-base font-bold text-navy-500 mb-3">Service Times</h3>
                <div className="space-y-2">
                  {info.serviceTimes.map((st, i) => (
                    <div key={i} className="flex justify-between font-body text-sm">
                      <span className="text-text-muted">{st.label}</span>
                      <span className="font-semibold text-navy-500">{st.day} · {st.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl overflow-hidden border border-border">
              <iframe src={embedUrl} width="100%" height="300" style={{ border: 0 }} loading="lazy" title="Chapel Location" />
            </div>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-full hover:bg-chapel-500 transition-colors w-full justify-center">
              <ExternalLink size={14} /> Get Directions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ name: string; email: string; subject: string; message: string }>();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data: { name: string; email: string; subject: string; message: string }) => {
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (r.ok) { setSent(true); reset(); } else toast.error("Failed to send message.");
    } catch { toast.error("Something went wrong."); }
  };

  if (sent) return (
    <div className="bg-white rounded-xl border border-border/60 p-8 text-center space-y-3">
      <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center"><Check size={28} className="text-green-600" /></div>
      <h3 className="font-heading text-lg font-bold text-navy-500">Message Sent!</h3>
      <p className="font-body text-sm text-text-muted">We&apos;ll respond within 24 hours.</p>
      <button onClick={() => setSent(false)} className="font-body text-sm text-chapel-400 font-semibold">Send another</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-border/60 p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Name</label><input {...register("name", { required: true })} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
        <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Email</label><input {...register("email", { required: true })} type="email" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
      </div>
      <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Subject</label>
        <select {...register("subject")} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30">
          <option value="General">General</option><option value="Prayer">Prayer</option><option value="Partnership">Partnership</option><option value="Other">Other</option>
        </select>
      </div>
      <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Message</label><textarea {...register("message", { required: true })} rows={4} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
      <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-60">{isSubmitting ? <><Loader2 size={16} className="animate-spin" />Sending...</> : "Send Message"}</button>
    </form>
  );
}

function PrayerForm() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ name: string; email: string; topic: string; request: string; isPrivate: boolean }>();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data: { name: string; email: string; topic: string; request: string; isPrivate: boolean }) => {
    try {
      const r = await fetch("/api/prayer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (r.ok) { setSent(true); reset(); } else toast.error("Failed to submit.");
    } catch { toast.error("Something went wrong."); }
  };

  if (sent) return (
    <div className="bg-white rounded-xl border border-border/60 p-8 text-center space-y-3">
      <div className="w-14 h-14 mx-auto rounded-full bg-chapel-400/10 flex items-center justify-center"><Check size={28} className="text-chapel-400" /></div>
      <h3 className="font-heading text-lg font-bold text-navy-500">Prayer Request Received</h3>
      <p className="font-body text-sm text-text-muted">Our prayer team will intercede for you.</p>
      <button onClick={() => setSent(false)} className="font-body text-sm text-chapel-400 font-semibold">Submit another</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-border/60 p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Name</label><input {...register("name", { required: true })} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
        <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Email</label><input {...register("email", { required: true })} type="email" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
      </div>
      <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Prayer Topic</label><input {...register("topic", { required: true })} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
      <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Request</label><textarea {...register("request", { required: true })} rows={4} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
      <label className="flex items-center gap-2 font-body text-sm text-text-muted"><input type="checkbox" {...register("isPrivate")} className="rounded" />Keep this private</label>
      <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-60">{isSubmitting ? <><Loader2 size={16} className="animate-spin" />Submitting...</> : "Submit Prayer"}</button>
    </form>
  );
}

function SubscribeForm() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ name: string; email: string }>();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data: { name: string; email: string }) => {
    try {
      const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, source: "contact_page" }) });
      const j = await r.json();
      if (r.ok) { setSent(true); reset(); } else toast.error(j.error || "Failed.");
    } catch { toast.error("Something went wrong."); }
  };

  if (sent) return (
    <div className="bg-white rounded-xl border border-border/60 p-8 text-center space-y-3">
      <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center"><Check size={28} className="text-green-600" /></div>
      <h3 className="font-heading text-lg font-bold text-navy-500">Subscribed!</h3>
      <p className="font-body text-sm text-text-muted">Welcome to the Holy Spirit Chapel family.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-border/60 p-6 space-y-4">
      <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Name</label><input {...register("name", { required: true, minLength: 2 })} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
      <div><label className="block font-body text-xs font-semibold text-text-muted mb-1">Email</label><input {...register("email", { required: true })} type="email" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" /></div>
      <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-60">{isSubmitting ? <><Loader2 size={16} className="animate-spin" />Subscribing...</> : "Subscribe"}</button>
    </form>
  );
}
