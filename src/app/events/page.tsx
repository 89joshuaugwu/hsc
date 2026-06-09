"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import {
  MapPin,
  Clock,
  ArrowRight,
  Grid3X3,
  List,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate?: { toDate: () => Date };
  endDate?: { toDate: () => Date };
  location: string;
  coverImageUrl: string;
  isFeatured: boolean;
  requiresRegistration: boolean;
  registrationUrl?: string;
}

const CATEGORIES = ["All Events", "Worship", "Community", "Youth", "Outreach"];
const ITEMS_PER_PAGE = 6;

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(
          collection(db, "events"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EventItem));
      } catch (err) {
        console.error("Events fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const filtered =
    activeCategory === "All Events"
      ? events
      : events.filter((e) => e.category?.toLowerCase() === activeCategory.toLowerCase());

  const featured = filtered.find((e) => e.isFeatured);
  const regular = filtered.filter((e) => e.id !== featured?.id);
  const visible = regular.slice(0, visibleCount);

  const formatDate = (date: Date) => ({
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
    full: date.toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
  });

  return (
    <>
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-navy-500 via-chapel-400 to-navy-700" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center px-4"
        >
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white">
            Life at the Chapel
          </h1>
          <p className="font-body text-base text-white/60 mt-3 max-w-xl mx-auto">
            Stay connected with everything happening at Holy Spirit Chapel
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="relative mt-10 max-w-3xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-start md:justify-center scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(ITEMS_PER_PAGE); }}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full font-body text-sm font-semibold whitespace-nowrap transition-all",
                  activeCategory === cat
                    ? "bg-gold-500 text-navy-700"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border/60 animate-pulse">
                  <div className="aspect-square bg-ivory-dark" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-32 bg-ivory-dark rounded" />
                    <div className="h-3 w-full bg-ivory-dark rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Calendar size={48} className="mx-auto text-text-light" />
              <h3 className="font-heading text-lg text-navy-500">
                No upcoming events
              </h3>
              <p className="font-body text-sm text-text-muted">
                Check back soon for new events!
              </p>
            </div>
          ) : (
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-10"
            >
              {/* Featured event */}
              {featured && (
                <motion.div variants={fadeUp}>
                  <div className="relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[380px] group">
                    {featured.coverImageUrl ? (
                      <Image src={featured.coverImageUrl} alt={featured.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-chapel-400 to-navy-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-700/90 via-navy-700/50 to-transparent" />
                    <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-10">
                      <span className="inline-block w-fit px-3 py-1 bg-gold-500 text-navy-700 font-body text-xs font-bold rounded-full mb-4">
                        FEATURED EVENT
                      </span>
                      <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                        {featured.title}
                      </h2>
                      <p className="font-body text-sm text-white/70 mb-3 max-w-2xl line-clamp-2">
                        {featured.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-white/60 mb-6">
                        {featured.startDate ? (
                          <>
                            <span className="inline-flex items-center gap-1 font-body text-sm">
                              <Calendar size={14} />
                              {formatDate(featured.startDate.toDate()).full}
                            </span>
                            <span className="inline-flex items-center gap-1 font-body text-sm">
                              <Clock size={14} />
                              {formatDate(featured.startDate.toDate()).time}
                            </span>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-body text-sm">
                            <Calendar size={14} />
                            Date TBA
                          </span>
                        )}
                        {featured.location && (
                          <span className="inline-flex items-center gap-1 font-body text-sm">
                            <MapPin size={14} />
                            {featured.location}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {featured.requiresRegistration && featured.registrationUrl && (
                          <a
                            href={featured.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-gold-500 text-navy-700 font-body text-sm font-bold rounded-full hover:bg-gold-400 transition-colors"
                          >
                            Register Now
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* View mode toggle */}
              {regular.length > 0 && (
                <motion.div variants={fadeUp} className="flex items-center justify-between">
                  <p className="font-body text-sm text-text-muted">
                    {regular.length} event{regular.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        viewMode === "grid" ? "bg-chapel-400 text-white" : "text-text-light hover:bg-ivory"
                      )}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        viewMode === "list" ? "bg-chapel-400 text-white" : "text-text-light hover:bg-ivory"
                      )}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Grid view */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visible.map((evt) => {
                    const d = evt.startDate ? formatDate(evt.startDate.toDate()) : null;
                    return (
                      <motion.div key={evt.id} variants={fadeUp}>
                        <div className="bg-white rounded-xl border border-border/60 overflow-hidden hover:shadow-chapel transition-all group">
                          <div className="relative aspect-[4/3]">
                            {evt.coverImageUrl ? (
                              <Image src={evt.coverImageUrl} alt={evt.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-chapel-300 to-chapel-500" />
                            )}
                            <div className="absolute top-3 left-3 w-12 h-14 bg-navy-500 rounded-lg flex flex-col items-center justify-center">
                              {d ? (
                                <>
                                  <span className="font-body text-[0.55rem] font-bold text-gold-500">{d.month}</span>
                                  <span className="font-heading text-lg font-bold text-white -mt-0.5">{d.day}</span>
                                </>
                              ) : (
                                <span className="font-body text-[0.55rem] font-bold text-gold-500 text-center px-1">TBA</span>
                              )}
                            </div>
                            <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-navy-500 font-body text-[0.6rem] font-bold rounded-full">
                              {evt.category || "Event"}
                            </span>
                          </div>
                          <div className="p-4 space-y-2">
                            <h3 className="font-heading text-base font-bold text-navy-500 line-clamp-1">{evt.title}</h3>
                            <div className="flex items-center gap-3 text-text-muted">
                              <span className="inline-flex items-center gap-1 font-body text-xs">
                                <Clock size={12} />
                                {d ? d.time : "TBA"}
                              </span>
                              {evt.location && <span className="inline-flex items-center gap-1 font-body text-xs truncate"><MapPin size={12} />{evt.location}</span>}
                            </div>
                            <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-chapel-400">Details <ArrowRight size={12} /></span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* List view */}
              {viewMode === "list" && (
                <div className="space-y-3">
                  {visible.map((evt) => {
                    const d = evt.startDate ? formatDate(evt.startDate.toDate()) : null;
                    return (
                      <motion.div key={evt.id} variants={fadeUp}>
                        <div className="flex items-center gap-4 bg-white rounded-xl border border-border/60 p-4 hover:shadow-chapel transition-all">
                          <div className="w-14 h-16 bg-navy-500 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                            {d ? (
                              <>
                                <span className="font-body text-[0.55rem] font-bold text-gold-500">{d.month}</span>
                                <span className="font-heading text-lg font-bold text-white -mt-0.5">{d.day}</span>
                              </>
                            ) : (
                              <span className="font-body text-[0.55rem] font-bold text-gold-500 text-center px-1">TBA</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-sm font-bold text-navy-500 truncate">{evt.title}</h3>
                            <div className="flex items-center gap-3 text-text-muted mt-1">
                              <span className="inline-flex items-center gap-1 font-body text-xs">
                                <Clock size={12} />
                                {d ? d.time : "TBA"}
                              </span>
                              {evt.location && <span className="inline-flex items-center gap-1 font-body text-xs truncate"><MapPin size={12} />{evt.location}</span>}
                              <span className="px-2 py-0.5 bg-chapel-400/10 text-chapel-400 font-body text-[0.6rem] font-bold rounded-full">{evt.category || "Event"}</span>
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-text-light flex-shrink-0" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Load More */}
              {visibleCount < regular.length && (
                <motion.div variants={fadeUp} className="text-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                    className="px-6 py-2.5 border-2 border-chapel-400 text-chapel-400 font-body text-sm font-bold rounded-full hover:bg-chapel-400 hover:text-white transition-all"
                  >
                    Load More Events
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Newsletter strip */}
          <div className="mt-16 bg-gradient-to-r from-navy-500 to-chapel-400 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2">
              Stay in the Loop
            </h3>
            <p className="font-body text-sm text-white/60 mb-6 max-w-md mx-auto">
              Subscribe to receive updates about upcoming events and chapel activities
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-700 font-body text-sm font-bold rounded-full hover:bg-gold-400 transition-colors"
            >
              Subscribe Now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
