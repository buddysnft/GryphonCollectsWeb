"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { updateUser } from "@/lib/firestore";
import { getOrders } from "@/lib/firestore";
import type { Order } from "@/lib/types";

export default function AccountPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [address, setAddress] = useState({
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName);
      if (userData.shippingAddress) {
        setAddress(userData.shippingAddress);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    const userOrders = await getOrders(user.uid);
    setOrders(userOrders);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUser(user.uid, {
        displayName,
        shippingAddress: address,
      });
      setEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user || !userData) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary">Account</h1>
          <button
            onClick={handleSignOut}
            className="text-text-secondary hover:text-danger transition"
          >
            Sign Out
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Profile</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-primary hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary mb-2">Display Name</label>
              {editing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
              ) : (
                <p className="text-text-primary">{displayName}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary mb-2">Email</label>
              <p className="text-text-muted">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-text-primary mb-6">Shipping Address</h2>

          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Apt/Suite (optional)"
                value={address.apt}
                onChange={(e) => setAddress({ ...address, apt: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="bg-background border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="bg-background border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="ZIP Code"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary text-background py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-surface-hover border border-border text-text-primary py-2 rounded-lg font-semibold hover:bg-background transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-text-secondary">
              {address.street ? (
                <>
                  <p>{address.street}</p>
                  {address.apt && <p>{address.apt}</p>}
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                </>
              ) : (
                <p className="text-text-muted">No address saved</p>
              )}
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-text-primary mb-6">Order History</h2>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-text-primary font-semibold">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-text-muted text-sm">
                        {order.createdAt.toDate().toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-primary font-bold">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-light text-primary font-semibold">
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
