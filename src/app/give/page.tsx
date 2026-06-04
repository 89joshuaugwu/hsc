"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { GiveCard } from "@/components/give/GiveCard";
import { stagger, fadeUp } from "@/lib/motion";
import type { GiveOption } from "@/types/chapel.types";

export default function GivePage() {
  const [options, setOptions] = useState<GiveOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const q = query(
          collection(db, "give_options"),
          where("isActive", "==", true),
          orderBy("sortOrder", "asc")
        );
        const snap = await getDocs(q);
        setOptions(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GiveOption)
        );
      } catch (error) {
        console.error("Failed to fetch give options:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Warm gradient bg with cross motif */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-ivory to-chapel-50">
          {/* Subtle cross watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="0 0 200 200"
              className="w-[400px] h-[400px] opacity-[0.03]"
              fill="none"
              stroke="#0A2D52"
              strokeWidth="2"
            >
              <rect x="85" y="20" width="30" height="160" rx="4" />
              <rect x="30" y="60" width="140" height="30" rx="4" />
            </svg>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <span className="inline-block font-body text-xs font-bold tracking-[0.25em] text-gold-600 uppercase">
              Generosity
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-navy-500">
              Support Our Mission
            </h1>
            <p className="font-body text-base md:text-lg text-text-muted max-w-xl mx-auto">
              Every gift makes a difference in our community. Your generosity
              fuels the work of the Kingdom at Holy Spirit Chapel.
            </p>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ── Give Options Grid ── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-border/60 overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-ivory-dark" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-40 bg-ivory-dark rounded" />
                    <div className="h-3 w-full bg-ivory-dark rounded" />
                    <div className="h-3 w-2/3 bg-ivory-dark rounded" />
                    <div className="h-10 w-28 bg-ivory-dark rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : options.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-navy-500 mb-2">
                Give options coming soon
              </h3>
              <p className="font-body text-sm text-text-muted">
                Check back later for ways to support the chapel.
              </p>
            </div>
          ) : (
            <motion.div
              variants={stagger(0.12)}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {options.map((opt) => (
                <GiveCard key={opt.id} option={opt} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Scripture ── */}
      <section className="py-12 bg-ivory-dark">
        <div className="max-w-2xl mx-auto text-center px-4">
          <p className="font-quote text-xl md:text-2xl italic text-navy-500/80 leading-relaxed">
            &ldquo;Each of you should give what you have decided in your heart
            to give, not reluctantly or under compulsion, for God loves a
            cheerful giver.&rdquo;
          </p>
          <p className="font-display text-sm text-gold-600 mt-4 tracking-widest">
            — 2 CORINTHIANS 9:7
          </p>
        </div>
      </section>
    </>
  );
}
