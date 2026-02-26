"use client";

import { useEffect, useState } from "react";
import { getBreaks } from "@/lib/firestore";
import type { Break } from "@/lib/types";

export default function AdminBreaksPage() {
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBreaks();
  }, []);

  const loadBreaks = async () => {
    try {
      const allBreaks = await getBreaks([]);
      setBreaks(allBreaks.sort((a, b) => b.date.seconds - a.date.seconds));
    } catch (error) {
      console.error("Error loading breaks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-text-secondary">Loading breaks...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary">Breaks</h1>
        <div className="bg-primary-light border border-primary text-primary px-4 py-2 rounded-lg">
          Breaks management coming soon - Use iOS app for now
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <p className="text-text-secondary">
          Showing {breaks.length} breaks
        </p>
        <p className="text-text-muted text-sm mt-2">
          Full break scheduling interface will be added in next update
        </p>
      </div>
    </div>
  );
}
