"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "@/lib/firestore";
import { Timestamp } from "firebase/firestore";
import ImageUpload from "@/components/ImageUpload";
import type { Product } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Boxes" as Product["category"],
    sport: "Soccer" as Product["sport"],
    brand: "",
    year: "",
    player: "",
    team: "",
    gradeCompany: "" as Product["gradeCompany"] | "",
    gradeValue: "",
    quantity: "",
    tags: "",
    isFeatured: false,
    isActive: true,
  });
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData: Omit<Product, "id"> = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        category: form.category,
        sport: form.sport,
        brand: form.brand || null,
        year: form.year || null,
        player: form.player || null,
        team: form.team || null,
        gradeCompany: form.gradeCompany || null,
        gradeValue: form.gradeValue || null,
        quantity: parseInt(form.quantity),
        imageURLs,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addProduct(productData);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Add Product</h1>
          <p className="text-text-secondary">
            Add a new product to your store and iOS app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-6">
          {/* Image Upload */}
          <ImageUpload
            onUploadComplete={(url) => setImageURLs([...imageURLs, url])}
          />

          {imageURLs.length > 0 && (
            <div>
              <p className="text-text-secondary mb-2">Uploaded Images:</p>
              <div className="flex flex-wrap gap-2">
                {imageURLs.map((url, index) => (
                  <div key={index} className="relative w-24 h-24 bg-background rounded-lg overflow-hidden">
                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageURLs(imageURLs.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-danger text-white rounded-full w-6 h-6 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-text-secondary mb-2">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-text-secondary mb-2">Original Price (if on sale)</label>
              <input
                type="number"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-2">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="Boxes">Boxes</option>
                <option value="Cases">Cases</option>
                <option value="Singles">Singles</option>
                <option value="Slabs">Slabs</option>
                <option value="Merch">Merch</option>
              </select>
            </div>

            <div>
              <label className="block text-text-secondary mb-2">Sport *</label>
              <select
                required
                value={form.sport}
                onChange={(e) => setForm({ ...form, sport: e.target.value as Product["sport"] })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="Soccer">Soccer</option>
                <option value="Merch">Merch</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-2">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-text-secondary mb-2">Year</label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-2">Player</label>
              <input
                type="text"
                value={form.player}
                onChange={(e) => setForm({ ...form, player: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-text-secondary mb-2">Team</label>
              <input
                type="text"
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {form.category === "Slabs" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-secondary mb-2">Grade Company</label>
                <select
                  value={form.gradeCompany || ""}
                  onChange={(e) => setForm({ ...form, gradeCompany: e.target.value as Product["gradeCompany"] | "" })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
                >
                  <option value="">None</option>
                  <option value="PSA">PSA</option>
                  <option value="BGS">BGS</option>
                  <option value="SGC">SGC</option>
                </select>
              </div>

              <div>
                <label className="block text-text-secondary mb-2">Grade Value</label>
                <input
                  type="text"
                  value={form.gradeValue}
                  onChange={(e) => setForm({ ...form, gradeValue: e.target.value })}
                  placeholder="10"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-text-secondary mb-2">Quantity *</label>
            <input
              type="number"
              required
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="chrome, refractor, hobby"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-text-secondary">Featured Product</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-text-secondary">Active</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-background py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 bg-surface-hover border border-border text-text-primary py-3 rounded-lg font-semibold hover:bg-background transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
