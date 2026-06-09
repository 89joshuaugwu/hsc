"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/upload/ImageUpload";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface GiveOption { id: string; title: string; slug: string; description: string; coverImageUrl: string; coverImagePublicId?: string; goalAmount: number | null; totalReceived: number; paystackEnabled: boolean; bankTransferEnabled: boolean; bankAccounts: { bankName: string; accountNumber: string; accountName: string; }[]; sortOrder: number; isActive: boolean; }
type FormData = { title: string; slug: string; description: string; coverImageUrl: string; coverImagePublicId: string; goalAmount: number | null; paystackEnabled: boolean; bankTransferEnabled: boolean; bankAccounts: { bankName: string; accountNumber: string; accountName: string; }[]; isActive: boolean; };

export default function AdminGivePage() {
  const [items, setItems] = useState<GiveOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmData, setConfirmData] = useState<{ isOpen: boolean; id: string | null; publicId?: string }>({ isOpen: false, id: null });
  
  const { register, handleSubmit, reset, setValue, control, watch } = useForm<FormData>({ 
    defaultValues: { isActive: true, paystackEnabled: true, bankTransferEnabled: true, bankAccounts: [{ bankName: "", accountNumber: "", accountName: "" }], coverImageUrl: "", coverImagePublicId: "" } 
  });
  const { fields, append, remove } = useFieldArray({ control, name: "bankAccounts" });
  
  const bankTransferEnabled = watch("bankTransferEnabled");
  const titleVal = watch("title");

  const fetchAll = async () => {
    try {
      const q = query(collection(db, "give_options"), orderBy("sortOrder", "asc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GiveOption));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  // Auto-slugify
  useEffect(() => {
    if (!editId && titleVal) {
      setValue("slug", slugify(titleVal), { shouldValidate: true });
    }
  }, [titleVal, editId, setValue]);

  const onSave = async (data: FormData) => {
    if (data.bankTransferEnabled && data.bankAccounts.length === 0) {
      toast.error("At least one bank account is required when Bank Transfer is enabled.");
      return;
    }

    setSaving(true);
    try {
      const slugToSave = data.slug || slugify(data.title);
      const payload = { 
        title: data.title, 
        slug: slugToSave, 
        description: data.description, 
        coverImageUrl: data.coverImageUrl, 
        coverImagePublicId: data.coverImagePublicId || null,
        goalAmount: data.goalAmount || null, 
        paystackEnabled: data.paystackEnabled, 
        bankTransferEnabled: data.bankTransferEnabled, 
        bankAccounts: data.bankTransferEnabled ? data.bankAccounts : [], 
        isActive: data.isActive 
      };

      if (editId) { 
        await updateDoc(doc(db, "give_options", editId), { ...payload, updatedAt: Timestamp.now() }); 
        toast.success("Updated!"); 
      }
      else { 
        await addDoc(collection(db, "give_options"), { ...payload, totalReceived: 0, sortOrder: items.length + 1, createdAt: Timestamp.now() }); 
        toast.success("Created!"); 
      }
      setShowForm(false); setEditId(null); 
      reset({ isActive: true, paystackEnabled: true, bankTransferEnabled: true, bankAccounts: [{ bankName: "", accountNumber: "", accountName: "" }], coverImageUrl: "", coverImagePublicId: "" }); 
      fetchAll();
    } catch { toast.error("Save failed."); } finally { setSaving(false); }
  };

  const handleEdit = (item: GiveOption) => {
    setEditId(item.id); 
    setValue("title", item.title); 
    setValue("slug", item.slug); 
    setValue("description", item.description);
    setValue("coverImageUrl", item.coverImageUrl || ""); 
    setValue("coverImagePublicId", item.coverImagePublicId || ""); 
    setValue("goalAmount", item.goalAmount || null);
    setValue("paystackEnabled", item.paystackEnabled ?? true);
    setValue("bankTransferEnabled", item.bankTransferEnabled ?? true);
    setValue("bankAccounts", item.bankAccounts && item.bankAccounts.length > 0 ? item.bankAccounts : [{ bankName: "", accountNumber: "", accountName: "" }]);
    setValue("isActive", item.isActive ?? true);
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
      await deleteDoc(doc(db, "give_options", id)); 
      setItems((p) => p.filter((i) => i.id !== id)); 
      toast.success("Deleted."); 
    } catch { toast.error("Delete failed."); } finally { setConfirmData({ isOpen: false, id: null }); }
  };

  const handleReorder = async (id: string, dir: "up" | "down") => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= items.length) return;
    try {
      await updateDoc(doc(db, "give_options", items[idx].id), { sortOrder: swap + 1 });
      await updateDoc(doc(db, "give_options", items[swap].id), { sortOrder: idx + 1 });
      fetchAll();
    } catch { toast.error("Reorder failed."); }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-navy-500">Give Options</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); reset({ isActive: true, paystackEnabled: true, bankTransferEnabled: true, bankAccounts: [{ bankName: "", accountNumber: "", accountName: "" }], coverImageUrl: "", coverImagePublicId: "" }); }} className="inline-flex items-center gap-1 px-4 py-2 bg-gold-500 text-navy-700 font-body text-sm font-bold rounded-lg hover:bg-gold-600"><Plus size={16} />Add New Give Option</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSave)} className="bg-white rounded-xl border border-border/60 p-6 space-y-6">
          <div className="flex justify-between items-center"><h3 className="font-heading text-sm font-bold text-navy-500">{editId ? "Edit" : "New"} Give Option</h3><button type="button" onClick={() => { setShowForm(false); setEditId(null); }}><X size={18} className="text-text-light" /></button></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Title</label>
              <input {...register("title", { required: true })} placeholder="e.g. Tithes & Offering" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
            <div>
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Slug</label>
              <input {...register("slug", { required: true })} placeholder="e.g. tithes-offering" className="w-full px-3 py-2.5 rounded-lg border border-border bg-ivory font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
          </div>

          <div>
            <label className="block font-body text-xs font-semibold text-text-muted mb-1">Description</label>
            <textarea {...register("description", { required: true })} rows={3} placeholder="A short description of this give option" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
              <label className="block font-body text-xs font-semibold text-text-muted mb-1">Goal Amount (Optional, ₦)</label>
              <input type="number" {...register("goalAmount", { valueAsNumber: true })} placeholder="Leave empty if no goal" className="w-full px-3 py-2.5 rounded-lg border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30" />
            </div>
          </div>

          <div className="border-t border-border/40 pt-4 space-y-4">
            <h4 className="font-heading text-sm font-bold text-navy-500">Payment Methods</h4>
            
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 font-body text-sm font-semibold"><input type="checkbox" {...register("paystackEnabled")} className="w-4 h-4 rounded" /> Accept Paystack Payments</label>
              <label className="flex items-center gap-2 font-body text-sm font-semibold"><input type="checkbox" {...register("bankTransferEnabled")} className="w-4 h-4 rounded" /> Accept Bank Transfers</label>
            </div>

            {bankTransferEnabled && (
              <div className="bg-ivory/50 rounded-xl border border-border/60 p-4 space-y-3 mt-3">
                <h5 className="font-body text-xs font-bold text-text-muted">BANK ACCOUNTS</h5>
                {fields.map((f, idx) => (
                  <div key={f.id} className="flex flex-wrap gap-2 items-start">
                    <input {...register(`bankAccounts.${idx}.bankName`, { required: true })} placeholder="Bank Name" className="flex-1 px-3 py-2 rounded-lg border border-border font-body text-sm" />
                    <input {...register(`bankAccounts.${idx}.accountNumber`, { required: true })} placeholder="Account Number" className="flex-1 px-3 py-2 rounded-lg border border-border font-body text-sm" />
                    <input {...register(`bankAccounts.${idx}.accountName`, { required: true })} placeholder="Account Name" className="flex-1 px-3 py-2 rounded-lg border border-border font-body text-sm" />
                    <button type="button" onClick={() => remove(idx)} className="p-2 text-red-400 hover:text-red-600 rounded bg-white border border-border"><Trash2 size={16} /></button>
                  </div>
                ))}
                {fields.length < 5 && (
                  <button type="button" onClick={() => append({ bankName: "", accountNumber: "", accountName: "" })} className="text-chapel-400 font-body text-xs font-semibold hover:underline mt-1"><Plus size={12} className="inline mr-1" />Add Account</button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("isActive")} className="w-4 h-4 rounded" id="isActive" />
            <label htmlFor="isActive" className="font-body text-sm font-semibold">Active (visible on website)</label>
          </div>

          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-60">{saving ? <Loader2 size={14} className="animate-spin" /> : null}{editId ? "Update Give Option" : "Create Give Option"}</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-xl border border-border/60 animate-pulse h-64" />)
        : items.length === 0 ? <p className="col-span-full text-center py-8 font-body text-sm text-text-light">No give options created yet.</p>
        : items.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-xl border border-border/60 overflow-hidden flex flex-col relative">
            <div className="relative aspect-video bg-ivory-dark">
              {item.coverImageUrl ? (
                <Image src={item.coverImageUrl} alt={item.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-light font-body text-xs">No Image</div>
              )}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className={cn("px-2 py-0.5 font-body text-[0.65rem] font-bold rounded-full text-white shadow", item.isActive ? "bg-green-500" : "bg-red-500")}>{item.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-heading text-base font-bold text-navy-500">{item.title}</h4>
                  <span className="font-body text-[0.65rem] text-text-light bg-ivory px-1.5 py-0.5 rounded">/{item.slug}</span>
                </div>
              </div>
              
              <p className="font-body text-xs text-text-muted line-clamp-2 mb-3 flex-1">{item.description}</p>
              
              <div className="bg-ivory/50 rounded-lg p-2.5 mb-3 border border-border/40 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-body text-[0.7rem] text-text-muted font-semibold uppercase tracking-wider">Revenue</span>
                  <span className="font-body text-xs font-bold text-navy-500">₦{(item.totalReceived || 0).toLocaleString()}</span>
                </div>
                {item.goalAmount ? (
                  <div className="flex justify-between items-center">
                    <span className="font-body text-[0.7rem] text-text-muted font-semibold uppercase tracking-wider">Goal</span>
                    <span className="font-body text-xs font-bold text-gold-600">₦{item.goalAmount.toLocaleString()}</span>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                <span className={cn("px-2 py-0.5 font-body text-[0.6rem] font-bold rounded-md", item.paystackEnabled ? "bg-blue-100 text-blue-700" : "bg-ivory text-text-light")}>Paystack {item.paystackEnabled ? "ON" : "OFF"}</span>
                <span className={cn("px-2 py-0.5 font-body text-[0.6rem] font-bold rounded-md", item.bankTransferEnabled ? "bg-amber-100 text-amber-700" : "bg-ivory text-text-light")}>Bank {item.bankTransferEnabled ? "ON" : "OFF"}</span>
              </div>

              <div className="flex justify-between items-center border-t border-border/40 pt-3">
                <div className="flex gap-1">
                  <button onClick={() => handleReorder(item.id, "up")} className="p-1.5 rounded bg-ivory text-text-muted hover:text-chapel-400" title="Move Up"><ArrowUp size={14} /></button>
                  <button onClick={() => handleReorder(item.id, "down")} className="p-1.5 rounded bg-ivory text-text-muted hover:text-chapel-400" title="Move Down"><ArrowDown size={14} /></button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-1.5 rounded text-text-light hover:text-chapel-400 hover:bg-chapel-50"><Edit2 size={16} /></button>
                  <button onClick={() => confirmDelete(item.id, item.coverImagePublicId)} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={confirmData.isOpen}
        title="Delete Give Option"
        message="Are you sure you want to delete this give option? This cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmData({ isOpen: false, id: null })}
      />
    </div>
  );
}
