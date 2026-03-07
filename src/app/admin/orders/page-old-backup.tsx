"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      if (!db) throw new Error("Firestore not initialized");
      const querySnapshot = await getDocs(collection(db, "orders"));
      const loadedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort by date (newest first)
      loadedOrders.sort((a, b) => {
        const getTime = (order: any) => {
          if (!order.createdAt) return 0;
          if (typeof order.createdAt.toMillis === 'function') return order.createdAt.toMillis();
          if (order.createdAt._seconds) return order.createdAt._seconds * 1000;
          if (typeof order.createdAt === 'string') return new Date(order.createdAt).getTime();
          return 0;
        };
        return getTime(b) - getTime(a);
      });
      
      setOrders(loadedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (createdAt: any) => {
    if (!createdAt) return 'Unknown';
    if (typeof createdAt.toDate === 'function') {
      return createdAt.toDate().toLocaleDateString();
    }
    if (createdAt._seconds) {
      return new Date(createdAt._seconds * 1000).toLocaleDateString();
    }
    if (typeof createdAt === 'string') {
      return new Date(createdAt).toLocaleDateString();
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Orders</h1>
          <p className="text-text-secondary">{orders.length} total orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <p className="text-text-secondary">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-surface border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-mono text-text-muted">Order #{order.id.slice(0, 8)}</div>
                    <div className="text-lg font-bold text-text-primary mt-1">
                      ${(order.total || order.amount || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'confirmed' ? 'bg-success/20 text-success' :
                      order.status === 'test' ? 'bg-warning/20 text-warning' :
                      'bg-surface-hover text-text-secondary'
                    }`}>
                      {order.status || 'pending'}
                    </div>
                    <div className="text-xs text-text-muted mt-1">{formatDate(order.createdAt)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-text-muted mb-1">Customer</div>
                    <div className="text-text-primary">{order.customerName || 'Unknown'}</div>
                    {order.customerEmail && (
                      <div className="text-text-secondary text-xs">{order.customerEmail}</div>
                    )}
                  </div>

                  <div>
                    <div className="text-text-muted mb-1">Type</div>
                    {order.type === 'break' ? (
                      <div>
                        <div className="text-text-primary">Break Spots</div>
                        <div className="text-text-secondary text-xs">
                          Spot{order.spots?.length !== 1 ? 's' : ''}: {order.spots?.join(', ') || 'Unknown'}
                        </div>
                      </div>
                    ) : order.items ? (
                      <div>
                        <div className="text-text-primary">Product Order</div>
                        <div className="text-text-secondary text-xs">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ) : (
                      <div className="text-text-primary">Order</div>
                    )}
                  </div>
                </div>

                {order.stripeSessionId && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs text-text-muted">
                      Stripe Session: <span className="font-mono">{order.stripeSessionId.slice(0, 20)}...</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
