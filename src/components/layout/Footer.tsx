"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FooterSubscribe } from "@/components/ui/FooterSubscribe";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { ChapelInfo, ServiceTime } from "@/types/chapel.types";

/* ─── Inline SVG Social Icons (lucide-react doesn't include branded icons) ─── */

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TwitterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── Social icon component map ─── */
const socialIconMap: Record<string, React.FC<{ size?: number }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  whatsapp: WhatsAppIcon,
};

/* ─── Quick Links ─── */
const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/departments", label: "Departments" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/give", label: "Give" },
];

/* ─── Default service times (fallback before Firestore loads) ─── */
const defaultServiceTimes: ServiceTime[] = [
  { label: "Sunday Service", day: "Sunday", time: "9:00 AM" },
  { label: "Midweek Service", day: "Wednesday", time: "5:00 PM" },
  { label: "Bible Study", day: "Friday", time: "5:00 PM" },
];

/* ─── Social media link type ─── */
interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
}

/**
 * Footer — Holy Spirit Chapel
 *
 * Dark bg (navy-700), 4-column grid stacking on mobile.
 * Col 1: Logo + chapel name + motto + social icons
 * Col 2: Quick Links
 * Col 3: Service Times (from Firestore chapel_info/main)
 * Col 4: FooterSubscribe component
 * Bottom bar: Copyright + Privacy + Terms
 */
export function Footer() {
  const [serviceTimes, setServiceTimes] = useState<ServiceTime[]>(defaultServiceTimes);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Fetch chapel info from Firestore ── */
  useEffect(() => {
    async function fetchChapelInfo() {
      try {
        const snap = await getDoc(doc(db, "chapel_info", "main"));
        if (snap.exists()) {
          const data = snap.data() as ChapelInfo;
          if (data.serviceTimes?.length) {
            setServiceTimes(data.serviceTimes);
          }
          // Build social links from Firestore data
          const links: SocialLink[] = [];
          if (data.socials?.facebook) {
            links.push({ icon: FacebookIcon, href: data.socials.facebook, label: "Facebook" });
          }
          if (data.socials?.instagram) {
            links.push({ icon: InstagramIcon, href: data.socials.instagram, label: "Instagram" });
          }
          if (data.socials?.twitter) {
            links.push({ icon: TwitterIcon, href: data.socials.twitter, label: "Twitter" });
          }
          if (data.socials?.whatsapp) {
            links.push({
              icon: WhatsAppIcon,
              href: `https://wa.me/${data.socials.whatsapp}`,
              label: "WhatsApp",
            });
          }
          if (links.length) setSocials(links);
        }
      } catch (error) {
        console.error("Failed to fetch chapel info:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChapelInfo();
  }, []);

  /* ── Fallback social links when Firestore has none ── */
  const displaySocials: SocialLink[] = socials.length
    ? socials
    : [
        { icon: FacebookIcon, href: "#", label: "Facebook" },
        { icon: InstagramIcon, href: "#", label: "Instagram" },
        { icon: TwitterIcon, href: "#", label: "Twitter" },
        { icon: WhatsAppIcon, href: "#", label: "WhatsApp" },
      ];

  return (
    <footer className="bg-navy-700 text-white/70">
      {/* ── Main Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* ── Column 1: Brand ── */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/clogo.png"
                alt="Holy Spirit Chapel"
                width={112}
                height={56}
                className="h-14 w-auto object-contain"
              />
            </Link>
            <div>
              <h3 className="font-display text-lg text-gold-500 tracking-wide">
                Holy Spirit Chapel
              </h3>
              <p className="font-body text-sm text-white/50 mt-1">
                ESUT Agbani, Enugu State
              </p>
            </div>
            <p className="font-display text-xs tracking-[0.2em] text-gold-500/70 uppercase">
              Dominus Regnant · Arise, Shine
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {displaySocials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full",
                    "bg-white/10 text-white/60 hover:bg-gold-500 hover:text-navy-700",
                    "transition-all duration-200"
                  )}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h4 className="font-heading text-base text-white font-bold mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Service Times ── */}
          <div>
            <h4 className="font-heading text-base text-white font-bold mb-5">
              Service Times
            </h4>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-10 bg-white/10" />
                <Skeleton className="w-full h-10 bg-white/10" />
              </div>
            ) : (
              <ul className="space-y-4 transition-opacity duration-500">
                {serviceTimes.map((service, idx) => (
                  <li key={idx} className="space-y-0.5">
                    <p className="font-body text-sm font-semibold text-white/80">
                      {service.label}
                    </p>
                    <p className="font-body text-xs text-white/50">
                      {service.day} · {service.time}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Column 4: Subscribe ── */}
          <div>
            <h4 className="font-heading text-base text-white font-bold mb-5">
              Stay Connected
            </h4>
            <p className="font-body text-sm text-white/50 mb-4">
              Get updates on events, programs, and chapel news.
            </p>
            <FooterSubscribe />
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-body text-white/40">
            <p>
              © {new Date().getFullYear()} Holy Spirit Chapel, ESUT Agbani. All
              rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
