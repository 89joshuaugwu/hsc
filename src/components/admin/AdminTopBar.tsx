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
  Bell,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Live", href: "/admin/live", icon: Radio },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Departments", href: "/admin/departments", icon: Users },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Give", href: "/admin/give", icon: Gift },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Subscribers", href: "/admin/subscribers", icon: UserCheck },
  { label: "Messages", href: "/admin/contact-messages", icon: Mail },
  { label: "Prayers", href: "/admin/prayer-requests", icon: Heart },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminTopBarProps {
  user: User;
}

/**
 * AdminTopBar — Sticky top bar with mobile hamburger, page title, and user menu.
 */
export function AdminTopBar({ user }: AdminTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-border/60 px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: mobile menu + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-navy-500 hover:text-navy-700"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-heading text-lg font-bold text-navy-500 truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right: notifications + user */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg text-text-muted hover:text-navy-500 hover:bg-ivory transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-live rounded-full" />
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
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
