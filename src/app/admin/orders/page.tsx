"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

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

  async function updateTeamAssignment(orderId: string, team: string) {
    setUpdating(orderId);
    try {
      if (!db) throw new Error("Firestore not initialized");
      await updateDoc(doc(db, "orders", orderId), {
        teamAssignment: team,
        updatedAt: Timestamp.now(),
      });
      await loadOrders();
      alert(`✅ Team "${team}" assigned successfully!`);
    } catch (error: any) {
      console.error("Error updating team:", error);
      alert(`❌ Failed to assign team: ${error.message}`);
    } finally {
      setUpdating(null);
    }
  }

  async function createShippingLabel(order: any) {
    if (!order.shippingAddress) {
      alert("❌ No shipping address on this order");
      return;
    }

    if (!confirm("Create shipping label via Shippo?")) return;

    setUpdating(order.id);
    try {
      const response = await fetch("/api/shippo/create-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          shippingAddress: order.shippingAddress,
          orderTotal: order.total || order.amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create label");
      }

      // Update order with tracking + label
      if (!db) throw new Error("Firestore not initialized");
      await updateDoc(doc(db, "orders", order.id), {
        status: "shipped",
        trackingNumber: data.trackingNumber,
        trackingUrl: data.trackingUrl,
        shippingLabelUrl: data.labelUrl,
        shippingCarrier: data.carrier,
        shippingService: data.service,
        shippingCost: data.cost,
        shippedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      await loadOrders();

      // Open label in new tab
      window.open(data.labelUrl, "_blank");

      alert(`✅ Label created! Tracking: ${data.trackingNumber}\nCost: $${data.cost}\nLabel opened in new tab.`);
    } catch (error: any) {
      console.error("Error creating label:", error);
      alert(`❌ Failed to create label: ${error.message}`);
    } finally {
      setUpdating(null);
    }
  }

  async function markAsShipped(orderId: string) {
    const tracking = prompt("Enter tracking number:");
    if (!tracking) return;

    setUpdating(orderId);
    try {
      if (!db) throw new Error("Firestore not initialized");
      await updateDoc(doc(db, "orders", orderId), {
        status: "shipped",
        trackingNumber: tracking,
        shippedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await loadOrders();
      alert(`✅ Order marked as shipped! Tracking: ${tracking}`);
    } catch (error: any) {
      console.error("Error marking shipped:", error);
      alert(`❌ Failed to mark as shipped: ${error.message}`);
    } finally {
      setUpdating(null);
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
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm font-mono text-text-muted">Order #{order.id.slice(0, 8)}</div>
                    <div className="text-lg font-bold text-text-primary mt-1">
                      ${(order.total || order.amount || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'shipped' ? 'bg-success/20 text-success' :
                      order.status === 'confirmed' ? 'bg-primary/20 text-primary' :
                      order.status === 'test' ? 'bg-warning/20 text-warning' :
                      'bg-surface-hover text-text-secondary'
                    }`}>
                      {order.status || 'pending'}
                    </div>
                    <div className="text-xs text-text-muted mt-1">{formatDate(order.createdAt)}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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

                {/* Break Order: Team Assignment */}
                {order.type === 'break' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-text-primary mb-1">
                          Team Assignment
                        </div>
                        {order.teamAssignment ? (
                          <div className="text-primary font-bold">⚽ {order.teamAssignment}</div>
                        ) : (
                          <div className="text-text-muted text-sm">Not assigned yet</div>
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="text-primary text-sm font-semibold hover:underline"
                      >
                        {order.teamAssignment ? 'Change Team' : 'Assign Team'}
                      </button>
                    </div>

                    {/* Team Selection Dropdown */}
                    {expandedOrder === order.id && (
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Enter team name (e.g., Liverpool, Arsenal)"
                          className="w-full bg-background border border-border rounded px-3 py-2 text-text-primary"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const value = e.currentTarget.value.trim();
                              if (value) {
                                updateTeamAssignment(order.id, value);
                                setExpandedOrder(null);
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                          disabled={updating === order.id}
                        />
                        <div className="text-xs text-text-muted mt-1">
                          Press Enter to save
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Shipping Section */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-text-primary mb-1">
                        Shipping
                      </div>
                      {order.trackingNumber ? (
                        <div className="text-sm">
                          <div className="text-text-secondary">
                            Tracking: <span className="font-mono text-primary">{order.trackingNumber}</span>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-primary hover:underline text-xs"
                              >
                                Track →
                              </a>
                            )}
                          </div>
                          {order.shippingCarrier && order.shippingService && (
                            <div className="text-xs text-text-muted mt-1">
                              {order.shippingCarrier} {order.shippingService}
                              {order.shippingCost && ` • $${order.shippingCost}`}
                            </div>
                          )}
                          {order.shippedAt && (
                            <div className="text-xs text-text-muted mt-1">
                              Shipped: {formatDate(order.shippedAt)}
                            </div>
                          )}
                          {order.shippingLabelUrl && (
                            <a
                              href={order.shippingLabelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-1 inline-block"
                            >
                              View Label PDF →
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="text-text-muted text-sm">Not shipped yet</div>
                      )}
                    </div>
                    {order.status !== 'shipped' && order.status !== 'test' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => createShippingLabel(order)}
                          disabled={updating === order.id || !order.shippingAddress}
                          className="bg-success text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          title={order.shippingAddress ? "Create Shippo label" : "No shipping address"}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {updating === order.id ? 'Creating...' : 'Create Label'}
                        </button>
                        <button
                          onClick={() => markAsShipped(order.id)}
                          disabled={updating === order.id}
                          className="bg-primary text-background px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                        >
                          {updating === order.id ? 'Updating...' : 'Manual Entry'}
                        </button>
                      </div>
                    )}
                  </div>
                  {order.shippingAddress && (
                    <div className="text-xs text-text-muted mt-2 p-2 bg-background rounded">
                      {order.shippingAddress.name && <div>{order.shippingAddress.name}</div>}
                      <div>{order.shippingAddress.street1}</div>
                      {order.shippingAddress.street2 && <div>{order.shippingAddress.street2}</div>}
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stripe Session ID */}
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
