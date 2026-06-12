"use client";

/**
 * useAdminNotifications — Real-time Firestore listener for admin badge counts.
 *
 * Tracks unread/pending items across key collections and exposes
 * counts for sidebar badge rendering.
 *
 * Uses onSnapshot (real-time) so badges update instantly when
 * a user submits a form on the public site.
 */

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AdminNotifications {
  messages: number;
  prayers: number;
  payments: number;
  subscribers: number;
  total: number;
}

const EMPTY: AdminNotifications = {
  messages: 0,
  prayers: 0,
  payments: 0,
  subscribers: 0,
  total: 0,
};

export function useAdminNotifications(): AdminNotifications {
  const [counts, setCounts] = useState<AdminNotifications>(EMPTY);

  useEffect(() => {
    // 1. Unread contact messages
    const unsubMsgs = onSnapshot(
      query(collection(db, "contact_messages"), where("isRead", "==", false)),
      (snap) =>
        setCounts((prev) => {
          const messages = snap.size;
          return { ...prev, messages, total: messages + prev.prayers + prev.payments + prev.subscribers };
        }),
      (err) => console.error("Notification listener (messages):", err)
    );

    // 2. Unread prayer requests
    const unsubPrayers = onSnapshot(
      query(collection(db, "prayer_requests"), where("isRead", "==", false)),
      (snap) =>
        setCounts((prev) => {
          const prayers = snap.size;
          return { ...prev, prayers, total: prev.messages + prayers + prev.payments + prev.subscribers };
        }),
      (err) => console.error("Notification listener (prayers):", err)
    );

    // 3. Pending payments (bank transfers awaiting verification)
    const unsubPayments = onSnapshot(
      query(collection(db, "transactions"), where("status", "==", "pending")),
      (snap) =>
        setCounts((prev) => {
          const payments = snap.size;
          return { ...prev, payments, total: prev.messages + prev.prayers + payments + prev.subscribers };
        }),
      (err) => console.error("Notification listener (payments):", err)
    );

    // 4. New subscribers (isNew flag not yet cleared by admin)
    const unsubSubs = onSnapshot(
      query(collection(db, "subscribers"), where("isActive", "==", true), where("isNew", "==", true)),
      (snap) =>
        setCounts((prev) => {
          const subscribers = snap.size;
          return { ...prev, subscribers, total: prev.messages + prev.prayers + prev.payments + subscribers };
        }),
      (err) => {
        // isNew field may not exist yet on old docs — this is expected
        console.warn("Notification listener (subscribers):", err);
      }
    );

    return () => {
      unsubMsgs();
      unsubPrayers();
      unsubPayments();
      unsubSubs();
    };
  }, []);

  return counts;
}
