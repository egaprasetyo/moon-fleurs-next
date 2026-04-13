"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "products",
  placeholder = "Upload gambar atau paste URL",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran maksimal 5MB");
      return;
    }

    setUploading(true);

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast.error("Gagal upload", { description: error.message });
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    onChange(urlData.publicUrl);
    setMode("url");
    setUploading(false);
    toast.success("Gambar berhasil diupload");
  };

  const handleRemove = () => {
    onChange("");
    setMode("upload");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-border">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Upload / URL toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            mode === "upload"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            mode === "url"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Paste URL
        </button>
      </div>

      {/* Input */}
      {mode === "upload" ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Mengupload..." : "Pilih Gambar"}
          </Button>
          <span className="text-xs text-muted-foreground">
            Max 5MB (JPG, PNG, WebP)
          </span>
        </div>
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
