"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";

/**
 * Admin Layout — Protected by Firebase Auth.
 * Redirects unauthenticated users to /admin/login.
 * Renders AdminSidebar (desktop) + AdminTopBar + page content.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Public admin routes that don't require auth
  const publicRoutes = ["/admin/login", "/admin/verify-2fa"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);

      if (!u && !isPublicRoute) {
        router.replace("/admin/login");
      }
    });
    return () => unsub();
  }, [router, isPublicRoute]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-chapel-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-sm text-text-muted">Loading admin...</p>
        </div>
      </div>
    );
  }

  // Public routes render without sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Authenticated admin layout
  const notifications = useAdminNotifications();

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar (desktop) */}
      <AdminSidebar notifications={notifications} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 min-w-0">
        <AdminTopBar user={user} notifications={notifications} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
