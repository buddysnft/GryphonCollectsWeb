"use client";

import { useEffect, useState } from "react";
import { getProducts, getBreaks, getOrders } from "@/lib/firestore";
import { where, Timestamp } from "firebase/firestore";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/products">
          <div className="bg-surface border border-border rounded-lg p-6 hover:border-primary transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-secondary font-semibold">Products</h3>
              <span className="text-3xl">📦</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.activeProducts}
            </div>
            <div className="text-text-muted text-sm">
              {stats.totalProducts} total
            </div>
          </div>
        </Link>

        <Link href="/admin/breaks">
          <div className="bg-surface border border-border rounded-lg p-6 hover:border-primary transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-secondary font-semibold">Breaks</h3>
              <span className="text-3xl">🎬</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.upcomingBreaks}
            </div>
            <div className="text-text-muted text-sm">
              {stats.totalBreaks} total
            </div>
          </div>
        </Link>

        <Link href="/admin/orders">
          <div className="bg-surface border border-border rounded-lg p-6 hover:border-primary transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-secondary font-semibold">Orders</h3>
              <span className="text-3xl">📋</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {stats.pendingOrders}
            </div>
            <div className="text-text-muted text-sm">
              {stats.totalOrders} total
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="bg-primary text-background px-4 py-3 rounded-lg font-semibold text-center hover:opacity-90 transition"
          >
            Add Product
          </Link>
          <Link
            href="/admin/breaks/templates"
            className="bg-primary text-background px-4 py-3 rounded-lg font-semibold text-center hover:opacity-90 transition"
          >
            Break Templates
          </Link>
          <Link
            href="/admin/notifications"
            className="bg-primary text-background px-4 py-3 rounded-lg font-semibold text-center hover:opacity-90 transition"
          >
            Send Notification
          </Link>
          <Link
            href="/"
            className="bg-surface-hover border border-border text-text-primary px-4 py-3 rounded-lg font-semibold text-center hover:border-primary transition"
          >
            View Site
          </Link>
        </div>
      </div>
    </div>
  );
}
