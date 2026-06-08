"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LiveBadge } from "@/components/layout/LiveBadge";
import { fadeUp, fadeIn, heroReveal, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ─── Generate particle positions at build time ─── */
interface Particle {
  id: number;
  size: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  opacity: number;
  color: string;
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const isGold = i % 3 === 0;
    particles.push({
      id: i,
      size: 3 + (i % 5) * 1.2,            // 3px–8px
      left: `${5 + (i * 6.1) % 90}%`,      // spread across width
      top: `${10 + (i * 5.3) % 80}%`,       // spread across height
      delay: `${(i * 0.7) % 6}s`,           // stagger animation start
      duration: `${4 + (i % 4) * 2}s`,      // 4–10s float cycle
      opacity: 0.15 + (i % 5) * 0.1,        // 0.15–0.55
      color: isGold ? "#F0B429" : "#ffffff",
    });
  }
  return particles;
}

const PARTICLES = generateParticles(16);

/**
 * HeroSection — Holy Spirit Chapel Homepage Hero
 *
 * Full viewport height with admin-uploaded background image or
 * fallback gradient. Features floating particles, SVG cross,
 * radial glow, and staggered Framer Motion text entrance.
 */
export function HeroSection() {
  const [heroImages, setHeroImages] = useState<Array<{url: string, publicId: string, order: number}>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tagline, setTagline] = useState(
    "A vibrant Anglican community of faith, worship, and fellowship at Enugu State University of Technology."
  );

  /* ── Fetch hero image and tagline from Firestore ── */
  useEffect(() => {
    async function fetchHeroData() {
      try {
        const snap = await getDoc(doc(db, "chapel_info", "main"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.heroImages && data.heroImages.length > 0) {
            setHeroImages(data.heroImages.sort((a: any, b: any) => a.order - b.order));
          } else if (data.heroImageUrl) {
            setHeroImages([{ url: data.heroImageUrl, publicId: "", order: 0 }]);
          }
          if (data.tagline) setTagline(data.tagline);
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHeroData();
  }, []);

  /* ── Slideshow Logic ── */
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background: Image or Gradient ── */}
      <div className="absolute inset-0 z-0 bg-chapel-gradient overflow-hidden group/hero">
        <div className={cn("absolute inset-0 transition-opacity duration-500", isLoading ? "opacity-0" : "opacity-100")}>
          {heroImages.map((image, index) => (
            <div
              key={image.publicId || index}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: index === currentIndex ? 1 : 0 }}
            >
              <Image
                src={image.url}
                alt={`Hero slide ${index + 1}`}
                fill
                className={cn("object-cover", index === currentIndex ? "hero-slide-active" : "")}
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Hero overlay gradient */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,45,82,0.7) 0%, rgba(10,45,82,0.4) 50%, rgba(10,45,82,0.8) 100%)",
          }}
        />

        {/* Slide Navigation Arrows */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 opacity-0 group-hover/hero:opacity-100 transition-opacity hidden md:block"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 opacity-0 group-hover/hero:opacity-100 transition-opacity hidden md:block"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* ── Radial Glow (top center) ── */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,159,216,0.15) 0%, transparent 70%)",
        }}
      />

      {/* ── SVG Cross (centered, behind content) ── */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          className="w-[320px] h-[320px] md:w-[480px] md:h-[480px] lg:w-[560px] lg:h-[560px] opacity-[0.04]"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        >
          {/* Vertical bar */}
          <rect x="85" y="20" width="30" height="160" rx="4" />
          {/* Horizontal bar */}
          <rect x="30" y="60" width="140" height="30" rx="4" />
          {/* Radiating lines */}
          <line x1="100" y1="0" x2="100" y2="15" strokeWidth="0.5" />
          <line x1="100" y1="185" x2="100" y2="200" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="20" y2="75" strokeWidth="0.5" />
          <line x1="180" y1="75" x2="200" y2="75" strokeWidth="0.5" />
          {/* Diagonal rays */}
          <line x1="35" y1="20" x2="55" y2="40" strokeWidth="0.5" />
          <line x1="165" y1="20" x2="145" y2="40" strokeWidth="0.5" />
          <line x1="35" y1="130" x2="55" y2="110" strokeWidth="0.5" />
          <line x1="165" y1="130" x2="145" y2="110" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ── Floating Particles ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-float"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
              backgroundColor: p.color,
              opacity: p.opacity,
              animationDelay: p.delay,
              animationDuration: p.duration,
              filter: `blur(${p.size > 5 ? 1 : 0}px)`,
            }}
          />
        ))}
      </div>

      {/* ── Main Content ── */}
      {isLoading ? (
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center gap-6 w-full opacity-50 animate-pulse">
          <div className="w-24 h-6 bg-white/20 rounded-full" />
          <div className="w-48 h-4 bg-white/20 rounded" />
          <div className="w-3/4 max-w-lg h-16 sm:h-24 bg-white/20 rounded-lg" />
          <div className="w-1/2 max-w-sm h-6 sm:h-8 bg-white/20 rounded" />
          <div className="w-24 h-px bg-gold-500/50 my-6" />
          <div className="w-full max-w-xl h-12 bg-white/20 rounded" />
          <div className="flex gap-4 mt-10">
            <div className="w-40 h-12 bg-white/20 rounded-full" />
            <div className="w-40 h-12 bg-white/20 rounded-full" />
          </div>
        </div>
      ) : (
        <motion.div
          variants={stagger(0.2)}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
        >
          {/* LiveBadge — shown only when admin is live */}
          <motion.div variants={fadeIn} className="mb-4">
            <LiveBadge className="mx-auto" />
          </motion.div>

          {/* Motto Badge */}
          <motion.p
            variants={fadeIn}
            className="font-display text-[0.7rem] sm:text-xs tracking-[0.3em] text-gold-500 uppercase mb-6"
          >
            Dominus Regnant · Arise, Shine
          </motion.p>

          {/* Chapel Name */}
          <motion.h1
            variants={heroReveal}
            className="font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4rem] font-bold text-white uppercase tracking-wide leading-tight"
          >
            Holy Spirit Chapel
          </motion.h1>

          {/* Sub-name */}
          <motion.p
            variants={fadeUp}
            className="font-display text-lg sm:text-xl md:text-[1.375rem] text-chapel-300 mt-3 tracking-widest uppercase"
          >
            ESUT Agbani
          </motion.p>

          {/* Gold Divider */}
          <motion.div
            variants={{
              hidden: { width: 0, opacity: 0 },
              visible: {
                width: 96,
                opacity: 1,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="h-px bg-gold-500 mx-auto mt-6 mb-6"
          />

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="font-heading text-base sm:text-lg text-white/75 italic max-w-xl mx-auto leading-relaxed"
          >
            {tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center px-8 py-3.5 rounded-full",
                "font-body font-bold text-sm sm:text-base",
                "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-700",
                "hover:shadow-gold hover:-translate-y-0.5 active:translate-y-0",
                "transition-all duration-200"
              )}
            >
              Join Us This Sunday
            </Link>
            <Link
              href="/departments"
              className={cn(
                "inline-flex items-center justify-center px-8 py-3.5 rounded-full",
                "font-body font-semibold text-sm sm:text-base",
                "border-2 border-white/40 text-white",
                "hover:bg-white/10 hover:border-white/60",
                "transition-all duration-200"
              )}
            >
              Our Departments
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* ── Slide Indicators ── */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="relative p-1 flex items-center justify-center"
            >
              {currentIndex === idx ? (
                <motion.div layoutId="hero-dot" className="w-6 h-2 rounded-full bg-white" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Scroll Indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/40 font-body text-[0.65rem] tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown
            size={20}
            className="text-white/40 animate-[bounce-gentle_2s_ease-in-out_infinite]"
          />
        </motion.div>
      </div>
    </section>
  );
}
