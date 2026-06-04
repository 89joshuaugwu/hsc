"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, MessageCircle, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import type { Department } from "@/types/chapel.types";

function DeptIcon({ name, className }: { name: string; className?: string }) {
  const iconName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("") as keyof typeof LucideIcons;
  const Icon = (LucideIcons[iconName] as LucideIcons.LucideIcon) || LucideIcons.Users;
  return <Icon className={className} />;
}

interface DepartmentModalProps {
  department: Department | null;
  onClose: () => void;
}

/**
 * DepartmentModal — Slide-in panel.
 * Desktop: slides from right. Mobile: slides from bottom.
 * Backdrop with blur + dark overlay. Close via X button or backdrop click.
 */
export function DepartmentModal({ department, onClose }: DepartmentModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Lock body scroll when modal open */
  useEffect(() => {
    if (department) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [department]);

  /* Close on Escape key */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

  return (
    <AnimatePresence>
      {department && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-navy-700/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="modal-panel"
            initial={isMobile ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
            exit={isMobile ? { y: "100%", opacity: 0 } : { x: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className={cn(
              "fixed z-50 bg-white overflow-y-auto",
              // Desktop: right panel
              "md:top-0 md:right-0 md:bottom-0 md:w-full md:max-w-lg md:shadow-chapel-lg",
              // Mobile: bottom sheet
              "top-[10%] left-0 right-0 bottom-0 rounded-t-2xl md:rounded-none"
            )}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className={cn(
                "absolute top-4 right-4 z-10",
                "flex items-center justify-center w-10 h-10 rounded-full",
                "bg-white/90 text-navy-500 hover:bg-white hover:text-navy-700",
                "shadow-md transition-all"
              )}
            >
              <X size={20} />
            </button>

            {/* Cover Image */}
            <div className="relative w-full aspect-video">
              {department.coverImageUrl ? (
                <Image
                  src={department.coverImageUrl}
                  alt={department.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 512px"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-chapel-400 to-chapel-600 flex items-center justify-center">
                  <DeptIcon name={department.icon} className="w-16 h-16 text-white/30" />
                </div>
              )}
              {/* Gradient overlay at bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8 -mt-4 relative space-y-6">
              {/* Department name + icon */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-chapel-50 text-chapel-400 shadow-sm">
                  <DeptIcon name={department.icon} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-navy-500">
                    {department.name}
                  </h2>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="font-body text-sm text-text-muted leading-relaxed whitespace-pre-line">
                  {department.description}
                </p>
              </div>

              {/* Head of Department */}
              <div className="flex items-center gap-3 p-4 bg-ivory rounded-xl">
                {department.headPhotoUrl ? (
                  <Image
                    src={department.headPhotoUrl}
                    alt={department.headName}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-chapel-100 flex items-center justify-center text-chapel-500">
                    <Users size={20} />
                  </div>
                )}
                <div>
                  <p className="font-body text-xs text-text-light uppercase tracking-wider font-semibold">
                    Head of Department
                  </p>
                  <p className="font-body text-sm font-bold text-navy-500">
                    {department.headName}
                  </p>
                </div>
              </div>

              {/* Activities */}
              {department.activities?.length > 0 && (
                <div>
                  <h3 className="font-heading text-sm font-bold text-navy-500 mb-3">
                    Activities
                  </h3>
                  <ul className="space-y-2">
                    {department.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2
                          size={16}
                          className="text-chapel-400 mt-0.5 flex-shrink-0"
                        />
                        <span className="font-body text-sm text-text-muted">
                          {activity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meeting Schedule */}
              {department.meetingSchedule && (
                <div className="flex items-start gap-3 p-4 bg-gold-500/5 border border-gold-500/20 rounded-xl">
                  <Calendar size={18} className="text-gold-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-body text-xs text-gold-700 uppercase tracking-wider font-semibold mb-1">
                      Meeting Schedule
                    </p>
                    <p className="font-body text-sm text-navy-500">
                      {department.meetingSchedule}
                    </p>
                  </div>
                </div>
              )}

              {/* Member Count */}
              {department.memberCount && (
                <div className="flex items-center gap-2 text-text-muted">
                  <Users size={16} />
                  <span className="font-body text-sm">
                    {department.memberCount} members
                  </span>
                </div>
              )}

              {/* Contact WhatsApp */}
              {department.contactWhatsApp && (
                <a
                  href={`https://wa.me/${department.contactWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center gap-2 w-full py-3 rounded-xl",
                    "bg-green-600 text-white font-body font-bold text-sm",
                    "hover:bg-green-700 transition-colors"
                  )}
                >
                  <MessageCircle size={18} />
                  Contact Department
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
