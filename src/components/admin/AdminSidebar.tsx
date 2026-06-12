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
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminNotifications } from "@/hooks/useAdminNotifications";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Live Manager", href: "/admin/live", icon: Radio },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Departments", href: "/admin/departments", icon: Users },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Give Options", href: "/admin/give", icon: Heart },
  { label: "Payments", href: "/admin/payments", icon: CreditCard, badgeKey: "payments" as const },
  { label: "Subscribers", href: "/admin/subscribers", icon: UserCheck, badgeKey: "subscribers" as const },
  { label: "Messages", href: "/admin/contact-messages", icon: Mail, badgeKey: "messages" as const },
  { label: "Prayer Requests", href: "/admin/prayer-requests", icon: Heart, badgeKey: "prayers" as const },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Help & Guide", href: "/admin/admin-guide", icon: HelpCircle },
];

interface AdminSidebarProps {
  notifications?: AdminNotifications;
}

/**
 * AdminSidebar — Fixed left panel on desktop.
 * Chapel logo at top, nav links with active state, collapsible.
 * Shows red badge counts on items with pending user-generated content.
 */
export function AdminSidebar({ notifications }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
            const count = getBadgeCount(item.badgeKey);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                  "font-body font-medium relative",
                  active
                    ? "bg-chapel-400/20 text-gold-500"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="relative flex-shrink-0">
                  <Icon size={20} />
                  {/* Collapsed mode: badge dot on icon */}
                  {collapsed && count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {count > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </>
                )}
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
