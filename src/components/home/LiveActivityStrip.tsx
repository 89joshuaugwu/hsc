"use client";

import { useLiveStatus } from "@/hooks/useLiveStatus";

/**
 * LiveActivityStrip — Full-width red strip below hero.
 * Shown ONLY when admin has toggled a service as live.
 * Reads live_status/current from Firestore via onSnapshot.
 * Not dismissable — stays until admin turns off.
 */
export function LiveActivityStrip() {
  const { liveStatus, isLive } = useLiveStatus();

  if (!isLive || !liveStatus) return null;

  return (
    <div className="relative w-full bg-live overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-3">
          {/* Pulsing dot */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-live-pulse" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
          </span>

          {/* Activity info */}
          <p className="font-body text-sm font-bold text-white tracking-wide">
            <span className="uppercase">{liveStatus.activityName}</span>
            <span className="font-normal opacity-80 ml-2">— happening now</span>
          </p>
        </div>
      </div>

      {/* Subtle shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s linear infinite",
        }}
      />
    </div>
  );
}
