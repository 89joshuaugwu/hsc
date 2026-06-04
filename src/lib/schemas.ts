import { z } from "zod";

/* =============================================
   Holy Spirit Chapel — Zod Validation Schemas
   ============================================= */

// ─── Contact Form ───

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ─── Prayer Request Form ───

export const prayerRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  topic: z.string().min(2, "Prayer topic is required").max(200),
  request: z.string().min(10, "Please describe your prayer request").max(3000),
  isPrivate: z.boolean().default(false),
});

export type PrayerRequestFormData = z.infer<typeof prayerRequestSchema>;

// ─── Subscribe Form ───

export const subscribeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  source: z.enum(["footer", "contact_page", "events_page"]).default("footer"),
});

export type SubscribeFormData = z.infer<typeof subscribeSchema>;

// ─── Give / Donation Form ───

export const giveFormSchema = z.object({
  donorName: z.string().min(2, "Name is required").max(100),
  donorEmail: z.string().email("Please enter a valid email"),
  donorPhone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number format"),
  amount: z
    .number({ error: "Amount is required" })
    .min(100, "Minimum amount is ₦100")
    .max(10000000, "Maximum amount is ₦10,000,000"),
  method: z.enum(["paystack", "bank_transfer"]),
  giveOptionId: z.string().min(1),
});

export type GiveFormData = z.infer<typeof giveFormSchema>;

// ─── Admin: Department ───

export const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  icon: z.string().min(1, "Select an icon"),
  headName: z.string().min(2, "Head of department name is required").max(100),
  headPhotoUrl: z.string().url().optional().or(z.literal("")),
  coverImageUrl: z.string().url("Cover image is required"),
  activities: z.array(z.string().min(1)).min(1, "Add at least one activity"),
  meetingSchedule: z.string().min(2, "Meeting schedule is required").max(500),
  contactWhatsApp: z.string().optional(),
  memberCount: z.number().int().positive().optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

// ─── Admin: Event ───

export const eventSchema = z.object({
  title: z.string().min(3, "Event title is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(3000),
  category: z.enum(["worship", "community", "youth", "outreach", "conference", "vigil", "other"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  location: z.string().min(2, "Location is required").max(200),
  coverImageUrl: z.string().url("Cover image is required"),
  isFeatured: z.boolean().default(false),
  requiresRegistration: z.boolean().default(false),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export type EventFormData = z.infer<typeof eventSchema>;

// ─── Admin: Announcement ───

export const announcementSchema = z.object({
  title: z.string().min(3, "Title is required").max(200),
  content: z.string().min(10, "Content must be at least 10 characters").max(3000),
  category: z.enum(["schedule", "notice", "youth", "outreach", "general"]),
  isPriority: z.boolean().default(false),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;

// ─── Admin: Gallery Upload ───

export const gallerySchema = z.object({
  imageUrl: z.string().url("Image URL is required"),
  publicId: z.string().min(1, "Cloudinary public ID is required"),
  caption: z.string().max(300).optional(),
  category: z.enum(["worship", "community", "youth", "architecture", "events"]),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;

// ─── Admin: Give Option ───

const bankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(10, "Account number must be at least 10 digits").max(10),
  accountName: z.string().min(2, "Account name is required"),
});

export const giveOptionSchema = z.object({
  title: z.string().min(3, "Title is required").max(200),
  description: z.string().min(10, "Description is required").max(2000),
  coverImageUrl: z.string().url("Cover image is required"),
  goalAmount: z.number().positive().optional(),
  paystackEnabled: z.boolean().default(false),
  bankTransferEnabled: z.boolean().default(false),
  bankAccounts: z.array(bankAccountSchema).default([]),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type GiveOptionFormData = z.infer<typeof giveOptionSchema>;

// ─── Admin: Chapel Info / Settings ───

const serviceTimeSchema = z.object({
  label: z.string().min(1),
  day: z.string().min(1),
  time: z.string().min(1),
});

const socialsSchema = z.object({
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  whatsapp: z.string().optional(),
});

export const chapelInfoSchema = z.object({
  chapelName: z.string().min(2).max(200),
  fellowshipName: z.string().min(2).max(200),
  tagline: z.string().min(5).max(300),
  address: z.string().min(5).max(500),
  phone: z.array(z.string().min(10)),
  email: z.string().email(),
  socials: socialsSchema,
  serviceTimes: z.array(serviceTimeSchema).min(1, "Add at least one service time"),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  aboutContent: z.string().min(20).max(10000),
  missionStatement: z.string().min(10).max(1000),
  visionStatement: z.string().min(10).max(1000),
  scriptureVerse: z.string().min(5).max(500),
  scriptureReference: z.string().min(3).max(100),
});

export type ChapelInfoFormData = z.infer<typeof chapelInfoSchema>;

// ─── Admin: Settings ───

export const adminSettingsSchema = z.object({
  contactEmails: z.array(z.string().email()).min(1, "At least one contact email"),
  prayerEmail: z.string().email(),
  paymentEmail: z.string().email(),
  twoFAEnabled: z.boolean().default(false),
  paystackPublicKey: z.string().optional().or(z.literal("")),
  paystackMode: z.enum(["test", "live"]).default("test"),
});

export type AdminSettingsFormData = z.infer<typeof adminSettingsSchema>;

// ─── Admin: 2FA Verification ───

export const verify2FASchema = z.object({
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^[0-9]+$/, "Code must contain only numbers"),
});

export type Verify2FAFormData = z.infer<typeof verify2FASchema>;

// ─── Admin: Login ───

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Admin: Subscriber Broadcast ───

export const broadcastSchema = z.object({
  subject: z.string().min(3, "Subject is required").max(200),
  message: z.string().min(10, "Message body is required").max(10000),
  recipientIds: z.array(z.string()).optional(),
  sendToAll: z.boolean().default(true),
});

export type BroadcastFormData = z.infer<typeof broadcastSchema>;

// ─── Admin: Live Activity ───

export const liveActivitySchema = z.object({
  name: z.string().min(2, "Activity name is required").max(100),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type LiveActivityFormData = z.infer<typeof liveActivitySchema>;

// ─── Admin: Payment Action ───

export const paymentVerifySchema = z.object({
  transactionId: z.string().min(1),
  action: z.enum(["verify", "reject"]),
  rejectionReason: z.string().max(500).optional(),
});

export type PaymentVerifyFormData = z.infer<typeof paymentVerifySchema>;
