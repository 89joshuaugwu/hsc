"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Send, Loader2, X as XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface Sub { id: string; name: string; email: string; source: string; isActive: boolean; createdAt: { toDate: () => Date }; }

export default function AdminSubscribersPage() {
  const [items, setItems] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientMode, setRecipientMode] = useState<"all" | "select">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState("");
  const [confirmData, setConfirmData] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const fetchAll = async () => {
    try {
      const q = query(collection(db, "subscribers"), orderBy("createdAt", "desc"), limit(500));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Sub));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const active = items.filter((s) => s.isActive);
  const thisMonth = items.filter((s) => {
    if (!s.createdAt?.toDate) return false;
    const d = s.createdAt.toDate();
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const confirmDelete = (id: string) => setConfirmData({ isOpen: true, id });
  const handleDelete = async () => {
    const id = confirmData.id;
    if (!id) return;
    try { await deleteDoc(doc(db, "subscribers", id)); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Removed."); } catch { toast.error("Failed."); } finally { setConfirmData({ isOpen: false, id: null }); }
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) { toast.error("Subject and message required."); return; }
    setSending(true);
    setProgress("Preparing...");
    try {
      const ids = recipientMode === "all" ? "all" : Array.from(selectedIds);
      const r = await fetch("/api/admin/subscribers/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, message, recipientIds: ids }) });
      const d = await r.json();
      if (r.ok) { toast.success(`Sent to ${d.sent} subscribers!`); setShowComposer(false); setSubject(""); setMessage(""); }
      else toast.error(d.error || "Failed.");
    } catch { toast.error("Error sending."); }
    finally { setSending(false); setProgress(""); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-heading text-lg font-bold text-navy-500">Subscribers</h2>
        <button onClick={() => setShowComposer(true)} className="inline-flex items-center gap-1 px-4 py-2 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500"><Send size={14} />Send Message</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border/60 p-4 text-center"><p className="font-body text-2xl font-bold text-navy-500">{items.length}</p><p className="font-body text-xs text-text-muted">Total</p></div>
        <div className="bg-white rounded-xl border border-border/60 p-4 text-center"><p className="font-body text-2xl font-bold text-green-600">{active.length}</p><p className="font-body text-xs text-text-muted">Active</p></div>
        <div className="bg-white rounded-xl border border-border/60 p-4 text-center"><p className="font-body text-2xl font-bold text-chapel-400">{thisMonth.length}</p><p className="font-body text-xs text-text-muted">This Month</p></div>
      </div>

      {/* Composer */}
      {showComposer && (
        <div className="bg-white rounded-xl border border-border/60 p-6 space-y-4">
          <div className="flex justify-between items-center"><h3 className="font-heading text-sm font-bold text-navy-500">Compose Message</h3><button onClick={() => setShowComposer(false)}><XIcon size={18} className="text-text-light" /></button></div>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message body..." rows={6} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          <div className="flex gap-3">
            <button onClick={() => setRecipientMode("all")} className={cn("px-3 py-1.5 rounded-lg font-body text-xs font-semibold", recipientMode === "all" ? "bg-chapel-400 text-white" : "bg-ivory text-text-muted")}>All Subscribers ({active.length})</button>
            <button onClick={() => setRecipientMode("select")} className={cn("px-3 py-1.5 rounded-lg font-body text-xs font-semibold", recipientMode === "select" ? "bg-chapel-400 text-white" : "bg-ivory text-text-muted")}>Select Specific</button>
          </div>
          {recipientMode === "select" && (
            <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-2 space-y-1">
              {active.map((s) => (
                <label key={s.id} className="flex items-center gap-2 px-2 py-1 hover:bg-ivory rounded cursor-pointer">
                  <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSelect(s.id)} />
                  <span className="font-body text-xs">{s.name} ({s.email})</span>
                </label>
              ))}
            </div>
          )}
          <button onClick={handleSend} disabled={sending} className="inline-flex items-center gap-2 px-5 py-2 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-60">{sending ? <><Loader2 size={14} className="animate-spin" />{progress}</> : <><Send size={14} />Send</>}</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-border/40 bg-ivory/50">
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Name</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Email</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Source</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Date</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Active</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-border/40">
              {loading ? <tr><td colSpan={6} className="px-4 py-8 text-center font-body text-sm text-text-light">Loading...</td></tr>
              : items.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center font-body text-sm text-text-light">No subscribers yet.</td></tr>
              : items.map((s) => (
                <tr key={s.id} className="hover:bg-ivory/30">
                  <td className="px-4 py-3 font-body text-sm font-semibold text-navy-500">{s.name}</td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{s.email}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-ivory-dark font-body text-[0.65rem] font-bold rounded-full">{s.source || "website"}</span></td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{s.createdAt?.toDate?.()?.toLocaleDateString("en-NG") || "-"}</td>
                  <td className="px-4 py-3"><span className={cn("px-2 py-0.5 font-body text-[0.65rem] font-bold rounded-full", s.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>{s.isActive ? "Yes" : "No"}</span></td>
                  <td className="px-4 py-3"><button onClick={() => confirmDelete(s.id)} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmData.isOpen}
        title="Remove Subscriber"
        message="Are you sure you want to remove this subscriber?"
        confirmText="Remove"
        onConfirm={handleDelete}
        onCancel={() => setConfirmData({ isOpen: false, id: null })}
      />
    </div>
  );
}
