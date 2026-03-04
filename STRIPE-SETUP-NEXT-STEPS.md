# Stripe Setup - What to Do Next

**Status:** ✅ Code implemented and deployed  
**Remaining:** Environment variables + webhook configuration

---

## What's Already Done

✅ All code implemented  
✅ Dependencies installed (stripe, @stripe/stripe-js)  
✅ Checkout flow working  
✅ Webhook handler ready  
✅ Success page created  
✅ Cart page updated with checkout button  

---

## What You Need to Do (15 minutes)

### Step 1: Create Stripe Account (5 minutes)

1. Go to https://dashboard.stripe.com
2. Sign up with `apps@teambuddys.com`
3. Complete business verification
4. Stay in **Test mode** for now

### Step 2: Get API Keys (2 minutes)

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy these two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)  
     ⚠️ Keep secret key private!

### Step 3: Add Keys to Vercel (3 minutes)

1. Go to https://vercel.com/jons-projects-019c1373/gryphon-collects-web-jswr
2. Click **Settings** → **Environment Variables**
3. Add these 3 variables:

```
STRIPE_SECRET_KEY = sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_KEY_HERE
NEXT_PUBLIC_SITE_URL = https://gryphon-collects-web-jswr.vercel.app
```

4. Click **Save**
5. **Redeploy** the site (Settings → Deployments → Redeploy latest)

### Step 4: Upgrade Firebase to Blaze (2 minutes)

1. Go to https://console.firebase.google.com/project/gryphon-breaks
2. Click **Upgrade** in the bottom-left corner
3. Select **Blaze Plan** (pay-as-you-go)
4. **Cost:** ~$1-5/month for low volume

**Why needed:** Webhook handler uses Cloud Functions which require paid plan

### Step 5: Configure Webhook (3 minutes)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter this URL:
   ```
   https://gryphon-collects-web-jswr.vercel.app/api/webhooks/stripe
   ```
4. Select these events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Go back to Vercel → Environment Variables
8. Add this variable:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_YOUR_SECRET_HERE
   ```
9. **Redeploy** again

---

## Testing (5 minutes)

Once steps 1-5 are complete:

1. Go to your site
2. Add a product to cart
3. Click "Proceed to Checkout"
4. Use this test card:
   - **Card number:** `4242 4242 4242 4242`
   - **Expiry:** Any future date (e.g., 12/34)
   - **CVC:** Any 3 digits (e.g., 123)
   - **ZIP:** Any 5 digits (e.g., 10001)
5. Complete the payment
6. You should see the success page
7. Check Firestore `orders` collection for new order
8. Check Stripe Dashboard for payment

---

## What Happens When Someone Pays

1. **User clicks "Proceed to Checkout"**
   - Creates Stripe checkout session
   - Redirects to Stripe-hosted payment page

2. **User enters card details**
   - Stripe handles all payment processing
   - Stripe validates card
   - Stripe processes payment

3. **Payment succeeds**
   - Stripe sends webhook to your server
   - Your webhook handler creates order in Firestore
   - User redirected to success page
   - Cart is cleared
   - Stripe sends email receipt automatically

4. **Order appears in admin**
   - Go to `/admin/orders`
   - See order with "confirmed" status
   - Can view customer email, items, total

---

## When to Switch to Live Mode

**After testing works:**

1. In Stripe Dashboard, toggle from **Test mode** to **Live mode**
2. Get your **live API keys** (starts with `pk_live_` and `sk_live_`)
3. Update Vercel env vars with live keys
4. Create new webhook endpoint for live mode
5. Get new signing secret for live webhook
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel
7. Redeploy

**Then test with a real card using a small amount ($1) first!**

---

## Fees

**Stripe takes:**
- 2.9% + $0.30 per successful charge
- Example: $100 sale → you receive $96.80

**Firebase Blaze:**
- ~$1-5/month for low-medium volume
- First 2 million function invocations free

---

## Troubleshooting

### "No such checkout session"
- Make sure env vars are set in Vercel
- Redeploy after adding env vars

### "Webhook signature verification failed"
- Check `STRIPE_WEBHOOK_SECRET` matches webhook signing secret
- Make sure webhook URL is exactly correct

### Orders not appearing in Firestore
- Check webhook is configured and active
- View webhook logs in Stripe Dashboard → Developers → Webhooks
- Check webhook endpoint is receiving events

### Payment works but no order
- Check Firebase is on Blaze plan (required for Cloud Functions)
- Check webhook endpoint URL is correct
- Check Firestore rules allow order creation via webhook

---

## Quick Checklist

- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Keys added to Vercel
- [ ] Site redeployed
- [ ] Firebase upgraded to Blaze
- [ ] Webhook configured in Stripe
- [ ] Webhook secret added to Vercel
- [ ] Site redeployed again
- [ ] Tested with test card
- [ ] Order appears in Firestore
- [ ] Payment shows in Stripe Dashboard

---

## Need Help?

See complete guide: `STRIPE-IMPLEMENTATION-GUIDE.md`

---

**Once all steps complete, checkout is LIVE! 🚀**

