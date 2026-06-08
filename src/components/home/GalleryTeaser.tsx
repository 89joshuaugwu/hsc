"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
}

export function GalleryTeaser() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(
          collection(db, "gallery"),
          orderBy("uploadedAt", "desc"),
          limit(6)
        );
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryItem));
      } catch (err) {
        console.error("Gallery fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  if (!isLoading && items.length === 0) return null;

  return (
    <section ref={ref} className="py-16 md:py-20 bg-ivory-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center">
            <span className="inline-block font-body text-xs font-bold tracking-[0.25em] text-chapel-400 uppercase mb-3">
              Gallery
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-navy-500">
              Our Community in Focus
            </h2>
          </motion.div>

          {/* Mosaic grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`relative rounded-xl w-full ${
                    i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 transition-opacity duration-500">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className={`relative rounded-xl overflow-hidden group cursor-pointer ${
                    i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.caption || "Gallery image"}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div variants={fadeUp} className="text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-700 font-body text-sm font-bold rounded-full hover:shadow-gold transition-all"
            >
              View Full Gallery <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
