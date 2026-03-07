"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/types";

// Status color mapping
const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500",
  confirmed: "bg-blue-500/20 text-blue-500 border-blue-500",
  shipped: "bg-green-500/20 text-green-500 border-green-500",
  delivered: "bg-gray-500/20 text-gray-500 border-gray-500",
  held: "bg-purple-500/20 text-purple-500 border-purple-500",
};

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  held: "Held for Pickup",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      if (!db) throw new Error("Firestore not initialized");
      const querySnapshot = await getDocs(collection(db, "orders"));
      const loadedOrders = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      }) as any[];
      
      // Sort by date (newest first)
      // Handle multiple date formats (Timestamp, string, object with _seconds)
      loadedOrders.sort((a, b) => {
        const getTime = (order: any) => {
          if (!order.createdAt) return 0;
          if (typeof order.createdAt.toMillis === 'function') {
            return order.createdAt.toMillis();
          }
          if (order.createdAt._seconds) {
            return order.createdAt._seconds * 1000;
          }
          if (typeof order.createdAt === 'string') {
            return new Date(order.createdAt).getTime();
          }
          return 0;
        };
        return getTime(b) - getTime(a);
      });
      
      setOrders(loadedOrders as Order[]);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: Order["status"]) {
    setUpdating(orderId);
    
    try {
      if (!db) throw new Error("Firestore not initialized");
      const orderRef = doc(db, "orders", orderId);
      
      if (newStatus === "shipped") {
        // Prompt for tracking number
        const trackingNumber = prompt("Enter tracking number:");
        if (!trackingNumber) {
          setUpdating(null);
          return;
        }
        
        await updateDoc(orderRef, {
          status: newStatus,
          trackingNumber,
        });
      } else if (newStatus === "held") {
        // Mark as held for pickup
        await updateDoc(orderRef, {
          status: newStatus,
          holdForPickup: true,
        });
      } else {
        await updateDoc(orderRef, {
          status: newStatus,
        });
      }
      
      // Reload orders
      await loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Orders</h1>
          <p className="text-text-secondary">{orders.length} total orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface rounded-xl p-12 text-center">
            <p className="text-text-secondary text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      Order ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      Items
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      Total
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      Tracking
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-primary">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-surface-hover">
                      <td className="px-6 py-4 text-sm text-text-primary font-mono">
                        {order.id.slice(0, 8)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-primary">
                          {order.shippingAddress.street}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-secondary">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 font-semibold text-text-primary">
                        ${order.total.toFixed(2)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                          disabled={updating === order.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[order.status]} bg-transparent cursor-pointer disabled:opacity-50`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="held">Held for Pickup</option>
                        </select>
                      </td>
                      
                      <td className="px-6 py-4">
                        {order.trackingNumber ? (
                          <span className="text-sm text-primary font-mono">
                            {order.trackingNumber}
                          </span>
                        ) : (
                          <span className="text-xs text-text-secondary">—</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {order.createdAt.toDate().toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
