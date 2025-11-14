# Deployment Guide

This guide covers deploying Color Rodeo to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Custom Server](#custom-server)
- [Environment Variables](#environment-variables)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js >= 18.18 installed
- npm >= 9.0.0
- Git repository set up
- Production-ready build tested locally

### Local Production Build Test

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

---

## Build Configuration

The project uses Vite for building. Configuration is in `vite.config.ts`.

### Build Output

- Output directory: `dist/`
- Assets are automatically optimized
- Code splitting enabled
- CSS is extracted and minified

---

## Deployment Platforms

### Vercel (Recommended)

Vercel provides zero-configuration deployment for Vite apps.

#### Via GitHub Integration

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

#### Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Configuration File

The project includes `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

---

### Netlify

#### Via Git Integration

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 or higher

3. **Create `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18.18.0"
```

#### Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

### GitHub Pages

#### Setup

1. **Create GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. **Configure vite.config.ts**

Update for GitHub Pages base path:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
});
```

3. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: GitHub Actions

---

### Custom Server

For deployment to your own server:

#### Build

```bash
npm run build
```

#### Serve with Node.js

```bash
# Install serve
npm install -g serve

# Serve the dist folder
serve -s dist -l 3000
```

#### Serve with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t color-rodeo .
docker run -p 80:80 color-rodeo
```

---

## Environment Variables

### Local Development

Create `.env.local`:

```bash
VITE_APP_TITLE="Color Rodeo"
VITE_APP_DESCRIPTION="Professional color palette management tool"
```

### Production

Set environment variables in your deployment platform:

**Vercel:**
- Project Settings > Environment Variables

**Netlify:**
- Site Settings > Build & Deploy > Environment

**GitHub Actions:**
- Repository Settings > Secrets and variables > Actions

---

## Performance Optimization

### Pre-deployment Checklist

- [ ] Run `npm run build` and check for warnings
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all features work in production mode
- [ ] Check bundle size (aim for < 500KB initial load)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify dark/light mode switching
- [ ] Test localStorage persistence

### Optimization Tips

1. **Code Splitting**
   - Vite automatically splits code
   - Lazy load heavy components if needed

2. **Asset Optimization**
   - Images are automatically optimized by Vite
   - SVGs are inlined when small

3. **Caching**
   - Static assets get hash-based filenames
   - Configure CDN caching for assets

4. **Compression**
   - Enable gzip/brotli compression on server
   - Most platforms enable this by default

---

## Troubleshooting

### Build Fails

**Issue:** `npm run build` fails

**Solutions:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be >= 18.18)
- Check for TypeScript errors: `npm run type-check`

### Blank Page After Deployment

**Issue:** Page loads but shows blank screen

**Solutions:**
- Check browser console for errors
- Verify base path in `vite.config.ts` matches deployment
- Check if all assets are loading (Network tab)
- Ensure index.html is in dist folder

### Dark Mode Not Working

**Issue:** Theme doesn't persist or switch

**Solutions:**
- Check localStorage is enabled
- Verify script in index.html runs before app loads
- Check CSS variables are defined in globals.css

### Fonts Not Loading

**Issue:** Custom fonts (Bebas Neue, Satoshi) don't load

**Solutions:**
- Verify font imports in globals.css
- Check browser console for CORS errors
- Ensure fonts are loaded from reliable CDN

### localStorage Issues

**Issue:** Palettes not saving

**Solutions:**
- Check if browser allows localStorage
- Verify localStorage quota isn't exceeded
- Test in incognito mode to rule out extensions

---

## Post-Deployment

### Monitoring

- Set up error tracking (Sentry, etc.)
- Monitor Core Web Vitals
- Track user analytics (optional)

### Updates

To deploy updates:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
```

Most platforms auto-deploy on push to main branch.

### Rollback

If issues arise, rollback to previous deployment:

**Vercel:** Deployments > [Previous deployment] > Promote to Production

**Netlify:** Deploys > [Previous deploy] > Publish deploy

**GitHub Pages:** Revert commit and push

---

## Security Checklist

- [ ] No API keys in client code
- [ ] HTTPS enabled
- [ ] Content Security Policy headers set (if applicable)
- [ ] No sensitive data in localStorage
- [ ] Dependencies updated (`npm audit`)

---

## Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90
- **Bundle Size:** < 500KB (initial)

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs carefully
- Open an issue on GitHub

---

**Happy Deploying! 🚀**
