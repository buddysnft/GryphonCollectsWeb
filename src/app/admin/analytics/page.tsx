"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AnalyticsData {
  totalRevenue: number;
  revenueByDay: { date: string; revenue: number }[];
  topProducts: { name: string; revenue: number; units: number }[];
  totalBreaks: number;
  avgParticipation: number;
  upcomingBreaks: number;
  totalUsers: number;
  newUsersThisMonth: number;
  categoryBreakdown: { category: string; value: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      if (!db) throw new Error("Firestore not initialized");

      // Revenue from orders
      const ordersSnap = await getDocs(collection(db, "orders"));
      const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const completedOrders = orders.filter((o: any) => o.status === "delivered" || o.status === "completed");
      const totalRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

      // Revenue by day (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const revenueByDay = completedOrders
        .filter((o: any) => {
          const orderDate = o.createdAt?.toDate?.() || new Date(o.createdAt);
          return orderDate >= thirtyDaysAgo;
        })
        .reduce((acc: any, o: any) => {
          const date = (o.createdAt?.toDate?.() || new Date(o.createdAt)).toLocaleDateString();
          if (!acc[date]) acc[date] = 0;
          acc[date] += o.total || 0;
          return acc;
        }, {});

      const revenueByDayArray = Object.entries(revenueByDay).map(([date, revenue]) => ({
        date,
        revenue: revenue as number
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Top products
      const productsSnap = await getDocs(collection(db, "products"));
      const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const productSales: any = {};
      completedOrders.forEach((order: any) => {
        order.items?.forEach((item: any) => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { name: item.productName, revenue: 0, units: 0 };
          }
          productSales[item.productId].revenue += (item.priceAtPurchase || 0) * (item.quantity || 0);
          productSales[item.productId].units += item.quantity || 0;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 10);

      // Category breakdown
      const categoryBreakdown: any = {};
      products.forEach((p: any) => {
        const cat = p.category || "other";
        if (!categoryBreakdown[cat]) categoryBreakdown[cat] = 0;
        categoryBreakdown[cat]++;
      });

      const categoryBreakdownArray = Object.entries(categoryBreakdown).map(([category, value]) => ({
        category,
        value: value as number
      }));

      // Breaks
      const breaksSnap = await getDocs(collection(db, "breaks"));
      const breaks = breaksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalBreaks = breaks.length;
      const upcomingBreaks = breaks.filter((b: any) => {
        const breakDate = b.date?.toDate?.() || new Date(b.date);
        return breakDate > new Date() && b.isActive;
      }).length;

      const avgParticipation = breaks.reduce((sum: number, b: any) => {
        const rate = (b.claimedSpots || 0) / (b.totalSpots || 1);
        return sum + rate;
      }, 0) / (breaks.length || 1);

      // Users
      const usersSnap = await getDocs(collection(db, "users"));
      const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalUsers = users.length;
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const newUsersThisMonth = users.filter((u: any) => {
        const created = u.createdAt?.toDate?.() || new Date(u.createdAt);
        return created >= thisMonth;
      }).length;

      setData({
        totalRevenue,
        revenueByDay: revenueByDayArray,
        topProducts: topProducts as any,
        totalBreaks,
        avgParticipation,
        upcomingBreaks,
        totalUsers,
        newUsersThisMonth,
        categoryBreakdown: categoryBreakdownArray
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading analytics...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Failed to load analytics</div>
      </div>
    );
  }

  const COLORS = ['#d4a843', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Analytics Dashboard</h1>

      {/* Revenue Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Revenue</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="text-text-muted text-sm mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-primary">${data.totalRevenue.toFixed(2)}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="text-text-muted text-sm mb-2">Average Order Value</div>
            <div className="text-3xl font-bold text-primary">
              ${data.totalRevenue > 0 ? (data.totalRevenue / Math.max(data.revenueByDay.length, 1)).toFixed(2) : '0.00'}
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="text-text-muted text-sm mb-2">Revenue (30 days)</div>
            <div className="text-3xl font-bold text-primary">${data.revenueByDay.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Revenue Over Time (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#d4a843' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#d4a843" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Top Products</h2>
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-secondary font-semibold">Product</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-semibold">Units Sold</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((product, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-text-primary">{product.name}</td>
                    <td className="py-3 px-4 text-text-secondary text-right">{product.units}</td>
                    <td className="py-3 px-4 text-primary text-right font-semibold">${product.revenue.toFixed(2)}</td>
                  </tr>
                ))}
                {data.topProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-text-muted">No sales data yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Products Category Breakdown */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Product Categories</h2>
        <div className="bg-surface border border-border rounded-lg p-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.category}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breaks Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Breaks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="text-text-muted text-sm mb-2">Total Breaks</div>
            <div className="text-3xl font-bold text-primary">{data.totalBreaks}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="text-text-muted text-sm mb-2">Upcoming Breaks</div>
            <div className="text-3xl font-bold text-primary">{data.upcomingBreaks}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="text-text-muted text-sm mb-2">Avg Participation</div>
            <div className="text-3xl font-bold text-primary">{(data.avgParticipation * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="text-text-muted text-sm mb-2">Total Users</div>
            <div className="text-3xl font-bold text-primary">{data.totalUsers}</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="text-text-muted text-sm mb-2">New This Month</div>
            <div className="text-3xl font-bold text-primary">{data.newUsersThisMonth}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
