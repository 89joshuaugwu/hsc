"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { DepartmentCard } from "@/components/departments/DepartmentCard";
import { DepartmentModal } from "@/components/departments/DepartmentModal";
import { stagger, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Department } from "@/types/chapel.types";

/* ─── Filter categories ─── */
const FILTER_CHIPS = [
  { label: "All", value: "all" },
  { label: "Ministry", value: "ministry" },
  { label: "Technical", value: "technical" },
  { label: "Administrative", value: "administrative" },
];

/* ─── Department → category mapping (based on name keywords) ─── */
function getDeptCategory(name: string): string {
  const n = name.toLowerCase();
  if (["choir", "band", "prayer", "evangelism"].some((k) => n.includes(k)))
    return "ministry";
  if (["technical", "media", "sound", "light"].some((k) => n.includes(k)))
    return "technical";
  if (["ushering", "welfare", "sanctuary", "decoration", "protocol"].some((k) => n.includes(k)))
    return "administrative";
  return "ministry";
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  /* ── Fetch departments from Firestore ── */
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const q = query(
          collection(db, "departments"),
          where("isActive", "==", true),
          orderBy("order", "asc")
        );
        const snap = await getDocs(q);
        const items = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Department
        );
        setDepartments(items);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  /* ── Filter + Search logic ── */
  const filtered = useMemo(() => {
    let result = departments;

    // Filter by category
    if (activeFilter !== "all") {
      result = result.filter(
        (d) => getDeptCategory(d.name) === activeFilter
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.headName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [departments, activeFilter, searchQuery]);

  return (
    <>
      {/* ── Hero Strip ── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        {/* Geometric pattern bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-chapel-50 to-chapel-100">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(30deg, #1E9FD8 12%, transparent 12.5%, transparent 87%, #1E9FD8 87.5%, #1E9FD8),
                linear-gradient(150deg, #1E9FD8 12%, transparent 12.5%, transparent 87%, #1E9FD8 87.5%, #1E9FD8),
                linear-gradient(30deg, #1E9FD8 12%, transparent 12.5%, transparent 87%, #1E9FD8 87.5%, #1E9FD8),
                linear-gradient(150deg, #1E9FD8 12%, transparent 12.5%, transparent 87%, #1E9FD8 87.5%, #1E9FD8),
                linear-gradient(60deg, #0E618877 25%, transparent 25.5%, transparent 75%, #0E618877 75%, #0E618877),
                linear-gradient(60deg, #0E618877 25%, transparent 25.5%, transparent 75%, #0E618877 75%, #0E618877)
              `,
              backgroundSize: "80px 140px",
              backgroundPosition:
                "0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <span className="inline-block font-body text-xs font-bold tracking-[0.25em] text-chapel-400 uppercase">
              Find Your Place
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-navy-500">
              Our Departments
            </h1>
            <p className="font-body text-base md:text-lg text-text-muted max-w-xl mx-auto">
              Discover where you belong — every gift finds its home at Holy
              Spirit Chapel.
            </p>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ── Search + Filter Bar ── */}
      <section className="sticky top-16 md:top-20 z-30 bg-white/90 backdrop-blur-md border-b border-border/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
              />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl border border-border",
                  "font-body text-sm text-text placeholder-text-light",
                  "focus:outline-none focus:ring-2 focus:ring-chapel-400/30 focus:border-chapel-400",
                  "transition-all bg-white"
                )}
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => setActiveFilter(chip.value)}
                  className={cn(
                    "px-4 py-2 rounded-full font-body text-xs font-semibold whitespace-nowrap transition-all",
                    activeFilter === chip.value
                      ? "bg-chapel-400 text-white shadow-sm"
                      : "bg-ivory-dark text-text-muted hover:bg-chapel-50 hover:text-chapel-500"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Department Grid ── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            /* Loading skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-border/60 overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-ivory-dark" />
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-ivory-dark" />
                      <div className="h-4 w-32 bg-ivory-dark rounded" />
                    </div>
                    <div className="h-3 w-full bg-ivory-dark rounded" />
                    <div className="h-3 w-2/3 bg-ivory-dark rounded" />
                    <div className="h-3 w-20 bg-ivory-dark rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full bg-ivory-dark flex items-center justify-center mb-4">
                <Search size={24} className="text-text-light" />
              </div>
              <h3 className="font-heading text-lg text-navy-500 mb-2">
                No departments found
              </h3>
              <p className="font-body text-sm text-text-muted">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search.`
                  : "No departments in this category yet."}
              </p>
              {(searchQuery || activeFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                  className="mt-4 font-body text-sm font-semibold text-chapel-400 hover:text-chapel-500 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            /* Department cards grid */
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((dept) => (
                  <DepartmentCard
                    key={dept.id}
                    department={dept}
                    onSelect={setSelectedDept}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Department Modal ── */}
      <DepartmentModal
        department={selectedDept}
        onClose={() => setSelectedDept(null)}
      />
    </>
  );
}
