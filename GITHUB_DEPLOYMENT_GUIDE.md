# GitHub Pages Deployment Guide

Complete step-by-step guide to deploy your CFI ACS App to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your computer
- Node.js and npm installed (already done)

---

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `cfi-acs-app` (or your preferred name)
   - **Description**: "CFI Airplane ACS App - Complete lesson plans, ACS tasks, flashcards, and study tools"
   - **Visibility**: Choose **Public** (required for free GitHub Pages) or **Private** (requires GitHub Pro)
   - **DO NOT** check "Initialize with README" (we already have files)
4. Click **"Create repository"**

---

## Step 2: Initialize Git in Your Project (if not already done)

Open Terminal/PowerShell in your project folder and run:

```bash
# Check if git is already initialized
git status

# If you get an error, initialize git:
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - CFI ACS App v5"
```

---

## Step 3: Connect to GitHub Repository

1. Copy the repository URL from GitHub (click the green "Code" button)
   - It will look like: `https://github.com/yourusername/cfi-acs-app.git`

2. In Terminal/PowerShell, run:

```bash
# Add GitHub as remote (replace with your actual URL)
git remote add origin https://github.com/yourusername/cfi-acs-app.git

# Verify it was added
git remote -v
```

---

## Step 4: Push Your Code to GitHub

```bash
# Push to GitHub (first time)
git branch -M main
git push -u origin main
```

You may be prompted to sign in to GitHub. Follow the authentication steps.

---

## Step 5: Set Up GitHub Actions for Automatic Deployment

The GitHub Actions workflow file has been created for you at `.github/workflows/deploy.yml`.

This will automatically:
- Build your app when you push to `main` branch
- Deploy to GitHub Pages
- Update the site whenever you make changes

**The workflow is already configured!** You just need to enable GitHub Pages.

---

## Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab (top menu)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Source**: `GitHub Actions`
5. Click **"Save"**

**Note**: If you don't see "GitHub Actions" option, you may need to push the workflow file first (see Step 7).

---

## Step 7: Push the Workflow File (if not already pushed)

The workflow file should already be in your repository. If you need to add it:

```bash
# Make sure you're in the project root
cd C:\Users\danrr\Desktop\CFI\App\cfi-acs-app-v5

# Add and commit the workflow file
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push
```

---

## Step 8: Trigger the First Deployment

After pushing, GitHub Actions will automatically:

1. Build your app
2. Deploy to GitHub Pages
3. Make it available at: `https://yourusername.github.io/cfi-acs-app/`

**To check deployment status:**
- Go to your repository on GitHub
- Click the **"Actions"** tab
- You'll see the deployment workflow running
- Wait for it to complete (usually 2-5 minutes)

---

## Step 9: Access Your Deployed App

Once deployment completes:

1. Go to your repository **Settings** → **Pages**
2. You'll see the URL: `https://yourusername.github.io/cfi-acs-app/`
3. Click the link to open your app!

**Note**: It may take a few minutes for the site to be available after first deployment.

---

## Step 10: Test Offline Functionality

1. Open your deployed app on a mobile device
2. Visit all pages to ensure everything loads
3. Turn on **Airplane Mode** (or disable WiFi)
4. Try navigating the app - it should work offline!

---

## Future Updates

Whenever you make changes:

```bash
# Make your changes to files
# Then commit and push:

git add .
git commit -m "Description of your changes"
git push
```

GitHub Actions will automatically rebuild and redeploy your app!

---

## Troubleshooting

### Deployment Fails

1. Check the **Actions** tab for error messages
2. Common issues:
   - Build errors: Check that `npm run build` works locally
   - Missing files: Ensure all required files are committed
   - Path issues: Verify `base: '/'` in `vite.config.ts`

### Site Not Loading

1. Wait 5-10 minutes after first deployment
2. Clear browser cache
3. Check the **Actions** tab to ensure deployment succeeded
4. Verify the Pages URL in Settings → Pages

### Service Worker Not Working

1. Ensure `base: '/'` is set in `vite.config.ts`
2. Check browser console for service worker errors
3. Clear site data and reload

### Can't See GitHub Actions Option

1. Make sure the `.github/workflows/deploy.yml` file exists
2. Push it to GitHub if it's not there
3. Refresh the Settings → Pages page

---

## Custom Domain (Optional)

If you have a custom domain:

1. Go to Settings → Pages
2. Enter your custom domain
3. Follow GitHub's DNS configuration instructions
4. Update `base` in `vite.config.ts` if needed (usually keep as `/`)

---

## Summary

✅ **Repository created on GitHub**
✅ **Code pushed to GitHub**
✅ **GitHub Actions workflow configured**
✅ **GitHub Pages enabled**
✅ **App deployed and accessible**

Your app is now live at: `https://yourusername.github.io/cfi-acs-app/`

---

## Quick Reference Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Check remote
git remote -v
```

---

**Need Help?** Check the GitHub Actions logs in the **Actions** tab of your repository for detailed error messages.

