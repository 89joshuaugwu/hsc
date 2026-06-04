"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "done" | "failed";
  progress: number;
  url?: string;
  publicId?: string;
}

export function GalleryUpload({ onUploadComplete }: { onUploadComplete: (items: Array<{url: string, publicId: string, file: File}>) => void }) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: UploadItem[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        newItems.push({
          id: Math.random().toString(36).substring(7),
          file,
          previewUrl: URL.createObjectURL(file),
          status: "pending",
          progress: 0,
        });
      }
    });
    setItems((prev) => [...prev, ...newItems]);
  };

  const uploadFile = (item: UploadItem): Promise<UploadItem> => {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append("file", item.file);
      
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, progress, status: "uploading" } : i));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const updatedItem = { ...item, status: "done" as const, progress: 100, url: data.url, publicId: data.publicId };
          setItems((prev) => prev.map((i) => i.id === item.id ? updatedItem : i));
          resolve(updatedItem);
        } else {
          const updatedItem = { ...item, status: "failed" as const, progress: 0 };
          setItems((prev) => prev.map((i) => i.id === item.id ? updatedItem : i));
          resolve(updatedItem);
        }
      };

      xhr.onerror = () => {
        const updatedItem = { ...item, status: "failed" as const, progress: 0 };
        setItems((prev) => prev.map((i) => i.id === item.id ? updatedItem : i));
        resolve(updatedItem);
      };

      xhr.send(formData);
    });
  };

  const handleUploadAll = async () => {
    const pending = items.filter((i) => i.status === "pending" || i.status === "failed");
    if (pending.length === 0) return;

    const successful: Array<{url: string, publicId: string, file: File}> = [];
    
    // Sequential upload to avoid rate limits
    for (const item of pending) {
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: "uploading", progress: 0 } : i));
      const result = await uploadFile(item);
      if (result.status === "done" && result.url && result.publicId) {
        successful.push({ url: result.url, publicId: result.publicId, file: result.file });
      }
    }

    if (successful.length > 0) {
      onUploadComplete(successful);
      // Remove successful ones from list
      setItems((prev) => prev.filter((i) => i.status !== "done"));
    }
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
  };

  const pendingCount = items.filter((i) => i.status === "pending" || i.status === "failed").length;
  const isUploading = items.some((i) => i.status === "uploading");
  const totalMB = (items.reduce((acc, i) => acc + i.file.size, 0) / (1024 * 1024)).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer relative",
          isDragging ? "border-chapel-400 bg-chapel-50 animate-pulse" : "border-border hover:border-chapel-400 hover:bg-chapel-50/50"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
        <UploadCloud size={48} className={cn("mx-auto mb-4", isDragging ? "text-chapel-500" : "text-chapel-400")} />
        <h3 className="font-heading text-lg font-bold text-navy-500 mb-1">Drop images here or click to browse</h3>
        <p className="font-body text-sm text-text-muted">Supports JPG, PNG, WEBP — Max 5MB each</p>
      </div>

      {/* Grid */}
      {items.length > 0 && (
        <div className="bg-white border border-border/60 rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col border border-border/40 rounded-lg p-2 relative bg-ivory/30">
                {(item.status === "pending" || item.status === "failed") && !isUploading && (
                  <button onClick={() => remove(item.id)} className="absolute top-1 right-1 z-10 p-1 bg-white/80 hover:bg-white rounded text-red-500 shadow-sm"><X size={14} /></button>
                )}
                
                <div className="relative aspect-square rounded-md overflow-hidden bg-ivory-dark mb-2">
                  <Image src={item.previewUrl} alt={item.file.name} fill className="object-cover" />
                  {item.status === "uploading" && (
                    <div className="absolute inset-0 bg-navy-700/60 flex items-center justify-center">
                      <span className="font-body text-xs font-bold text-white">{item.progress}%</span>
                    </div>
                  )}
                  {item.status === "done" && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-500 drop-shadow-md" />
                    </div>
                  )}
                </div>
                
                <div className="px-1">
                  <p className="font-body text-xs font-semibold text-navy-500 truncate">{item.file.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-body text-[0.65rem] text-text-light">{(item.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    <span className={cn(
                      "font-body text-[0.65rem] font-bold px-1.5 py-0.5 rounded",
                      item.status === "pending" ? "bg-gray-100 text-gray-600" :
                      item.status === "uploading" ? "bg-blue-100 text-blue-600" :
                      item.status === "done" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-600"
                    )}>
                      {item.status === "failed" ? "Failed ✗" : item.status === "uploading" ? `Uploading` : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  {item.status === "uploading" && (
                    <div className="w-full bg-gray-200 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-chapel-400 h-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/40">
            <span className="font-body text-sm text-text-muted">{items.length} file{items.length !== 1 && "s"} selected ({totalMB} MB total)</span>
            <div className="flex gap-2">
              <button onClick={clearAll} disabled={isUploading} className="px-4 py-2 bg-ivory hover:bg-ivory-dark text-text-muted font-body text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">Clear All</button>
              <button onClick={handleUploadAll} disabled={isUploading || pendingCount === 0} className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-navy-700 font-body text-sm font-bold rounded-lg transition-colors disabled:opacity-50 shadow-gold">
                {isUploading ? "Uploading..." : `Upload ${pendingCount} File${pendingCount !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
