"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Live Manager", href: "/admin/live", icon: Radio },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Departments", href: "/admin/departments", icon: Users },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Give Options", href: "/admin/give", icon: Gift },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Subscribers", href: "/admin/subscribers", icon: UserCheck },
  { label: "Messages", href: "/admin/contact-messages", icon: Mail },
  { label: "Prayer Requests", href: "/admin/prayer-requests", icon: Heart },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

/**
 * AdminSidebar — Fixed left panel on desktop.
 * Chapel logo at top, nav links with active state, collapsible.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 bg-navy-700 text-white transition-all duration-300",
          "hidden md:flex flex-col",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <Image
            src="/clogo.png"
            alt="Chapel Logo"
            width={36}
            height={36}
            className="flex-shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-display text-sm font-bold text-gold-500 truncate">
                HSC Admin
              </p>
              <p className="font-body text-[0.65rem] text-white/50 truncate">
                ESUT Agbani
              </p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                  "font-body font-medium",
                  active
                    ? "bg-chapel-400/20 text-gold-500"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 border-t border-white/10 text-white/40 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>
    </>
  );
}
