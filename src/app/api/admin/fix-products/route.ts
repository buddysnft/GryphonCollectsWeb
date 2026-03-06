import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

/**
 * Fix products: Set isActive=true on all products that don't have it
 * This is needed because shop page filters by isActive==true
 */
export async function POST() {
  try {
    const adminDb = getAdminDb();
    
    // Get all products
    const productsSnapshot = await adminDb.collection("products").get();
    console.log(`Found ${productsSnapshot.size} products`);
    
    if (productsSnapshot.empty) {
      return NextResponse.json({
        success: false,
        message: "No products found in database"
      });
    }

    // Update each product to have isActive: true
    const batch = adminDb.batch();
    let updateCount = 0;

    productsSnapshot.forEach((doc) => {
      const data = doc.data();
      // Only update if isActive is not already true
      if (data.isActive !== true) {
        batch.update(doc.ref, { isActive: true });
        updateCount++;
      }
    });

    await batch.commit();

    // Count active products
    const activeSnapshot = await adminDb
      .collection("products")
      .where("isActive", "==", true)
      .get();

    return NextResponse.json({
      success: true,
      message: "Products updated successfully",
      total: productsSnapshot.size,
      updated: updateCount,
      active: activeSnapshot.size
    });
  } catch (error: any) {
    console.error("Error fixing products:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
