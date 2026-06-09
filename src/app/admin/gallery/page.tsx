"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, getDocs, updateDoc, deleteDoc, doc, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, Edit2, Check, X, Loader2, Plus, ImageIcon, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GalleryUpload } from "@/components/admin/upload/GalleryUpload";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryAlbum, GalleryImage } from "@/types/chapel.types";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

const CATS = ["community", "worship", "youth", "architecture", "events"];

export default function AdminGalleryAlbumsPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("community");
  const [newImages, setNewImages] = useState<Array<{url: string, publicId: string, caption: string}>>([]);
  const [creatingProcess, setCreatingProcess] = useState(false);

  // Edit state
  const [editAlbum, setEditAlbum] = useState<GalleryAlbum | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImages, setEditImages] = useState<GalleryImage[]>([]);

  // Modals
  const [confirmData, setConfirmData] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [migrateModalOpen, setMigrateModalOpen] = useState(false);

  // Migrating
  const [isMigrating, setIsMigrating] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setAlbums(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GalleryAlbum));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const confirmMigrate = () => setMigrateModalOpen(true);
  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      const oldSnap = await getDocs(collection(db, "gallery"));
      let migrated = 0;
      for (const d of oldSnap.docs) {
        const data = d.data();
        await addDoc(collection(db, "gallery_albums"), {
          title: data.caption || "Migrated Photo",
          description: "",
          category: data.category || "community",
          coverImageUrl: data.imageUrl,
          coverPublicId: data.publicId,
          images: [{
            url: data.imageUrl,
            publicId: data.publicId,
            caption: data.caption || "",
            order: 0
          }],
          imageCount: 1,
          isActive: data.isActive ?? true,
          createdAt: data.uploadedAt || Timestamp.now()
        });
        migrated++;
      }
      toast.success(`Migrated ${migrated} items to albums!`);
      fetchAll();
    } catch (e) {
      toast.error("Migration failed.");
      console.error(e);
    } finally {
      setIsMigrating(false);
      setMigrateModalOpen(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) { toast.error("Title is required"); return; }
    if (newImages.length === 0) { toast.error("Upload at least one image"); return; }
    setCreatingProcess(true);
    try {
      const formattedImages: GalleryImage[] = newImages.map((img, idx) => ({
        url: img.url,
        publicId: img.publicId,
        caption: img.caption,
        order: idx
      }));

      await addDoc(collection(db, "gallery_albums"), {
        title: newTitle.trim(),
        description: newDesc.trim(),
        category: newCategory,
        coverImageUrl: formattedImages[0].url,
        coverPublicId: formattedImages[0].publicId,
        images: formattedImages,
        imageCount: formattedImages.length,
        isActive: true,
        createdAt: Timestamp.now()
      });
      toast.success("Album created!");
      setIsCreating(false);
      setNewTitle(""); setNewDesc(""); setNewImages([]);
      fetchAll();
    } catch (e) {
      toast.error("Failed to create album");
    } finally {
      setCreatingProcess(false);
    }
  };

  const startEdit = (album: GalleryAlbum) => {
    setEditAlbum(album);
    setEditTitle(album.title);
    setEditDesc(album.description || "");
    setEditCategory(album.category);
    setEditImages([...album.images]);
  };

  const handleSaveEdit = async () => {
    if (!editAlbum) return;
    if (!editTitle.trim()) { toast.error("Title is required"); return; }
    if (editImages.length === 0) { toast.error("Album must have at least one image"); return; }
    
    try {
      // Ensure cover image exists in the images list, otherwise pick the first one
      let coverUrl = editAlbum.coverImageUrl;
      let coverId = editAlbum.coverPublicId;
      if (!editImages.find(i => i.url === coverUrl)) {
        coverUrl = editImages[0].url;
        coverId = editImages[0].publicId;
      }

      await updateDoc(doc(db, "gallery_albums", editAlbum.id), {
        title: editTitle.trim(),
        description: editDesc.trim(),
        category: editCategory,
        coverImageUrl: coverUrl,
        coverPublicId: coverId,
        images: editImages.map((img, idx) => ({ ...img, order: idx })),
        imageCount: editImages.length
      });
      toast.success("Album updated!");
      setEditAlbum(null);
      fetchAll();
    } catch (e) {
      toast.error("Failed to update");
    }
  };

  const confirmDeleteAlbum = (id: string) => setConfirmData({ isOpen: true, id });
  const handleDeleteAlbum = async () => {
    const id = confirmData.id;
    if (!id) return;
    try {
      await deleteDoc(doc(db, "gallery_albums", id));
      toast.success("Album deleted.");
      fetchAll();
    } catch {
      toast.error("Failed to delete album.");
    } finally {
      setConfirmData({ isOpen: false, id: null });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-heading text-xl font-bold text-navy-500">Gallery Albums</h2>
        <button onClick={confirmMigrate} disabled={isMigrating} className="px-4 py-2 bg-amber-100 text-amber-700 font-bold rounded-lg hover:bg-amber-200 transition-colors text-sm">
          {isMigrating ? "Migrating..." : "Migrate Old Gallery"}
        </button>
      </div>

      {/* CREATE ALBUM */}
      <div className="bg-white rounded-xl border border-border/60 p-6">
        <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setIsCreating(!isCreating)}>
          <h2 className="font-heading text-lg font-bold text-navy-500 flex items-center gap-2"><Plus className="text-chapel-400" /> Create New Album</h2>
          {isCreating ? <ChevronUp size={20} className="text-text-light" /> : <ChevronDown size={20} className="text-text-light" />}
        </div>
        
        {isCreating && (
          <div className="space-y-6 pt-6 mt-4 border-t border-border/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Album Title *" className="px-4 py-2 border border-border rounded-lg w-full font-body text-sm focus:outline-none focus:border-chapel-400" />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="px-4 py-2 border border-border rounded-lg w-full font-body text-sm focus:outline-none focus:border-chapel-400 capitalize">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)" className="px-4 py-2 border border-border rounded-lg w-full h-24 font-body text-sm focus:outline-none focus:border-chapel-400" />
            
            <div>
              <h3 className="font-heading font-bold text-navy-500 mb-3">Upload Images</h3>
              <GalleryUpload onUploadComplete={(items) => {
                setNewImages(prev => [...prev, ...items.map(i => ({ url: i.url, publicId: i.publicId, caption: "" }))]);
              }} />
            </div>

            {newImages.length > 0 && (
              <div className="bg-ivory/50 p-4 rounded-xl border border-border/40">
                <h4 className="font-bold text-sm text-navy-500 mb-3">Album Preview ({newImages.length} images)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-white border border-border rounded-lg p-2 flex flex-col gap-2">
                      <div className="relative flex-1 rounded bg-ivory-dark overflow-hidden">
                        <Image src={img.url} alt="" fill className="object-cover" />
                        {idx === 0 && <span className="absolute top-1 left-1 bg-black/60 text-white text-[0.6rem] px-1.5 rounded uppercase font-bold">Cover</span>}
                      </div>
                      <input 
                        placeholder="Caption (optional)" 
                        value={img.caption}
                        onChange={(e) => {
                          const copy = [...newImages];
                          copy[idx].caption = e.target.value;
                          setNewImages(copy);
                        }}
                        className="text-xs px-2 py-1.5 border border-border rounded focus:outline-none focus:border-chapel-400"
                      />
                      <button onClick={() => setNewImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-colors"><X size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleCreate} disabled={creatingProcess} className="w-full py-3 bg-chapel-400 text-white font-bold rounded-lg hover:bg-chapel-500 disabled:opacity-50 transition-colors">
              {creatingProcess ? "Creating..." : "Create Album"}
            </button>
          </div>
        )}
      </div>

      {/* ALBUMS GRID */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="aspect-[4/3] bg-white rounded-xl border border-border/60 animate-pulse"/>)}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-border/60"><p className="font-body text-sm text-text-light">No albums found.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <div key={album.id} className="bg-white border border-border/60 rounded-xl overflow-hidden flex flex-col group hover:shadow-chapel transition-shadow">
                <div className="relative aspect-video bg-ivory-dark border-b border-border/40">
                  {album.coverImageUrl && <Image src={album.coverImageUrl} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {album.imageCount} photos
                  </span>
                  <span className="absolute top-3 left-3 bg-white/90 text-navy-500 text-xs font-bold px-2.5 py-1 rounded-full uppercase backdrop-blur-sm shadow-sm">
                    {album.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading font-bold text-navy-500 text-lg mb-1">{album.title}</h3>
                  <p className="font-body text-sm text-text-muted line-clamp-2 mb-4">{album.description}</p>
                  
                  <div className="flex gap-2 mt-auto pt-4 border-t border-border/40">
                    <button onClick={() => startEdit(album)} className="flex-1 py-2 bg-ivory text-navy-500 rounded-lg font-bold text-sm hover:bg-chapel-50 transition-colors flex items-center justify-center gap-1.5"><Edit2 size={14}/> Edit</button>
                    <button onClick={() => confirmDeleteAlbum(album.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"><Trash2 size={14}/> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editAlbum && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-border/40 pb-4">
              <h2 className="font-heading text-xl font-bold text-navy-500">Edit Album</h2>
              <button onClick={() => setEditAlbum(null)} className="p-2 hover:bg-ivory rounded-full transition-colors"><X size={20} className="text-text-muted" /></button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-500 mb-1">Album Title</label>
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-chapel-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-500 mb-1">Category</label>
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-chapel-400 capitalize">
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-500 mb-1">Description</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg h-20 font-body text-sm focus:outline-none focus:border-chapel-400" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-navy-500 mb-3 border-b border-border/40 pb-2">Images ({editImages.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {editImages.map((img, idx) => (
                    <div key={idx} className={cn("relative aspect-square border-2 rounded-lg p-1.5 flex flex-col gap-1.5 group bg-white", editAlbum.coverImageUrl === img.url ? "border-chapel-400" : "border-border/60")}>
                      <div className="relative flex-1 rounded overflow-hidden bg-ivory-dark">
                        <Image src={img.url} alt="" fill className="object-cover" />
                        {editAlbum.coverImageUrl === img.url && <span className="absolute top-1 left-1 bg-chapel-400 text-white text-[0.6rem] px-1.5 rounded uppercase font-bold">Cover</span>}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                          {editAlbum.coverImageUrl !== img.url && (
                            <button onClick={() => setEditAlbum({...editAlbum, coverImageUrl: img.url, coverPublicId: img.publicId})} className="text-xs bg-white text-navy-500 px-3 py-1.5 rounded-full font-bold hover:bg-ivory transition-colors">Set Cover</button>
                          )}
                          <button onClick={() => setEditImages(p => p.filter((_, i) => i !== idx))} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-red-600 transition-colors">Remove</button>
                        </div>
                      </div>
                      <input 
                        value={img.caption || ""} 
                        onChange={e => { const copy = [...editImages]; copy[idx].caption = e.target.value; setEditImages(copy); }}
                        placeholder="Caption"
                        className="text-xs px-2 py-1.5 border border-border rounded focus:outline-none focus:border-chapel-400"
                      />
                      <div className="flex gap-1">
                        <button onClick={() => { if(idx > 0){ const copy = [...editImages]; [copy[idx-1], copy[idx]] = [copy[idx], copy[idx-1]]; setEditImages(copy); } }} className="flex-1 bg-ivory text-text-muted hover:bg-ivory-dark hover:text-navy-500 rounded flex justify-center py-1 transition-colors disabled:opacity-30" disabled={idx===0}><ArrowUp size={14}/></button>
                        <button onClick={() => { if(idx < editImages.length-1){ const copy = [...editImages]; [copy[idx+1], copy[idx]] = [copy[idx], copy[idx+1]]; setEditImages(copy); } }} className="flex-1 bg-ivory text-text-muted hover:bg-ivory-dark hover:text-navy-500 rounded flex justify-center py-1 transition-colors disabled:opacity-30" disabled={idx===editImages.length-1}><ArrowDown size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 bg-ivory/50 border border-dashed border-border rounded-xl">
                  <h4 className="text-sm font-bold text-navy-500 mb-3 flex items-center gap-2"><Plus size={16}/> Add More Images</h4>
                  <GalleryUpload onUploadComplete={(items) => {
                    setEditImages(prev => [...prev, ...items.map((i, idx) => ({ url: i.url, publicId: i.publicId, caption: "", order: prev.length + idx }))]);
                  }} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border/40">
                <button onClick={() => setEditAlbum(null)} className="px-6 py-2.5 rounded-lg font-bold text-text-muted hover:bg-ivory transition-colors">Cancel</button>
                <button onClick={handleSaveEdit} className="px-6 py-2.5 rounded-lg font-bold bg-chapel-400 text-white hover:bg-chapel-500 shadow-sm transition-colors">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmData.isOpen}
        title="Delete Album"
        message="Are you sure you want to delete this entire album? This cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteAlbum}
        onCancel={() => setConfirmData({ isOpen: false, id: null })}
      />

      <ConfirmModal
        isOpen={migrateModalOpen}
        title="Migrate Old Gallery"
        message="Run one-time migration from old gallery to new gallery_albums? This will copy old data into the new structure."
        confirmText="Migrate"
        isDestructive={false}
        isLoading={isMigrating}
        onConfirm={handleMigrate}
        onCancel={() => setMigrateModalOpen(false)}
      />
    </div>
  );
}
