# Admin Panel Guide for Gryphon

Welcome! This is your control center for Gryphon Collects.

---

## 🔐 Getting Started

1. **Sign Up:** Go to your deployed site and create an account
2. **Get Admin Access:** JA will set you up with admin privileges in Firebase
3. **Access Admin:** Go to `/admin` on your site
4. You'll see the dashboard with stats and quick actions

---

## 📦 Adding Products (Most Important!)

### Step-by-Step:

1. **Click "Products" in sidebar** → Click "Add Product" button

2. **Upload Image:**
   - Click "Choose File"
   - Select product photo (max 5MB)
   - Wait for upload to complete
   - ✨ **This image will appear in BOTH the website and your iOS app instantly**

3. **Fill Out Product Info:**
   - **Product Name:** Full descriptive name (e.g., "2024-25 Topps Chrome UEFA Hobby Box")
   - **Description:** Details about the product
   - **Price:** Regular selling price
   - **Original Price:** Only fill this if it's on sale (shows sale badge)
   - **Category:** Boxes, Cases, Singles, Slabs, or Merch
   - **Sport:** Soccer or Merch
   - **Brand:** e.g., "Topps Chrome"
   - **Year:** e.g., "2024-25"
   - **Player:** For singles/slabs only
   - **Team:** For singles/slabs only
   - **Quantity:** How many you have in stock

4. **For Graded Cards (Slabs):**
   - Select **Grade Company:** PSA, BGS, or SGC
   - Enter **Grade Value:** e.g., "10" or "9.5"

5. **Tags:** Optional keywords (comma-separated) for search
   - Example: "chrome, refractor, hobby, ucl"

6. **Checkboxes:**
   - **Featured Product:** Shows on homepage "Available Now" section
   - **Active:** Makes product visible in shop (uncheck to hide without deleting)

7. **Click "Add Product"** → Done! Product is live on website + app

---

## 📋 Managing Products

### Product List

- Click **Products** in sidebar to see all products
- **Search bar** at top to find specific products quickly

### Quick Actions:

- **⭐ Star Icon:** Toggle featured status (shows on homepage)
- **Active/Inactive Button:** Toggle visibility (hide without deleting)
- **Edit:** Make changes to product details
- **Delete:** Remove product permanently (asks for confirmation)

### Editing Products:

1. Click **Edit** on any product
2. Make your changes
3. Upload new images if needed
4. Click **Update Product**

---

## 📋 Managing Orders

1. Click **Orders** in sidebar
2. See all customer orders with:
   - Order number
   - Date placed
   - Total amount
   - Current status

3. **Update Order Status:**
   - Use dropdown on each order
   - Select: Pending → Confirmed → Shipped → Delivered
   - Status updates instantly

---

## 🔔 Sending Notifications

1. Click **Notifications** in sidebar
2. Enter:
   - **Title:** Short headline (e.g., "New Drops!")
   - **Message:** Full text (e.g., "Check out the latest Topps Chrome boxes in our shop")
3. Click **Send to All Users**

**Note:** Right now this saves the notification to the database. Push sending will be wired up later via Firebase Cloud Functions. For now, use this to log announcements.

---

## 💡 Tips & Tricks

### Product Photos
- **Best size:** 1200x1200px or larger (square)
- **File type:** JPG or PNG
- **Max size:** 5MB per image
- **Tip:** Take clear, well-lit photos. Good images = better sales!

### Organizing Products
- Use **Featured** for your best sellers or new arrivals
- Set products to **Inactive** instead of deleting (keeps history)
- Use **Tags** to help customers find products via search

### Stock Management
- Update **Quantity** when you sell items outside the website
- Set quantity to 0 → product shows "SOLD OUT" but stays visible
- Delete products you'll never restock

### Pricing
- **Sale Pricing:** Set both Original Price and Price to show sale badge
- Example: Original $99.99, Price $79.99 → shows as on sale
- Leave Original Price empty for regular pricing

---

## 🎯 Daily Workflow

1. **Check Orders:** See if any new orders came in, update status
2. **Add New Products:** When you get new inventory, add with photos
3. **Update Stock:** When items sell, reduce quantity or mark sold out
4. **Feature Products:** Rotate featured items to keep homepage fresh

---

## ⚡ Key Benefits

### One Upload, Two Platforms
When you upload a product image in the admin panel:
- Website shows it immediately
- iOS app pulls from same database → shows same image
- **No double work!**

### Real-Time Updates
All changes happen instantly:
- Add product → appears in shop immediately
- Update price → changes everywhere
- Mark as sold out → shows on site + app

---

## 🆘 Troubleshooting

**Can't access /admin:**
- Make sure JA set your account to admin role in Firebase
- Try signing out and back in
- Clear browser cache

**Image won't upload:**
- Check file size (must be under 5MB)
- Make sure it's a JPG or PNG
- Try a different browser

**Product not showing in shop:**
- Check that "Active" checkbox is checked
- Make sure Quantity is greater than 0 (or it shows as sold out)

**Orders not showing:**
- Orders only show up when customers place them
- Right now checkout is disabled (Stripe coming soon)

---

## 📞 Need Help?

Contact JA if you run into issues or have questions about the admin panel.

---

**Remember:** This is YOUR platform. Add products, manage orders, and grow your business. Everything you do here syncs with your iOS app automatically. 🚀
