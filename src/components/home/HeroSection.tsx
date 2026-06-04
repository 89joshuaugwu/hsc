"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
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
          if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
          if (data.tagline) setTagline(data.tagline);
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      }
    }
    fetchHeroData();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background: Image or Gradient ── */}
      <div className="absolute inset-0 z-0">
        {heroImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-chapel-gradient" />
        )}

        {/* Hero overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,45,82,0.7) 0%, rgba(10,45,82,0.4) 50%, rgba(10,45,82,0.8) 100%)",
          }}
        />
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
