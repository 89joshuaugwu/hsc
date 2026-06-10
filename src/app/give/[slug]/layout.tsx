import type { Metadata } from "next";
import { adminDb } from "@/lib/firebase-admin";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const querySnapshot = await adminDb
      .collection("give_options")
      .where("slug", "==", slug)
      .where("isActive", "==", true)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return {
        title: "Give Option Not Found",
      };
    }

    const data = querySnapshot.docs[0].data();

    return {
      title: `${data.title} | Give`,
      description: data.description || `Support the ${data.title} at Holy Spirit Chapel.`,
      openGraph: {
        title: `${data.title} | Holy Spirit Chapel`,
        description: data.description || `Support the ${data.title} at Holy Spirit Chapel.`,
        url: `https://hscesut.vercel.app/give/${slug}`,
        images: data.coverImageUrl ? [{ url: data.coverImageUrl }] : undefined,
      },
    };
  } catch (error) {
    return {
      title: "Give | Holy Spirit Chapel",
    };
  }
}

export default function GiveSlugLayout({ children }: Props) {
  return <>{children}</>;
}
