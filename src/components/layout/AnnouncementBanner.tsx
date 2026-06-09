"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types/chapel.types";

/**
 * AnnouncementBanner — Thin strip below navbar.
 * Shows active priority announcements from Firestore.
 * Continuous horizontal marquee animation.
 * Toggles visibility every minute as requested.
 * Background: chapel-navy gradient. Text: white, Nunito 500.
 */
export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const q = query(
          collection(db, "announcements"),
          where("isActive", "==", true),
          where("isPriority", "==", true),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement);
        setAnnouncements(items);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    }
    fetchAnnouncements();
  }, []);

  // Toggle visibility every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed top-16 md:top-20 left-0 right-0 z-40",
        "bg-gradient-to-r from-navy-600 to-navy-500",
        "py-2 overflow-hidden transition-all duration-1000",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}
    >
      <div className="flex whitespace-nowrap animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Duplicate announcements multiple times for seamless ticker loop regardless of screen width */}
        {[...announcements, ...announcements, ...announcements, ...announcements].map(
          (ann, idx) => (
            <span
              key={`${ann.id}-${idx}`}
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-white/90 mx-8"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
              {ann.title}
            </span>
          )
        )}
      </div>
    </div>
  );
}
