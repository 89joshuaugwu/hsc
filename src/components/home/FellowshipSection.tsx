"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function FellowshipSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChapelInfo() {
      try {
        const snap = await getDoc(doc(db, "chapel_info", "main"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.heroImages && data.heroImages.length > 0) {
            setHeroImageUrl(data.heroImages[0].url);
          } else if (data.heroImageUrl) {
            setHeroImageUrl(data.heroImageUrl);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chapel info for fellowship section:", err);
      }
    }
    fetchChapelInfo();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger(0.15)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center"
        >
          {/* Right image (shows first on mobile) */}
          <motion.div variants={fadeUp} className="md:col-span-2 md:order-2">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
              {heroImageUrl ? (
                <>
                  <Image
                    src={heroImageUrl}
                    alt="Fellowship Background"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy-900/40 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-chapel-300 to-navy-500" />
              )}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <Image
                  src="/flogo.png"
                  alt="Anglican Students Fellowship"
                  width={200}
                  height={200}
                  className="object-contain drop-shadow-2xl z-10"
                />
              </div>
            </div>
          </motion.div>

          {/* Left text */}
          <motion.div variants={fadeUp} className="md:col-span-3 md:order-1 space-y-6">
            <Image
              src="/flogo.png"
              alt="ASF Logo"
              width={96}
              height={96}
              className="rounded-xl"
            />

            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy-500">
              Anglican Students&apos; Fellowship
            </h2>

            <p className="font-display text-sm font-semibold text-red-600 tracking-[0.15em] uppercase">
              Arise, Shine
            </p>

            <p className="font-body text-base text-text-muted leading-relaxed max-w-lg">
              The Anglican Students&apos; Fellowship (ASF) at ESUT Agbani is a vibrant
              community of young Anglicans growing together in faith, knowledge,
              and service. We gather to worship, study the Word, and make a
              difference on campus and beyond. Join us and be part of something
              meaningful.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-body text-sm font-bold rounded-full hover:bg-red-700 transition-colors"
            >
              Join the Fellowship <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
