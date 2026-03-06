"use client";

import { useEffect, useState } from "react";
import { getProducts, getBreaks, getOrders } from "@/lib/firestore";
import { where, Timestamp } from "firebase/firestore";
import { StatCardSkeleton } from "@/components/LoadingSkeletons";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalBreaks: 0,
    upcomingBreaks: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Products
      const allProducts = await getProducts([]);
      const activeProducts = allProducts.filter((p) => p.isActive);

      // Breaks
      const allBreaks = await getBreaks([]);
      const upcomingBreaks = allBreaks.filter(
        (b) => b.isActive && b.date.seconds * 1000 > Date.now()
      );

      // Orders
      const allOrders = await getOrders();
      const pendingOrders = allOrders.filter((o) => o.status === "pending");

      setStats({
        totalProducts: allProducts.length,
        activeProducts: activeProducts.length,
        totalBreaks: allBreaks.length,
        upcomingBreaks: upcomingBreaks.length,
        totalOrders: allOrders.length,
        pendingOrders: pendingOrders.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
        <Link href="/admin/products">
          <div className="bg-surface border border-border rounded-lg p-4 md:p-6 hover:border-primary transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-secondary font-semibold text-sm md:text-base">Products</h3>
              <span className="text-2xl md:text-3xl">📦</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {stats.activeProducts}
            </div>
            <div className="text-text-muted text-xs md:text-sm">
              {stats.totalProducts} total
            </div>
          </div>
        </Link>

        <Link href="/admin/breaks">
          <div className="bg-surface border border-border rounded-lg p-4 md:p-6 hover:border-primary transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-secondary font-semibold text-sm md:text-base">Breaks</h3>
              <span className="text-2xl md:text-3xl">🎬</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {stats.upcomingBreaks}
            </div>
            <div className="text-text-muted text-xs md:text-sm">
              {stats.totalBreaks} total
            </div>
          </div>
        </Link>

        <Link href="/admin/orders">
          <div className="bg-surface border border-border rounded-lg p-4 md:p-6 hover:border-primary transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-secondary font-semibold text-sm md:text-base">Orders</h3>
              <span className="text-2xl md:text-3xl">📋</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {stats.pendingOrders}
            </div>
            <div className="text-text-muted text-xs md:text-sm">
              {stats.totalOrders} total
            </div>
          </div>
        </Link>
        </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <Link
            href="/admin/products/new"
            className="bg-primary text-background px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-center hover:opacity-90 transition text-sm md:text-base"
          >
            Add Product
          </Link>
          <Link
            href="/admin/breaks/templates"
            className="bg-primary text-background px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-center hover:opacity-90 transition text-sm md:text-base"
          >
            Templates
          </Link>
          <Link
            href="/admin/notifications"
            className="bg-primary text-background px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-center hover:opacity-90 transition text-sm md:text-base"
          >
            Notify
          </Link>
          <Link
            href="/admin/fix-data"
            className="bg-surface-hover border border-border text-text-secondary px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-center hover:border-primary transition text-sm md:text-base col-span-2 lg:col-span-1"
            title="Fix data activation issues (for troubleshooting)"
          >
            🔧 Fix Data
          </Link>
          <Link
            href="/"
            className="bg-surface-hover border border-border text-text-primary px-3 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-center hover:border-primary transition text-sm md:text-base"
          >
            View Site
          </Link>
        </div>
      </div>
    </div>
  );
}
