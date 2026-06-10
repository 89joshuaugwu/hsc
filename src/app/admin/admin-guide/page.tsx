"use client";

import { useState, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_HELP_DATA } from "@/lib/admin-guide-data";
import { cn } from "@/lib/utils";

function renderSteps(steps: string[]) {
  return (
    <ol className="list-decimal list-inside space-y-2">
      {steps.map((step, stepIdx) => {
        const parts = step.split(/(\*\*.*?\*\*)/g);
        return (
          <li
            key={stepIdx}
            className="font-body text-sm text-text-muted leading-relaxed pl-2"
          >
            {parts.map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i} className="text-navy-500 font-bold">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </li>
        );
      })}
    </ol>
  );
}

function SectionContent({
  content,
}: {
  content: { title: string; steps: string[] }[];
}) {
  return (
    <div className="p-5 pt-0 border-t border-border/40 space-y-6">
      {content.map((block, idx) => (
        <div key={idx} className="space-y-3">
          <h4 className="font-body text-sm font-bold text-navy-500 uppercase tracking-wider">
            {block.title}
          </h4>
          {renderSteps(block.steps)}
        </div>
      ))}
    </div>
  );
}

export default function AdminGuidePage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "getting-started"
  );
  const [isPrinting, setIsPrinting] = useState(false);

  // Listen to native print events so isPrinting resets even if user
  // cancels the print dialog or uses Ctrl+P directly
  useEffect(() => {
    const onBefore = () => setIsPrinting(true);
    const onAfter = () => setIsPrinting(false);

    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);
    return () => {
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
    };
  }, []);

  const handleDownload = () => {
    // Expand everything first, then print once React has re-rendered
    setIsPrinting(true);
    // Double rAF ensures DOM paint with all sections open before dialog opens
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Print CSS — only hides chrome UI, no need to force-show content
          because isPrinting already renders everything into the DOM */}
      <style media="print">{`
        nav, aside, header, .no-print { display: none !important; }
        body { font-size: 12pt; background: white !important; }
      `}</style>

      {/* Screen header */}
      <div className="flex items-center justify-between no-print">
        <h2 className="font-heading text-xl font-bold text-navy-500">
          Admin Help &amp; User Guide
        </h2>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy-500 text-white font-body text-sm font-bold rounded-lg hover:bg-navy-600 transition-colors"
        >
          <Download size={16} />
          Download as PDF
        </button>
      </div>

      {/* Print-only page title */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-navy-500 mb-2">
          Holy Spirit Chapel Admin Guide
        </h1>
        <p className="text-gray-600">
          Complete user manual for the administrative dashboard.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {ADMIN_HELP_DATA.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-border/60 overflow-hidden"
            >
              {/* Accordion toggle — hidden in print */}
              <button
                onClick={() => toggleSection(section.id)}
                className="no-print w-full flex items-center justify-between p-5 hover:bg-ivory/30 transition-colors text-left"
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
                    "text-text-light transition-transform duration-300",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>

              {/* Static header shown only in print */}
              <div className="hidden print:flex items-center gap-3 p-5 border-b border-border/40">
                <div className="p-2 bg-chapel-50 text-chapel-500 rounded-lg">
                  <Icon size={20} />
                </div>
                <h3 className="font-heading text-lg font-bold text-navy-500">
                  {section.title}
                </h3>
              </div>

              {/* Content — two render paths:
                  1. isPrinting → plain div, no animation, always in DOM
                  2. normal → Framer Motion accordion */}
              {isPrinting ? (
                <SectionContent content={section.content} />
              ) : (
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <SectionContent content={section.content} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
