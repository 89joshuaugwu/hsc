"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface Msg { id: string; name: string; email: string; subject: string; message: string; isRead: boolean; createdAt: { toDate: () => Date }; }

export default function AdminContactMessagesPage() {
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  useEffect(() => {
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"), limit(500));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Msg));
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleExpand = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    const item = items.find((i) => i.id === id);
    if (item && !item.isRead) {
      try {
        await updateDoc(doc(db, "contact_messages", id), { isRead: true });
        setItems((p) => p.map((i) => i.id === id ? { ...i, isRead: true } : i));
      } catch { /* silent */ }
    }
  };

  const confirmDelete = (id: string) => setConfirmData({ isOpen: true, id });
  const handleDelete = async () => {
    const id = confirmData.id;
    if (!id) return;
    try { await deleteDoc(doc(db, "contact_messages", id)); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Deleted."); } catch { toast.error("Failed."); } finally { setConfirmData({ isOpen: false, id: null }); }
  };

  const unreadCount = items.filter((i) => !i.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="font-heading text-lg font-bold text-navy-500">Contact Messages</h2>
        {unreadCount > 0 && <span className="px-2.5 py-0.5 bg-chapel-400 text-white font-body text-xs font-bold rounded-full">{unreadCount} unread</span>}
      </div>

      <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
        {loading ? <div className="px-4 py-8 text-center font-body text-sm text-text-light">Loading...</div>
        : items.length === 0 ? <div className="px-4 py-8 text-center font-body text-sm text-text-light">No messages yet.</div>
        : <div className="divide-y divide-border/40">
          {items.map((msg) => (
            <div key={msg.id}>
              <div className={cn("flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-ivory/30 transition-colors", !msg.isRead && "bg-chapel-400/5")} onClick={() => handleExpand(msg.id)}>
                <div className="flex-shrink-0">{msg.isRead ? <MailOpen size={16} className="text-text-light" /> : <Mail size={16} className="text-chapel-400" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-body text-sm", !msg.isRead ? "font-bold text-navy-500" : "text-text-muted")}>{msg.name}</span>
                    <span className="font-body text-[0.65rem] text-text-light">{msg.email}</span>
                  </div>
                  <p className="font-body text-xs text-text-muted truncate">{msg.subject || "No subject"} — {msg.message}</p>
                </div>
                <span className="font-body text-[0.65rem] text-text-light whitespace-nowrap">{msg.createdAt?.toDate?.()?.toLocaleDateString("en-NG") || ""}</span>
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); confirmDelete(msg.id); }} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                  {expanded === msg.id ? <ChevronUp size={14} className="text-text-light" /> : <ChevronDown size={14} className="text-text-light" />}
                </div>
              </div>
              {expanded === msg.id && (
                <div className="px-4 py-4 bg-ivory/50 border-t border-border/40">
                  <div className="space-y-2">
                    <p className="font-body text-xs text-text-light"><strong>From:</strong> {msg.name} ({msg.email})</p>
                    <p className="font-body text-xs text-text-light"><strong>Subject:</strong> {msg.subject || "General"}</p>
                    <hr className="border-border/40" />
                    <p className="font-body text-sm text-text whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>}
      </div>

      <ConfirmModal
        isOpen={confirmData.isOpen}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmData({ isOpen: false, id: null })}
      />
    </div>
  );
}
