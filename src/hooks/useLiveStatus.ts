"use client";

import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { LiveStatus } from "@/types/chapel.types";

/**
 * Real-time listener for live service status.
 * Uses Firestore onSnapshot on `live_status/current` doc.
 * Returns null when loading or no doc exists.
 */
export function useLiveStatus() {
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "live_status", "current"),
      (snap) => {
        if (snap.exists()) {
          setLiveStatus(snap.data() as LiveStatus);
        } else {
          setLiveStatus(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Live status listener error:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { liveStatus, loading, isLive: liveStatus?.isLive ?? false };
}
