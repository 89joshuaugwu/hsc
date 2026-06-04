"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FellowshipSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-red-100 to-red-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/flogo.png"
                  alt="Anglican Students Fellowship"
                  width={200}
                  height={200}
                  className="object-contain"
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
