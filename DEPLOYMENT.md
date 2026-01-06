# Deployment Guide

## GitHub Pages Deployment

This app is configured to deploy automatically to GitHub Pages when you push to the `main` or `master` branch.

### Repository Configuration

- **Repository**: `cfi-app-offline`
- **Base Path**: `/cfi-app-offline/`
- **GitHub Pages URL**: `https://danroyrod.github.io/cfi-app-offline/`

### Automatic Deployment

1. **Push to main branch**: The GitHub Actions workflow will automatically:
   - Install dependencies
   - Build the app
   - Deploy to GitHub Pages

2. **Manual deployment**: You can also trigger deployment manually:
   - Go to Actions tab in GitHub
   - Select "Deploy to GitHub Pages" workflow
   - Click "Run workflow"

### Manual Deployment Steps

If you need to deploy manually:

```bash
# 1. Make sure you're on the main branch
git checkout main

# 2. Build the app
npm run build

# 3. The dist/ folder contains the built app
# For GitHub Pages, the workflow handles deployment automatically
```

### Local Testing Before Deployment

Test the production build locally:

```bash
# Build
npm run build

# Preview production build
npm run preview
```

The preview will be available at `http://localhost:4173/cfi-app-offline/`

### Important Notes

1. **Base Path**: The app is configured with base path `/cfi-app-offline/` in `vite.config.ts`. If you change the repository name, update the base path accordingly.

2. **Service Worker**: The PWA service worker is automatically generated during build and will work in production.

3. **Large Files**: The lesson plans data (3.43 MB) is bundled into the JavaScript chunks, so it's automatically cached by the service worker.

4. **GitHub Pages Settings**: 
   - Go to Settings > Pages
   - Source should be set to "GitHub Actions"
   - The workflow will handle deployment automatically

### Troubleshooting

**Build fails:**
- Check Node.js version (should be 20+)
- Run `npm ci` to ensure clean install
- Check for TypeScript errors: `npm run build`

**App doesn't load on GitHub Pages:**
- Verify base path matches repository name
- Check browser console for errors
- Ensure GitHub Pages is enabled in repository settings

**Service worker not working:**
- Service worker only works in production builds
- Clear browser cache and reload
- Check that HTTPS is enabled (GitHub Pages uses HTTPS)

### Updating the App

1. Make your changes
2. Test locally: `npm run dev`
3. Build and preview: `npm run build && npm run preview`
4. Commit and push:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
5. GitHub Actions will automatically deploy

