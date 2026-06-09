"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/upload/ImageUpload";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

const ICONS = ["Music", "BookOpen", "Mic", "Heart", "Users", "Camera", "Monitor", "Shield", "Headphones", "Pen", "Cross", "Flame", "Star", "Globe", "Zap", "Award", "Bell", "Gift", "Sun", "Moon"];

interface Dept { id: string; name: string; description: string; icon: string; slug: string; headName: string; activities: string[]; meetingSchedule: string; contactWhatsApp: string; coverImageUrl: string; coverImagePublicId?: string; isActive: boolean; order: number; }
type FormData = { name: string; description: string; icon: string; headName: string; activities: { value: string }[]; meetingSchedule: string; contactWhatsApp: string; coverImageUrl: string; coverImagePublicId: string; isActive: boolean; };

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function AdminDepartmentsPage() {
  const [items, setItems] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmData, setConfirmData] = useState<{ isOpen: boolean; id: string | null; publicId?: string }>({ isOpen: false, id: null });
  const { register, handleSubmit, reset, setValue, watch, control } = useForm<FormData>({ defaultValues: { isActive: true, icon: "Users", activities: [{ value: "" }] } });
  const { fields, append, remove } = useFieldArray({ control, name: "activities" });

  const fetchAll = async () => {
    try {
      const q = query(collection(db, "departments"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Dept));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const onSave = async (data: FormData) => {
    setSaving(true);
    try {
      const payload = { name: data.name, description: data.description, icon: data.icon, slug: slugify(data.name), headName: data.headName, activities: data.activities.map((a) => a.value).filter(Boolean), meetingSchedule: data.meetingSchedule, contactWhatsApp: data.contactWhatsApp, coverImageUrl: data.coverImageUrl, coverImagePublicId: data.coverImagePublicId || null, isActive: data.isActive };
      if (editId) { await updateDoc(doc(db, "departments", editId), { ...payload, updatedAt: Timestamp.now() }); toast.success("Updated!"); }
      else { await addDoc(collection(db, "departments"), { ...payload, order: items.length + 1, createdAt: Timestamp.now() }); toast.success("Created!"); }
      setShowForm(false); setEditId(null); reset({ isActive: true, icon: "Users", activities: [{ value: "" }], coverImageUrl: "", coverImagePublicId: "" }); fetchAll();
    } catch { toast.error("Save failed."); } finally { setSaving(false); }
  };

  const handleEdit = (item: Dept) => {
    setEditId(item.id); setValue("name", item.name); setValue("description", item.description);
    setValue("icon", item.icon); setValue("headName", item.headName);
    setValue("activities", (item.activities || []).map((a) => ({ value: a })));
    setValue("meetingSchedule", item.meetingSchedule || ""); setValue("contactWhatsApp", item.contactWhatsApp || "");
    setValue("coverImageUrl", item.coverImageUrl || ""); setValue("coverImagePublicId", item.coverImagePublicId || ""); setValue("isActive", item.isActive);
    setShowForm(true);
  };

  const confirmDelete = (id: string, publicId?: string) => setConfirmData({ isOpen: true, id, publicId });
  const handleDelete = async () => {
    const { id, publicId } = confirmData;
    if (!id) return;
    try { 
      if (publicId) {
        await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicId }) });
      }
      await deleteDoc(doc(db, "departments", id)); 
      setItems((p) => p.filter((i) => i.id !== id)); 
      toast.success("Deleted."); 
    } catch { toast.error("Delete failed."); } finally { setConfirmData({ isOpen: false, id: null }); }
  };


  const handleReorder = async (id: string, dir: "up" | "down") => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= items.length) return;
    try {
      await updateDoc(doc(db, "departments", items[idx].id), { order: swap + 1 });
      await updateDoc(doc(db, "departments", items[swap].id), { order: idx + 1 });
      fetchAll();
    } catch { toast.error("Reorder failed."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-navy-500">Departments</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); reset({ isActive: true, icon: "Users", activities: [{ value: "" }] }); }} className="inline-flex items-center gap-1 px-4 py-2 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500"><Plus size={16} />Add</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSave)} className="bg-white rounded-xl border border-border/60 p-6 space-y-4">
          <div className="flex justify-between items-center"><h3 className="font-heading text-sm font-bold text-navy-500">{editId ? "Edit" : "New"} Department</h3><button type="button" onClick={() => { setShowForm(false); setEditId(null); }}><X size={18} className="text-text-light" /></button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input {...register("name", { required: true })} placeholder="Department name" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            <select {...register("icon")} className="px-3 py-2.5 rounded-lg border border-border font-body text-sm">
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <textarea {...register("description")} placeholder="Description" rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input {...register("headName")} placeholder="Head of Department" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            <input {...register("meetingSchedule")} placeholder="Meeting schedule" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input {...register("contactWhatsApp")} placeholder="WhatsApp number" className="px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            <ImageUpload
              label="Cover Image"
              hint="Recommended: 1200×600px, JPG or PNG"
              value={watch("coverImageUrl")}
              onChange={(url, publicId) => {
                setValue("coverImageUrl", url);
                setValue("coverImagePublicId", publicId);
              }}
              onRemove={() => {
                setValue("coverImageUrl", "");
                setValue("coverImagePublicId", "");
              }}
            />
          </div>
          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-2">Activities</label>
            {fields.map((f, idx) => (
              <div key={f.id} className="flex gap-2 mb-2">
                <input {...register(`activities.${idx}.value`)} placeholder="Activity" className="flex-1 px-3 py-2 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
                {fields.length > 1 && <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
              </div>
            ))}
            <button type="button" onClick={() => append({ value: "" })} className="text-chapel-400 font-body text-xs font-semibold"><Plus size={12} className="inline" /> Add Activity</button>
          </div>
          <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" {...register("isActive")} />Active</label>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : null}{editId ? "Update" : "Create"}</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-xl border border-border/60 p-4 animate-pulse h-24" />)
        : items.length === 0 ? <p className="col-span-2 text-center py-8 font-body text-sm text-text-light">No departments yet.</p>
        : items.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-xl border border-border/60 p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("px-2 py-0.5 font-body text-[0.65rem] font-bold rounded-full", item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>{item.isActive ? "Active" : "Inactive"}</span>
                <span className="font-body text-[0.65rem] text-text-light">#{idx + 1}</span>
              </div>
              <h4 className="font-heading text-sm font-bold text-navy-500">{item.name}</h4>
              <p className="font-body text-xs text-text-muted">{item.headName || "No head assigned"}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleReorder(item.id, "up")} className="p-1.5 rounded text-text-light hover:text-chapel-400"><ArrowUp size={14} /></button>
              <button onClick={() => handleReorder(item.id, "down")} className="p-1.5 rounded text-text-light hover:text-chapel-400"><ArrowDown size={14} /></button>
              <button onClick={() => handleEdit(item)} className="p-1.5 rounded text-text-light hover:text-chapel-400 hover:bg-chapel-50"><Edit2 size={14} /></button>
              <button onClick={() => confirmDelete(item.id, item.coverImagePublicId)} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={confirmData.isOpen}
        title="Delete Department"
        message="Are you sure you want to delete this department?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmData({ isOpen: false, id: null })}
      />
    </div>
  );
}
