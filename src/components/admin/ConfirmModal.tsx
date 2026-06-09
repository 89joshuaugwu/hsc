import { X, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-700/60 backdrop-blur-sm" 
        onClick={!isLoading ? onCancel : undefined} 
      />

      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-xl shadow-chapel w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className={cn("p-2 rounded-full", isDestructive ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600")}>
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-heading text-lg font-bold text-navy-500">{title}</h3>
            </div>
            <button 
              onClick={onCancel} 
              disabled={isLoading}
              className="text-text-light hover:text-navy-500 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <p className="font-body text-sm text-text-muted">
            {message}
          </p>
        </div>

        <div className="bg-ivory/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-border/40">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 font-body text-sm font-semibold text-text-muted hover:text-navy-500 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2 font-body text-sm font-bold rounded-lg text-white transition-all disabled:opacity-60",
              isDestructive ? "bg-red-500 hover:bg-red-600" : "bg-chapel-400 hover:bg-chapel-500"
            )}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
