"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  isPriority: boolean;
  createdAt: { toDate: () => Date };
}

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(
          collection(db, "announcements"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const snap = await getDocs(q);
        setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement));
      } catch (err) {
        console.error("Announcements fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const featured = announcements[0];
  const side = announcements.slice(1);

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 relative"
      style={{
        backgroundImage:
          "radial-gradient(circle, #0A2D52 0.5px, transparent 0.5px)",
        backgroundSize: "20px 20px",
        backgroundColor: "#F0EDE6",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center">
            <span className="inline-block font-body text-xs font-bold tracking-[0.25em] text-chapel-400 uppercase mb-3">
              Latest Updates
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-navy-500">
              What&apos;s Happening
            </h2>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <Skeleton className="w-full h-48 md:h-64" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-32" />
              </div>
            </div>
          ) : announcements.length === 0 ? (
            <motion.div variants={fadeUp} className="text-center py-12">
              <p className="font-body text-sm text-text-muted">
                No announcements at this time. Check back soon!
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 transition-opacity duration-500">
              {/* Featured */}
              {featured && (
                <motion.div variants={fadeUp} className="lg:col-span-3">
                  <div className="bg-white rounded-xl border border-border/60 p-6 md:p-8 h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-chapel-400/10 text-chapel-400 font-body text-xs font-bold rounded-full">
                        {featured.category || "Update"}
                      </span>
                      {featured.createdAt && isToday(featured.createdAt.toDate()) && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 font-body text-xs font-bold rounded-full">
                          Updated Today
                        </span>
                      )}
                      {featured.isPriority && (
                        <span className="px-3 py-1 bg-gold-500/10 text-gold-600 font-body text-xs font-bold rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-navy-500 mb-3">
                      {featured.title}
                    </h3>
                    <p className="font-body text-sm text-text-muted leading-relaxed mb-4">
                      {featured.content}
                    </p>
                    <p className="font-body text-xs text-text-light">
                      {featured.createdAt?.toDate?.()?.toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Side cards */}
              <div className="lg:col-span-2 space-y-6">
                {side.map((ann) => (
                  <motion.div key={ann.id} variants={fadeUp}>
                    <div className="bg-white rounded-xl border border-border/60 p-5 h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-chapel-400/10 text-chapel-400 font-body text-[0.65rem] font-bold rounded-full">
                          {ann.category || "Update"}
                        </span>
                        {ann.createdAt && isToday(ann.createdAt.toDate()) && (
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 font-body text-[0.65rem] font-bold rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading text-base font-bold text-navy-500 mb-2">
                        {ann.title}
                      </h4>
                      <p className="font-body text-xs text-text-muted line-clamp-3 leading-relaxed">
                        {ann.content}
                      </p>
                      <p className="font-body text-[0.65rem] text-text-light mt-3">
                        {ann.createdAt?.toDate?.()?.toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* View All */}
          {announcements.length >= 3 && (
            <motion.div variants={fadeUp} className="text-center">
              <Link
                href="/announcements"
                className="font-body text-sm font-semibold text-chapel-400 hover:text-chapel-500 transition-colors"
              >
                View All →
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
