"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";

interface GalleryItem { id: string; imageUrl: string; caption: string; category: string; isActive: boolean; }
const CATS = ["community", "worship", "youth", "architecture", "events"];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const fetchAll = async () => {
    try {
      const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryItem));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUploadSuccess = async (result: { info?: { secure_url?: string; width?: number; height?: number } }) => {
    const info = result?.info;
    if (!info?.secure_url) return;
    try {
      await addDoc(collection(db, "gallery"), { imageUrl: info.secure_url, caption: "", category: "community", isActive: true, width: info.width || 400, height: info.height || 300, uploadedAt: Timestamp.now() });
      toast.success("Photo uploaded!");
      fetchAll();
    } catch { toast.error("Failed to save."); }
  };

  const handleCaptionChange = async (id: string, caption: string) => {
    try { await updateDoc(doc(db, "gallery", id), { caption }); } catch { /* silent */ }
  };

  const handleCategoryChange = async (id: string, category: string) => {
    try { await updateDoc(doc(db, "gallery", id), { category }); setItems((p) => p.map((i) => i.id === id ? { ...i, category } : i)); } catch { toast.error("Update failed."); }
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    try { await deleteDoc(doc(db, "gallery", id)); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Deleted."); } catch { toast.error("Delete failed."); }
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} photos?`)) return;
    setDeleting(true);
    try {
      await Promise.all(Array.from(selected).map((id) => deleteDoc(doc(db, "gallery", id))));
      setItems((p) => p.filter((i) => !selected.has(i.id)));
      setSelected(new Set());
      toast.success(`${selected.size} photos deleted.`);
    } catch { toast.error("Bulk delete failed."); }
    finally { setDeleting(false); }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-heading text-lg font-bold text-navy-500">Gallery</h2>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <button onClick={handleDeleteSelected} disabled={deleting} className="inline-flex items-center gap-1 px-4 py-2 bg-red-500 text-white font-body text-sm font-bold rounded-lg hover:bg-red-600 disabled:opacity-60">
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}Delete {selected.size}
            </button>
          )}
          <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(result) => handleUploadSuccess(result as { info?: { secure_url?: string; width?: number; height?: number } })} options={{ multiple: true, maxFiles: 10 }}>
            {({ open }) => (
              <button type="button" onClick={() => open()} className="inline-flex items-center gap-1 px-4 py-2 bg-chapel-400 text-white font-body text-sm font-bold rounded-lg hover:bg-chapel-500">Upload Photos</button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-ivory-dark rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16"><p className="font-body text-sm text-text-light">No photos yet. Upload some above!</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.id} className={cn("relative rounded-xl overflow-hidden border-2 transition-all", selected.has(item.id) ? "border-chapel-400" : "border-transparent")}>
              <div className="relative aspect-square cursor-pointer" onClick={() => toggleSelect(item.id)}>
                <Image src={item.imageUrl} alt={item.caption || ""} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
                {selected.has(item.id) && (
                  <div className="absolute top-2 left-2 w-6 h-6 bg-chapel-400 rounded-full flex items-center justify-center"><Check size={14} className="text-white" /></div>
                )}
              </div>
              <div className="bg-white p-2 space-y-1">
                <select value={item.category} onChange={(e) => handleCategoryChange(item.id, e.target.value)} className="w-full px-2 py-1 rounded border border-border font-body text-[0.65rem]">
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input defaultValue={item.caption} onBlur={(e) => handleCaptionChange(item.id, e.target.value)} placeholder="Caption" className="w-full px-2 py-1 rounded border border-border font-body text-[0.65rem]" />
                <button onClick={() => handleDeleteOne(item.id)} className="w-full text-center py-1 text-red-400 hover:text-red-600 font-body text-[0.6rem] font-semibold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
