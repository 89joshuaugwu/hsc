"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Radio,
  Megaphone,
  Calendar,
  Users,
  ImageIcon,
  Gift,
  CreditCard,
  UserCheck,
  Mail,
  Heart,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpModal } from "./HelpModal";
import type { AdminNotifications } from "@/hooks/useAdminNotifications";

const MOBILE_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Live", href: "/admin/live", icon: Radio },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Departments", href: "/admin/departments", icon: Users },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Give", href: "/admin/give", icon: Gift },
  { label: "Payments", href: "/admin/payments", icon: CreditCard, badgeKey: "payments" as const },
  { label: "Subscribers", href: "/admin/subscribers", icon: UserCheck, badgeKey: "subscribers" as const },
  { label: "Messages", href: "/admin/contact-messages", icon: Mail, badgeKey: "messages" as const },
  { label: "Prayers", href: "/admin/prayer-requests", icon: Heart, badgeKey: "prayers" as const },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Help & Guide", href: "/admin/admin-guide", icon: HelpCircle },
];

interface AdminTopBarProps {
  user: User;
  notifications?: AdminNotifications;
}

/**
 * AdminTopBar — Sticky top bar with mobile hamburger, page title, and user menu.
 * Shows red notification dot on hamburger when there are pending items.
 */
export function AdminTopBar({ user, notifications }: AdminTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const totalCount = notifications?.total || 0;

  const pageTitle = (() => {
    const segment = pathname.split("/").filter(Boolean).pop() || "admin";
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  })();

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const getBadgeCount = (badgeKey?: "messages" | "prayers" | "payments" | "subscribers"): number => {
    if (!badgeKey || !notifications) return 0;
    return notifications[badgeKey] || 0;
  };

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-border/60 px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: mobile menu + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="relative md:hidden text-navy-500 hover:text-navy-700"
          >
            <Menu size={22} />
            {/* Red dot when there are pending notifications */}
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </button>
          <h1 className="font-heading text-lg font-bold text-navy-500 truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right: help + user */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 rounded-full text-text-muted hover:text-chapel-400 hover:bg-ivory transition-colors"
            title="Help & Guide"
          >
            <HelpCircle size={20} />
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border/60">
            <div className="w-8 h-8 rounded-full bg-chapel-400 flex items-center justify-center text-white font-body text-xs font-bold">
              {user.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="font-body text-sm text-text-muted truncate max-w-[120px]">
              {user.email}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg text-text-light hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-navy-700/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 z-50 bg-navy-700 md:hidden overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="font-display text-sm font-bold text-gold-500">
                HSC Admin
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {MOBILE_NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const count = getBadgeCount(item.badgeKey);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-all",
                      active
                        ? "bg-chapel-400/20 text-gold-500"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon size={20} />
                    <span className="flex-1">{item.label}</span>
                    {count > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
