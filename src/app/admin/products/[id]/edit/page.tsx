"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ImageUpload from "@/components/ImageUpload";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    saleEndDate: null,
    category: "BOXES",
    sport: "Soccer",
    brand: "",
    year: "",
    player: "",
    team: "",
    gradeCompany: null,
    gradeValue: "",
    quantity: "",
    imageURLs: [],
    tags: [],
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const product = { id: docSnap.id, ...docSnap.data() } as Product;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || "",
          saleEndDate: product.saleEndDate,
          category: product.category,
          sport: product.sport,
          brand: product.brand || "",
          year: product.year || "",
          player: product.player || "",
          team: product.team || "",
          gradeCompany: product.gradeCompany,
          gradeValue: product.gradeValue || "",
          quantity: product.quantity.toString(),
          imageURLs: product.imageURLs || [],
          tags: product.tags || [],
          isFeatured: product.isFeatured,
          isActive: product.isActive,
        });
      } else {
        setError("Product not found");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const productRef = doc(db, "products", productId);

      await updateDoc(productRef, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        saleEndDate: formData.saleEndDate,
        category: formData.category,
        sport: formData.sport,
        brand: formData.brand || null,
        year: formData.year || null,
        player: formData.player || null,
        team: formData.team || null,
        gradeCompany: formData.gradeCompany,
        gradeValue: formData.gradeValue || null,
        quantity: parseInt(formData.quantity),
        imageURLs: formData.imageURLs,
        tags: formData.tags,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        updatedAt: Timestamp.now(),
      });

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Edit Product</h1>
          <p className="text-text-secondary">Update product details</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 space-y-6">
          {/* Images - Show existing with delete, allow adding new */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Product Images (Up to 5)
            </label>
            
            {/* Existing Images */}
            {formData.imageURLs.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mb-4">
                {formData.imageURLs.map((url: string, index: number) => (
                  <div key={index} className="relative aspect-square bg-background rounded-lg overflow-hidden group">
                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const newURLs = formData.imageURLs.filter((_: string, i: number) => i !== index);
                        setFormData({ ...formData, imageURLs: newURLs });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Image (only if less than 5) */}
            {formData.imageURLs.length < 5 && (
              <ImageUpload
                onUploadComplete={(url) => {
                  setFormData({ ...formData, imageURLs: [...formData.imageURLs, url] });
                }}
              />
            )}
          </div>

          {/* Rest of form fields (same as new product page) */}
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
            />
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Original Price (for sales)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
              />
            </div>
          </div>

          {/* Sale End Date */}
          {formData.originalPrice && parseFloat(formData.originalPrice) > 0 && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sale End Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.saleEndDate ? new Date((formData.saleEndDate as Timestamp).toMillis()).toISOString().slice(0, 16) : ""}
                onChange={(e) => {
                  const date = e.target.value ? Timestamp.fromDate(new Date(e.target.value)) : null;
                  setFormData({ ...formData, saleEndDate: date });
                }}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
              />
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
            >
              <option value="BOXES">BOXES</option>
              <option value="CASES">CASES</option>
              <option value="SINGLES">SINGLES</option>
              <option value="SLABS">SLABS</option>
              <option value="MERCH">MERCH</option>
            </select>
          </div>

          {/* Sport, Brand, Year, Player, Team (same as new page) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sport
              </label>
              <select
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
              >
                <option value="Soccer">Soccer</option>
                <option value="Merch">Merch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Player
              </label>
              <input
                type="text"
                value={formData.player}
                onChange={(e) => setFormData({ ...formData, player: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Team
              </label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
              />
            </div>
          </div>

          {/* Grade Fields - Only for Slabs */}
          {formData.category === "SLABS" && (
            <>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Grade Company
                </label>
                <select
                  value={formData.gradeCompany || "None"}
                  onChange={(e) => setFormData({ ...formData, gradeCompany: e.target.value as any })}
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
                >
                  <option value="None">None</option>
                  <option value="PSA">PSA</option>
                  <option value="BGS">BGS</option>
                  <option value="SGC">SGC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Grade Value
                </label>
                <input
                  type="text"
                  value={formData.gradeValue || ""}
                  onChange={(e) => setFormData({ ...formData, gradeValue: e.target.value })}
                  placeholder="e.g., 10, 9.5, Authentic"
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary"
                />
              </div>
            </>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Quantity *
            </label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-text-primary">Featured Product</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-text-primary">Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Update Product"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="px-6 py-3 bg-surface border border-border rounded-lg text-text-secondary hover:bg-surface-hover transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
