# Clean Breaks + Update Images

## Step 1: Find Official Product Images

I'll search for official product images for these 5 products:

### 1. 2026 FIFA Prizm HOBBY 🎯
**Product:** Panini Prizm FIFA Soccer Hobby Box  
**Official Image:** Search "2026 Panini Prizm FIFA Soccer Hobby Box" on:
- cardboardconnection.com
- paniniamerica.net
- blowoutcards.com

**Recommended:** Use box image (not single card)

---

### 2. 2026 FIFA Prizm 🎯
**Product:** Panini Prizm FIFA Soccer (retail/blaster)  
**Official Image:** Same as above, but retail version

---

### 3. 2026 FIFA Prizm CHOICE 🎯
**Product:** Panini Prizm FIFA Soccer Choice Box  
**Official Image:** Search "2026 Panini Prizm FIFA Soccer Choice" 

Screenshot shows: Black box with "PRIZM" logo + "FIFA" badge

---

### 4. NEW - 2026 EPL Sapphire 🎯
**Product:** Topps Chrome Premier League Sapphire Edition  
**Official Image:** Search "2026 Topps Chrome Premier League Sapphire"

Screenshot shows: Blue/purple gradient Topps Chrome box

---

### 5. 2026 RTWC Select 🎯
**Product:** Panini Select Road to World Cup  
**Official Image:** Search "2026 Panini Select Road to World Cup"

Screenshot shows: Stained glass/mosaic style card design

---

## Step 2: Clean Breaks Database

**Option A: Manual (Firebase Console)**
1. Go to Firebase Console → Firestore
2. Open `breaks` collection
3. Delete all breaks EXCEPT the 5 listed above
4. Update `imageUrl` field for each of the 5

**Option B: Script (Automated)**
```bash
cd ~/Desktop/gryphon-collects-web
node scripts/clean-breaks.js  # Dry run (preview)
node scripts/clean-breaks.js --confirm  # Actually delete
```

---

## Step 3: Upload Images to Firebase Storage

**Best practice:** Upload to Firebase Storage instead of external URLs

1. Go to Firebase Console → Storage
2. Create folder: `product-images/`
3. Upload 5 product images (JPG or PNG)
4. Get download URLs (click "Get download URL")
5. Update script with actual URLs

---

## Image Specifications

- **Format:** JPG or PNG
- **Size:** 800x800px minimum (1200x1200px recommended)
- **Aspect Ratio:** Square or 4:3
- **File Size:** < 500KB (optimize for web)

---

## Quick Image Sources

### Official Manufacturer Sites:
- **Panini:** paniniamerica.net/products
- **Topps:** topps.com/cards-collectibles/sports-cards

### Trusted Retailers:
- **Blowout Cards:** blowoutcards.com
- **Steel City Collectibles:** steelcitycollectibles.com
- **Dave & Adam's:** dacardworld.com

### Image Search:
- Google Images: "official [product name] box image"
- Filter: Large, High-resolution

---

## After Cleaning

Run this to verify:
```bash
node scripts/verify-breaks.js
```

Should show exactly 5 breaks with proper images.

---

## Need Help?

Let me know which step you're on and I can:
1. Find official images for you
2. Upload them to Firebase Storage
3. Run the cleanup script
4. Verify everything looks good

---

**Ready to proceed?**
