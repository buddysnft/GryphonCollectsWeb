"use client";

import { useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const productImages: Record<string, string[]> = {
  "6bXP2BZg0szsOYYAzFSM": ["https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80"],
  "7d7CVS94vijK92xRP2Aa": ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80"],
  "8a0CtPvlTpBkETmT7Lrw": ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80"],
  "Cjzm4O3whwzCt3XQX5Uv": ["https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?w=800&auto=format&fit=crop&q=80"],
};

export default function AddPlaceholdersPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function addPlaceholderImages() {
    setLoading(true);
    setResult("");

    try {
      const productsRef = collection(db!, "products");
      const snapshot = await getDocs(productsRef);
      let updated = 0;

      for (const docSnap of snapshot.docs) {
        const productId = docSnap.id;
        const product = docSnap.data();

        if (product.imageURLs && product.imageURLs.length > 0) {
          continue; // Skip if has images
        }

        const imageURLs = productImages[productId] || [
          `https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80&sig=${productId.slice(0, 8)}`,
        ];

        await updateDoc(doc(db!, "products", productId), {
          imageURLs,
          updatedAt: new Date(),
        });

        updated++;
      }

      setResult(`✅ Success! Added placeholder images to ${updated} products.`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Add Placeholder Images</h1>
      <p className="text-text-secondary mb-6">
        This will add thematic placeholder images to products that don't have images yet.
        Featured products get specific soccer-themed images.
      </p>

      <button
        onClick={addPlaceholderImages}
        disabled={loading}
        className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Adding Images..." : "Add Placeholder Images"}
      </button>

      {result && (
        <div className={`mt-6 p-4 rounded-lg ${result.startsWith("✅") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {result}
        </div>
      )}

      <div className="mt-8 p-4 bg-surface rounded-lg border border-border">
        <h2 className="font-semibold mb-2">Note:</h2>
        <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
          <li>These are placeholder images from Unsplash</li>
          <li>Replace with actual product photos via Edit Product page</li>
          <li>Only adds images to products without any images</li>
          <li>Safe to run multiple times</li>
        </ul>
      </div>
    </div>
  );
}
