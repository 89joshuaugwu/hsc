import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Departments",
  description: "Explore the various departments and ministries at Holy Spirit Chapel, ESUT Agbani. Find where you can serve and grow.",
  openGraph: {
    title: "Departments | Holy Spirit Chapel ESUT Agbani",
    description: "Explore the various departments and ministries at Holy Spirit Chapel, ESUT Agbani.",
    url: "https://hscesut.vercel.app/departments",
  },
};

export default function DepartmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
