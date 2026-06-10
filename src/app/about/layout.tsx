import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the history, mission, and leadership of Holy Spirit Chapel, ESUT Agbani. Discover what makes our community unique.",
  openGraph: {
    title: "About Us | Holy Spirit Chapel ESUT Agbani",
    description: "Learn about the history, mission, and leadership of Holy Spirit Chapel, ESUT Agbani.",
    url: "https://hscesut.vercel.app/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
