"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  width?: number;
  height?: number;
}

const CATS = ["All", "Worship", "Community", "Youth", "Architecture", "Events"];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const [lb, setLb] = useState<number | null>(null);
  const heroRef = useRef(null);
  const heroIn = useInView(heroRef, { once: true });

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
        const s = await getDocs(q);
        setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryItem));
      } catch (e) { console.error("Gallery:", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = cat === "All" ? items : items.filter((i) => i.category?.toLowerCase() === cat.toLowerCase());

  const onKey = useCallback((e: KeyboardEvent) => {
    if (lb === null) return;
    if (e.key === "Escape") setLb(null);
    if (e.key === "ArrowLeft" && lb > 0) setLb(lb - 1);
    if (e.key === "ArrowRight" && lb < filtered.length - 1) setLb(lb + 1);
  }, [lb, filtered.length]);

  useEffect(() => { window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onKey]);

  return (
    <>
      <section ref={heroRef} className="relative pt-28 pb-14 md:pt-36 md:pb-18 bg-gradient-to-br from-navy-500 via-chapel-400 to-navy-700">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={heroIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="relative max-w-4xl mx-auto text-center px-4">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white">Our Community in Focus</h1>
          <p className="font-body text-base text-white/60 mt-3">Moments of worship, fellowship, and service</p>
        </motion.div>
        <div className="relative mt-10 max-w-3xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 justify-center scrollbar-hide">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn("px-4 py-2 rounded-full font-body text-sm font-semibold whitespace-nowrap transition-all", cat === c ? "bg-gold-500 text-navy-700" : "bg-white/10 text-white/70 hover:bg-white/20")}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="break-inside-avoid mb-3 rounded-xl bg-ivory-dark animate-pulse aspect-[3/4]" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20"><p className="font-body text-sm text-text-muted">No photos in this category yet.</p></div>
          ) : (
            <motion.div variants={stagger(0.04)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="columns-2 md:columns-3 lg:columns-4 gap-3">
              {filtered.map((item, idx) => (
                <motion.div key={item.id} variants={fadeUp} className="break-inside-avoid mb-3 rounded-xl overflow-hidden cursor-pointer group" onClick={() => setLb(idx)}>
                  <Image src={item.imageUrl} alt={item.caption || "Photo"} width={item.width || 400} height={item.height || 300} className="w-full h-auto transition-all duration-500 group-hover:brightness-110 group-hover:scale-[1.03]" sizes="(max-width:768px) 50vw, 25vw" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 bg-ivory text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-quote text-xl italic text-navy-500/70">&ldquo;Let everything that has breath praise the Lord.&rdquo;</p>
          <p className="font-display text-xs text-gold-600 tracking-[0.2em] mt-4">— PSALM 150:6</p>
        </div>
      </section>

      <AnimatePresence>
        {lb !== null && filtered[lb] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center" onClick={() => setLb(null)}>
            <button onClick={() => setLb(null)} className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"><X size={20} /></button>
            <span className="absolute top-4 right-4 z-10 font-body text-sm text-white/60">{lb + 1} / {filtered.length}</span>
            <button onClick={(e) => { e.stopPropagation(); if (navigator.share) navigator.share({ title: filtered[lb].caption, url: filtered[lb].imageUrl }); }} className="absolute top-4 right-20 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"><Share2 size={18} /></button>
            {lb > 0 && <button onClick={(e) => { e.stopPropagation(); setLb(lb - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronLeft size={24} /></button>}
            {lb < filtered.length - 1 && <button onClick={(e) => { e.stopPropagation(); setLb(lb + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight size={24} /></button>}
            <motion.div key={lb} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
              <Image src={filtered[lb].imageUrl} alt={filtered[lb].caption || ""} width={800} height={600} className="max-h-[85vh] w-auto object-contain rounded-lg" priority />
              {filtered[lb].caption && <p className="text-center font-body text-sm text-white/80 mt-4">{filtered[lb].caption}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
