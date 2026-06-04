"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Save, Loader2 } from "lucide-react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const CATS = ["community", "worship", "youth", "architecture", "events"];

interface UploadedItem { url: string; publicId: string; file: File; }
interface FormItem extends UploadedItem { category: string; caption: string; id: string; }

export function GalleryItemForm({ items, onComplete }: { items: UploadedItem[]; onComplete: () => void }) {
  const [formItems, setFormItems] = useState<FormItem[]>(
    items.map(i => ({ ...i, category: "community", caption: "", id: Math.random().toString() }))
  );
  const [saving, setSaving] = useState(false);

  const updateItem = (id: string, field: keyof FormItem, value: string) => {
    setFormItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const remove = (id: string) => {
    setFormItems(prev => prev.filter(i => i.id !== id));
    if (formItems.length === 1) onComplete();
  };

  const handleSaveAll = async () => {
    if (formItems.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(formItems.map(item => 
        addDoc(collection(db, "gallery"), {
          imageUrl: item.url,
          publicId: item.publicId,
          caption: item.caption,
          category: item.category,
          isActive: true,
          uploadedAt: Timestamp.now()
        })
      ));
      toast.success(`Saved ${formItems.length} photos to gallery!`);
      onComplete();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save to gallery.");
    } finally {
      setSaving(false);
    }
  };

  if (formItems.length === 0) return null;

  return (
    <div className="bg-white border border-border/60 rounded-xl p-4 mt-6 shadow-sm">
      <h3 className="font-heading text-base font-bold text-navy-500 mb-4">Add Details to Uploaded Photos</h3>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {formItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-ivory/30 border border-border/40 p-3 rounded-lg">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-ivory-dark">
              <Image src={item.url} alt="thumbnail" fill className="object-cover" />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <select value={item.category} onChange={(e) => updateItem(item.id, "category", e.target.value)} className="px-3 py-2 rounded-lg border border-border font-body text-sm bg-white">
                {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <input value={item.caption} onChange={(e) => updateItem(item.id, "caption", e.target.value)} placeholder="Add a caption... (optional)" className="px-3 py-2 rounded-lg border border-border font-body text-sm bg-white" />
            </div>

            <button onClick={() => remove(item.id)} className="p-2 text-text-light hover:text-red-500 transition-colors" title="Remove from batch">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/40 flex justify-end">
        <button onClick={handleSaveAll} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-body text-sm font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save All to Gallery</>}
        </button>
      </div>
    </div>
  );
}
