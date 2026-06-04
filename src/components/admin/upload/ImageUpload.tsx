"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, publicId: string) => void;
  onRemove?: () => void;
  label?: string;
  hint?: string;
  aspectRatio?: "video" | "square" | "wide";
}

export function ImageUpload({ value, onChange, onRemove, label, hint, aspectRatio = "video" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) setPreview(value);
    else setPreview(null);
  }, [value]);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WEBP, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        onChange(data.url, data.publicId);
      } else {
        const data = JSON.parse(xhr.responseText);
        setError(data.error || "Upload failed.");
        setPreview(value || null); // revert
      }
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    };

    xhr.onerror = () => {
      setError("Network error occurred during upload.");
      setUploading(false);
      setPreview(value || null);
      URL.revokeObjectURL(localUrl);
    };

    xhr.send(formData);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block font-body text-xs font-semibold text-text-muted">{label}</label>}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl transition-all cursor-pointer",
          aspectRatio === "video" && "aspect-video",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "wide" && "aspect-[21/9]",
          !preview && "border-2 border-dashed border-border hover:border-chapel-400 hover:bg-chapel-50",
          isDragging && "border-chapel-400 bg-chapel-50",
          error && "border-red-400"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => { if (!uploading && !preview) inputRef.current?.click(); }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ''; }} />
        
        {!preview && !uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <UploadCloud size={40} className="text-chapel-400 mb-2" />
            <p className="font-body text-sm text-text-muted">Click to upload or drag and drop</p>
            {hint && <p className="font-body text-xs text-text-light mt-1">{hint}</p>}
            <button type="button" onClick={() => inputRef.current?.click()} className="mt-3 px-4 py-1.5 bg-chapel-400 text-white text-xs font-bold rounded-lg hover:bg-chapel-500 transition-colors">Browse Files</button>
          </div>
        )}

        {preview && (
          <>
            <Image src={preview} alt="Upload preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            
            {uploading && (
              <div className="absolute inset-0 bg-navy-700/60 flex flex-col items-center justify-center">
                <RefreshCw size={24} className="text-white animate-spin mb-2" />
                <p className="font-body text-sm text-white font-semibold">Uploading... {progress}%</p>
              </div>
            )}

            {!uploading && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-end">
                <span className="font-body text-xs text-white/90">Current image</span>
                <div className="flex gap-2">
                  <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white font-body text-xs rounded transition-colors">Change</button>
                  {onRemove && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); setPreview(null); }} className="p-1 bg-red-500/80 hover:bg-red-500 text-white rounded transition-colors"><X size={16} /></button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {error && <p className="font-body text-xs text-red-500">{error}</p>}
    </div>
  );
}
