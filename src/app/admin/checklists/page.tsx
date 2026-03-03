"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Checklist {
  id?: string;
  productName: string;
  brand: string;
  year: string;
  sport: string;
  league: string;
  teams: string[];
  players?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);
  const [formData, setFormData] = useState<Checklist>({
    productName: "",
    brand: "",
    year: "",
    sport: "soccer",
    league: "",
    teams: [],
    players: []
  });

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      if (!db) throw new Error("Firestore not initialized");
      const snapshot = await getDocs(collection(db, "productChecklists"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Checklist[];
      setChecklists(data);
    } catch (error) {
      console.error("Error loading checklists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingChecklist(null);
    setFormData({
      productName: "",
      brand: "",
      year: "",
      sport: "soccer",
      league: "",
      teams: [],
      players: []
    });
    setShowModal(true);
  };

  const handleEdit = (checklist: Checklist) => {
    setEditingChecklist(checklist);
    setFormData(checklist);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!db) throw new Error("Firestore not initialized");

      // Validate required fields
      if (!formData.productName.trim()) {
        alert("Product name is required");
        return;
      }
      if (!formData.league.trim()) {
        alert("League is required");
        return;
      }

      // Filter out empty lines from teams
      const cleanedTeams = formData.teams.filter(t => t.trim()).map(t => t.trim());
      
      if (cleanedTeams.length === 0) {
        alert("At least one team is required");
        return;
      }

      const data = {
        ...formData,
        teams: cleanedTeams,
        players: (formData.players || []).filter(p => p.trim()).map(p => p.trim()),
        updatedAt: Timestamp.now()
      };

      if (editingChecklist?.id) {
        await updateDoc(doc(db, "productChecklists", editingChecklist.id), data);
      } else {
        await addDoc(collection(db, "productChecklists"), {
          ...data,
          createdAt: Timestamp.now()
        });
      }

      setShowModal(false);
      loadChecklists();
    } catch (error: any) {
      console.error("Error saving checklist:", error);
      alert(`Failed to save checklist: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this checklist?")) return;

    try {
      if (!db) throw new Error("Firestore not initialized");
      await deleteDoc(doc(db, "productChecklists", id));
      loadChecklists();
    } catch (error) {
      console.error("Error deleting checklist:", error);
      alert("Failed to delete checklist");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading checklists...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Product Checklists</h1>
        <button
          onClick={handleCreate}
          className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Create Checklist
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="text-left py-4 px-6 text-text-secondary font-semibold">Product Name</th>
              <th className="text-left py-4 px-6 text-text-secondary font-semibold">League</th>
              <th className="text-center py-4 px-6 text-text-secondary font-semibold"># Teams</th>
              <th className="text-right py-4 px-6 text-text-secondary font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checklists.map((checklist) => (
              <tr key={checklist.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                <td className="py-4 px-6 text-text-primary">{checklist.productName}</td>
                <td className="py-4 px-6 text-text-secondary">{checklist.league}</td>
                <td className="py-4 px-6 text-text-secondary text-center">{checklist.teams.length}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => handleEdit(checklist)}
                    className="text-primary hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(checklist.id!)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {checklists.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-text-muted">
                  No checklists yet. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {editingChecklist ? "Edit Checklist" : "Create Checklist"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                  placeholder="2024-25 Topps Chrome Premier League"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                    placeholder="Topps"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-2">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                    placeholder="2024-25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary mb-2">Sport</label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                  >
                    <option value="soccer">Soccer</option>
                    <option value="basketball">Basketball</option>
                    <option value="football">Football</option>
                    <option value="baseball">Baseball</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary mb-2">League</label>
                  <input
                    type="text"
                    value={formData.league}
                    onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                    placeholder="Premier League"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary mb-2">Teams (one per line)</label>
                <textarea
                  value={formData.teams.join("\n")}
                  onChange={(e) => {
                    // Don't filter out empty lines while typing - only filter on save
                    const lines = e.target.value.split("\n");
                    setFormData({ ...formData, teams: lines });
                  }}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary h-48 font-mono"
                  placeholder="Arsenal&#10;Chelsea&#10;Liverpool"
                  rows={10}
                />
                <div className="text-text-muted text-sm mt-1">{formData.teams.filter(t => t.trim()).length} teams</div>
              </div>

              <div>
                <label className="block text-text-secondary mb-2">Players (optional, one per line)</label>
                <textarea
                  value={(formData.players || []).join("\n")}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n");
                    setFormData({ ...formData, players: lines });
                  }}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary h-32 font-mono"
                  placeholder="Bukayo Saka&#10;Cole Palmer"
                  rows={6}
                />
                <div className="text-text-muted text-sm mt-1">{(formData.players || []).filter(p => p.trim()).length} players</div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-hover transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-primary text-background font-semibold hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
