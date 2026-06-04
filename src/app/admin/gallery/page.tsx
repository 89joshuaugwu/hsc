"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GalleryUpload } from "@/components/admin/upload/GalleryUpload";
import { GalleryItemForm } from "@/components/admin/upload/GalleryItemForm";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem { id: string; imageUrl: string; publicId?: string; caption: string; category: string; isActive: boolean; }
const CATS = ["community", "worship", "youth", "architecture", "events"];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  // Upload state
  const [uploadedItems, setUploadedItems] = useState<Array<{url: string, publicId: string, file: File}>>([]);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editCaption, setEditCaption] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryItem));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteOne = async (id: string, publicId?: string) => {
    if (!confirm("Remove this photo from the gallery?")) return;
    try { 
      if (publicId) {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId })
        });
      }
      await deleteDoc(doc(db, "gallery", id)); 
      setItems((p) => p.filter((i) => i.id !== id)); 
      toast.success("Deleted."); 
    } catch { toast.error("Delete failed."); }
  };

  const startEdit = (item: GalleryItem) => {
    setEditId(item.id);
    setEditCategory(item.category);
    setEditCaption(item.caption);
  };

  const saveEdit = async () => {
    if (!editId) return;
    try {
      await updateDoc(doc(db, "gallery", editId), { category: editCategory, caption: editCaption });
      setItems(p => p.map(i => i.id === editId ? { ...i, category: editCategory, caption: editCaption } : i));
      setEditId(null);
      toast.success("Saved.");
    } catch { toast.error("Update failed."); }
  };

  const filtered = filter === "all" ? items : items.filter(i => i.category === filter);

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-border/60 p-6">
        <h2 className="font-heading text-lg font-bold text-navy-500 mb-4">Upload New Images</h2>
        <GalleryUpload onUploadComplete={(newItems) => setUploadedItems(newItems)} />
        {uploadedItems.length > 0 && (
          <GalleryItemForm 
            items={uploadedItems} 
            onComplete={() => {
              setUploadedItems([]);
              fetchAll();
            }} 
          />
        )}
      </div>

      {/* Gallery Section */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="font-heading text-lg font-bold text-navy-500">Published Gallery ({items.length})</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter("all")} className={cn("px-3 py-1.5 rounded-lg font-body text-xs font-semibold capitalize", filter === "all" ? "bg-chapel-400 text-white" : "bg-white border border-border/60 text-text-muted")}>All</button>
            {CATS.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={cn("px-3 py-1.5 rounded-lg font-body text-xs font-semibold capitalize", filter === c ? "bg-chapel-400 text-white" : "bg-white border border-border/60 text-text-muted")}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-ivory-dark rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-border/60"><p className="font-body text-sm text-text-light">No gallery images yet. Upload some above.</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div 
                  layout 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  transition={{ duration: 0.2 }}
                  key={item.id} 
                  className={cn("bg-white border border-border/60 rounded-xl overflow-hidden shadow-sm flex flex-col transition-all", editId === item.id ? "ring-2 ring-chapel-400" : "")}
                >
                  <div className="relative aspect-square">
                    <Image src={item.imageUrl} alt={item.caption || "Gallery"} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[0.6rem] font-bold text-white uppercase tracking-wider">{item.category}</div>
                  </div>
                  
                  {editId === item.id ? (
                    <div className="p-3 space-y-2 flex-1 flex flex-col">
                      <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full px-2 py-1.5 rounded border border-border font-body text-xs focus:ring-1 focus:ring-chapel-400 outline-none">
                        {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                      <input value={editCaption} onChange={(e) => setEditCaption(e.target.value)} placeholder="Caption" className="w-full px-2 py-1.5 rounded border border-border font-body text-xs focus:ring-1 focus:ring-chapel-400 outline-none" />
                      <div className="flex gap-2 pt-1 mt-auto">
                        <button onClick={saveEdit} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded text-xs font-bold transition-colors"><Check size={14} className="inline mr-1"/>Save</button>
                        <button onClick={() => setEditId(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 rounded text-xs font-bold transition-colors"><X size={14} className="inline mr-1"/>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 flex-1 flex flex-col">
                      <p className="font-body text-xs text-text-muted mb-2 line-clamp-2 min-h-[2rem]">{item.caption || <span className="italic text-text-light">No caption</span>}</p>
                      <div className="flex justify-end gap-1 mt-auto pt-2 border-t border-border/40">
                        <button onClick={() => startEdit(item)} className="p-1.5 rounded text-text-light hover:text-chapel-400 hover:bg-chapel-50 transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteOne(item.id, item.publicId)} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
