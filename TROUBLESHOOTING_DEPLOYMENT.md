# Troubleshooting GitHub Pages Deployment

## Common Issues and Solutions

### 1. Check the Actual Error

Go to your repository → **Actions** tab → Click on the failed workflow run → Look at the error message.

Common errors and fixes:

---

### Error: "Workflow run failed" or "Job failed"

**Possible causes:**
- Build errors
- Missing dependencies
- Permission issues

**Solution:**
1. Click on the failed job
2. Expand each step to see the error
3. Look for red X marks
4. Check the error message

---

### Error: "Permission denied" or "403 Forbidden"

**Cause:** GitHub Pages permissions not set correctly

**Solution:**
1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **"Read and write permissions"**
4. Check **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**
6. Re-run the workflow

---

### Error: "Environment 'github-pages' not found"

**Cause:** GitHub Pages environment not initialized

**Solution:**
1. Go to **Settings** → **Pages**
2. Under **Source**, make sure **"GitHub Actions"** is selected
3. If it's not there, select it and click **Save**
4. Go back to **Actions** and re-run the workflow

---

### Error: "npm ci failed" or "Build failed"

**Cause:** Build errors or missing dependencies

**Solution:**
1. Check if `package-lock.json` is committed (it should be)
2. Try building locally: `npm run build`
3. If local build fails, fix those errors first
4. Make sure all dependencies are in `package.json`

---

### Error: "Path './dist' not found"

**Cause:** Build didn't create dist folder

**Solution:**
1. Check the build step in Actions
2. Verify `npm run build` completed successfully
3. Make sure `vite.config.ts` has correct output directory

---

### Error: "Workflow not triggering"

**Cause:** Workflow file not in correct location or not committed

**Solution:**
1. Verify `.github/workflows/deploy.yml` exists
2. Make sure it's committed: `git status`
3. If not committed: `git add .github/workflows/deploy.yml && git commit -m "Add workflow" && git push`

---

## Step-by-Step Fix

### Step 1: Check Workflow Permissions

1. Go to: https://github.com/danroyrod/cfi-app-offline/settings/actions
2. Scroll to **"Workflow permissions"**
3. Select **"Read and write permissions"**
4. Check the box for **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**

### Step 2: Verify Pages Source

1. Go to: https://github.com/danroyrod/cfi-app-offline/settings/pages
2. Under **"Source"**, make sure **"GitHub Actions"** is selected
3. If not, select it and click **Save**

### Step 3: Re-run the Workflow

1. Go to: https://github.com/danroyrod/cfi-app-offline/actions
2. Click on **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** button (top right)
4. Select **"main"** branch
5. Click **"Run workflow"**

### Step 4: Monitor the Build

1. Watch the workflow run
2. Click on each step to see details
3. If it fails, note the exact error message
4. Share the error message for further help

---

## Quick Fixes

### If build fails:
```bash
# Test locally first
npm run build
```

### If workflow not running:
```bash
# Make sure workflow file is committed
git add .github/workflows/deploy.yml
git commit -m "Fix workflow"
git push
```

### If permissions issue:
- Go to Settings → Actions → General
- Set workflow permissions to "Read and write"

---

## Still Having Issues?

Share the exact error message from the Actions tab, and I can help you fix it!

Common places to find errors:
1. **Actions** tab → Click failed workflow → Expand failed step
2. Look for red text or error messages
3. Copy the full error message

