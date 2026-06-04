"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cardHover, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Department } from "@/types/chapel.types";

/* ─── Icon map: Lucide icon name → component ─── */
import * as LucideIcons from "lucide-react";

function DeptIcon({ name, className }: { name: string; className?: string }) {
  const iconName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("") as keyof typeof LucideIcons;

  const Icon = (LucideIcons[iconName] as LucideIcons.LucideIcon) || LucideIcons.Users;
  return <Icon className={className} />;
}

interface DepartmentCardProps {
  department: Department;
  onSelect: (department: Department) => void;
}

/**
 * DepartmentCard — Framer Motion card with hover lift.
 * Shows cover image, icon, name, description snippet, and head name.
 * Gold top border on hover. Clicking opens the DepartmentModal.
 */
export function DepartmentCard({ department, onSelect }: DepartmentCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group cursor-pointer"
      onClick={() => onSelect(department)}
      layout
    >
      <motion.div
        variants={cardHover}
        className={cn(
          "bg-white rounded-xl overflow-hidden border border-border/60",
          "transition-colors duration-300",
          "group-hover:border-t-2 group-hover:border-t-gold-500"
        )}
      >
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden">
          {department.coverImageUrl ? (
            <Image
              src={department.coverImageUrl}
              alt={department.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-chapel-400 to-chapel-600 flex items-center justify-center">
              <DeptIcon
                name={department.icon}
                className="w-12 h-12 text-white/40"
              />
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-navy-700/0 group-hover:bg-navy-700/20 transition-colors duration-300" />
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {/* Icon + Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-chapel-50 text-chapel-400 flex-shrink-0">
              <DeptIcon name={department.icon} className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-navy-500 leading-tight">
              {department.name}
            </h3>
          </div>

          {/* Description (2 lines) */}
          <p className="font-body text-sm text-text-muted line-clamp-2 leading-relaxed">
            {department.description}
          </p>

          {/* Head of Department */}
          <p className="font-body text-xs text-text-light">
            <span className="text-text-muted font-semibold">Head:</span>{" "}
            {department.headName}
          </p>

          {/* Learn More button */}
          <button
            className={cn(
              "inline-flex items-center gap-1.5 font-body text-sm font-semibold",
              "text-chapel-400 hover:text-chapel-500 transition-colors",
              "group/btn"
            )}
          >
            Learn More
            <ArrowRight
              size={14}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
