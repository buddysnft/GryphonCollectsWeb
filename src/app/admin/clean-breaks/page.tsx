"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Break } from "@/lib/types";

// Official product images - UPDATE THESE with actual URLs
const PRODUCT_IMAGES: { [key: string]: string } = {
  "2026 FIFA Prizm HOBBY": "https://firebasestorage.googleapis.com/v0/b/gryphon-breaks.firebasestorage.app/o/products%2Fprizm-hobby.jpg?alt=media",
  "2026 FIFA Prizm": "https://firebasestorage.googleapis.com/v0/b/gryphon-breaks.firebasestorage.app/o/products%2Fprizm.jpg?alt=media",
  "2026 FIFA Prizm CHOICE": "https://firebasestorage.googleapis.com/v0/b/gryphon-breaks.firebasestorage.app/o/products%2Fprizm-choice.jpg?alt=media",
  "NEW - 2026 EPL Sapphire": "https://firebasestorage.googleapis.com/v0/b/gryphon-breaks.firebasestorage.app/o/products%2Fsapphire.jpg?alt=media",
  "2026 RTWC Select": "https://firebasestorage.googleapis.com/v0/b/gryphon-breaks.firebasestorage.app/o/products%2Fselect.jpg?alt=media",
};

// Breaks to KEEP (exact titles from screenshot)
const BREAKS_TO_KEEP = [
  "2026 FIFA Prizm HOBBY",
  "2026 FIFA Prizm",
  "2026 FIFA Prizm CHOICE",
  "NEW - 2026 EPL Sapphire",
  "2026 RTWC Select",
];

export default function CleanBreaksPage() {
  const [breaks, setBreaks] = useState<(Break & { shouldKeep: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadBreaks();
  }, []);

  async function loadBreaks() {
    try {
      const breaksSnapshot = await getDocs(collection(db, "breaks"));
      const breaksData = breaksSnapshot.docs.map((doc) => {
        const data = doc.data() as Break;
        const title = data.title || "";
        
        // Check if this break should be kept
        const shouldKeep = BREAKS_TO_KEEP.some(keepTitle => 
          title.toLowerCase().includes(keepTitle.toLowerCase()) || 
          keepTitle.toLowerCase().includes(title.toLowerCase())
        );

        return {
          id: doc.id,
          ...data,
          shouldKeep,
        };
      });

      setBreaks(breaksData);
    } catch (error) {
      console.error("Error loading breaks:", error);
      setMessage({ type: "error", text: "Failed to load breaks" });
    } finally {
      setLoading(false);
    }
  }

  async function cleanBreaks() {
    if (!confirm(`This will DELETE ${breaks.filter(b => !b.shouldKeep).length} breaks. Continue?`)) {
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      let deletedCount = 0;
      let updatedCount = 0;

      for (const breakData of breaks) {
        if (breakData.shouldKeep) {
          // Update image if we have one
          const matchingTitle = BREAKS_TO_KEEP.find(title => 
            breakData.title.toLowerCase().includes(title.toLowerCase()) || 
            title.toLowerCase().includes(breakData.title.toLowerCase())
          );

          if (matchingTitle && PRODUCT_IMAGES[matchingTitle]) {
            await updateDoc(doc(db, "breaks", breakData.id), {
              imageUrl: PRODUCT_IMAGES[matchingTitle],
            });
            updatedCount++;
          }
        } else {
          // Delete this break
          await deleteDoc(doc(db, "breaks", breakData.id));
          deletedCount++;
        }
      }

      setMessage({
        type: "success",
        text: `✅ Deleted ${deletedCount} breaks, updated ${updatedCount} images`,
      });

      // Reload breaks
      await loadBreaks();
    } catch (error) {
      console.error("Error cleaning breaks:", error);
      setMessage({ type: "error", text: "Failed to clean breaks" });
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-text-secondary">Loading breaks...</p>
      </div>
    );
  }

  const toKeep = breaks.filter(b => b.shouldKeep);
  const toDelete = breaks.filter(b => !b.shouldKeep);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Clean Breaks</h1>
        <p className="text-text-secondary">
          Review which breaks to keep/delete based on the 5 approved products
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === "success" 
            ? "bg-green-500/10 border border-green-500/30 text-green-500" 
            : "bg-danger/10 border border-danger/30 text-danger"
        }`}>
          {message.text}
        </div>
      )}

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-lg p-4">
          <p className="text-sm text-text-secondary mb-1">Total Breaks</p>
          <p className="text-3xl font-bold text-text-primary">{breaks.length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-green-500 mb-1">To Keep</p>
          <p className="text-3xl font-bold text-green-500">{toKeep.length}</p>
        </div>
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-4">
          <p className="text-sm text-danger mb-1">To Delete</p>
          <p className="text-3xl font-bold text-danger">{toDelete.length}</p>
        </div>
      </div>

      {/* Breaks to Keep */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-green-500 mb-4">✅ Breaks to Keep ({toKeep.length})</h2>
        <div className="space-y-2">
          {toKeep.map((breakData) => (
            <div key={breakData.id} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{breakData.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    ID: {breakData.id} | Spots: {breakData.totalSpots} | Price: ${breakData.price || breakData.pricePerSpot}
                  </p>
                  {breakData.imageUrl && (
                    <p className="text-xs text-text-muted mt-1">
                      Current image: {breakData.imageUrl.substring(0, 60)}...
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breaks to Delete */}
      {toDelete.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-danger mb-4">❌ Breaks to Delete ({toDelete.length})</h2>
          <div className="space-y-2">
            {toDelete.map((breakData) => (
              <div key={breakData.id} className="bg-danger/10 border border-danger/30 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{breakData.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">
                      ID: {breakData.id} | Spots: {breakData.totalSpots} | Price: ${breakData.price || breakData.pricePerSpot}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex gap-4">
        <button
          onClick={cleanBreaks}
          disabled={processing || toDelete.length === 0}
          className="bg-danger text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? "Processing..." : `Delete ${toDelete.length} Breaks & Update Images`}
        </button>
        <button
          onClick={loadBreaks}
          disabled={processing}
          className="bg-background border border-border text-text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface transition"
        >
          Refresh
        </button>
      </div>

      {/* Product Images Info */}
      <div className="mt-8 p-4 bg-surface border border-border rounded-lg">
        <h3 className="font-semibold text-text-primary mb-3">Product Images to Use:</h3>
        <ul className="space-y-2 text-sm text-text-secondary">
          {Object.entries(PRODUCT_IMAGES).map(([title, url]) => (
            <li key={title}>
              <strong className="text-text-primary">{title}:</strong>{" "}
              <span className="text-xs text-text-muted">{url.substring(0, 80)}...</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-warning">
          ⚠️ Note: Update PRODUCT_IMAGES in the code with actual Firebase Storage URLs after uploading product images
        </p>
      </div>
    </div>
  );
}
