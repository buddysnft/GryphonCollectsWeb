"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, deleteProduct, updateProduct } from "@/lib/firestore";
import type { Product } from "@/lib/types";
import Badge from "@/components/Badge";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const allProducts = await getProducts([]);
      setProducts(allProducts.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await updateProduct(product.id, { isFeatured: !product.isFeatured });
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { isActive: !product.isActive });
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, isActive: !p.isActive } : p
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-surface border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Product</th>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Category</th>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Price</th>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Stock</th>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Status</th>
              <th className="text-right px-6 py-4 text-text-secondary font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-surface-hover">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-text-primary font-medium">{product.name}</div>
                    {product.player && (
                      <div className="text-text-muted text-sm">{product.player}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="primary">{product.category.toUpperCase()}</Badge>
                </td>
                <td className="px-6 py-4 text-text-primary">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-text-secondary">{product.quantity}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`text-xs px-2 py-1 rounded ${
                        product.isFeatured
                          ? "bg-primary-light text-primary"
                          : "bg-surface-hover text-text-muted"
                      }`}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => toggleActive(product)}
                      className={`text-xs px-2 py-1 rounded ${
                        product.isActive
                          ? "bg-success/20 text-success"
                          : "bg-danger/20 text-danger"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-danger hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
