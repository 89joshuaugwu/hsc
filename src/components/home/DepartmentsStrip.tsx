"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Music: LucideIcons.Music,
  BookOpen: LucideIcons.BookOpen,
  Mic: LucideIcons.Mic,
  Heart: LucideIcons.Heart,
  Users: LucideIcons.Users,
  Camera: LucideIcons.Camera,
  Monitor: LucideIcons.Monitor,
  Shield: LucideIcons.Shield,
  Headphones: LucideIcons.Headphones,
  Pen: LucideIcons.Pen,
  Cross: LucideIcons.Cross,
  Flame: LucideIcons.Flame,
};

interface DeptMini {
  id: string;
  name: string;
  icon: string;
}

export function DepartmentsStrip() {
  const [departments, setDepartments] = useState<DeptMini[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(
          collection(db, "departments"),
          where("isActive", "==", true),
          orderBy("order", "asc"),
          limit(8)
        );
        const snap = await getDocs(q);
        setDepartments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DeptMini));
      } catch (err) {
        console.error("Departments fetch error:", err);
      }
    }
    fetch();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-20 bg-navy-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center">
            <span className="inline-block font-body text-xs font-bold tracking-[0.25em] text-gold-500 uppercase mb-3">
              Departments
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-white">
              Find Your Place
            </h2>
            <p className="font-body text-sm text-white/50 mt-3 max-w-lg mx-auto">
              Discover the many ways you can serve, grow, and connect within our chapel community.
            </p>
          </motion.div>

          {/* Cards */}
          {departments.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide">
              {departments.map((dept) => {
                const Icon = ICON_MAP[dept.icon] || LucideIcons.Users;
                return (
                  <motion.div key={dept.id} variants={fadeUp} className="min-w-[140px] md:min-w-0 flex-shrink-0">
                    <Link href="/departments" className="block group">
                      <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <div className="w-14 h-14 rounded-full bg-chapel-400/20 flex items-center justify-center group-hover:bg-chapel-400/30 transition-colors">
                          <Icon size={24} className="text-chapel-300" />
                        </div>
                        <span className="font-body text-sm font-semibold text-white text-center">
                          {dept.name}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <motion.div variants={fadeUp} className="text-center">
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-white/30 text-white font-body text-sm font-bold rounded-full hover:bg-white/10 transition-all"
            >
              View All Departments <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
