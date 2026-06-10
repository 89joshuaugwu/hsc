import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Stay connected with everything happening at Holy Spirit Chapel, ESUT Agbani. View our upcoming worship, community, and youth events.",
  openGraph: {
    title: "Events | Holy Spirit Chapel ESUT Agbani",
    description: "Stay connected with everything happening at Holy Spirit Chapel, ESUT Agbani.",
    url: "https://hscesut.vercel.app/events",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
