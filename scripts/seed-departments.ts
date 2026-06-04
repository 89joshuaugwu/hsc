/**
 * Seed script — Populates Firestore with 8 default departments.
 *
 * Run with: npx tsx scripts/seed-departments.ts
 *
 * Prerequisites:
 * - .env.local must be present with Firebase config
 * - Firestore must be initialized in Firebase console
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

/* ── Load env vars manually (Node.js doesn't read .env.local) ── */
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    console.error("Could not read .env.local — make sure it exists.");
    process.exit(1);
  }
}

loadEnv();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ─── 8 Default Departments ─── */
const departments = [
  {
    name: "Choir Department",
    slug: "choir",
    description:
      "Leading the congregation in praise and worship through hymns, anthems, and contemporary worship songs. The Choir Department ministers through music and creates an atmosphere of worship during services and special programs.",
    icon: "music",
    headName: "To be announced",
    coverImageUrl: "",
    activities: [
      "Sunday worship leading",
      "Choir rehearsals",
      "Special musical presentations",
      "Carol services",
      "Worship workshops",
    ],
    meetingSchedule: "Wednesdays & Saturdays, 4:00 PM",
    order: 1,
    isActive: true,
  },
  {
    name: "Band Department",
    slug: "band",
    description:
      "Providing instrumental accompaniment for worship sessions, services, and chapel events. The Band Department consists of skilled instrumentalists who use their talents to enhance the worship experience.",
    icon: "guitar",
    headName: "To be announced",
    coverImageUrl: "",
    activities: [
      "Instrumental worship",
      "Band rehearsals",
      "Sound check coordination",
      "Musical training sessions",
      "Concert performances",
    ],
    meetingSchedule: "Tuesdays & Thursdays, 4:00 PM",
    order: 2,
    isActive: true,
  },
  {
    name: "Ushering Department",
    slug: "ushering",
    description:
      "Welcoming and guiding worshippers, maintaining order during services, and ensuring a smooth worship experience for all members and visitors. The Ushering Department is the first point of contact for everyone who enters the chapel.",
    icon: "hand-helping",
    headName: "To be announced",
    coverImageUrl: "",
    activities: [
      "Welcoming worshippers",
      "Seating coordination",
      "Offering collection",
      "Crowd management",
      "Visitor assistance",
    ],
    meetingSchedule: "Saturdays, 3:00 PM",
    order: 3,
    isActive: true,
  },
  {
    name: "Sanctuary Decoration Department",
    slug: "sanctuary-decoration",
    description:
      "Beautifying the chapel sanctuary and altar for worship services, festivals, and special occasions. This department ensures the worship space reflects the glory and reverence of God through creative decoration.",
    icon: "flower-2",
    headName: "To be announced",
    coverImageUrl: "",
    activities: [
      "Altar decoration",
      "Seasonal decorations (Christmas, Easter, Harvest)",
      "Floral arrangements",
      "Event venue setup",
      "Creative arts displays",
    ],
    meetingSchedule: "Fridays, 4:00 PM",
    order: 4,
    isActive: true,
  },
  {
    name: "Prayer Department",
    slug: "prayer",
    description:
      "Anchoring the spiritual life of the chapel through organized prayer sessions, intercession, and prayer walks. The Prayer Department ensures that every activity of the chapel is covered in prayer.",
    icon: "heart-handshake",
    headName: "To be announced",
    coverImageUrl: "",
    activities: [
      "Morning devotional prayers",
      "Intercessory prayer sessions",
      "Night vigils",
      "Prayer walks",
      "Prayer chain coordination",
    ],
    meetingSchedule: "Daily, 6:00 AM & Fridays, 10:00 PM (Vigil)",
    order: 5,
    isActive: true,
  },
  {
    name: "Evangelism Department",
    slug: "evangelism",
    description:
      "Spreading the Gospel of Jesus Christ within and beyond the ESUT campus through outreach programs, campus evangelism, and community missions. The Evangelism Department is driven by the Great Commission.",
    icon: "megaphone",
    headName: "To be announced",
    coverImageUrl: "",
    activities: [
      "Campus evangelism",
      "Community outreach",
      "Tract distribution",
      "Hospital visitations",
      "New convert follow-up",
    ],
    meetingSchedule: "Saturdays, 2:00 PM",
    order: 6,
    isActive: true,
  },
  {
    name: "Welfare Department",
    slug: "welfare",
    description:
      "Caring for the material and emotional needs of chapel members and the wider community. The Welfare Department organizes charity drives, visits the sick, and provides support to members in need.",
    icon: "heart",
    headName: "To be announced",
    coverImageUrl: "",
    activities: [
      "Sick visitation",
      "Charity and donation drives",
      "Birthday celebrations",
      "Bereavement support",
      "Student welfare support",
    ],
    meetingSchedule: "Sundays after service & Wednesdays, 5:00 PM",
    order: 7,
    isActive: true,
  },
  {
    name: "Technical Department",
    slug: "technical",
    description:
      "Managing the chapel's sound system, projectors, lighting, media, and all technical equipment for worship services and events. The Technical Department ensures seamless audio-visual experiences.",
    icon: "monitor-speaker",
    headName: "To be announced",
    coverImageUrl: "",
    activities: [
      "Sound engineering",
      "Projection and media operation",
      "Lighting setup",
      "Live recording",
      "Equipment maintenance",
    ],
    meetingSchedule: "Saturdays, 1:00 PM",
    order: 8,
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Seeding 8 departments to Firestore...\n");

  const colRef = collection(db, "departments");
  const now = Timestamp.now();

  for (const dept of departments) {
    const docRef = doc(colRef, dept.slug);
    await setDoc(docRef, {
      ...dept,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  ✅ ${dept.name}`);
  }

  console.log("\n🎉 All departments seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
