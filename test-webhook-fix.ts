/**
 * Test script to verify Firebase Admin can write orders to Firestore
 * This simulates what the webhook does after the private key fix
 * 
 * Run with: npx tsx test-webhook-fix.ts
 */

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Read env vars the same way the webhook does
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gryphon-breaks";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

console.log("=== Testing Firebase Admin with Fixed Private Key Handling ===\n");

if (!clientEmail || !privateKey) {
  console.error("❌ Missing Firebase Admin credentials in environment");
  console.error("Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY");
  process.exit(1);
}

console.log("✅ Env vars present");
console.log("- Project ID:", projectId);
console.log("- Client Email:", clientEmail);
console.log("- Private Key length:", privateKey.length);

// Apply the SAME fix as in firebase-admin.ts
const fixedKey = privateKey
  .replace(/\\\\n/g, "\n")  // Handle double-escaped newlines first
  .replace(/\\n/g, "\n");   // Then single-escaped

console.log("\nPrivate key after fix:");
console.log("- Contains actual newlines:", fixedKey.includes('\n'));
console.log("- Line count:", fixedKey.split('\n').length);

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: fixedKey,
    }),
  });
}

async function testOrderCreation() {
  try {
    console.log("\n=== Initializing Firebase Admin ===");
    const app = getAdminApp();
    const db = getFirestore(app);
    console.log("✅ Firebase Admin initialized");

    console.log("\n=== Creating Test Order ===");
    
    // Create an order exactly like the webhook does
    const testOrder = {
      type: "product" as const,
      stripeSessionId: `cs_test_${Date.now()}`,
      stripePaymentIntentId: `pi_test_${Date.now()}`,
      customerEmail: "test@example.com",
      customerName: "Test Customer",
      items: [
        {
          id: "test-product-1",
          name: "Test Product",
          price: 29.99,
          quantity: 1,
        },
      ],
      total: 29.99,
      status: "confirmed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      _test: true,  // Mark as test for easy cleanup
    };

    const orderRef = await db.collection("orders").add(testOrder);
    console.log("✅ Test order created successfully!");
    console.log("   Order ID:", orderRef.id);

    // Read it back to verify
    const orderDoc = await orderRef.get();
    const orderData = orderDoc.data();
    console.log("\n✅ Order retrieved from Firestore:");
    console.log("   Customer:", orderData?.customerEmail);
    console.log("   Total: $" + orderData?.total);

    // Clean up
    console.log("\n=== Cleaning Up ===");
    await orderRef.delete();
    console.log("✅ Test order deleted");

    console.log("\n🎉 SUCCESS! Firebase Admin is working correctly.");
    console.log("   The webhook should now be able to save orders.");
    
  } catch (error: any) {
    console.error("\n❌ TEST FAILED");
    console.error("Error:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
}

testOrderCreation();
