"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Lock, Eye, X as XIcon, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface Prayer { id: string; name: string; email: string; topic: string; request: string; isPrivate: boolean; createdAt: { toDate: () => Date }; }

export default function AdminPrayerRequestsPage() {
  const [items, setItems] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Prayer | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [confirmData, setConfirmData] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const fetchAll = async () => {
    try {
      const q = query(collection(db, "prayer_requests"), orderBy("createdAt", "desc"), limit(500));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Prayer));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const confirmDelete = (id: string) => setConfirmData({ isOpen: true, id });
  const handleDelete = async () => {
    const id = confirmData.id;
    if (!id) return;
    try { await deleteDoc(doc(db, "prayer_requests", id)); setItems((p) => p.filter((i) => i.id !== id)); setViewing(null); toast.success("Deleted."); } catch { toast.error("Failed."); } finally { setConfirmData({ isOpen: false, id: null }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="font-heading text-lg font-bold text-navy-500">Prayer Requests</h2>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="font-body text-sm text-amber-800">Handle with care and confidentiality. Private requests are blurred until explicitly revealed.</p>
      </div>

      <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-border/40 bg-ivory/50">
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Name</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Topic</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Private</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Date</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-border/40">
              {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-text-light">Loading...</td></tr>
              : items.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-text-light">No prayer requests yet.</td></tr>
              : items.map((pr) => (
                <tr key={pr.id} className="hover:bg-ivory/30">
                  <td className="px-4 py-3 font-body text-sm font-semibold text-navy-500">{pr.name}</td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{pr.topic || "General"}</td>
                  <td className="px-4 py-3">{pr.isPrivate ? <Lock size={14} className="text-amber-500" /> : <span className="font-body text-[0.65rem] text-text-light">No</span>}</td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{pr.createdAt?.toDate?.()?.toLocaleDateString("en-NG") || "-"}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => setViewing(pr)} className="p-1.5 rounded text-text-light hover:text-chapel-400 hover:bg-chapel-50"><Eye size={14} /></button>
                    <button onClick={() => confirmDelete(pr.id)} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View modal */}
      {viewing && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => { setViewing(null); }}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-base font-bold text-navy-500">Prayer Request</h3>
              <button onClick={() => setViewing(null)}><XIcon size={18} className="text-text-light" /></button>
            </div>
            <div className="space-y-2">
              <p className="font-body text-xs text-text-light"><strong>From:</strong> {viewing.name} ({viewing.email})</p>
              <p className="font-body text-xs text-text-light"><strong>Topic:</strong> {viewing.topic || "General"}</p>
              <p className="font-body text-xs text-text-light"><strong>Date:</strong> {viewing.createdAt?.toDate?.()?.toLocaleDateString("en-NG")}</p>
              {viewing.isPrivate && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 font-body text-[0.65rem] font-bold rounded-full"><Lock size={10} />PRIVATE</span>}
            </div>
            <hr className="border-border/40" />
            {viewing.isPrivate && !revealed.has(viewing.id) ? (
              <div className="text-center space-y-3">
                <p className={cn("font-body text-sm text-text blur-sm select-none")}>{viewing.request}</p>
                <button onClick={() => setRevealed((p) => new Set(p).add(viewing.id))} className="px-4 py-2 bg-amber-100 text-amber-700 font-body text-xs font-bold rounded-lg hover:bg-amber-200">
                  <Eye size={12} className="inline mr-1" />Reveal Private Content
                </button>
              </div>
            ) : (
              <p className="font-body text-sm text-text whitespace-pre-wrap">{viewing.request}</p>
            )}
            <div className="flex justify-end">
              <button onClick={() => confirmDelete(viewing.id)} className="inline-flex items-center gap-1 px-4 py-2 bg-red-50 text-red-500 font-body text-xs font-bold rounded-lg hover:bg-red-100"><Trash2 size={12} />Delete</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmData.isOpen}
        title="Delete Prayer Request"
        message="Are you sure you want to delete this prayer request? This is sensitive data."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmData({ isOpen: false, id: null })}
      />
    </div>
  );
}
