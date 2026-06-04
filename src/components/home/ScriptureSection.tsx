"use client";

import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export function ScriptureSection() {
  const [verse, setVerse] = useState("");
  const [reference, setReference] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDoc(doc(db, "chapel_info", "main"));
        if (snap.exists()) {
          const d = snap.data();
          setVerse(d.scriptureVerse || "Arise, shine, for your light has come, and the glory of the Lord rises upon you.");
          setReference(d.scriptureReference || "Isaiah 60:1");
        }
      } catch {
        setVerse("Arise, shine, for your light has come, and the glory of the Lord rises upon you.");
        setReference("Isaiah 60:1");
      }
    }
    fetch();
  }, []);

  return (
    <section ref={ref} className="py-20 md:py-28 bg-ivory relative overflow-hidden">
      {/* Cross watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          className="w-[500px] h-[500px] opacity-[0.04]"
          fill="none"
          stroke="#0A2D52"
          strokeWidth="2"
        >
          <rect x="85" y="10" width="30" height="180" rx="4" />
          <rect x="20" y="65" width="160" height="30" rx="4" />
        </svg>
      </div>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        className="relative max-w-3xl mx-auto text-center px-6"
      >
        {/* Decorative lines + quote */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="h-px w-16 bg-gold-500/50" />
          <div className="w-2 h-2 bg-gold-500 rounded-full" />
          <div className="h-px w-16 bg-gold-500/50" />
        </div>

        <p className="font-quote text-2xl md:text-3xl italic text-navy-500/80 leading-relaxed">
          &ldquo;{verse}&rdquo;
        </p>

        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="h-px w-16 bg-gold-500/50" />
          <p className="font-display text-sm text-gold-600 tracking-[0.2em]">
            — {reference.toUpperCase()}
          </p>
          <div className="h-px w-16 bg-gold-500/50" />
        </div>
      </motion.div>
    </section>
  );
}
