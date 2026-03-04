"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import type { Break } from "@/lib/types";

export default function AdminBreaksPage() {
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadBreaks();
  }, []);

  const loadBreaks = async () => {
    try {
      if (!db) throw new Error("Firestore not initialized");
      
      const breaksQuery = query(collection(db, "breaks"), orderBy("date", "desc"));
      const snapshot = await getDocs(breaksQuery);
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Break[];
      
      setBreaks(data);
    } catch (error) {
      console.error("Error loading breaks:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (breakId: string, currentStatus: boolean) => {
    try {
      if (!db) throw new Error("Firestore not initialized");
      await updateDoc(doc(db, "breaks", breakId), {
        isActive: !currentStatus
      });
      loadBreaks();
    } catch (error) {
      console.error("Error toggling break status:", error);
      alert("Failed to update break status");
    }
  };

  const handleDelete = async (breakId: string) => {
    if (!confirm("Delete this break? This action cannot be undone.")) return;

    try {
      if (!db) throw new Error("Firestore not initialized");
      await deleteDoc(doc(db, "breaks", breakId));
      loadBreaks();
    } catch (error) {
      console.error("Error deleting break:", error);
      alert("Failed to delete break");
    }
  };

  const filteredBreaks = breaks.filter(b => {
    if (filter === 'active') return b.isActive;
    if (filter === 'completed') return !b.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading breaks...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Breaks Management</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/breaks/new"
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition text-center"
          >
            Create Break
          </Link>
          <Link
            href="/admin/breaks/templates"
            className="bg-surface border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition text-center"
          >
            Templates
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition ${
            filter === 'all'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          All ({breaks.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 font-medium transition ${
            filter === 'active'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Active ({breaks.filter(b => b.isActive).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 font-medium transition ${
            filter === 'completed'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          Completed ({breaks.filter(b => !b.isActive).length})
        </button>
      </div>

      {/* Breaks Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-hover border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Break
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">
                  Spots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBreaks.map((breakItem) => (
                <tr key={breakItem.id} className="hover:bg-surface-hover transition">
                  <td className="px-6 py-4">
                    <div className="text-text-primary font-medium">{breakItem.title}</div>
                    <div className="text-text-muted text-sm md:hidden">
                      {new Date(breakItem.date.seconds * 1000).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary hidden md:table-cell">
                    {new Date(breakItem.date.seconds * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-text-primary font-medium">
                    ${breakItem.price}
                  </td>
                  <td className="px-6 py-4 text-text-secondary hidden md:table-cell">
                    {breakItem.spots?.length || 0} / {breakItem.totalSpots}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      breakItem.isActive
                        ? 'bg-green-500 bg-opacity-20 text-green-500'
                        : 'bg-gray-500 bg-opacity-20 text-gray-500'
                    }`}>
                      {breakItem.isActive ? 'Active' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(breakItem.id!, breakItem.isActive)}
                        className="text-primary hover:text-primary-light text-sm font-medium"
                      >
                        {breakItem.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(breakItem.id!)}
                        className="text-red-500 hover:text-red-400 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBreaks.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            No {filter !== 'all' ? filter : ''} breaks found.
          </div>
        )}
      </div>
    </div>
  );
}
