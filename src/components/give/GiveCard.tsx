"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { GiveOption } from "@/types/chapel.types";

interface GiveCardProps {
  option: GiveOption;
}

/**
 * GiveCard — Admin-created payment option card.
 * Cover image + title + description + "Give Now →" gold button.
 * Hover: subtle lift + gold border glow.
 */
export function GiveCard({ option }: GiveCardProps) {
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/give/${option.slug}`} className="group block">
        <div
          className={cn(
            "bg-white rounded-xl overflow-hidden border border-border/60",
            "transition-all duration-300",
            "hover:shadow-gold hover:border-gold-500/30 hover:-translate-y-1"
          )}
        >
          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden">
            {option.coverImageUrl ? (
              <Image
                src={option.coverImageUrl}
                alt={option.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-5 space-y-3">
            <h3 className="font-heading text-lg font-bold text-navy-500">
              {option.title}
            </h3>
            <p className="font-body text-sm text-text-muted line-clamp-2 leading-relaxed">
              {option.description}
            </p>

            {/* Progress bar (if goal set) */}
            {option.goalAmount && option.goalAmount > 0 && (
              <div className="space-y-1">
                <div className="h-2 bg-ivory-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (option.totalReceived / option.goalAmount) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="font-body text-xs text-text-light">
                  ₦{option.totalReceived.toLocaleString()} of ₦{option.goalAmount.toLocaleString()} goal
                </p>
              </div>
            )}

            {/* CTA */}
            <span
              className={cn(
                "inline-flex items-center gap-2 font-body text-sm font-bold",
                "text-navy-700 bg-gradient-to-r from-gold-500 to-gold-400",
                "px-5 py-2.5 rounded-full",
                "group-hover:shadow-gold transition-all duration-200"
              )}
            >
              Give Now
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
