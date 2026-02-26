# Gryphon Collects - E-Commerce Website + Admin Dashboard

A white-label e-commerce platform for sports card breakers. Built with Next.js, TypeScript, and Firebase.

**Live Demo:** (Deploy to get URL)

---

## 🎯 Features

### Customer-Facing
- 🛍️ Product catalog with advanced filtering
- 🎬 Break scheduling and live stream links
- 🛒 Shopping cart (Stripe integration coming soon)
- 👤 User accounts with order history
- 📱 Fully responsive design
- 🔥 Real-time sync with iOS app

### Admin Dashboard
- 📦 Product management with Firebase Storage image upload
- 📋 Order management with status tracking
- 🔔 Push notification composer
- 📊 Real-time stats dashboard
- ⚡ One upload → instant sync to website + iOS app

### White-Label Ready
- 🎨 Easy rebranding via config files
- 🔄 Shared Firebase backend
- 🚀 Deploy new breaker sites in minutes
- 💰 No per-site infrastructure costs

---

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dark theme)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Deployment:** Vercel
- **Future:** Stripe payments, FCM push notifications

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project (gryphon-breaks)
- Vercel account (free tier works)

### Installation

```bash
# Clone the repo
git clone https://github.com/buddysnft/GryphonCollectsWeb.git
cd GryphonCollectsWeb

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your Firebase config

# Run development server
npm run dev

# Open http://localhost:3000
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── shop/              # Product catalog
│   ├── breaks/            # Break schedule
│   ├── cart/              # Shopping cart
│   ├── account/           # User account
│   ├── login/             # Authentication
│   └── admin/             # Admin dashboard
├── components/            # Reusable React components
├── lib/                   # Firebase & utilities
│   ├── firebase.ts        # Firebase initialization
│   ├── firestore.ts       # Database helpers
│   ├── auth-context.tsx   # Auth provider
│   └── cart.ts            # Cart logic
├── config/                # White-label configuration
│   └── brand.ts           # 🎨 REBRAND HERE
└── styles/
    └── globals.css        # 🎨 COLORS HERE
```

---

## 🎨 Rebrand for New Breaker

1. **Update `src/config/brand.ts`:**
   - Change `businessName`, `tagline`
   - Update social links
   - Modify `colors.primary` (gold → their brand color)

2. **Update `src/app/globals.css`:**
   - Change CSS color variables

3. **Replace logo files:**
   - `public/logo.png`
   - `public/favicon.png`

4. **Deploy:**
   ```bash
   git commit -am "Rebrand for [New Breaker]"
   git push
   ```

That's it! Entire site rebranded in 5 minutes.

---

## 🔑 Admin Access

To grant admin access to a user:

1. User signs up at `/signup`
2. Go to Firebase Console → Firestore
3. Find user document in `users` collection
4. Add field: `role: "admin"`
5. User can now access `/admin`

---

## 📸 Image Upload Flow

When Gryphon uploads a product image in admin:

1. Image → Firebase Storage (`products/` folder)
2. Download URL → Firestore `products` collection (`imageURLs` array)
3. **Website displays image immediately**
4. **iOS app reads same Firestore doc → displays image**

**One upload = both platforms updated instantly** ⚡

---

## 🔥 Firebase Collections

### `products`
```typescript
{
  name: string
  description: string
  price: number
  originalPrice: number | null
  category: "Boxes" | "Cases" | "Singles" | "Slabs" | "Merch"
  sport: "Soccer" | "Merch"
  brand: string | null
  year: string | null
  player: string | null
  team: string | null
  gradeCompany: "PSA" | "BGS" | "SGC" | null
  gradeValue: string | null
  quantity: number
  imageURLs: string[]
  tags: string[]
  isFeatured: boolean
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `breaks`
```typescript
{
  title: string
  description: string
  date: Timestamp
  pricePerSpot: number
  totalSpots: number
  claimedSpots: number
  breakFormat: "Pick Your Team" | "Pick Your Player" | "Random" | "Hit Draft"
  imageURL: string | null
  youtubeURL: string | null
  instagramURL: string | null
  isActive: boolean
  notifyList: string[]
  participants: string[]
  createdAt: Timestamp
}
```

### `users`
```typescript
{
  email: string
  displayName: string
  photoURL: string | null
  role?: "admin"
  shippingAddress: object | null
  createdAt: Timestamp
}
```

### `orders`
```typescript
{
  userId: string
  items: Array<{productId, productName, price, quantity}>
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  shippingAddress: object
  createdAt: Timestamp
}
```

---

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint
npm run lint
```

---

## 📦 Deployment

### Vercel (Recommended)

Vercel auto-deploys on `git push` to main branch.

1. Connect GitHub repo to Vercel
2. Add Firebase environment variables
3. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

---

## 🚧 Roadmap

- [x] Product catalog
- [x] Shopping cart (localStorage)
- [x] User authentication
- [x] Admin dashboard
- [x] Firebase Storage image upload
- [x] Order management
- [ ] Stripe checkout integration
- [ ] Break scheduling UI
- [ ] Firebase Cloud Functions for FCM
- [ ] Email notifications
- [ ] Advanced search/filters
- [ ] Product reviews
- [ ] Wishlist
- [ ] Custom domain

---

## 📄 License

MIT

---

## 👨‍💻 Built By

Danya (OpenClaw) for JA  
February 2026

**White-label platform for card breakers.**  
One codebase → infinite breaker sites.
