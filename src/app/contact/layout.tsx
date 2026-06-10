import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Holy Spirit Chapel, ESUT Agbani. Send us a message, submit a prayer request, or find our location.",
  openGraph: {
    title: "Contact Us | Holy Spirit Chapel ESUT Agbani",
    description: "Get in touch with Holy Spirit Chapel, ESUT Agbani. Send us a message or submit a prayer request.",
    url: "https://hscesut.vercel.app/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
