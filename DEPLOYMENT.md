# 🚀 Deployment Guide - sq²ft Calculators

## Quick Start (Recommended)

### Option 1: GitHub Pages (Free, Easy)
```bash
# 1. Push to GitHub
git add .
git commit -m "Initial deployment setup"
git push origin main

# 2. Enable GitHub Pages
# Go to: Settings > Pages > Source: GitHub Actions
# Your site will be live at: https://yourusername.github.io/Utilities
```

### Option 2: Netlify (Free, Advanced)
```bash
# 1. Build the project
npm run build

# 2. Deploy to Netlify
# Drag & drop the 'dist' folder to netlify.com
# Or connect your GitHub repo for auto-deployment
```

### Option 3: Vercel (Free, Fast)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod
```

## Detailed Setup Instructions

### GitHub Pages Setup

1. **Enable GitHub Actions**
   - Go to your repository
   - Click "Actions" tab
   - Enable workflows if prompted

2. **Configure Pages**
   - Go to Settings > Pages
   - Source: "GitHub Actions"
   - Save

3. **Deploy**
   - Push your code to main branch
   - GitHub Actions will automatically build and deploy
   - Your site will be live in ~2 minutes

### Custom Domain Setup

1. **Add CNAME file**
   ```bash
   echo "sq2ft.com" > public/CNAME
   ```

2. **Configure DNS**
   - Add CNAME record: `www` → `yourusername.github.io`
   - Add A record: `@` → GitHub Pages IPs

3. **Enable HTTPS**
   - GitHub Pages automatically provides SSL
   - Force HTTPS in repository settings

## Environment Variables

Create `.env` file for production:
```env
# Production settings
NODE_ENV=production
VITE_APP_TITLE=sq²ft Calculators
VITE_APP_DESCRIPTION=Professional flooring calculators
VITE_APP_URL=https://sq2ft.com
VITE_ADSENSE_CLIENT=ca-pub-PLACEHOLDER
```

## Build Commands

```bash
# Development
npm run dev          # Start dev server
npm run preview      # Preview production build

# Production
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Check code quality
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`npm test`)
- [ ] Code linted (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] PWA manifest updated
- [ ] Service worker configured
- [ ] Analytics/AdSense configured

### Post-Deployment
- [ ] Site loads correctly
- [ ] All calculators working
- [ ] PWA installable
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Performance optimized

## Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**PWA Not Working**
- Check manifest.json is accessible
- Verify service worker registration
- Test in incognito mode

**Mobile Issues**
- Test on actual devices
- Check viewport meta tag
- Verify touch targets are 44px+

### Performance Issues

**Slow Loading**
- Check bundle size: `npm run build -- --analyze`
- Optimize images
- Enable gzip compression

**PWA Issues**
- Clear browser cache
- Check service worker updates
- Verify HTTPS is working

## Monitoring

### Analytics Setup
1. Google Analytics 4
2. Google Search Console
3. Lighthouse CI
4. Web Vitals monitoring

### Error Tracking
- Console error monitoring
- User feedback collection
- Performance monitoring

## Security

### HTTPS
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use HSTS headers

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
               style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;">
```

## Backup Strategy

1. **Code Backup**
   - Git repository (primary)
   - GitHub (cloud backup)

2. **Data Backup**
   - User preferences in localStorage
   - Calculator states
   - Analytics data

## Rollback Plan

If deployment fails:
1. Revert to previous commit
2. Rebuild and redeploy
3. Check error logs
4. Fix issues and redeploy

## Support

- **Documentation**: This file
- **Issues**: GitHub Issues
- **Email**: support@sq2ft.com
- **Status**: https://status.sq2ft.com
