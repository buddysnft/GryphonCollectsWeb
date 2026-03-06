import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

/**
 * Manually create a test order to verify Firestore is working
 * This helps isolate if the issue is webhook delivery or Firestore writes
 */
export async function POST() {
  try {
    console.log("Creating test order...");
    
    const adminDb = getAdminDb();
    console.log("Got admin DB");

    const testOrder = {
      type: "product",
      stripeSessionId: "test_session_" + Date.now(),
      stripePaymentIntentId: "test_pi_" + Date.now(),
      customerEmail: "test@example.com",
      customerName: "Test Customer",
      amount: 9.99,
      status: "test",
      items: [
        {
          productId: "test_product",
          productName: "Test Product",
          quantity: 1,
          price: 9.99,
        }
      ],
      createdAt: new Date().toISOString(),
    };

    console.log("Test order data:", testOrder);

    const docRef = await adminDb.collection("orders").add(testOrder);
    console.log("Order created with ID:", docRef.id);

    // Verify it was created
    const doc = await docRef.get();
    const createdOrder = doc.data();

    return NextResponse.json({
      success: true,
      message: "Test order created successfully",
      orderId: docRef.id,
      order: createdOrder,
    });
  } catch (error: any) {
    console.error("Failed to create test order:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      code: error.code,
    }, { status: 500 });
  }
}
