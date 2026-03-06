import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

/**
 * Check recent webhook attempts in Firestore
 * This helps debug if webhooks are being received
 */
export async function GET() {
  try {
    const adminDb = getAdminDb();
    
    // Check if there are any orders
    const ordersSnapshot = await adminDb.collection("orders").limit(10).get();
    
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Check if there's a webhook_logs collection (if we were logging them)
    let webhookLogs: any[] = [];
    try {
      const logsSnapshot = await adminDb.collection("webhook_logs").limit(10).get();
      webhookLogs = logsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (e) {
      // Collection might not exist yet
    }

    return NextResponse.json({
      success: true,
      ordersCount: orders.length,
      orders: orders,
      webhookLogsCount: webhookLogs.length,
      webhookLogs: webhookLogs,
      message: orders.length === 0 
        ? "No orders found. Webhook might not be configured in Stripe or failing silently."
        : `Found ${orders.length} order(s)`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
