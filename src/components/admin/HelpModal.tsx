"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_HELP_DATA } from "@/lib/admin-guide-data";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function HelpModal({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  // Find the matching help section for the current page
  // Exact match first, or fallback to the general guide
  const currentHelp =
    ADMIN_HELP_DATA.find((h) => h.path === pathname) ||
    ADMIN_HELP_DATA.find((h) => h.id === "getting-started");

  return (
    <AnimatePresence>
      {isOpen && currentHelp && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy-700/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-start justify-center md:justify-end md:pr-8 md:pt-20 pt-16 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white w-full md:w-[400px] rounded-2xl shadow-xl overflow-hidden pointer-events-auto border border-border/50 flex flex-col max-h-[70vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/40 bg-ivory/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chapel-50 text-chapel-500 rounded-lg">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-navy-500 leading-tight">
                      {currentHelp.title}
                    </h3>
                    <p className="font-body text-xs text-text-muted">
                      How to use this page
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-text-light hover:text-chapel-500 hover:bg-chapel-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-5 overflow-y-auto space-y-6">
                {currentHelp.content.map((block, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-body text-sm font-bold text-navy-500 uppercase tracking-wider">
                      {block.title}
                    </h4>
                    <ol className="list-none space-y-3">
                      {block.steps.map((step, stepIdx) => {
                        const parts = step.split(/(\*\*.*?\*\*)/g);
                        return (
                          <li key={stepIdx} className="flex gap-3 text-sm text-text-muted leading-relaxed font-body">
                            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-ivory-dark text-[10px] font-bold text-text-light mt-0.5">
                              {stepIdx + 1}
                            </span>
                            <div>
                              {parts.map((part, i) => {
                                if (part.startsWith("**") && part.endsWith("**")) {
                                  return (
                                    <strong key={i} className="text-navy-500 font-bold">
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return <span key={i}>{part}</span>;
                              })}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/40 bg-ivory/30 text-center flex-shrink-0">
                <Link
                  href="/admin/admin-guide"
                  onClick={onClose}
                  className="font-body text-sm font-bold text-chapel-500 hover:text-chapel-600 transition-colors"
                >
                  View Full Guide →
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
