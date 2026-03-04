# Stripe Implementation Guide
**For:** Gryphon Collects Platform  
**Date:** March 4, 2026

---

## Overview

This guide walks through complete Stripe integration for checkout, payment processing, and order management.

---

## Prerequisites

### 1. Stripe Account Setup

**Steps:**
1. Go to https://dashboard.stripe.com
2. Sign up with `apps@teambuddys.com`
3. Complete business verification
4. Get API keys from Dashboard → Developers → API keys

**Keys you need:**
- Publishable key: `pk_test_...` (client-side, safe to expose)
- Secret key: `sk_test_...` (server-side ONLY, never expose)

### 2. Firebase Blaze Plan

**Why:** Cloud Functions require paid plan  
**Cost:** Pay-as-you-go, ~$1-5/month for low volume  
**How:** Firebase Console → Upgrade to Blaze

### 3. Install Dependencies

```bash
cd ~/Desktop/gryphon-collects-web
npm install stripe @stripe/stripe-js
```

---

## Implementation Steps

### Step 1: Add Environment Variables

**In Vercel:**
1. Go to project settings
2. Add these env vars:
   - `STRIPE_SECRET_KEY` = `sk_test_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...` (get from webhooks setup)

**Locally (create `.env.local`):**
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### Step 2: Create Stripe Library

**File:** `src/lib/stripe.ts`

```typescript
import Stripe from "stripe";

// Server-side Stripe instance (secret key)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

// Client-side Stripe instance (publishable key)
export const getStripePromise = async () => {
  const { loadStripe } = await import("@stripe/stripe-js");
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};
```

---

### Step 3: Create Checkout API Route

**File:** `src/app/api/checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCart } from "@/lib/cart";

export async function POST(request: NextRequest) {
  try {
    const { cartItems } = await request.json();

    // Create line items for Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productName,
          images: item.imageURL ? [item.imageURL] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart`,
      metadata: {
        cartItems: JSON.stringify(cartItems),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

### Step 4: Create Webhook Handler

**File:** `src/app/api/webhooks/stripe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

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
}

async function handleSuccessfulCheckout(session: Stripe.Checkout.Session) {
  try {
    const cartItems = JSON.parse(session.metadata?.cartItems || "[]");

    // Create order in Firestore
    await addDoc(collection(db, "orders"), {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      items: cartItems,
      total: session.amount_total! / 100, // Convert from cents
      status: "confirmed",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log("Order created for session:", session.id);
  } catch (error) {
    console.error("Error creating order:", error);
  }
}
```

---

### Step 5: Update Cart Page with Checkout Button

**File:** `src/app/cart/page.tsx` (modify)

Find the "Checkout Coming Soon" button and replace with:

```typescript
const [checkingOut, setCheckingOut] = useState(false);

const handleCheckout = async () => {
  setCheckingOut(true);
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: cart }),
    });

    const { sessionId } = await response.json();
    
    const stripe = await getStripePromise();
    await stripe?.redirectToCheckout({ sessionId });
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Checkout failed. Please try again.");
  } finally {
    setCheckingOut(false);
  }
};

// Replace button:
<button
  onClick={handleCheckout}
  disabled={checkingOut}
  className="w-full bg-primary text-background py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
>
  {checkingOut ? "Redirecting to checkout..." : "Proceed to Checkout"}
</button>
```

---

### Step 6: Create Success Page

**File:** `src/app/checkout/success/page.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { clearCart } from "@/lib/cart";

export default function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      clearCart();
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Processing your order...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
          <p className="text-text-secondary mb-4">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <p className="text-text-muted text-sm">
            Order ID: {sessionId}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="bg-surface border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface-hover transition"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 7: Configure Stripe Webhooks

**In Stripe Dashboard:**
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://gryphon-collects-web-jswr.vercel.app/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Save and copy the **Signing secret** (starts with `whsec_`)
6. Add it to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

---

## Testing

### Test Cards

Use these in Stripe test mode:

**Successful payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Payment declined:**
- Card: `4000 0000 0000 0002`

**Requires authentication (3D Secure):**
- Card: `4000 0025 0000 3155`

### Test Flow

1. Add products to cart
2. Click "Proceed to Checkout"
3. Enter test card details
4. Complete payment
5. Verify redirect to success page
6. Check Firestore for new order
7. Check Stripe Dashboard for payment

---

## Security Checklist

- [ ] Secret key stored in env vars (NEVER in code)
- [ ] Webhook signature verified
- [ ] HTTPS enabled on production domain
- [ ] Firestore rules prevent client-side order creation
- [ ] Amount validation on server-side

---

## Production Deployment

### When Ready for Real Payments:

1. **Switch to Live Mode in Stripe:**
   - Get live API keys (Dashboard → Developers → API keys)
   - Update env vars with live keys (`pk_live_...` and `sk_live_...`)

2. **Update Webhook URL:**
   - Point to production domain
   - Get new signing secret for live mode

3. **Test with Real Card:**
   - Use small amount first ($1 test)
   - Verify order creation
   - Verify webhook handling

4. **Enable Payment Methods:**
   - In Stripe Dashboard → Settings → Payment methods
   - Enable: Cards, Apple Pay, Google Pay

---

## Cost Breakdown

**Stripe Fees (Standard):**
- 2.9% + $0.30 per successful charge
- Example: $100 sale = $3.20 fee, you receive $96.80

**Firebase Costs (Blaze Plan):**
- Cloud Functions: First 2 million invocations free per month
- Firestore: 50K reads, 20K writes free per day
- **Typical monthly cost:** $1-5 for low-medium volume

---

## Troubleshooting

### "Webhook signature verification failed"
- Check that `STRIPE_WEBHOOK_SECRET` env var is correct
- Verify webhook URL matches exactly
- Ensure HTTPS on production

### "No such checkout session"
- Check that publishable key matches secret key environment (test vs live)
- Verify session was created successfully

### Orders not appearing in Firestore
- Check webhook is configured correctly
- View webhook logs in Stripe Dashboard
- Check Cloud Functions logs

---

## Next Steps

1. Install dependencies: `npm install stripe @stripe/stripe-js`
2. Add env vars to Vercel
3. Create the API routes
4. Update cart page
5. Create success page
6. Configure webhooks
7. Test with test cards
8. Deploy and verify

---

## Estimated Implementation Time

- **Setup (keys, env vars):** 15 minutes
- **Code implementation:** 1-2 hours
- **Testing:** 30 minutes
- **Webhook configuration:** 15 minutes
- **Total:** 2-3 hours

