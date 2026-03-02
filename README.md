# Gryphon Collects Web

E-commerce platform for soccer card breaking built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project (Firestore, Auth, Storage)
- Vercel account (for deployment)

### Local Development

1. **Clone and install:**
   ```bash
   git clone https://github.com/buddysnft/GryphonCollectsWeb.git
   cd GryphonCollectsWeb
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase credentials in `.env.local`

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/              # Next.js 14 app router pages
│   ├── admin/        # Admin dashboard
│   ├── breaks/       # Break listings and details
│   ├── shop/         # Product catalog
│   └── account/      # User profile and orders
├── components/       # React components
├── lib/              # Utilities and services
│   ├── firebase.ts   # Firebase initialization
│   ├── firestore.ts  # Firestore operations
│   ├── validation.ts # Zod schemas
│   └── errors.ts     # Error handling
└── config/           # Configuration files
```

## 🔐 Environment Variables

Required variables (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

Optional (for production):
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking DSN

## 🔧 Firebase Setup

### 1. Firestore Security Rules

Deploy security rules:
```bash
firebase deploy --only firestore:rules
```

Rules are defined in `firestore.rules`. Key access controls:
- **Users:** Can read all, write own profile
- **Products/Breaks:** Read-only for public, write for admins
- **Orders:** Read own orders, write via Cloud Functions only

### 2. Storage Rules

Deploy storage rules:
```bash
firebase deploy --only storage:rules
```

Rules in `storage.rules` enforce:
- 5MB max image size
- Images only (no other file types)
- User profile images: own + admins
- Product/break images: admins only

### 3. Admin Access

Grant admin role to a user:
```typescript
// In Firestore console or via script
await db.collection('users').doc(userId).update({ role: 'admin' });
```

Admin emails (hardcoded):
- `apps@teambuddys.com`
- `Gryphoncollecting@gmail.com`

## 🚢 Deployment

### Vercel (Production)

1. **Connect GitHub repo:**
   - Go to [vercel.com](https://vercel.com)
   - Import `buddysnft/GryphonCollectsWeb`

2. **Add environment variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables from `.env.local`

3. **Deploy:**
   ```bash
   git push origin main
   ```
   Vercel auto-deploys on every push to `main`

### Manual Deployment

```bash
npm run build
npx vercel --prod
```

## 📊 Database Schema

### Collections

**users**
```typescript
{
  uid: string;
  email: string;
  displayName?: string;
  username?: string;
  role: "user" | "admin";
  shippingAddress?: Address;
  socials?: { instagram?, youtube?, tiktok? };
  createdAt: Timestamp;
}
```

**products**
```typescript
{
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: "boxes" | "cases" | "singles" | "slabs" | "merch";
  sport: "soccer" | "basketball" | etc.;
  brand?: string;
  year?: string;
  quantity: number;
  imageURLs: string[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}
```

**breaks**
```typescript
{
  title: string;
  description: string;
  date: Timestamp;
  pricePerSpot: number;
  totalSpots: number;
  claimedSpots: number;
  breakFormat: "Pick Your Team" | "Random" | etc.;
  teams?: string[];
  imageURL?: string;
  youtubeURL?: string;
  status: "upcoming" | "live" | "completed";
  isActive: boolean;
  notifyList: string[]; // user IDs
  participants: string[]; // user IDs
}
```

**orders**
```typescript
{
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentIntentId?: string;
  trackingNumber?: string;
  createdAt: Timestamp;
}
```

## 🛠️ Admin Features

Access admin dashboard at `/admin` (requires `role: admin`):

- **Products:** Add, edit, delete products
- **Breaks:** Manage upcoming breaks
- **Orders:** View and update order status
- **Notifications:** Send push notifications to users
- **Analytics:** Revenue, top products, user growth

## 🧪 Testing

```bash
# Run type check
npm run type-check

# Build check
npm run build

# Linting
npm run lint
```

## 🐛 Error Handling

All errors are handled through `src/lib/errors.ts`:

- **AppError classes:** ValidationError, AuthError, NotFoundError, etc.
- **Firebase error formatting:** User-friendly messages for auth/Firestore errors
- **Error logging:** Centralized with `logError()` (integrates with Sentry)
- **Safe async wrapper:** `safeAsync()` for consistent error handling

Example:
```typescript
import { safeAsync, ValidationError } from "@/lib/errors";

const result = await safeAsync(async () => {
  const data = validateOrThrow(userSchema, input);
  return await createUser(data);
});

if (!result.success) {
  toast.error(result.error.message);
}
```

## 🔒 Security Checklist

- [x] Environment variables not committed (`.env.local` in `.gitignore`)
- [x] Firestore security rules deployed
- [x] Storage security rules deployed
- [x] Input validation with Zod schemas
- [x] Admin-only routes protected
- [x] User data access controlled
- [ ] Rate limiting on auth endpoints (TODO: implement in Cloud Functions)
- [ ] CAPTCHA on contact forms (TODO)
- [ ] Stripe webhook signature verification (TODO when Stripe live)

## 📈 Monitoring & Logging

### Current
- Console logging with structured error data
- Firebase error codes formatted for users

### TODO (when ready)
- [ ] Sentry integration for error tracking
- [ ] PostHog/Plausible for analytics
- [ ] Firebase Performance Monitoring
- [ ] Uptime monitoring (UptimeRobot/Checkly)

## 🚦 Health Checks

No dedicated health endpoint yet. Monitor:
- Vercel deployment status: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Firebase status: [https://status.firebase.google.com](https://status.firebase.google.com)

## 📞 Support

- **Developer:** JA (@buddysnft)
- **Client:** Gryphon (@gryphoncollects)
- **Issues:** [GitHub Issues](https://github.com/buddysnft/GryphonCollectsWeb/issues)

## 📝 License

Private repository. All rights reserved.

---

## Common Tasks

### Add a new admin
```typescript
// Via Firebase Console → Firestore
users/{userId} → update field: role = "admin"
```

### Seed test data
```bash
npm run seed
```

### Deploy security rules
```bash
firebase deploy --only firestore:rules,storage:rules
```

### Check build locally
```bash
npm run build
npm start
```

### Reset database (DANGER)
Only in development:
```typescript
// Delete all docs in a collection via Firebase Console
// Or use Firebase CLI: firebase firestore:delete --recursive
```

## Tech Debt / Known Issues

1. **Stripe integration incomplete** — payment flow stubbed
2. **No automated tests** — manual testing only
3. **No staging environment** — dev → prod only
4. **Schema changes not versioned** — Firestore rules in git, but no migration system
5. **No rate limiting** — vulnerable to abuse (mitigated by Firebase Auth + rules)

See [GitHub Issues](https://github.com/buddysnft/GryphonCollectsWeb/issues) for full backlog.
