"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types/chapel.types";

/**
 * AnnouncementBanner — Thin strip below navbar.
 * Shows active priority announcements from Firestore.
 * Ticker scroll animation if >2 announcements.
 * Background: chapel-navy gradient. Text: white, Nunito 500.
 */
export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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
        // Silently fail — banner just doesn't show
        console.error("Failed to fetch announcements:", error);
      }
    }
    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  const needsTicker = announcements.length > 2;

  return (
    <div
      className={cn(
        "fixed top-16 md:top-20 left-0 right-0 z-40",
        "bg-gradient-to-r from-navy-600 to-navy-500",
        "py-2 overflow-hidden"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-8 whitespace-nowrap px-4",
          needsTicker && "animate-[ticker_20s_linear_infinite]"
        )}
      >
        {/* Duplicate announcements for seamless ticker loop */}
        {(needsTicker ? [...announcements, ...announcements] : announcements).map(
          (ann, idx) => (
            <span
              key={`${ann.id}-${idx}`}
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-white/90"
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
