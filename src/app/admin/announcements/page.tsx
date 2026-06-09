"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface Announcement { id: string; title: string; content: string; category: string; isPriority: boolean; isActive: boolean; startDate: string; endDate: string; createdAt: { toDate: () => Date }; }
type FormData = { title: string; content: string; category: string; customCategory?: string; isPriority: boolean; isActive: boolean; startDate: string; endDate: string; };

const ANN_CATS = ["General", "Worship", "Community", "Youth"];

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmData, setConfirmData] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({ defaultValues: { isActive: true, isPriority: false, category: "General" } });
  const catVal = watch("category");

  const fetchAll = async () => {
    try {
      const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const onSave = async (data: FormData) => {
    setSaving(true);
    try {
      const finalCategory = data.category === "Custom" ? (data.customCategory?.trim() || "General") : data.category;
      const payload = { ...data, category: finalCategory };
      delete payload.customCategory;

      if (editId) {
        await updateDoc(doc(db, "announcements", editId), { ...payload, updatedAt: Timestamp.now() });
        toast.success("Updated!");
      } else {
        await addDoc(collection(db, "announcements"), { ...payload, createdAt: Timestamp.now() });
        toast.success("Created!");
      }
      setShowForm(false); setEditId(null); reset({ isActive: true, isPriority: false }); fetchAll();
    } catch { toast.error("Save failed."); } finally { setSaving(false); }
  };

  const handleEdit = (item: Announcement) => {
    setEditId(item.id);
    setValue("title", item.title); setValue("content", item.content); 
    if (ANN_CATS.includes(item.category || "General")) {
      setValue("category", item.category || "General");
      setValue("customCategory", "");
    } else {
      setValue("category", "Custom");
      setValue("customCategory", item.category);
    }
    setValue("isPriority", item.isPriority); setValue("isActive", item.isActive);
    setValue("startDate", item.startDate || ""); setValue("endDate", item.endDate || "");
    setShowForm(true);
  };

  const confirmDelete = (id: string) => setConfirmData({ isOpen: true, id });
  const handleDelete = async () => {
    const id = confirmData.id;
    if (!id) return;
    try { await deleteDoc(doc(db, "announcements", id)); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Deleted."); } catch { toast.error("Delete failed."); } finally { setConfirmData({ isOpen: false, id: null }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-navy-500">Announcements</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); reset({ isActive: true, isPriority: false }); }} className="inline-flex items-center gap-1 px-4 py-2 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500"><Plus size={16} />New</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSave)} className="bg-white rounded-xl border border-border/60 p-6 space-y-4">
          <div className="flex justify-between items-center"><h3 className="font-heading text-sm font-bold text-navy-500">{editId ? "Edit" : "New"} Announcement</h3><button type="button" onClick={() => { setShowForm(false); setEditId(null); }}><X size={18} className="text-text-light" /></button></div>
          <input {...register("title", { required: true })} placeholder="Title" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          <textarea {...register("content", { required: true })} placeholder="Content" rows={4} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex gap-2">
              <select {...register("category")} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm">
                {ANN_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Custom">Custom...</option>
              </select>
              {catVal === "Custom" && (
                <input {...register("customCategory")} placeholder="Custom category" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
              )}
            </div>
            <input {...register("startDate")} type="date" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm" />
            <input {...register("endDate")} type="date" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm" placeholder="End (opt)" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" {...register("isPriority")} />Featured</label>
            <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" {...register("isActive")} />Active</label>
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : null}{editId ? "Update" : "Create"}</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-border/40 bg-ivory/50"><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Title</th><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Category</th><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Active</th><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Date</th><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Actions</th></tr></thead>
            <tbody className="divide-y divide-border/40">
              {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-text-light">Loading...</td></tr>
              : items.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-text-light">No announcements yet.</td></tr>
              : items.map((item) => (
                <tr key={item.id} className="hover:bg-ivory/30">
                  <td className="px-4 py-3 font-body text-sm font-semibold text-navy-500">{item.title}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-chapel-400/10 text-chapel-400 font-body text-[0.65rem] font-bold rounded-full">{item.category || "General"}</span></td>
                  <td className="px-4 py-3"><span className={cn("px-2 py-0.5 font-body text-[0.65rem] font-bold rounded-full", item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>{item.isActive ? "Yes" : "No"}</span></td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{item.createdAt?.toDate?.()?.toLocaleDateString("en-NG") || "-"}</td>
                  <td className="px-4 py-3 flex gap-1"><button onClick={() => handleEdit(item)} className="p-1.5 rounded text-text-light hover:text-chapel-400 hover:bg-chapel-50"><Edit2 size={14} /></button><button onClick={() => confirmDelete(item.id)} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmData.isOpen}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmData({ isOpen: false, id: null })}
      />
    </div>
  );
}
