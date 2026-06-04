/**
 * Seed script — Populates Firestore with 3 default give options.
 *
 * Run with: npx tsx scripts/seed-give-options.ts
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, Timestamp } from "firebase/firestore";
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
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.error("Could not read .env.local");
    process.exit(1);
  }
}

loadEnv();

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const giveOptions = [
  {
    title: "Tithes & Offering",
    slug: "tithes-offering",
    description:
      "Give your tithes and offerings to support the ongoing work of ministry at Holy Spirit Chapel. Your faithful giving sustains our worship, outreach, and community programs.",
    coverImageUrl: "",
    goalAmount: 0,
    totalReceived: 0,
    paystackEnabled: true,
    bankTransferEnabled: true,
    bankAccounts: [
      {
        bankName: "First Bank Nigeria",
        accountNumber: "0000000000",
        accountName: "Holy Spirit Chapel ESUT Agbani",
      },
    ],
    sortOrder: 1,
    isActive: true,
  },
  {
    title: "Building Fund",
    slug: "building-fund",
    description:
      "Contribute to the expansion and renovation of our chapel facilities. Help us create a more beautiful and spacious sanctuary for worship.",
    coverImageUrl: "",
    goalAmount: 5000000,
    totalReceived: 0,
    paystackEnabled: true,
    bankTransferEnabled: true,
    bankAccounts: [
      {
        bankName: "First Bank Nigeria",
        accountNumber: "0000000000",
        accountName: "Holy Spirit Chapel Building Fund",
      },
    ],
    sortOrder: 2,
    isActive: true,
  },
  {
    title: "Welfare & Charity",
    slug: "welfare-charity",
    description:
      "Support our welfare initiatives — providing for students in need, hospital visitations, and community outreach programs.",
    coverImageUrl: "",
    goalAmount: 0,
    totalReceived: 0,
    paystackEnabled: true,
    bankTransferEnabled: true,
    bankAccounts: [
      {
        bankName: "First Bank Nigeria",
        accountNumber: "0000000000",
        accountName: "Holy Spirit Chapel Welfare",
      },
    ],
    sortOrder: 3,
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Seeding give options to Firestore...\n");
  const colRef = collection(db, "give_options");
  const now = Timestamp.now();

  for (const opt of giveOptions) {
    const docRef = doc(colRef, opt.slug);
    await setDoc(docRef, { ...opt, createdAt: now });
    console.log(`  ✅ ${opt.title}`);
  }

  console.log("\n🎉 Give options seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
