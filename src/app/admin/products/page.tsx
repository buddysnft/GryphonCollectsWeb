"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts, deleteProduct, updateProduct } from "@/lib/firestore";
import type { Product } from "@/lib/types";
import Badge from "@/components/Badge";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const router = useRouter();

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

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} products?`)) return;

    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteProduct(id)));
      setProducts(products.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Error bulk deleting:", error);
      alert("Failed to delete products");
    }
  };

  const handleBulkActivate = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => updateProduct(id, { isActive: true }))
      );
      setProducts(products.map(p => 
        selectedIds.has(p.id) ? { ...p, isActive: true } : p
      ));
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Error bulk activating:", error);
      alert("Failed to activate products");
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => updateProduct(id, { isActive: false }))
      );
      setProducts(products.map(p => 
        selectedIds.has(p.id) ? { ...p, isActive: false } : p
      ));
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Error bulk deactivating:", error);
      alert("Failed to deactivate products");
    }
  };

  const handleExportCSV = () => {
    const selectedProducts = selectedIds.size > 0
      ? products.filter(p => selectedIds.has(p.id))
      : filteredProducts;

    const csv = [
      ["Name", "Category", "Price", "Quantity", "Active", "Featured"].join(","),
      ...selectedProducts.map(p => [
        `"${p.name}"`,
        p.category,
        p.price,
        p.quantity,
        p.isActive ? "Yes" : "No",
        p.isFeatured ? "Yes" : "No"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (p.player?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                         (p.team?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && p.isActive) ||
                         (statusFilter === "inactive" && !p.isActive);
    const matchesStock = stockFilter === "all" ||
                        (stockFilter === "in-stock" && p.quantity > 0) ||
                        (stockFilter === "low-stock" && p.quantity > 0 && p.quantity < 5) ||
                        (stockFilter === "out-of-stock" && p.quantity === 0);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

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
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-surface border border-border text-text-primary px-4 py-2 rounded-lg font-semibold hover:bg-surface-hover transition"
          >
            Export CSV
          </button>
          <Link
            href="/admin/products/new"
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-6 bg-primary-light border border-primary rounded-lg p-4 flex items-center justify-between">
          <div className="text-primary font-semibold">{selectedIds.size} selected</div>
          <div className="flex gap-3">
            <button
              onClick={handleBulkActivate}
              className="bg-primary text-background px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm"
            >
              Activate
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="bg-surface border border-border text-text-primary px-4 py-2 rounded-lg hover:bg-surface-hover transition text-sm"
            >
              Deactivate
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-opacity-30 transition text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-surface border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="boxes">Boxes</option>
          <option value="cases">Cases</option>
          <option value="singles">Singles</option>
          <option value="slabs">Slabs</option>
          <option value="merch">Merch</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
        >
          <option value="all">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock (&lt;5)</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
              </th>
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
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="rounded border-border"
                  />
                </td>
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
                <td className="px-6 py-4">
                  <span className={product.quantity === 0 ? "text-red-500" : product.quantity < 5 ? "text-yellow-500" : "text-text-secondary"}>
                    {product.quantity}
                  </span>
                </td>
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

      <div className="mt-4 text-text-muted text-sm">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
