import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * Fix all data issues at once:
 * 1. Set isActive=true on all products
 * 2. Set isActive=true on all breaks
 * 3. Ensure breaks have future dates
 */
export async function POST() {
  try {
    const adminDb = getAdminDb();
    const results = {
      products: { total: 0, updated: 0, active: 0 },
      breaks: { total: 0, updated: 0, active: 0, future: 0 }
    };

    // FIX PRODUCTS
    const productsSnapshot = await adminDb.collection("products").get();
    results.products.total = productsSnapshot.size;
    
    if (!productsSnapshot.empty) {
      const productBatch = adminDb.batch();
      let productUpdates = 0;

      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isActive !== true) {
          productBatch.update(doc.ref, { isActive: true });
          productUpdates++;
        }
      });

      if (productUpdates > 0) {
        await productBatch.commit();
      }
      results.products.updated = productUpdates;

      // Count active products
      const activeProducts = await adminDb
        .collection("products")
        .where("isActive", "==", true)
        .get();
      results.products.active = activeProducts.size;
    }

    // FIX BREAKS
    const breaksSnapshot = await adminDb.collection("breaks").get();
    results.breaks.total = breaksSnapshot.size;

    if (!breaksSnapshot.empty) {
      const breakBatch = adminDb.batch();
      let breakUpdates = 0;
      const now = Timestamp.now();
      const oneWeekFromNow = Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000);

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
        await breakBatch.commit();
      }
      results.breaks.updated = breakUpdates;

      // Count active breaks
      const activeBreaks = await adminDb
        .collection("breaks")
        .where("isActive", "==", true)
        .get();
      results.breaks.active = activeBreaks.size;

      // Count future breaks
      const futureBreaks = await adminDb
        .collection("breaks")
        .where("isActive", "==", true)
        .where("date", ">", now)
        .get();
      results.breaks.future = futureBreaks.size;
    }

    return NextResponse.json({
      success: true,
      message: "All data fixed successfully",
      results
    });
  } catch (error: any) {
    console.error("Error fixing data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
