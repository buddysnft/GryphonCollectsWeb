# Shippo Shipping Integration

**Status:** ✅ Implemented with TEST token (live token pending approval)

---

## What's Included

### 1. Automatic Shipping Label Creation
- **Button:** "Create Label" in admin orders page
- **Process:**
  1. Click button → Shippo creates label automatically
  2. PDF label opens in new tab
  3. Tracking number auto-saves to order
  4. Order marked as "shipped"

### 2. Tyler's Specifications (Implemented)
- **Carrier:** USPS Ground Advantage (falls back to cheapest USPS if unavailable)
- **Package:** 6 x 4 x 1 inches, 9 oz
- **Return Address:** Gryphon Collects, 4460 Corporation Lane Ste 100, Virginia Beach, VA 23462
- **Insurance:** NO (Tyler has independent policy)
- **Signature:** AUTO-ADDED if order total > $1,000

---

## Current Setup

### Environment Variables (.env.local)
```
SHIPPO_API_TOKEN=shippo_test_[TOKEN_REDACTED]
```

**Note:** This is a TEST token (set in .env.local). Replace with live token when approved by Shippo (takes 1 day).

---

## How It Works

### For Tyler (Admin):

1. **Go to Orders Page:**
   - `/admin/orders`

2. **Find Order to Ship:**
   - Scroll to order with shipping address
   - Status must NOT be "shipped" or "test"

3. **Create Label:**
   - Click green "Create Label" button
   - Shippo generates label (2-5 seconds)
   - PDF opens in new tab → Print it
   - Tracking number auto-saves

4. **Label Details:**
   - Tracking number appears in order
   - Carrier + service shown (e.g., "USPS Ground Advantage")
   - Cost displayed (e.g., "$4.50")
   - "View Label PDF →" link to re-download

5. **Alternative (Manual Entry):**
   - Click "Manual Entry" button
   - Enter tracking number manually
   - No label PDF generated

---

## What Gets Saved to Order

When label is created, these fields update:
- `status`: "shipped"
- `trackingNumber`: "92001234567890123456"
- `trackingUrl`: USPS tracking URL
- `shippingLabelUrl`: Shippo PDF label URL
- `shippingCarrier`: "USPS"
- `shippingService`: "Ground Advantage"
- `shippingCost`: "4.50"
- `shippedAt`: Current timestamp

---

## Switching to Live Token

**When Shippo approves live token:**

1. **Update .env.local:**
   ```
   SHIPPO_API_TOKEN=shippo_live_YOUR_LIVE_TOKEN_HERE
   ```

2. **Commit + Deploy:**
   ```bash
   git add .env.local
   git commit -m "Update to Shippo live token"
   git push
   ```

3. **Verify:**
   - Test on a real order
   - Label should work exactly the same
   - USPS will actually accept the label

**DO NOT commit .env.local to GitHub** (already in .gitignore, but double-check)

---

## Testing (Current - Test Mode)

**Test token limitations:**
- Labels are generated but NOT valid for actual shipping
- USPS will reject test labels
- Use for testing workflow only

**What works in test mode:**
- Label PDF generation
- Tracking number assignment
- UI workflow
- Signature confirmation logic (orders > $1,000)

**What to test:**
1. Create label for order < $1,000 (no signature)
2. Create label for order > $1,000 (signature required)
3. View label PDF
4. Check tracking URL

---

## Cost Tracking

**Shippo charges per label:**
- USPS Ground Advantage: ~$4-6 (depends on zone)
- Cost auto-saved to `shippingCost` field
- Track monthly costs in Shippo dashboard

**Monthly estimate:**
- 50 orders/month × $5/label = $250/month shipping cost
- Plus Shippo fee (if applicable)

---

## Troubleshooting

### "No USPS rates available"
- Customer address may be invalid
- Check address in order details
- Try manual tracking entry instead

### "Failed to create shipping label"
- Check Shippo API token is correct
- Verify .env.local has SHIPPO_API_TOKEN
- Check Shippo dashboard for error details

### Label PDF won't open
- Check browser pop-up blocker
- Right-click "View Label PDF" → Open in new tab
- Download from Shippo dashboard directly

### Tracking number not showing
- Refresh orders page
- Check Firestore directly (orders collection)
- Verify updateDoc succeeded (check console)

---

## API Endpoint

**Route:** `/api/shippo/create-label`  
**Method:** POST  
**Body:**
```json
{
  "orderId": "abc123",
  "shippingAddress": {
    "name": "Customer Name",
    "street1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "orderTotal": "1500.00"
}
```

**Response (success):**
```json
{
  "success": true,
  "labelUrl": "https://shippo-delivery.s3.amazonaws.com/...",
  "trackingNumber": "92001234567890123456",
  "trackingUrl": "https://tools.usps.com/...",
  "carrier": "USPS",
  "service": "Ground Advantage",
  "cost": "4.50"
}
```

---

## Files Modified

**New files:**
- `src/app/api/shippo/create-label/route.ts` - Shippo API endpoint
- `SHIPPO_INTEGRATION.md` - This file

**Modified files:**
- `src/app/admin/orders/page.tsx` - Added Create Label button + UI
- `.env.local` - Added SHIPPO_API_TOKEN
- `package.json` - Added `shippo` dependency

---

## Next Steps

1. **Wait for Shippo live token** (1 day approval)
2. **Update .env.local** with live token
3. **Test on real order**
4. **Print label + ship**
5. **Confirm USPS accepts label**

---

## Support

**Shippo Dashboard:** https://app.goshippo.com  
**Shippo Docs:** https://docs.goshippo.com  
**Contact Shippo:** support@goshippo.com

**For code issues:** Check console logs, Firestore data, and Shippo dashboard

---

**✅ Ready to ship! Just waiting on live token.**
