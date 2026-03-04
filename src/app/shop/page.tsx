"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/firestore";
import { where, orderBy } from "firebase/firestore";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { ProductCardSkeleton } from "@/components/LoadingSkeletons";
import type { Product } from "@/lib/types";

const PRODUCTS_PER_PAGE = 12;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters
  const [sportFilter, setSportFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, sportFilter, categoryFilter, sortBy, searchQuery]);

  useEffect(() => {
    applyPagination();
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [sportFilter, categoryFilter, searchQuery]);

  const loadProducts = async () => {
    try {
      const constraints = [where("isActive", "==", true)];
      const fetchedProducts = await getProducts(constraints);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Sport filter
    if (sportFilter !== "All") {
      filtered = filtered.filter((p) => p.sport === sportFilter);
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.player?.toLowerCase().includes(query) ||
          p.team?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredProducts(filtered);
  };

  const applyPagination = () => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  };

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Don't show loading state at top level, show in grid instead

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Shop</h1>
          <p className="text-text-secondary">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Sport Filter */}
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="All">All Sports</option>
            <option value="Soccer">Soccer</option>
            <option value="Merch">Merch</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Boxes">Boxes</option>
            <option value="Cases">Cases</option>
            <option value="Singles">Singles</option>
            <option value="Slabs">Slabs</option>
            <option value="Merch">Merch</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-text-secondary text-sm">
            Showing {filteredProducts.length} results
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-border rounded-lg px-4 py-2 text-text-primary text-sm focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-20 h-20 text-text-muted mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-text-primary mb-2">No products found</h3>
            <p className="text-text-secondary mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSportFilter("All");
                setCategoryFilter("All");
                setSearchQuery("");
              }}
              className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
