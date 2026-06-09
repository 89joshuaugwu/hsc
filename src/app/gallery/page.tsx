"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { X, ChevronLeft, ChevronRight, Share2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryAlbum } from "@/types/chapel.types";

const CATS = ["All", "Worship", "Community", "Youth", "Architecture", "Events"];

// Helper component for auto-cycling slideshow
function AlbumCard({ album, onClick }: { album: GalleryAlbum; onClick: () => void }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (album.images.length <= 1) return;
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % album.images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [album.images.length]);

  return (
    <motion.div variants={fadeUp} className="break-inside-avoid mb-3 rounded-xl overflow-hidden cursor-pointer group relative" onClick={onClick}>
      <div className="relative aspect-[4/5] bg-ivory-dark w-full">
        {album.images.map((img, i) => (
          <Image
            key={img.publicId || i}
            src={img.url}
            alt={img.caption || album.title}
            fill
            className={cn(
              "object-cover transition-opacity duration-1000",
              i === idx ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ))}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        {/* Badges */}
        <span className="absolute top-2 left-2 bg-white/90 text-navy-500 text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
          {album.category}
        </span>
        <span className="absolute top-2 right-2 bg-black/60 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
          <Camera size={10} /> {album.imageCount}
        </span>
        
        {/* Dots */}
        {album.images.length > 1 && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5 px-4 z-10">
            {album.images.slice(0, 5).map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-full transition-all", i === idx % 5 ? "w-4 bg-white" : "w-1.5 bg-white/50")} />
            ))}
            {album.images.length > 5 && <span className="text-[0.5rem] text-white/80 font-bold ml-1">+{album.images.length - 5}</span>}
          </div>
        )}
        
        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h3 className="font-heading text-sm font-bold text-white leading-tight">{album.title}</h3>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  
  // Lightbox State
  const [lbAlbum, setLbAlbum] = useState<GalleryAlbum | null>(null);
  const [lbImgIdx, setLbImgIdx] = useState(0);
  
  const heroRef = useRef(null);
  const heroIn = useInView(heroRef, { once: true });
  
  // Touch support for swiping
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
        const s = await getDocs(q);
        setAlbums(s.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryAlbum));
      } catch (e) { console.error("Gallery:", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = cat === "All" ? albums : albums.filter((a) => a.category?.toLowerCase() === cat.toLowerCase());

  const onKey = useCallback((e: KeyboardEvent) => {
    if (!lbAlbum) return;
    if (e.key === "Escape") setLbAlbum(null);
    if (e.key === "ArrowLeft" && lbImgIdx > 0) setLbImgIdx(lbImgIdx - 1);
    if (e.key === "ArrowRight" && lbImgIdx < lbAlbum.images.length - 1) setLbImgIdx(lbImgIdx + 1);
  }, [lbAlbum, lbImgIdx]);

  useEffect(() => { window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onKey]);

  const openLightbox = (album: GalleryAlbum) => {
    setLbAlbum(album);
    setLbImgIdx(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !lbAlbum) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;
    
    if (diff > 50 && lbImgIdx < lbAlbum.images.length - 1) {
      setLbImgIdx(lbImgIdx + 1);
    } else if (diff < -50 && lbImgIdx > 0) {
      setLbImgIdx(lbImgIdx - 1);
    }
    touchStart.current = null;
  };

  return (
    <>
      <section ref={heroRef} className="relative pt-28 pb-14 md:pt-36 md:pb-18 bg-gradient-to-br from-navy-500 via-chapel-400 to-navy-700">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={heroIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="relative max-w-4xl mx-auto text-center px-4">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white">Our Community in Focus</h1>
          <p className="font-body text-base text-white/60 mt-3">Moments of worship, fellowship, and service</p>
        </motion.div>
        <div className="relative mt-10 max-w-3xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-start md:justify-center scrollbar-hide">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn("flex-shrink-0 px-4 py-2 rounded-full font-body text-sm font-semibold whitespace-nowrap transition-all", cat === c ? "bg-gold-500 text-navy-700" : "bg-white/10 text-white/70 hover:bg-white/20")}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="break-inside-avoid mb-3 rounded-xl bg-ivory-dark animate-pulse aspect-[4/5]" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20"><p className="font-body text-sm text-text-muted">No albums in this category yet.</p></div>
          ) : (
            <motion.div variants={stagger(0.04)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="columns-2 md:columns-3 lg:columns-4 gap-3">
              {filtered.map((album) => (
                <AlbumCard key={album.id} album={album} onClick={() => openLightbox(album)} />
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
        {lbAlbum && lbAlbum.images[lbImgIdx] && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col" 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold text-white">{lbAlbum.title}</span>
                <span className="font-body text-xs text-white/60">{lbImgIdx + 1} / {lbAlbum.images.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); if (navigator.share) navigator.share({ title: lbAlbum.title, url: lbAlbum.images[lbImgIdx].url }); }} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"><Share2 size={18} /></button>
                <button onClick={() => setLbAlbum(null)} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"><X size={20} /></button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              {lbImgIdx > 0 && <button onClick={(e) => { e.stopPropagation(); setLbImgIdx(lbImgIdx - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hidden md:block"><ChevronLeft size={24} /></button>}
              {lbImgIdx < lbAlbum.images.length - 1 && <button onClick={(e) => { e.stopPropagation(); setLbImgIdx(lbImgIdx + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hidden md:block"><ChevronRight size={24} /></button>}
              
              <motion.div key={lbImgIdx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="relative max-w-full max-h-[75vh] w-full h-full flex items-center justify-center">
                  <Image src={lbAlbum.images[lbImgIdx].url} alt="" fill className="object-contain" priority />
                </div>
                {lbAlbum.images[lbImgIdx].caption && <p className="text-center font-body text-sm text-white/80 mt-4 max-w-2xl mx-auto bg-black/40 px-4 py-2 rounded-lg">{lbAlbum.images[lbImgIdx].caption}</p>}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
