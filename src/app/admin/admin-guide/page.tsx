"use client";

import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_HELP_DATA } from "@/lib/admin-guide-data";
import { cn } from "@/lib/utils";

export default function AdminGuidePage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("getting-started");

  const handlePrint = () => {
    window.print();
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Print-specific CSS */}
      <style media="print">
        {`
          nav, aside, header, .no-print { display: none !important; }
          body { font-size: 12pt; background: white !important; }
          .print-break { page-break-before: always; }
          .print-break:first-of-type { page-break-before: avoid; }
          .print-expand { display: block !important; opacity: 1 !important; height: auto !important; }
          .print-hide-icon { display: none !important; }
          .print-border { border: 1px solid #ccc !important; padding: 1rem !important; margin-bottom: 2rem !important; }
        `}
      </style>

      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <h2 className="font-heading text-xl font-bold text-navy-500">Admin Help & User Guide</h2>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy-500 text-white font-body text-sm font-bold rounded-lg hover:bg-navy-600 transition-colors"
        >
          <Download size={16} />
          Download as PDF
        </button>
      </div>

      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-navy-500 mb-2">Holy Spirit Chapel Admin Guide</h1>
        <p className="text-gray-600">Complete user manual for the administrative dashboard.</p>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-4">
        {ADMIN_HELP_DATA.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-border/60 overflow-hidden print-break print-border"
            >
              {/* Header (Click to toggle) */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-ivory/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chapel-50 text-chapel-500 rounded-lg">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-navy-500">
                    {section.title}
                  </h3>
                </div>
                <ChevronDown
                  size={20}
                  className={cn(
                    "text-text-light transition-transform duration-300 no-print print-hide-icon",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {/* Content (Animated expand/collapse) */}
              <AnimatePresence initial={false}>
                {(isExpanded || typeof window !== 'undefined' && window.matchMedia('print').matches) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="print-expand"
                  >
                    <div className="p-5 pt-0 border-t border-border/40 space-y-6">
                      {section.content.map((block, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="font-body text-sm font-bold text-navy-500 uppercase tracking-wider">
                            {block.title}
                          </h4>
                          <ol className="list-decimal list-inside space-y-2">
                            {block.steps.map((step, stepIdx) => {
                              // Render bold tags dynamically
                              const parts = step.split(/(\*\*.*?\*\*)/g);
                              return (
                                <li key={stepIdx} className="font-body text-sm text-text-muted leading-relaxed pl-2">
                                  {parts.map((part, i) => {
                                    if (part.startsWith("**") && part.endsWith("**")) {
                                      return <strong key={i} className="text-navy-500 font-bold">{part.slice(2, -2)}</strong>;
                                    }
                                    return <span key={i}>{part}</span>;
                                  })}
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
