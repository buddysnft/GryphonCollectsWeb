import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  console.log("=== WEBHOOK RECEIVED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Has signature:", !!signature);
  console.log("Has webhook secret:", !!process.env.STRIPE_WEBHOOK_SECRET);

  if (!signature) {
    console.error("No signature in request");
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Webhook signature verified successfully");
    console.log("Event type:", event.type);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed", details: err.message },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulCheckout(session);
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.error("Payment failed:", failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error handling webhook:", error);
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Webhook handler failed",
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      { status: 500 }
    );
  }
}

async function handleSuccessfulCheckout(session: Stripe.Checkout.Session) {
  console.log("=== WEBHOOK HANDLER STARTED ===");
  console.log("Session ID:", session.id);
  console.log("Metadata:", JSON.stringify(session.metadata));
  
  try {
    const orderType = session.metadata?.type || "product";
    console.log("Order type detected:", orderType);

    console.log("Attempting to get Admin DB...");
    const adminDb = getAdminDb();
    console.log("Admin DB obtained successfully");

    if (orderType === "break") {
      // Handle break spot purchase
      const breakId = session.metadata?.breakId;
      const spots = JSON.parse(session.metadata?.spots || "[]");
      const pricePerSpot = parseFloat(session.metadata?.pricePerSpot || "0");
      const holdForPickup = session.metadata?.holdForPickup === "true";

      console.log("Break order data:", { breakId, spots, pricePerSpot, holdForPickup });

      // Extract shipping address from Stripe if provided
      let shippingAddress = null;
      if (session.shipping_details?.address && !holdForPickup) {
        const addr = session.shipping_details.address;
        shippingAddress = {
          name: session.shipping_details.name || session.customer_details?.name || "",
          street: addr.line1 || "",
          apt: addr.line2 || "",
          city: addr.city || "",
          state: addr.state || "",
          zip: addr.postal_code || "",
          country: addr.country || "US",
        };
      }

      const orderData: any = {
        type: "break",
        breakId,
        spots,
        pricePerSpot,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        customerEmail: session.customer_details?.email || null,
        customerName: session.customer_details?.name || null,
        amount: session.amount_total! / 100, // Total including tax
        amountSubtotal: session.amount_subtotal! / 100, // Subtotal before tax
        taxAmount: (session.total_details?.amount_tax || 0) / 100, // Sales tax collected
        status: holdForPickup ? "held" : "confirmed",
        holdForPickup: holdForPickup || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add shipping address if not holding for pickup
      if (shippingAddress) {
        orderData.shippingAddress = shippingAddress;
      }

      console.log("Creating order in Firestore...");
      await adminDb.collection("orders").add(orderData);
      console.log("Order created successfully");

      // Update break claimed spots
      console.log("Updating break spots for:", breakId);
      const breakRef = adminDb.collection("breaks").doc(breakId!);
      const breakDoc = await breakRef.get();
      
      if (breakDoc.exists) {
        const currentClaimed = breakDoc.data()?.claimedSpots || 0;
        const newClaimed = currentClaimed + spots.length;
        console.log(`Updating claimed spots: ${currentClaimed} -> ${newClaimed}`);
        
        await breakRef.update({
          claimedSpots: newClaimed,
        });
        console.log("Break spots updated successfully");
      } else {
        console.error("Break document not found:", breakId);
      }

      console.log("✅ Break order completed for session:", session.id);
    } else {
      // Handle product purchase
      const cartItems = JSON.parse(session.metadata?.cartItems || "[]");
      console.log("Product order - cart items:", cartItems.length);

      const orderData = {
        type: "product",
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        customerEmail: session.customer_details?.email || null,
        customerName: session.customer_details?.name || null,
        items: cartItems,
        total: session.amount_total! / 100,
        status: "confirmed" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Creating product order in Firestore...");
      await adminDb.collection("orders").add(orderData);
      console.log("✅ Product order completed for session:", session.id);
    }
  } catch (error: any) {
    console.error("❌ ERROR in handleSuccessfulCheckout:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw error;
  }
}
