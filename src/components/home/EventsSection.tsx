"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, useInView } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { MapPin, Clock, ArrowRight } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate?: { toDate: () => Date };
  location: string;
  coverImageUrl: string;
  isFeatured: boolean;
}

export function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetch() {
      try {
        const q = query(
          collection(db, "events"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const snap = await getDocs(q);
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EventItem));
      } catch (err) {
        console.error("Events fetch error:", err);
      }
    }
    fetch();
  }, []);

  const featured = events[0];
  const rest = events.slice(1);

  const formatDate = (date: Date) => ({
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
  });

  return (
    <section ref={ref} className="py-16 md:py-20 bg-white">
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
              Calendar
            </span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-navy-500">
              Upcoming Events
            </h2>
          </motion.div>

          {events.length === 0 ? (
            <motion.div variants={fadeUp} className="text-center py-12">
              <p className="font-body text-sm text-text-muted">
                No upcoming events. Check back soon!
              </p>
            </motion.div>
          ) : (
            <>
              {/* Featured event */}
              {featured && (
                <motion.div variants={fadeUp}>
                  <div className="relative rounded-2xl overflow-hidden min-h-[280px] md:min-h-[340px] group">
                    {featured.coverImageUrl ? (
                      <Image
                        src={featured.coverImageUrl}
                        alt={featured.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-chapel-400 to-navy-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-700/90 via-navy-700/40 to-transparent" />
                    <div className="relative z-10 flex items-end h-full p-6 md:p-8">
                      <div className="flex gap-4 items-end w-full">
                        {/* Date badge */}
                        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl flex flex-col items-center justify-center">
                          {featured.startDate ? (
                            <>
                              <span className="font-body text-[0.6rem] font-bold text-chapel-400 uppercase">
                                {formatDate(featured.startDate.toDate()).month}
                              </span>
                              <span className="font-heading text-xl font-bold text-navy-500 -mt-0.5">
                                {formatDate(featured.startDate.toDate()).day}
                              </span>
                            </>
                          ) : (
                            <span className="font-body text-[0.6rem] font-bold text-chapel-400 uppercase text-center px-1">
                              TBA
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
                            {featured.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-white/70">
                            {featured.location && (
                              <span className="inline-flex items-center gap-1 font-body text-xs">
                                <MapPin size={12} />
                                {featured.location}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 font-body text-xs">
                              <Clock size={12} />
                              {featured.startDate
                                ? featured.startDate.toDate().toLocaleTimeString("en-NG", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "TBA"}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/events`}
                          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-navy-700 font-body text-sm font-bold rounded-full hover:bg-gold-400 transition-colors"
                        >
                          Details
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Event cards */}
              {rest.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide">
                  {rest.map((evt) => {
                    const d = evt.startDate ? formatDate(evt.startDate.toDate()) : null;
                    return (
                      <motion.div key={evt.id} variants={fadeUp} className="min-w-[260px] md:min-w-0 flex-shrink-0">
                        <div className="bg-ivory rounded-xl border border-border/60 overflow-hidden hover:shadow-chapel transition-all group">
                          <div className="relative aspect-square">
                            {evt.coverImageUrl ? (
                              <Image
                                src={evt.coverImageUrl}
                                alt={evt.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-chapel-300 to-chapel-500" />
                            )}
                            {/* Date badge */}
                            <div className="absolute top-3 left-3 w-12 h-14 bg-navy-500 rounded-lg flex flex-col items-center justify-center">
                              {d ? (
                                <>
                                  <span className="font-body text-[0.55rem] font-bold text-gold-500 uppercase">
                                    {d.month}
                                  </span>
                                  <span className="font-heading text-lg font-bold text-white -mt-0.5">
                                    {d.day}
                                  </span>
                                </>
                              ) : (
                                <span className="font-body text-[0.55rem] font-bold text-gold-500 uppercase text-center px-1">
                                  TBA
                                </span>
                              )}
                            </div>
                            {/* Category */}
                            <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-navy-500 font-body text-[0.6rem] font-bold rounded-full">
                              {evt.category || "Event"}
                            </span>
                          </div>
                          <div className="p-4 space-y-2">
                            <h4 className="font-heading text-base font-bold text-navy-500 line-clamp-1">
                              {evt.title}
                            </h4>
                            <div className="flex items-center gap-3 text-text-muted">
                              <span className="inline-flex items-center gap-1 font-body text-xs">
                                <Clock size={12} />
                                {evt.startDate
                                  ? evt.startDate.toDate().toLocaleTimeString("en-NG", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "TBA"}
                              </span>
                              {evt.location && (
                                <span className="inline-flex items-center gap-1 font-body text-xs truncate">
                                  <MapPin size={12} />
                                  {evt.location}
                                </span>
                              )}
                            </div>
                            <Link
                              href="/events"
                              className="inline-flex items-center gap-1 font-body text-xs font-semibold text-chapel-400 hover:text-chapel-500"
                            >
                              Details <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* View all */}
          <motion.div variants={fadeUp} className="text-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-chapel-400 text-chapel-400 font-body text-sm font-bold rounded-full hover:bg-chapel-400 hover:text-white transition-all"
            >
              View All Events <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
