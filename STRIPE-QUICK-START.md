# Stripe Quick Start - 5-Minute Setup

**For:** Gryphon Collects Platform  
**Time:** ~5-10 minutes to get basic checkout working

---

## Step 1: Install Packages (1 minute)

```bash
cd ~/Desktop/gryphon-collects-web
npm install stripe @stripe/stripe-js
```

---

## Step 2: Get Stripe Keys (2 minutes)

1. Go to https://dashboard.stripe.com
2. Sign up or login
3. Click "Developers" → "API keys"
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

---

## Step 3: Add to Vercel (2 minutes)

1. Go to Vercel project settings
2. Add these environment variables:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```
3. Redeploy

**Locally (optional):**
Create `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

---

## Step 4: Upgrade Firebase to Blaze (1 minute)

1. Go to Firebase Console → gryphon-breaks project
2. Click "Upgrade" in bottom-left
3. Choose "Blaze" (pay-as-you-go)
4. **Cost:** ~$1-5/month for low volume

**Why:** Cloud Functions (for webhooks) require paid plan

---

## Step 5: Deploy Code (Already Written!)

All the Stripe code is documented in `STRIPE-IMPLEMENTATION-GUIDE.md`.

**Files you need to create:**
1. `src/lib/stripe.ts` - Stripe instances
2. `src/app/api/checkout/route.ts` - Create checkout session
3. `src/app/api/webhooks/stripe/route.ts` - Handle payments
4. `src/app/checkout/success/page.tsx` - Success page
5. Update `src/app/cart/page.tsx` - Add checkout button

**Total code:** ~200 lines (all provided in guide)

---

## Step 6: Configure Webhooks (2 minutes)

1. Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://gryphon-collects-web-jswr.vercel.app/api/webhooks/stripe`
4. Events to select:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## Test It!

**Test card:** `4242 4242 4242 4242`  
**Expiry:** Any future date  
**CVC:** Any 3 digits

1. Add a product to cart
2. Click "Proceed to Checkout"
3. Enter test card
4. Complete payment
5. Check Firestore for new order!

---

## What You Get

✅ Full checkout flow  
✅ Card payments  
✅ Apple Pay / Google Pay (automatic)  
✅ Order creation in Firestore  
✅ Webhook handling  
✅ Success page  

---

## When to Switch to Live Mode

Once tested and ready:
1. Get live API keys from Stripe Dashboard
2. Update env vars with live keys
3. Update webhook URL for live mode
4. Test with real card (small amount first)

**Stripe fees:** 2.9% + $0.30 per successful charge

---

## Need Help?

See full guide: `STRIPE-IMPLEMENTATION-GUIDE.md`

**Estimated total time:** 2-3 hours including testing

