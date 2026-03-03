# Deployment Audit Checklist

## When Changes Don't Appear on Live Site

### 1. Verify Local Changes Are Committed
```bash
cd ~/Desktop/gryphon-collects-web
git status  # Should show "nothing to commit"
git log --oneline -1  # Shows latest commit
```

### 2. Verify Changes Are Pushed to GitHub
```bash
git remote -v  # Should show buddysnft/GryphonCollectsWeb
git log origin/main..HEAD  # Should show nothing (all pushed)
```

### 3. Check Vercel Deployment Status
- Go to: https://vercel.com/jons-projects-019c1373/gryphon-collects-web-jswr/deployments
- Latest deployment should show:
  - ✅ Green checkmark = "Ready"
  - 🟡 Yellow spinner = "Building" (wait 2-5 min)
  - ❌ Red X = "Error" (click for details)

### 4. Verify Build Succeeded Locally
```bash
cd ~/Desktop/gryphon-collects-web
npm run build  # Must complete without errors
```

If build fails locally, it will fail on Vercel too.

### 5. Check Browser Cache
- Hard refresh: **Cmd + Shift + R** (Mac) or **Ctrl + F5** (Windows)
- Or: Clear cache completely
- Or: Open in Incognito/Private window

### 6. Verify Correct Vercel Project
- Settings → Git: https://vercel.com/jons-projects-019c1373/gryphon-collects-web-jswr/settings/git
- Should show: **buddysnft/GryphonCollectsWeb** (NOT GryphonBreaks)
- Branch: **main**

### 7. Check for Client-Side Errors
- Open browser DevTools: **Cmd + Option + I** (Mac)
- Go to Console tab
- Look for red error messages

### 8. Deployment Timeline
From code change to live site:
- Code written: 0 min
- `git commit && git push`: +30 sec
- Vercel build starts: +10 sec
- Vercel build completes: +2-5 min
- **Total: ~3-6 minutes**

**Wait 5 minutes after pushing before declaring it "not working"**

## Quick Test Commands

```bash
# Check what's on GitHub
git log origin/main --oneline -3

# Force rebuild on Vercel (if webhook failed)
# Go to Vercel dashboard → Redeploy

# Test live site
curl -s https://gryphon-collects-web-jswr.vercel.app/ | grep "<title>"
```

## Common Issues

### Issue: "404 Page Not Found"
- **Cause**: Build failed or route doesn't exist
- **Fix**: Run `npm run build` locally, check for errors

### Issue: "Stuck on Loading..."
- **Cause**: Client-side JavaScript error
- **Fix**: Check browser console for errors

### Issue: "Old version showing"
- **Cause**: Browser cache or CDN cache
- **Fix**: Hard refresh, or wait 5 min for CDN

### Issue: "Changes show locally but not on Vercel"
- **Cause**: Forgot to push to GitHub
- **Fix**: `git push origin main`

## Emergency: Force Redeploy

If Vercel webhook failed:
1. Go to: https://vercel.com/jons-projects-019c1373/gryphon-collects-web-jswr
2. Click latest deployment
3. Click "⋮" menu → "Redeploy"
