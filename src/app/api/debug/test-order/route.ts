import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

/**
 * Test endpoint to verify Firebase Admin can write orders to Firestore
 * 
 * This will help confirm the private key fix is working in production
 * GET https://gryphon-collects-web-jswr.vercel.app/api/debug/test-order
 */
export async function GET() {
  try {
    console.log("=== Test Order Creation Started ===");
    
    // Get Firebase Admin DB
    const adminDb = getAdminDb();
    console.log("✅ Admin DB obtained");

    // Create a test order (same structure as webhook)
    const testOrder = {
      type: "product" as const,
      stripeSessionId: `cs_test_${Date.now()}`,
      stripePaymentIntentId: `pi_test_${Date.now()}`,
      customerEmail: "test@gryphoncollects.com",
      customerName: "Test Order (Debug Endpoint)",
      items: [
        {
          id: "test-product",
          name: "Debug Test Product",
          price: 1.00,
          quantity: 1,
        },
      ],
      total: 1.00,
      status: "confirmed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      _test: true,  // Mark for easy identification/cleanup
    };

    console.log("Creating test order...");
    const orderRef = await adminDb.collection("orders").add(testOrder);
    console.log("✅ Order created:", orderRef.id);

    // Read it back to verify
    const orderDoc = await orderRef.get();
    const savedOrder = orderDoc.data();

    return NextResponse.json({
      success: true,
      message: "Firebase Admin is working! Order created successfully.",
      orderId: orderRef.id,
      orderData: {
        customerEmail: savedOrder?.customerEmail,
        total: savedOrder?.total,
        type: savedOrder?.type,
      },
      note: "This test order is marked with _test:true and can be safely deleted from Firestore console.",
    });
  } catch (error: any) {
    console.error("❌ Test order creation failed:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin test failed",
        error: error.message,
        errorName: error.name,
        errorCode: error.code,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
