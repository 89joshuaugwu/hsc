"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";

/**
 * LayoutShell — Conditionally renders NavBar + Footer.
 * Admin routes (/admin/*) skip the public chrome since they have their own layout.
 */
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <NavBar />
      <AnnouncementBanner />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
