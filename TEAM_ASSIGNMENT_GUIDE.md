# Team Assignment + Shipping Tracking Guide

## ✅ NEW FEATURES DEPLOYED

**Commit:** 970aa05  
**Deployed:** ~2:35 AM EST, March 7, 2026  
**Live in:** ~60 seconds

---

## 🎯 What's New

### 1. Team Assignment for Break Orders
After your live break, you can assign which team each spot pulled.

### 2. Shipping Tracking
Mark orders as shipped and add tracking numbers.

---

## 📋 How to Use

### After a Live Break

**Scenario:** You ran a break. Spot 10 pulled Liverpool cards.

**Steps:**
1. Go to: `/admin/orders`
2. Find the Spot 10 order
3. Click **"Assign Team"** button
4. Type: `Liverpool` and press **Enter**
5. ✅ Team saved! Shows **"⚽ Liverpool"**

**To Change:**
- Click **"Change Team"**
- Type new team name
- Press Enter

---

### When Shipping

**Steps:**
1. Find the order in `/admin/orders`
2. Click **"Mark as Shipped"**
3. Enter tracking number in popup (e.g., `USPS 9400111899223334445566`)
4. Click OK
5. ✅ Order updated!

**What Happens:**
- Status changes to "shipped"
- Tracking number saved
- Ship date recorded
- Customer can see tracking

---

## 👀 What Customers See

**Before Shipping:**
- Spot #10
- Status: confirmed

**After Team Assignment:**
- Spot #10
- Team: ⚽ Liverpool
- Status: confirmed

**After Shipping:**
- Spot #10  
- Team: ⚽ Liverpool
- Status: shipped
- Tracking: USPS 9400...

---

## 💡 Tips

**Team Names:**
- Can be anything (Arsenal, Man City, Liverpool, etc.)
- Type exactly as you want it displayed
- Press Enter to save (don't click away)

**Tracking Numbers:**
- Enter full tracking number
- System doesn't validate format (enter carefully)
- Customer sees exactly what you enter

**Order Status:**
- "confirmed" = paid, not shipped
- "shipped" = tracking added, on the way
- Can't mark test orders as shipped (filter)

---

## 🔄 Typical Workflow

```
1. Customer buys Spot 10 ($25)
   ↓
2. Order shows in /admin/orders
   Status: confirmed
   ↓
3. You run the break live (YouTube/Instagram)
   Spot 10 = Liverpool cards
   ↓
4. You assign team in admin
   Click "Assign Team" → type "Liverpool" → Enter
   ↓
5. You pack the Liverpool cards
   ↓
6. You ship with USPS
   Click "Mark as Shipped" → enter tracking
   ↓
7. Customer sees update
   Spot 10 (Liverpool) - Shipped - USPS 9400...
```

---

## 🐛 Troubleshooting

**Team assignment not saving:**
- Make sure you press **Enter** after typing
- Don't just click away or tab out

**Mark as Shipped button missing:**
- Only shows for non-test, non-shipped orders
- Test orders (status: test) can't be marked shipped

**Tracking not showing:**
- Wait 5 seconds and refresh page
- Check browser console for errors

---

## 📊 What Got Added

**Database Fields:**
- `teamAssignment` (optional string)
- `shippedAt` (optional timestamp)
- `trackingNumber` (already existed, now used for breaks too)

**Admin UI:**
- Team assignment section (break orders only)
- Text input with Enter-to-save
- Mark as Shipped button (all orders)
- Tracking number prompt
- Shipped date display

---

## 🎉 You're Ready!

The features are live. Go to `/admin/orders` and try it out with your test order (Spot #10, $25).

1. Assign a team to it
2. Mark it as shipped with fake tracking
3. See how it looks

Then when you run real breaks, you'll know exactly what to do!

---

**Questions? Issues? Let me know!** 🦅
