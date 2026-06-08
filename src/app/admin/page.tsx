"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLiveStatus } from "@/hooks/useLiveStatus";
import {
  UserCheck,
  CreditCard,
  Calendar,
  Mail,
  ImageIcon,
  Users,
  Radio,
  Plus,
  Megaphone,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/utils";

interface StatCardData {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  href: string;
}

/**
 * Admin Dashboard Home — Stat cards, quick actions, recent activity.
 */
export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    subscribers: 0,
    pendingPayments: 0,
    events: 0,
    messages: 0,
    gallery: 0,
    departments: 0,
  });
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; subject: string; date: string }[]>([]);
  const [recentPayments, setRecentPayments] = useState<{ id: string; name: string; amount: number; status: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLive, liveStatus } = useLiveStatus();
  const [togglingLive, setTogglingLive] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const unsubSubs = onSnapshot(query(collection(db, "subscribers"), where("isActive", "==", true)), (snap) => setCounts(prev => ({ ...prev, subscribers: snap.size })));
    const unsubPending = onSnapshot(query(collection(db, "transactions"), where("status", "==", "pending")), (snap) => setCounts(prev => ({ ...prev, pendingPayments: snap.size })));
    const unsubEvents = onSnapshot(query(collection(db, "events"), where("isActive", "==", true), where("startDate", ">=", Timestamp.fromDate(startOfMonth))), (snap) => setCounts(prev => ({ ...prev, events: snap.size })));
    const unsubMsgs = onSnapshot(query(collection(db, "contact_messages"), where("isRead", "==", false)), (snap) => setCounts(prev => ({ ...prev, messages: snap.size })));
    const unsubGallery = onSnapshot(query(collection(db, "gallery"), where("isActive", "==", true)), (snap) => setCounts(prev => ({ ...prev, gallery: snap.size })));
    const unsubDepts = onSnapshot(query(collection(db, "departments"), where("isActive", "==", true)), (snap) => setCounts(prev => ({ ...prev, departments: snap.size })));

    const unsubRecentMsgs = onSnapshot(query(collection(db, "contact_messages"), orderBy("createdAt", "desc"), limit(5)), (snap) => {
      setRecentMessages(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            subject: data.subject,
            date: data.createdAt?.toDate?.()?.toLocaleDateString("en-NG") || "",
          };
        })
      );
    });

    const unsubRecentPay = onSnapshot(query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(5)), (snap) => {
      setRecentPayments(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.donorName,
            amount: data.amount,
            status: data.status,
            date: data.createdAt?.toDate?.()?.toLocaleDateString("en-NG") || "",
          };
        })
      );
      setLoading(false);
    });

    return () => {
      unsubSubs(); unsubPending(); unsubEvents(); unsubMsgs(); unsubGallery(); unsubDepts(); unsubRecentMsgs(); unsubRecentPay();
    };
  }, []);

  const stats: StatCardData[] = [
    { label: "Subscribers", value: counts.subscribers, icon: UserCheck, color: "bg-chapel-400/10 text-chapel-400", href: "/admin/subscribers" },
    { label: "Pending Payments", value: counts.pendingPayments, icon: CreditCard, color: "bg-amber-500/10 text-amber-600", href: "/admin/payments" },
    { label: "This Month Events", value: counts.events, icon: Calendar, color: "bg-green-500/10 text-green-600", href: "/admin/events" },
    { label: "New Messages", value: counts.messages, icon: Mail, color: "bg-blue-500/10 text-blue-600", href: "/admin/contact-messages" },
    { label: "Gallery Photos", value: counts.gallery, icon: ImageIcon, color: "bg-purple-500/10 text-purple-600", href: "/admin/gallery" },
    { label: "Departments", value: counts.departments, icon: Users, color: "bg-gold-500/10 text-gold-600", href: "/admin/departments" },
  ];

  const handleToggleLive = async () => {
    setTogglingLive(true);
    try {
      const ref = doc(db, "live_status", "current");
      if (isLive) {
        await updateDoc(ref, {
          isLive: false,
          activityName: "",
          startedAt: null,
        });
      } else {
        await updateDoc(ref, {
          isLive: true,
          activityName: "Sunday Service",
          startedAt: Timestamp.now(),
          startedBy: "admin",
        });
      }
    } catch (error) {
      console.error("Failed to toggle live:", error);
    } finally {
      setTogglingLive(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-border/60 animate-pulse">
                <div className="w-10 h-10 bg-ivory-dark rounded-lg mb-3" />
                <div className="h-6 w-12 bg-ivory-dark rounded mb-1" />
                <div className="h-3 w-20 bg-ivory-dark rounded" />
              </div>
            ))
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="bg-white rounded-xl p-4 border border-border/60 hover:shadow-chapel transition-all group"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", stat.color)}>
                    <Icon size={20} />
                  </div>
                  <p className="font-body text-2xl font-bold text-navy-500">
                    {stat.value}
                  </p>
                  <p className="font-body text-xs text-text-muted mt-0.5 group-hover:text-chapel-400 transition-colors">
                    {stat.label}
                  </p>
                </Link>
              );
            })}
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toggle Live */}
        <button
          onClick={handleToggleLive}
          disabled={togglingLive}
          className={cn(
            "relative p-6 rounded-xl border-2 font-body text-left transition-all overflow-hidden",
            isLive
              ? "border-red-500 bg-red-50"
              : "border-green-500 bg-green-50 hover:bg-green-100"
          )}
        >
          {isLive && (
            <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
          )}
          <div className="relative">
            <Radio size={24} className={isLive ? "text-red-500" : "text-green-600"} />
            <p className="font-bold text-lg mt-2 text-navy-500">
              {isLive ? "END LIVE" : "GO LIVE"}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {isLive
                ? `Live: ${liveStatus?.activityName || "Service"}`
                : "Start a live service"}
            </p>
          </div>
        </button>

        {/* Quick shortcuts */}
        <Link
          href="/admin/events"
          className="p-6 rounded-xl border border-border/60 bg-white hover:shadow-chapel transition-all"
        >
          <Plus size={24} className="text-chapel-400" />
          <p className="font-body font-bold text-navy-500 mt-2">Add Event</p>
          <p className="font-body text-xs text-text-muted mt-1">Create new event</p>
        </Link>

        <Link
          href="/admin/announcements"
          className="p-6 rounded-xl border border-border/60 bg-white hover:shadow-chapel transition-all"
        >
          <Megaphone size={24} className="text-gold-600" />
          <p className="font-body font-bold text-navy-500 mt-2">Add Announcement</p>
          <p className="font-body text-xs text-text-muted mt-1">Post an update</p>
        </Link>

        <Link
          href="/admin/payments"
          className="p-6 rounded-xl border border-border/60 bg-white hover:shadow-chapel transition-all"
        >
          <Eye size={24} className="text-amber-600" />
          <p className="font-body font-bold text-navy-500 mt-2">Pending Payments</p>
          <p className="font-body text-xs text-text-muted mt-1">Review submissions</p>
        </Link>
      </div>

      {/* ── Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <h3 className="font-heading text-sm font-bold text-navy-500">Recent Messages</h3>
            <Link href="/admin/contact-messages" className="font-body text-xs text-chapel-400 hover:text-chapel-500">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentMessages.length === 0 ? (
              <p className="px-5 py-8 text-center font-body text-sm text-text-light">No messages yet</p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="px-5 py-3 hover:bg-ivory/50 transition-colors">
                  <p className="font-body text-sm font-semibold text-navy-500 truncate">{msg.name}</p>
                  <p className="font-body text-xs text-text-muted truncate">{msg.subject}</p>
                  <p className="font-body text-[0.65rem] text-text-light mt-1">{msg.date}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <h3 className="font-heading text-sm font-bold text-navy-500">Recent Payments</h3>
            <Link href="/admin/payments" className="font-body text-xs text-chapel-400 hover:text-chapel-500">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentPayments.length === 0 ? (
              <p className="px-5 py-8 text-center font-body text-sm text-text-light">No payments yet</p>
            ) : (
              recentPayments.map((pay) => (
                <div key={pay.id} className="px-5 py-3 flex items-center justify-between hover:bg-ivory/50 transition-colors">
                  <div>
                    <p className="font-body text-sm font-semibold text-navy-500">{pay.name}</p>
                    <p className="font-body text-[0.65rem] text-text-light">{pay.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm font-bold text-navy-500">{formatNaira(pay.amount)}</p>
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded-full font-body text-[0.6rem] font-bold uppercase",
                        pay.status === "verified" && "bg-green-100 text-green-700",
                        pay.status === "pending" && "bg-amber-100 text-amber-700",
                        pay.status === "rejected" && "bg-red-100 text-red-700",
                        pay.status === "failed" && "bg-red-100 text-red-700"
                      )}
                    >
                      {pay.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
