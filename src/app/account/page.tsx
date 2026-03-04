"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

interface Order {
  id: string;
  type: "break" | "product";
  breakId?: string;
  breakTitle?: string;
  spots?: number[];
  items?: any[];
  total: number;
  status: string;
  customerEmail: string;
  createdAt: Date;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadOrders(currentUser.email!);
      } else {
        // Redirect to shop if not logged in
        router.push("/shop");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadOrders = async (email: string) => {
    try {
      if (!db) throw new Error("Firestore not initialized");

      const ordersQuery = query(
        collection(db, "orders"),
        where("customerEmail", "==", email),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(ordersQuery);
      const orderData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Order;
      });

      setOrders(orderData);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading your account...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">My Account</h1>
          <p className="text-text-secondary">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* Account Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button className="px-4 py-3 font-semibold text-primary border-b-2 border-primary">
            Orders
          </button>
          <button className="px-4 py-3 font-semibold text-text-secondary hover:text-text-primary transition">
            Settings
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text-primary">
              Your Orders ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 text-text-muted mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No orders yet
              </h3>
              <p className="text-text-secondary mb-6">
                Start shopping to see your orders here
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/shop"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Browse Products
                </Link>
                <Link
                  href="/breaks"
                  className="bg-surface border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition"
                >
                  View Breaks
                </Link>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface border border-border rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {order.type === "break" ? "Break Purchase" : "Product Order"}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "confirmed"
                          ? "bg-success/20 text-success"
                          : "bg-warning/20 text-warning"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm">
                      {order.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-2xl font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-text-muted text-sm">
                      Order #{order.id.substring(0, 8)}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t border-border pt-4">
                  {order.type === "break" ? (
                    <div>
                      <p className="text-text-secondary mb-2">
                        <span className="font-semibold">Break:</span> {order.breakTitle || "Break"}
                      </p>
                      <p className="text-text-secondary">
                        <span className="font-semibold">Spots:</span>{" "}
                        {order.spots?.sort((a, b) => a - b).join(", ") || "N/A"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-text-secondary">
                          <span>
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                  <button className="text-primary hover:underline text-sm font-semibold">
                    View Details
                  </button>
                  {order.type === "break" && (
                    <Link
                      href={`/breaks/${order.breakId}`}
                      className="text-text-secondary hover:text-text-primary text-sm font-semibold"
                    >
                      View Break →
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
