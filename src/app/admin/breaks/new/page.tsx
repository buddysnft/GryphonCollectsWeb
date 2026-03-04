"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function NewBreakPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    pricePerSpot: "",
    totalSpots: "",
    breakFormat: "Pick Your Team" as "Pick Your Team" | "Random Team" | "Random Number" | "Custom",
    teams: "",
    imageURL: "",
    youtubeURL: "",
    instagramURL: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const breakData = {
        title: formData.title,
        description: formData.description,
        date: Timestamp.fromDate(dateTime),
        pricePerSpot: parseFloat(formData.pricePerSpot),
        totalSpots: parseInt(formData.totalSpots),
        claimedSpots: 0,
        breakFormat: formData.breakFormat,
        teams: formData.teams ? formData.teams.split(",").map(t => t.trim()) : null,
        imageURL: formData.imageURL || null,
        youtubeURL: formData.youtubeURL || null,
        instagramURL: formData.instagramURL || null,
        status: "upcoming" as const,
        isActive: true,
        notifyList: [],
        participants: [],
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "breaks"), breakData);
      
      alert("Break created successfully!");
      router.push("/admin/breaks");
    } catch (error) {
      console.error("Error creating break:", error);
      alert("Failed to create break");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Create New Break</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                  placeholder="2026 FIFA Prizm HOBBY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                  placeholder="Premium FIFA Prizm box featuring top international stars..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Break Configuration */}
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Break Configuration</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Price per Spot ($) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.pricePerSpot}
                    onChange={(e) => setFormData({ ...formData, pricePerSpot: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                    placeholder="30.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Total Spots *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.totalSpots}
                    onChange={(e) => setFormData({ ...formData, totalSpots: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Break Format *
                </label>
                <select
                  required
                  value={formData.breakFormat}
                  onChange={(e) => setFormData({ ...formData, breakFormat: e.target.value as any })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                >
                  <option value="Pick Your Team">Pick Your Team - Customers choose their team</option>
                  <option value="Random Team">Random Team - Teams randomly assigned after purchase</option>
                  <option value="Random Number">Random Number - Spots randomly assigned</option>
                  <option value="Custom">Custom - Custom allocation method</option>
                </select>
                
                <p className="text-sm text-text-muted mt-2">
                  {formData.breakFormat === "Pick Your Team" && "Each spot corresponds to a specific team. Customers select their team when purchasing."}
                  {formData.breakFormat === "Random Team" && "Customers purchase spots, teams are randomly assigned via randomizer during the break."}
                  {formData.breakFormat === "Random Number" && "Spots are numbered 1-N and randomly assigned to teams during the break."}
                  {formData.breakFormat === "Custom" && "Custom allocation method - configure separately."}
                </p>
              </div>

              {formData.breakFormat === "Pick Your Team" && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Teams (comma-separated)
                  </label>
                  <textarea
                    value={formData.teams}
                    onChange={(e) => setFormData({ ...formData, teams: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary font-mono text-sm"
                    placeholder="Manchester United, Real Madrid, Barcelona, Bayern Munich, PSG, Liverpool"
                  />
                  <p className="text-sm text-text-muted mt-2">
                    Enter team names separated by commas. Number of teams should match total spots.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Media */}
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Media</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageURL}
                  onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.youtubeURL}
                  onChange={(e) => setFormData({ ...formData, youtubeURL: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagramURL}
                  onChange={(e) => setFormData({ ...formData, instagramURL: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                  placeholder="https://instagram.com/p/..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Break"}
            </button>
            
            <button
              type="button"
              onClick={() => router.push("/admin/breaks")}
              className="px-6 py-3 bg-surface border border-border text-text-primary rounded-lg font-semibold hover:bg-surface-hover transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
