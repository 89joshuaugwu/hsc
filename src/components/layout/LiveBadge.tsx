"use client";

import { useLiveStatus } from "@/hooks/useLiveStatus";
import { cn } from "@/lib/utils";

/**
 * LiveBadge — Shown in navbar when admin toggles a service as live.
 * Red pulsing dot + "LIVE · [activityName]" text.
 * Reads live_status/current from Firestore via onSnapshot.
 */
export function LiveBadge({ className }: { className?: string }) {
  const { liveStatus, isLive } = useLiveStatus();

  if (!isLive || !liveStatus) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-red-50 border border-red-200",
        className
      )}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-75 animate-live-pulse" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
      </span>

      {/* Label */}
      <span className="text-xs font-body font-bold text-live uppercase tracking-wide">
        Live
      </span>

      {/* Activity name */}
      <span className="text-xs font-body font-medium text-red-700">
        · {liveStatus.activityName}
      </span>
    </div>
  );
}
