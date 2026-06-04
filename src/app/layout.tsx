import type { Metadata } from "next";
import {
  Cinzel,
  Libre_Baskerville,
  Nunito,
  Cormorant_Garamond,
} from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

/* =============================================
   Google Fonts — Holy Spirit Chapel Typography
   ============================================= */

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-quote",
  display: "swap",
});

/* =============================================
   Metadata — SEO
   ============================================= */

export const metadata: Metadata = {
  title: {
    default: "Holy Spirit Chapel ESUT Agbani",
    template: "%s | Holy Spirit Chapel ESUT Agbani",
  },
  description:
    "Welcome to Holy Spirit Chapel, ESUT Agbani — a vibrant Anglican community of faith, worship, and fellowship at Enugu State University of Technology.",
  keywords: [
    "Holy Spirit Chapel",
    "ESUT Agbani",
    "Anglican Students Fellowship",
    "Chapel ESUT",
    "Enugu State University",
    "Anglican Church Enugu",
    "ASF ESUT",
  ],
  authors: [{ name: "Holy Spirit Chapel ESUT Agbani" }],
  openGraph: {
    title: "Holy Spirit Chapel ESUT Agbani",
    description:
      "A vibrant Anglican community of faith, worship, and fellowship at Enugu State University of Technology.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Holy Spirit Chapel ESUT Agbani",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Holy Spirit Chapel ESUT Agbani",
    description:
      "A vibrant Anglican community of faith, worship, and fellowship at ESUT.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

/* =============================================
   Root Layout
   ============================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${libreBaskerville.variable} ${nunito.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-text font-body">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
            },
          }}
        />
      </body>
    </html>
  );
}
