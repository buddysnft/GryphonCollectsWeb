import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
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
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSuccessfulCheckout(session: Stripe.Checkout.Session) {
  try {
    const orderType = session.metadata?.type || "product";

    if (orderType === "break") {
      // Handle break spot purchase
      const breakId = session.metadata?.breakId;
      const spots = JSON.parse(session.metadata?.spots || "[]");
      const pricePerSpot = parseFloat(session.metadata?.pricePerSpot || "0");

      const orderData = {
        type: "break",
        breakId,
        spots,
        pricePerSpot,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        customerEmail: session.customer_details?.email || null,
        customerName: session.customer_details?.name || null,
        total: session.amount_total! / 100,
        status: "confirmed" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const adminDb = getAdminDb();
      await adminDb.collection("orders").add(orderData);

      // Update break claimed spots
      const breakRef = adminDb.collection("breaks").doc(breakId!);
      const breakDoc = await breakRef.get();
      if (breakDoc.exists) {
        const currentClaimed = breakDoc.data()?.claimedSpots || 0;
        await breakRef.update({
          claimedSpots: currentClaimed + spots.length,
        });
      }

      console.log("Break order created successfully for session:", session.id);
    } else {
      // Handle product purchase
      const cartItems = JSON.parse(session.metadata?.cartItems || "[]");

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

      const adminDb = getAdminDb();
      await adminDb.collection("orders").add(orderData);

      console.log("Product order created successfully for session:", session.id);
    }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
