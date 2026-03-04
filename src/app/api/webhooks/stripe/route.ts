import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
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
    if (!db) {
      console.error("Firestore not initialized");
      return;
    }

    // Parse cart items from metadata
    const cartItems = JSON.parse(session.metadata?.cartItems || "[]");

    // Create order in Firestore
    const orderData = {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      customerEmail: session.customer_details?.email || null,
      customerName: session.customer_details?.name || null,
      items: cartItems,
      total: session.amount_total! / 100, // Convert from cents to dollars
      status: "confirmed" as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(db, "orders"), orderData);

    console.log("Order created successfully for session:", session.id);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
