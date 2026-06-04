"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LiveBadge } from "./LiveBadge";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";

/* ─── Navigation Links ─── */
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/departments", label: "Departments" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

/**
 * NavBar — Holy Spirit Chapel
 *
 * Desktop: Logo left | Links center | LiveBadge + "Give" button right
 * Mobile:  Logo left | Hamburger right → full-screen overlay
 * Sticky with blur backdrop on scroll
 * Active route indicated with gold underline
 */
export function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ── Detect scroll for sticky backdrop ── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ── Close mobile menu on route change ── */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/85 backdrop-blur-md border-b border-border/50 shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0 relative z-10">
              <Image
                src="/clogo.png"
                alt="Holy Spirit Chapel"
                width={80}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* ── Desktop Navigation Links (center) ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 font-body text-sm font-semibold tracking-wide transition-colors rounded-lg",
                    isActive(link.href)
                      ? "text-chapel-400"
                      : scrolled
                        ? "text-navy-500 hover:text-chapel-400"
                        : "text-white/90 hover:text-white"
                  )}
                >
                  {link.label}
                  {/* Gold underline for active route */}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Desktop Right Side: LiveBadge + Give CTA ── */}
            <div className="hidden lg:flex items-center gap-3">
              <LiveBadge />
              <Link
                href="/give"
                className={cn(
                  "inline-flex items-center px-6 py-2.5 rounded-full font-body font-bold text-sm",
                  "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-700",
                  "hover:shadow-gold hover:-translate-y-0.5 active:translate-y-0",
                  "transition-all duration-200"
                )}
              >
                Give
              </Link>
            </div>

            {/* ── Mobile: LiveBadge + Hamburger ── */}
            <div className="flex lg:hidden items-center gap-3">
              <LiveBadge className="hidden sm:inline-flex" />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "relative z-50 p-2 rounded-lg transition-colors",
                  mobileOpen
                    ? "text-white"
                    : scrolled
                      ? "text-navy-500 hover:bg-navy-500/5"
                      : "text-white hover:bg-white/10"
                )}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-navy-700/98 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.nav
              variants={stagger(0.08)}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center gap-2"
            >
              {/* Mobile LiveBadge */}
              <motion.div variants={fadeUp} className="mb-6">
                <LiveBadge />
              </motion.div>

              {navLinks.map((link) => (
                <motion.div key={link.href} variants={fadeUp}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-6 py-3 text-center font-body text-lg font-semibold rounded-xl transition-colors",
                      isActive(link.href)
                        ? "text-gold-500"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="block w-8 h-0.5 bg-gold-500 mx-auto mt-1 rounded-full" />
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Give CTA */}
              <motion.div variants={fadeUp} className="mt-6">
                <Link
                  href="/give"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "inline-flex items-center px-10 py-3 rounded-full font-body font-bold text-base",
                    "bg-gradient-to-r from-gold-500 to-gold-400 text-navy-700",
                    "hover:shadow-gold active:scale-95",
                    "transition-all duration-200"
                  )}
                >
                  Give
                </Link>
              </motion.div>

              {/* Mobile Motto */}
              <motion.p
                variants={fadeUp}
                className="mt-8 font-display text-xs tracking-[0.25em] text-gold-500/60 uppercase"
              >
                Dominus Regnant
              </motion.p>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
