"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "@/lib/firestore";
import type { Order } from "@/lib/types";
import Badge from "@/components/Badge";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await getOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Orders</h1>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Order ID</th>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Date</th>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Total</th>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Status</th>
              <th className="text-left px-6 py-4 text-text-secondary font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-surface-hover">
                <td className="px-6 py-4 text-text-primary font-mono">#{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4 text-text-secondary">
                  {order.createdAt.toDate().toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-primary font-bold">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "success"
                        : order.status === "shipped"
                        ? "primary"
                        : "default"
                    }
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                    className="bg-background border border-border rounded px-3 py-1 text-text-primary text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12 text-text-muted">No orders yet</div>
        )}
      </div>
    </div>
  );
}
