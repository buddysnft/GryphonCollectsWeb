# Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
- [ ] All required env vars set in Vercel dashboard
- [ ] `.env.local` never committed to git
- [ ] API keys rotated if previously exposed

### 2. Security
- [ ] Firestore security rules deployed: `firebase deploy --only firestore:rules`
- [ ] Storage security rules deployed: `firebase deploy --only storage:rules`
- [ ] Admin users configured in Firestore (`role: admin`)
- [ ] No hardcoded secrets in source code

### 3. Code Quality
- [ ] TypeScript build passes: `npm run build`
- [ ] No console.errors in production code (except in error handlers)
- [ ] All TODO comments reviewed
- [ ] Zod schemas added for all user inputs

### 4. Testing
- [ ] Manual test: Sign up / Sign in flow
- [ ] Manual test: Browse products
- [ ] Manual test: View breaks
- [ ] Manual test: Admin dashboard (if admin)
- [ ] Test on mobile (Chrome DevTools)

### 5. Firebase
- [ ] Firestore indexes created (check console warnings)
- [ ] Storage bucket configured
- [ ] Auth providers enabled (Email/Password, Google, etc.)
- [ ] Firebase pricing plan adequate (Spark vs Blaze)

### 6. Git
- [ ] All changes committed
- [ ] Branch pushed to GitHub
- [ ] PR reviewed (if applicable)
- [ ] Merged to `main`

## Deployment Process

### Vercel Automatic Deployment

1. **Push to main:**
   ```bash
   git push origin main
   ```

2. **Monitor deployment:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Check deployment status
   - View build logs if errors

3. **Verify deployment:**
   - Visit production URL
   - Test critical paths
   - Check Firebase console for errors

### Manual Deployment (if needed)

```bash
# Build locally first
npm run build

# Deploy to Vercel
npx vercel --prod
```

## Post-Deployment

### 1. Smoke Tests
- [ ] Homepage loads
- [ ] Shop page loads products
- [ ] Breaks page loads breaks
- [ ] Auth works (sign in/sign up)
- [ ] Admin dashboard accessible (for admins)

### 2. Monitoring
- [ ] Check Vercel deployment logs
- [ ] Check Firebase console for errors
- [ ] Check browser console for JS errors
- [ ] Verify no broken images

### 3. User Communication
- [ ] Notify client (Gryphon) deployment is complete
- [ ] Send test link if major changes
- [ ] Document any breaking changes

## Rollback Procedure

If deployment breaks:

1. **Quick rollback:**
   - Vercel Dashboard → Deployments → Previous deployment → "Promote to Production"

2. **Code rollback:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Notify stakeholders**

## Emergency Contacts

- **Developer:** JA (apps@teambuddys.com)
- **Client:** Gryphon (Gryphoncollecting@gmail.com)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Firebase Support:** [firebase.google.com/support](https://firebase.google.com/support)

## Regular Maintenance

### Weekly
- [ ] Check Vercel deployment status
- [ ] Review Firebase usage/costs
- [ ] Check for security updates: `npm audit`

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review error logs (once Sentry integrated)
- [ ] Backup Firestore data (manual export from console)

### Quarterly
- [ ] Review Firebase security rules
- [ ] Rotate API keys (if compromised)
- [ ] Performance audit
- [ ] Accessibility audit

## Known Issues

1. **Stripe not connected** — Payment flow is stubbed
2. **No automated tests** — Manual testing only
3. **No staging environment** — Test in dev, deploy to prod
4. **Schema mismatches** — iOS/web use different field names (being fixed)

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Deploy Firebase rules
firebase deploy --only firestore:rules,storage:rules

# Manual Vercel deploy
npx vercel --prod

# Check Firebase config
firebase projects:list
firebase use <project-id>

# View Vercel logs
npx vercel logs <deployment-url>
```

## Support

Questions? Check [README.md](./README.md) or contact JA.
