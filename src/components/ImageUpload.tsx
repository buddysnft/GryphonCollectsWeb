"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
}

export default function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create unique filename
      const filename = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `products/${filename}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      onUploadComplete(downloadURL);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-text-secondary mb-2">Product Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-text-primary bg-background border border-border rounded-lg px-4 py-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-background file:cursor-pointer hover:file:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {uploading && <p className="text-text-muted text-sm mt-2">Uploading...</p>}
      {error && <p className="text-danger text-sm mt-2">{error}</p>}
      <p className="text-text-muted text-xs mt-2">
        Max 5MB. Recommended: 1200x1200px or larger
      </p>
    </div>
  );
}
