# Gryphon Collects - Deployment Instructions

## 🎯 What's Built

A complete white-label e-commerce platform for card breakers with:

**Customer Storefront:**
- Home page with featured products + upcoming breaks
- Shop with filters, search, sort
- Product detail pages with add-to-cart
- Shopping cart (localStorage, Stripe coming later)
- Breaks schedule with live links (YouTube/Instagram)
- User authentication (Firebase)
- Account management (profile, address, order history)

**Admin Dashboard:**
- Product management with **Firebase Storage image upload**
- Order management with status updates
- Notification composer (UI ready, FCM integration later)
- Dashboard with real-time stats

**White-Label Features:**
- All branding controlled via `src/config/brand.ts`
- Easy color customization in `src/app/globals.css`
- Shared Firebase backend with iOS app
- One image upload → appears in website + app instantly

---

## 🚀 Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import Git Repository → Create new GitHub repo
3. Repository name: `buddysnft/GryphonCollectsWeb`
4. Push this code to that repo
5. Vercel will auto-deploy

### Option 2: Deploy via Vercel CLI

```bash
cd ~/Desktop/gryphon-collects-web
npm install -g vercel
vercel --prod
```

Follow the prompts - it will create the GitHub repo automatically.

---

## 🔥 Firebase Setup (CRITICAL)

### Step 1: Add Web App to Firebase Project

1. Go to https://console.firebase.google.com
2. Select project: **gryphon-breaks**
3. Click ⚙️ (Settings) → Project Settings
4. Scroll to "Your apps" → Click **Add app** → Select **Web** (</>) icon
5. App nickname: "Gryphon Collects Web"
6. ✅ **Check "Also set up Firebase Hosting"** (optional but recommended)
7. Click **Register app**

### Step 2: Get Web App Config

Firebase will show you config values like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "gryphon-breaks.firebaseapp.com",
  projectId: "gryphon-breaks",
  storageBucket: "gryphon-breaks.firebasestorage.app",
  messagingSenderId: "1056424347369",
  appId: "1:1056424347369:web:XXXXXXX"
};
```

### Step 3: Update Environment Variables

**In Vercel Dashboard:**
1. Go to your deployed project → Settings → Environment Variables
2. Add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=<from config above>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gryphon-breaks.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gryphon-breaks
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gryphon-breaks.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1056424347369
NEXT_PUBLIC_FIREBASE_APP_ID=<from config above>
```

3. Redeploy the project

**Or in `.env.local` (if running locally):**

Update the file with the real values, then restart dev server.

---

## 🔑 Set Up Admin Access

To give Gryphon admin access:

1. Have Gryphon sign up at your deployed site (e.g., gryphon-collects.vercel.app/signup)
2. Go to Firebase Console → Firestore Database
3. Find the `users` collection
4. Find Gryphon's user document (by email)
5. Click Edit → Add field:
   - Field: `role`
   - Type: `string`
   - Value: `admin`
6. Save

Now Gryphon can access `/admin` routes.

---

## 📸 Add Logo & Assets

1. Find the logo in the iOS project:
   - `~/Desktop/GryphonBreaks/GryphonBreaks/Assets.xcassets/GryphonLogo.imageset/*.png`

2. Copy to the website:
   ```bash
   cp ~/Desktop/GryphonBreaks/GryphonBreaks/Assets.xcassets/GryphonLogo.imageset/*.png ~/Desktop/gryphon-collects-web/public/logo.png
   ```

3. Copy app icon for favicon:
   ```bash
   cp ~/Desktop/GryphonBreaks/GryphonBreaks/Assets.xcassets/AppIcon.appiconset/*.png ~/Desktop/gryphon-collects-web/public/favicon.png
   ```

4. Commit and push:
   ```bash
   cd ~/Desktop/gryphon-collects-web
   git add public/*
   git commit -m "Add logo and favicon"
   git push
   ```

Vercel will auto-redeploy with the new assets.

---

## 🎨 White-Label Rebrand Guide

To rebrand for a different breaker:

1. **Update `src/config/brand.ts`:**
   ```typescript
   export const brandConfig = {
     businessName: "New Breaker Name",
     tagline: "Your tagline here",
     social: {
       instagram: "https://instagram.com/newbreaker",
       // ... etc
     },
     colors: {
       primary: "#yourcolor", // Change gold to their brand color
       // ...
     },
   };
   ```

2. **Update colors in `src/app/globals.css`:**
   ```css
   :root {
     --primary: #yourcolor;
   }
   ```

3. **Replace logo/favicon in `public/`**

4. **Update Firebase project in `.env`** (if using different backend)

5. **Commit, push, deploy**

That's it - entire site rebranded in ~5 minutes!

---

## ✅ Testing Checklist

### Storefront
- [ ] Home page loads with products from Firestore
- [ ] Shop filters and search work
- [ ] Product detail pages load
- [ ] Add to cart works
- [ ] Cart shows items
- [ ] Login/signup work
- [ ] Account page shows user data
- [ ] Responsive on mobile

### Admin (after setting role=admin)
- [ ] Dashboard shows stats
- [ ] Can add product with image upload
- [ ] Image appears in Firebase Storage
- [ ] Product appears in shop instantly
- [ ] Can edit/delete products
- [ ] Orders page shows orders
- [ ] Notifications page saves to Firestore

---

## 🐛 Troubleshooting

**"Firebase Auth error"**
- Check that web app is registered in Firebase Console
- Check environment variables are set correctly
- Make sure `.env.local` values match Firebase config

**"Admin routes redirect to home"**
- Check that user has `role: "admin"` field in Firestore users collection
- Clear browser cache and sign in again

**"Images not uploading"**
- Check Firebase Storage rules allow writes
- Check that storage bucket name is correct in env vars

**"Products not showing"**
- Check Firebase Firestore has `products` collection with data
- Check that products have `isActive: true`

---

## 📝 Next Steps (Future Sprints)

- [ ] Stripe integration for checkout
- [ ] Break scheduling UI in admin
- [ ] Firebase Cloud Functions for FCM push notifications
- [ ] Email notifications for orders
- [ ] Advanced product search/filters
- [ ] Product image gallery (multiple images)
- [ ] Break participant management
- [ ] Custom domain (gryphoncollects.com)

---

## 📞 Support

Built by Danya (OpenClaw) for JA.

Any issues? Check:
1. Vercel deployment logs
2. Browser console for errors
3. Firebase Console for auth/database issues

The site is built to scale - once Gryphon's instance is live, spinning up new breaker sites is just a rebrand + deploy.
