import { Timestamp } from "firebase/firestore";

/* =============================================
   Holy Spirit Chapel — TypeScript Interfaces
   All Firestore collection document types
   ============================================= */

// ─── Chapel Info (single doc: chapel_info/main) ───

export interface ServiceTime {
  label: string;
  day: string;
  time: string;
}

export interface Socials {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
}

export interface ChapelInfo {
  chapelName: string;
  fellowshipName: string;
  tagline: string;
  address: string;
  phone: string[];
  email: string;
  socials: Socials;
  serviceTimes: ServiceTime[];
  heroImageUrl: string;
  heroImagePublicId?: string;
  aboutContent: string;
  missionStatement: string;
  visionStatement: string;
  scriptureVerse: string;
  scriptureReference: string;
  mapEmbedUrl?: string;
  mapDirectionsUrl?: string;
  updatedAt: Timestamp;
}

// ─── Departments ───

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  headName: string;
  headPhotoUrl?: string;
  coverImageUrl: string;
  coverImagePublicId?: string;
  activities: string[];
  meetingSchedule: string;
  contactWhatsApp?: string;
  memberCount?: number;
  order: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Events ───

export type EventCategory =
  | "worship"
  | "community"
  | "youth"
  | "outreach"
  | "conference"
  | "vigil"
  | "other";

export interface ChapelEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  startDate: Timestamp;
  endDate: Timestamp;
  location: string;
  coverImageUrl: string;
  coverImagePublicId?: string;
  isFeatured: boolean;
  requiresRegistration: boolean;
  registrationUrl?: string;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── Announcements ───

export type AnnouncementCategory =
  | "schedule"
  | "notice"
  | "youth"
  | "outreach"
  | "general";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  isPriority: boolean;
  startDate: Timestamp;
  endDate?: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── Gallery ───

export type GalleryCategory =
  | "worship"
  | "community"
  | "youth"
  | "architecture"
  | "events";

export interface GalleryImage {
  url: string;
  publicId: string;
  caption?: string;
  order: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  category: GalleryCategory;
  coverImageUrl: string;
  coverPublicId: string;
  images: GalleryImage[];
  imageCount: number;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── Give Options ───

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface GiveOption {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  coverImagePublicId?: string;
  goalAmount?: number;
  totalReceived: number;
  paystackEnabled: boolean;
  bankTransferEnabled: boolean;
  bankAccounts: BankAccount[];
  sortOrder: number;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── Transactions ───

export type PaymentMethod = "paystack" | "bank_transfer";
export type PaymentStatus = "pending" | "verified" | "rejected" | "failed";

export interface Transaction {
  id: string;
  giveOptionId: string;
  giveOptionTitle: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paystackReference?: string;
  screenshotUrl?: string;
  screenshotPublicId?: string;
  receiptEmailSent: boolean;
  adminVerifiedBy?: string;
  adminVerifiedAt?: Timestamp;
  rejectionReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Subscribers ───

export type SubscriberSource = "footer" | "contact_page" | "events_page";

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  source: SubscriberSource;
  isActive: boolean;
  unsubscribeToken: string;
  subscribedAt: Timestamp;
}

// ─── Contact Messages ───

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp;
}

// ─── Prayer Requests ───

export interface PrayerRequest {
  id: string;
  name: string;
  email: string;
  topic: string;
  request: string;
  isPrivate: boolean;
  createdAt: Timestamp;
}

// ─── Live Status (single doc: live_status/current) ───

export interface LiveStatus {
  isLive: boolean;
  activityName: string;
  activityDescription?: string;
  startedAt: Timestamp | null;
  startedBy: string;
}

// ─── Live Activities (admin-managed presets) ───

export interface LiveActivity {
  id: string;
  name: string;
  description?: string;
  order: number;
  isActive: boolean;
}

// ─── Admin Settings (single doc: admin_settings/config) ───

export interface AdminSettings {
  contactEmails: string[];
  prayerEmail: string;
  paymentEmail: string;
  twoFAEnabled: boolean;
  paystackPublicKey: string;
  paystackMode: "test" | "live";
}

// ─── Admin 2FA (temporary, auto-cleaned) ───

export interface Admin2FA {
  code: string;
  expiresAt: Timestamp;
  used: boolean;
}
