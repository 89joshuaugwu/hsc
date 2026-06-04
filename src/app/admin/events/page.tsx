"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EventItem { id: string; title: string; description: string; category: string; startDate: string; endDate: string; location: string; coverImageUrl: string; isFeatured: boolean; requiresRegistration: boolean; registrationUrl: string; isActive: boolean; createdAt: { toDate: () => Date }; }
type FormData = { title: string; description: string; category: string; startDate: string; endDate: string; location: string; coverImageUrl: string; isFeatured: boolean; requiresRegistration: boolean; registrationUrl: string; isActive: boolean; };

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({ defaultValues: { isActive: true, isFeatured: false, requiresRegistration: false } });
  const reqReg = watch("requiresRegistration");

  const fetchAll = async () => {
    try {
      const q = query(collection(db, "events"), orderBy("startDate", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as EventItem));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const now = new Date().toISOString();
  const filtered = filter === "upcoming" ? items.filter((e) => e.startDate >= now) : filter === "past" ? items.filter((e) => e.startDate < now) : items;

  const onSave = async (data: FormData) => {
    setSaving(true);
    try {
      const payload = { ...data, startDate: data.startDate ? Timestamp.fromDate(new Date(data.startDate)) : null, endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null };
      if (editId) { await updateDoc(doc(db, "events", editId), { ...payload, updatedAt: Timestamp.now() }); toast.success("Updated!"); }
      else { await addDoc(collection(db, "events"), { ...payload, createdAt: Timestamp.now() }); toast.success("Created!"); }
      setShowForm(false); setEditId(null); reset({ isActive: true, isFeatured: false, requiresRegistration: false }); fetchAll();
    } catch { toast.error("Save failed."); } finally { setSaving(false); }
  };

  const handleEdit = (item: EventItem) => {
    setEditId(item.id);
    setValue("title", item.title); setValue("description", item.description); setValue("category", item.category);
    setValue("location", item.location); setValue("coverImageUrl", item.coverImageUrl || "");
    setValue("isFeatured", item.isFeatured); setValue("requiresRegistration", item.requiresRegistration);
    setValue("registrationUrl", item.registrationUrl || ""); setValue("isActive", item.isActive);
    // Convert Timestamp to datetime-local string
    const sd = item.startDate; setValue("startDate", typeof sd === "string" ? sd : "");
    const ed = item.endDate; setValue("endDate", typeof ed === "string" ? ed : "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try { await deleteDoc(doc(db, "events", id)); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Deleted."); } catch { toast.error("Delete failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-heading text-lg font-bold text-navy-500">Events</h2>
        <div className="flex gap-2">
          {(["all", "upcoming", "past"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1.5 rounded-lg font-body text-xs font-semibold capitalize", filter === f ? "bg-chapel-400 text-white" : "bg-white border border-border/60 text-text-muted")}>{f}</button>
          ))}
          <button onClick={() => { setShowForm(true); setEditId(null); reset({ isActive: true, isFeatured: false, requiresRegistration: false }); }} className="inline-flex items-center gap-1 px-4 py-1.5 bg-chapel-400 text-white font-body text-xs font-bold rounded-lg hover:bg-chapel-500"><Plus size={14} />New Event</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSave)} className="bg-white rounded-xl border border-border/60 p-6 space-y-4">
          <div className="flex justify-between items-center"><h3 className="font-heading text-sm font-bold text-navy-500">{editId ? "Edit" : "New"} Event</h3><button type="button" onClick={() => { setShowForm(false); setEditId(null); }}><X size={18} className="text-text-light" /></button></div>
          <input {...register("title", { required: true })} placeholder="Event title" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          <textarea {...register("description")} placeholder="Description" rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select {...register("category")} className="px-3 py-2.5 rounded-lg border border-border font-body text-sm"><option value="Worship">Worship</option><option value="Community">Community</option><option value="Youth">Youth</option><option value="Outreach">Outreach</option></select>
            <input {...register("startDate")} type="datetime-local" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm" />
            <input {...register("endDate")} type="datetime-local" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input {...register("location")} placeholder="Location" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            <input {...register("coverImageUrl")} placeholder="Cover image URL (Cloudinary)" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" {...register("isFeatured")} />Featured</label>
            <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" {...register("isActive")} />Active</label>
            <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" {...register("requiresRegistration")} />Requires Registration</label>
          </div>
          {reqReg && <input {...register("registrationUrl")} placeholder="Registration URL" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />}
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : null}{editId ? "Update" : "Create"}</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-border/40 bg-ivory/50"><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Title</th><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Category</th><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Location</th><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Active</th><th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Actions</th></tr></thead>
            <tbody className="divide-y divide-border/40">
              {loading ? <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-text-light">Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-text-light">No events found.</td></tr>
              : filtered.map((item) => (
                <tr key={item.id} className="hover:bg-ivory/30">
                  <td className="px-4 py-3 font-body text-sm font-semibold text-navy-500">{item.title}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-chapel-400/10 text-chapel-400 font-body text-[0.65rem] font-bold rounded-full">{item.category}</span></td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{item.location || "-"}</td>
                  <td className="px-4 py-3"><span className={cn("px-2 py-0.5 font-body text-[0.65rem] font-bold rounded-full", item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>{item.isActive ? "Yes" : "No"}</span></td>
                  <td className="px-4 py-3 flex gap-1"><button onClick={() => handleEdit(item)} className="p-1.5 rounded text-text-light hover:text-chapel-400 hover:bg-chapel-50"><Edit2 size={14} /></button><button onClick={() => handleDelete(item.id)} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
