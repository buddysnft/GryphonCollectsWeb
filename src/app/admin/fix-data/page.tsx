"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, Timestamp } from "firebase/firestore";

/**
 * Client-side data fix page
 * Sets isActive=true on all products and breaks
 * Works from browser using regular Firebase SDK
 */
export default function FixDataPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState("");

  const fixAllData = async () => {
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const results = {
        products: { total: 0, updated: 0 },
        breaks: { total: 0, updated: 0 }
      };

      // FIX PRODUCTS
      console.log("Fetching products...");
      const productsSnapshot = await getDocs(collection(db, "products"));
      results.products.total = productsSnapshot.size;

      if (!productsSnapshot.empty) {
        // Firestore batch limit is 500, so we'll batch in chunks
        const batches: any[] = [];
        let currentBatch = writeBatch(db);
        let batchCount = 0;
        let updateCount = 0;

        productsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.isActive !== true) {
            currentBatch.update(doc.ref, { isActive: true });
            batchCount++;
            updateCount++;

            // Commit batch every 500 updates
            if (batchCount >= 500) {
              batches.push(currentBatch);
              currentBatch = writeBatch(db);
              batchCount = 0;
            }
          }
        });

        // Add remaining batch
        if (batchCount > 0) {
          batches.push(currentBatch);
        }

        // Commit all batches
        console.log(`Committing ${batches.length} product batches...`);
        await Promise.all(batches.map(batch => batch.commit()));
        results.products.updated = updateCount;
      }

      // FIX BREAKS
      console.log("Fetching breaks...");
      const breaksSnapshot = await getDocs(collection(db, "breaks"));
      results.breaks.total = breaksSnapshot.size;

      if (!breaksSnapshot.empty) {
        const breakBatch = writeBatch(db);
        const now = Timestamp.now();
        const oneWeekFromNow = Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000);
        let breakUpdates = 0;

        breaksSnapshot.forEach((doc) => {
          const data = doc.data();
          const updates: any = {};

          // Set isActive if not set
          if (data.isActive !== true) {
            updates.isActive = true;
          }

          // If date is in the past, move it to next week
          if (data.date && data.date.seconds < now.seconds) {
            updates.date = oneWeekFromNow;
          }

          // If no date, set to next week
          if (!data.date) {
            updates.date = oneWeekFromNow;
          }

          if (Object.keys(updates).length > 0) {
            breakBatch.update(doc.ref, updates);
            breakUpdates++;
          }
        });

        if (breakUpdates > 0) {
          console.log("Committing break updates...");
          await breakBatch.commit();
        }
        results.breaks.updated = breakUpdates;
      }

      setResults(results);
      console.log("✅ Fix complete!", results);
    } catch (err: any) {
      console.error("Error fixing data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-surface border border-border rounded-lg p-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Fix Data</h1>
        <p className="text-text-secondary mb-8">
          This will set <code className="bg-surface-hover px-2 py-1 rounded">isActive: true</code> on all products and breaks,
          and move past breaks to next week.
        </p>

        {error && (
          <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {results && (
          <div className="bg-success/20 border border-success text-success px-4 py-3 rounded-lg mb-6">
            <strong>✅ Success!</strong>
            <div className="mt-2 space-y-1 text-sm">
              <div>Products: {results.products.updated} of {results.products.total} updated</div>
              <div>Breaks: {results.breaks.updated} of {results.breaks.total} updated</div>
            </div>
          </div>
        )}

        <button
          onClick={fixAllData}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
            loading
              ? "bg-surface-hover text-text-secondary cursor-not-allowed"
              : "bg-primary text-background hover:opacity-90"
          }`}
        >
          {loading ? "Fixing data..." : "Fix All Data"}
        </button>

        <div className="mt-6 text-sm text-text-secondary">
          <p>After fixing, check:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><a href="/shop" className="text-primary hover:underline">Shop page</a> - should show products</li>
            <li><a href="/breaks" className="text-primary hover:underline">Breaks page</a> - should show breaks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
