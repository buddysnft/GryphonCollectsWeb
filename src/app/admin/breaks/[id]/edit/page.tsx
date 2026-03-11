"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import type { Break } from "@/lib/types";

export default function EditBreakPage() {
  const router = useRouter();
  const params = useParams();
  const breakId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [breakData, setBreakData] = useState<Break | null>(null);
  
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
    isActive: true,
  });
  
  const [spotPrices, setSpotPrices] = useState<{ [spotNumber: number]: number }>({});

  useEffect(() => {
    loadBreak();
  }, [breakId]);

  const loadBreak = async () => {
    try {
      if (!db) throw new Error("Firestore not initialized");
      
      const breakRef = doc(db, "breaks", breakId);
      const breakSnap = await getDoc(breakRef);
      
      if (!breakSnap.exists()) {
        alert("Break not found");
        router.push("/admin/breaks");
        return;
      }

      const data = { id: breakSnap.id, ...breakSnap.data() } as Break;
      setBreakData(data);

      // Convert Firestore data to form data
      const breakDate = data.date.toDate();
      const dateStr = breakDate.toISOString().split('T')[0];
      const timeStr = breakDate.toTimeString().slice(0, 5);

      setFormData({
        title: data.title,
        description: data.description || "",
        date: dateStr,
        time: timeStr,
        pricePerSpot: data.pricePerSpot.toString(),
        totalSpots: data.totalSpots.toString(),
        breakFormat: data.breakFormat,
        teams: data.teams ? data.teams.join(", ") : "",
        imageURL: data.imageURL || "",
        youtubeURL: data.youtubeURL || "",
        instagramURL: data.instagramURL || "",
        isActive: data.isActive,
      });
      
      // Load custom spot prices if they exist
      if (data.spotPrices) {
        setSpotPrices(data.spotPrices);
      }
    } catch (error) {
      console.error("Error loading break:", error);
      alert("Failed to load break");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!db) throw new Error("Firestore not initialized");

      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        date: Timestamp.fromDate(dateTime),
        pricePerSpot: parseFloat(formData.pricePerSpot),
        totalSpots: parseInt(formData.totalSpots),
        breakFormat: formData.breakFormat,
        teams: formData.teams ? formData.teams.split(",").map(t => t.trim()) : null,
        imageURL: formData.imageURL || null,
        youtubeURL: formData.youtubeURL || null,
        instagramURL: formData.instagramURL || null,
        isActive: formData.isActive,
      };
      
      // Include spotPrices if any custom prices are set
      if (Object.keys(spotPrices).length > 0) {
        updateData.spotPrices = spotPrices;
      }

      const breakRef = doc(db, "breaks", breakId);
      await updateDoc(breakRef, updateData);
      
      alert("Break updated successfully!");
      router.push("/admin/breaks");
    } catch (error) {
      console.error("Error updating break:", error);
      alert("Failed to update break");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading break...</div>
      </div>
    );
  }

  if (!breakData) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Edit Break</h1>

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
                  />
                  <p className="text-sm text-text-muted mt-1">
                    Currently {breakData.claimedSpots} spots claimed
                  </p>
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
                  <option value="Pick Your Team">Pick Your Team</option>
                  <option value="Random Team">Random Team</option>
                  <option value="Random Number">Random Number</option>
                  <option value="Custom">Custom</option>
                </select>
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
                  />
                </div>
              )}

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-text-primary">
                    Active (visible to customers)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Spot Pricing */}
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Custom Spot Pricing</h2>
            <p className="text-sm text-text-secondary mb-4">
              Set custom prices for individual spots. Leave blank to use default price (${formData.pricePerSpot}).
            </p>
            
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: parseInt(formData.totalSpots) || 0 }, (_, i) => i + 1).map((spotNum) => {
                const spotPrice = spotPrices[spotNum];
                const isClaimed = breakData && breakData.participants && breakData.participants.includes(spotNum.toString());
                
                return (
                  <div key={spotNum} className="relative">
                    <label className="block text-xs font-medium text-text-primary mb-1">
                      Spot {spotNum}
                      {isClaimed && <span className="ml-1 text-green-500">✓</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={formData.pricePerSpot}
                        value={spotPrice || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSpotPrices(prev => {
                            if (val === "") {
                              const newPrices = { ...prev };
                              delete newPrices[spotNum];
                              return newPrices;
                            }
                            return { ...prev, [spotNum]: parseFloat(val) };
                          });
                        }}
                        disabled={isClaimed}
                        className={`w-full pl-7 pr-3 py-2 bg-background border rounded-lg text-text-primary text-sm ${
                          isClaimed ? 'opacity-50 cursor-not-allowed' : 'border-border'
                        } ${spotPrice ? 'border-primary' : 'border-border'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  const allSpots = Array.from({ length: parseInt(formData.totalSpots) || 0 }, (_, i) => i + 1);
                  const price = prompt("Set all unclaimed spots to what price?");
                  if (price && !isNaN(parseFloat(price))) {
                    const newPrices = { ...spotPrices };
                    allSpots.forEach(spotNum => {
                      const isClaimed = breakData && breakData.participants && breakData.participants.includes(spotNum.toString());
                      if (!isClaimed) {
                        newPrices[spotNum] = parseFloat(price);
                      }
                    });
                    setSpotPrices(newPrices);
                  }
                }}
                className="px-4 py-2 bg-background border border-border text-text-primary rounded-lg text-sm hover:bg-surface-hover transition"
              >
                Bulk Set All
              </button>
              
              <button
                type="button"
                onClick={() => setSpotPrices({})}
                className="px-4 py-2 bg-background border border-border text-text-primary rounded-lg text-sm hover:bg-surface-hover transition"
              >
                Clear All Custom Prices
              </button>
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
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
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
