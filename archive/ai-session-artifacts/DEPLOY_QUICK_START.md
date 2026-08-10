# Quick Start: Deploy to GitHub Pages

## One-Time Setup (5 minutes)

### 1. Create GitHub Repository
- Go to github.com → New repository
- Name: `cfi-acs-app`
- Make it **Public** (for free GitHub Pages)
- **Don't** initialize with README

### 2. Connect and Push
```bash
# If git not initialized:
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/cfi-acs-app.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages
- Go to repository → **Settings** → **Pages**
- Source: Select **"GitHub Actions"**
- Click **Save**

### 4. Wait for Deployment
- Go to **Actions** tab
- Wait 2-5 minutes for build to complete
- Your app will be at: `https://YOUR_USERNAME.github.io/cfi-acs-app/`

---

## Future Updates

```bash
git add .
git commit -m "Your changes"
git push
```

That's it! GitHub Actions automatically deploys.

---

## Full Guide

See `GITHUB_DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.

