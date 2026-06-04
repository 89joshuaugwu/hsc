"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail as MailIcon, ExternalLink, Check, Loader2, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

interface ChapelContact { address: string; phone: string[]; email: string; socials: Record<string, string>; serviceTimes: { label: string; day: string; time: string }[]; }

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
                {(info?.phone || []).map((p, i) => <div key={i} className="flex items-center gap-3"><Phone size={16} className="text-chapel-400 flex-shrink-0" /><span>{p}</span></div>)}
                {info?.email && <div className="flex items-center gap-3"><MailIcon size={16} className="text-chapel-400 flex-shrink-0" /><span>{info.email}</span></div>}
              </div>
              {info?.socials && (
                <div className="flex gap-3 pt-2">
                  {info.socials.facebook && <a href={info.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-chapel-400/10 text-chapel-400 hover:bg-chapel-400/20"><Globe size={16} /></a>}
                  {info.socials.instagram && <a href={info.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-chapel-400/10 text-chapel-400 hover:bg-chapel-400/20"><Globe size={16} /></a>}
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
              <iframe src="https://maps.google.com/maps?q=ESUT+Agbani+Enugu&output=embed" width="100%" height="300" style={{ border: 0 }} loading="lazy" title="Chapel Location" />
            </div>
            <a href="https://maps.google.com/?q=ESUT+Agbani+Enugu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-full hover:bg-chapel-500 transition-colors w-full justify-center">
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
