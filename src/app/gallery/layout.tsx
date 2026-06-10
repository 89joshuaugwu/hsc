import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "View photos of our community in focus. Moments of worship, fellowship, and service at Holy Spirit Chapel, ESUT Agbani.",
  openGraph: {
    title: "Gallery | Holy Spirit Chapel ESUT Agbani",
    description: "View photos of our community in focus. Moments of worship, fellowship, and service at Holy Spirit Chapel, ESUT Agbani.",
    url: "https://hscesut.vercel.app/gallery",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
