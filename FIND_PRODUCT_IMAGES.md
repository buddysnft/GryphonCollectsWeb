# Finding Official Product Images

## The 5 Products We Need Images For:

### 1. 2026 FIFA Prizm HOBBY 📦
**What to search:** "2026 Panini Prizm FIFA World Cup Hobby Box"

**Best sources:**
- **Panini America:** paniniamerica.net/products (search "Prizm FIFA Hobby")
- **Blowout Cards:** blowoutcards.com (search "2026 Prizm FIFA Hobby")
- **Cardboard Connection:** cardboardconnection.com

**What it looks like:** Black hobby box with "PRIZM" logo, FIFA World Cup badge

**Image specs:**
- Box front image (not card)
- At least 800x800px
- High quality JPG

---

### 2. 2026 FIFA Prizm (Retail/Blaster) 📦
**What to search:** "2026 Panini Prizm FIFA World Cup Retail Box" OR "Blaster Box"

**Best sources:**
- Same as above
- Target.com (if available)
- Walmart.com

**What it looks like:** Similar to Hobby but retail packaging (usually red/blue)

---

### 3. 2026 FIFA Prizm CHOICE 📦
**What to search:** "2026 Panini Prizm FIFA World Cup Choice Box"

**Best sources:**
- Panini America direct
- Blowout Cards
- Steel City Collectibles

**What it looks like:** Black box with "CHOICE" designation, Prizm branding

---

### 4. NEW - 2026 EPL Sapphire 💎
**What to search:** "2026 Topps Chrome Premier League Sapphire Edition"

**Best sources:**
- **Topps.com:** topps.com/cards-collectibles/sports-cards
- Blowout Cards
- Dave & Adam's Card World

**What it looks like:** Blue/purple gradient Topps Chrome box, "SAPPHIRE" branding

---

### 5. 2026 RTWC Select ⚽
**What to search:** "2026 Panini Select Road to World Cup"

**Best sources:**
- Panini America
- Blowout Cards
- Steel City Collectibles

**What it looks like:** Select box with stained glass/mosaic card design

---

## How to Get the Images:

### Option A: Direct Download (Easiest)
1. Go to product page on manufacturer site
2. Right-click box image → "Save Image As"
3. Save as: `prizm-hobby.jpg`, `prizm.jpg`, `prizm-choice.jpg`, `sapphire.jpg`, `select.jpg`

### Option B: Screenshot (If no download)
1. Open image in full-screen
2. Screenshot just the box image
3. Crop to square (remove background if needed)
4. Save at high quality

---

## Upload to Firebase Storage:

1. **Go to Firebase Console:**
   - https://console.firebase.google.com
   - Select "gryphon-breaks" project
   
2. **Navigate to Storage:**
   - Click "Storage" in left sidebar
   - Click "Upload files"
   
3. **Create folder:**
   - Create folder: `products/`
   - Upload all 5 images there
   
4. **Get URLs:**
   - Click each uploaded image
   - Copy the "Download URL"
   - Format should be: `https://firebasestorage.googleapis.com/v0/b/gryphon-breaks.firebasestorage.app/o/products%2F[filename].jpg?alt=media`

---

## Update the Code:

Once you have Firebase Storage URLs, update this file:
`src/app/admin/clean-breaks/page.tsx`

Find this section (line ~8):
```typescript
const PRODUCT_IMAGES: { [key: string]: string } = {
  "2026 FIFA Prizm HOBBY": "PASTE_URL_HERE",
  "2026 FIFA Prizm": "PASTE_URL_HERE",
  "2026 FIFA Prizm CHOICE": "PASTE_URL_HERE",
  "NEW - 2026 EPL Sapphire": "PASTE_URL_HERE",
  "2026 RTWC Select": "PASTE_URL_HERE",
};
```

Replace `PASTE_URL_HERE` with actual Firebase Storage URLs.

---

## Then Run the Cleanup:

1. **Commit the changes:**
   ```bash
   cd ~/Desktop/gryphon-collects-web
   git add -A
   git commit -m "Add clean breaks admin page"
   git push origin main
   ```

2. **Wait for Vercel deploy** (~2 min)

3. **Go to admin page:**
   - https://gryphon-collects-web-jswr.vercel.app/admin/clean-breaks
   - Log in as admin (apps@teambuddys.com)

4. **Review the list:**
   - Green = Keep (5 breaks)
   - Red = Delete (all others)

5. **Click "Delete X Breaks & Update Images"**
   - Confirms before deletion
   - Deletes old breaks
   - Updates images for the 5 kept breaks

---

## Alternative: I Can Help Find the Images

If you want, I can:
1. Search for official product images (need web_search enabled)
2. Download them for you
3. Upload to Firebase Storage
4. Update the URLs in code

**Just let me know which approach you prefer!**

---

## Quick Links:

- **Panini America:** https://www.paniniamerica.net/products
- **Topps:** https://www.topps.com/cards-collectibles/sports-cards
- **Blowout Cards:** https://www.blowoutcards.com
- **Cardboard Connection:** https://www.cardboardconnection.com

---

**Need help with any step? Let me know!**
