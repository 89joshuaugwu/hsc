import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Merge Tailwind CSS classes with clsx — resolves conflicts intelligently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Format a Firestore Timestamp or Date into a readable date string
 */
export function formatDate(
  date: Date | { toDate: () => Date } | string | number,
  pattern: string = "MMM d, yyyy"
): string {
  if (!date) return "";
  let d: Date;
  if (typeof date === "object" && "toDate" in date) {
    d = date.toDate();
  } else if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
  } else {
    d = date;
  }
  return format(d, pattern);
}

/**
 * Format a number as Nigerian Naira (₦)
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate a cryptographically-safe random token (UUID-like)
 */
export function generateToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a random 6-digit numeric code (for 2FA)
 */
export function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Convert kobo (Paystack) to Naira display value
 */
export function koboToNaira(kobo: number): number {
  return kobo / 100;
}

/**
 * Convert Naira to kobo for Paystack
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}
