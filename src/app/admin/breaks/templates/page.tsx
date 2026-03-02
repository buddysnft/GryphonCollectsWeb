"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface BreakTemplate {
  id?: string;
  name: string;
  breakFormat: string;
  pricePerSpot: number;
  totalSpots: number;
  teams?: string[];
  players?: string[];
  descriptionTemplate: string;
  createdBy?: string;
  createdAt?: any;
}

export default function BreakTemplatesPage() {
  const [templates, setTemplates] = useState<BreakTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BreakTemplate | null>(null);
  const [formData, setFormData] = useState<BreakTemplate>({
    name: "",
    breakFormat: "Pick Your Team",
    pricePerSpot: 25,
    totalSpots: 20,
    teams: [],
    players: [],
    descriptionTemplate: ""
  });
  const router = useRouter();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      if (!db) throw new Error("Firestore not initialized");
      const snapshot = await getDocs(collection(db, "breakTemplates"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BreakTemplate[];
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      breakFormat: "Pick Your Team",
      pricePerSpot: 25,
      totalSpots: 20,
      teams: [],
      players: [],
      descriptionTemplate: ""
    });
    setShowModal(true);
  };

  const handleEdit = (template: BreakTemplate) => {
    setEditingTemplate(template);
    setFormData(template);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!db) throw new Error("Firestore not initialized");

      const data = {
        ...formData,
        createdAt: editingTemplate ? editingTemplate.createdAt : Timestamp.now()
      };

      if (editingTemplate?.id) {
        await updateDoc(doc(db, "breakTemplates", editingTemplate.id), data);
      } else {
        await addDoc(collection(db, "breakTemplates"), data);
      }

      setShowModal(false);
      loadTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save template");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;

    try {
      if (!db) throw new Error("Firestore not initialized");
      await deleteDoc(doc(db, "breakTemplates", id));
      loadTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

  const handleUseTemplate = (template: BreakTemplate) => {
    const params = new URLSearchParams({
      templateId: template.id || "",
      breakFormat: template.breakFormat,
      pricePerSpot: template.pricePerSpot.toString(),
      totalSpots: template.totalSpots.toString(),
      teams: (template.teams || []).join(","),
      descriptionTemplate: template.descriptionTemplate
    });
    router.push(`/admin/breaks/new?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Break Templates</h1>
        <button
          onClick={handleCreate}
          className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-surface border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-2">{template.name}</h3>
            <div className="text-text-secondary text-sm space-y-1 mb-4">
              <div>Format: {template.breakFormat}</div>
              <div>Price: ${template.pricePerSpot}/spot</div>
              <div>Spots: {template.totalSpots}</div>
              {template.teams && template.teams.length > 0 && (
                <div>Teams: {template.teams.length}</div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleUseTemplate(template)}
                className="flex-1 bg-primary text-background px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm"
              >
                Use Template
              </button>
              <button
                onClick={() => handleEdit(template)}
                className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:bg-surface-hover transition text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(template.id!)}
                className="px-4 py-2 rounded-lg border border-border text-red-500 hover:bg-red-500 hover:bg-opacity-10 transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="col-span-full text-center py-12 text-text-muted">
            No templates yet. Create one to get started!
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {editingTemplate ? "Edit Template" : "Create Template"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary mb-2">Template Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                  placeholder="Standard PYT - 20 Teams"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary mb-2">Break Format</label>
                  <select
                    value={formData.breakFormat}
                    onChange={(e) => setFormData({ ...formData, breakFormat: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                  >
                    <option value="Pick Your Team">Pick Your Team</option>
                    <option value="Pick Your Player">Pick Your Player</option>
                    <option value="Random">Random</option>
                    <option value="Hit Draft">Hit Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary mb-2">Price per Spot</label>
                  <input
                    type="number"
                    value={formData.pricePerSpot}
                    onChange={(e) => setFormData({ ...formData, pricePerSpot: parseFloat(e.target.value) })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary mb-2">Total Spots</label>
                <input
                  type="number"
                  value={formData.totalSpots}
                  onChange={(e) => setFormData({ ...formData, totalSpots: parseInt(e.target.value) })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-2">Teams (one per line, optional)</label>
                <textarea
                  value={(formData.teams || []).join("\n")}
                  onChange={(e) => setFormData({ ...formData, teams: e.target.value.split("\n").filter(t => t.trim()) })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary h-32"
                  placeholder="Arsenal&#10;Chelsea&#10;Liverpool"
                />
              </div>

              <div>
                <label className="block text-text-secondary mb-2">Description Template</label>
                <textarea
                  value={formData.descriptionTemplate}
                  onChange={(e) => setFormData({ ...formData, descriptionTemplate: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary h-24"
                  placeholder="Pick your favorite team! All hits ship!"
                />
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
