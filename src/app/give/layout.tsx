import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give",
  description: "Support our mission at Holy Spirit Chapel, ESUT Agbani. Your generosity fuels the work of the Kingdom.",
  openGraph: {
    title: "Give | Holy Spirit Chapel ESUT Agbani",
    description: "Support our mission at Holy Spirit Chapel, ESUT Agbani. Your generosity fuels the work of the Kingdom.",
    url: "https://hscesut.vercel.app/give",
  },
};

export default function GiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
