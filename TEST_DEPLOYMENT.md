# How to Test Your Deployment

## Step 1: Check if Deployment Succeeded

### In GitHub Actions:
1. Go to: https://github.com/danroyrod/cfi-app-offline/actions
2. Look for the latest workflow run
3. Check for a **green checkmark** ✅ - this means success!
4. If you see a **red X** ❌, click on it to see the error

### What to look for:
- ✅ **Green checkmark** = Deployment successful!
- ❌ **Red X** = Something failed (check the error)

---

## Step 2: Get Your Site URL

### Find your site URL:
1. Go to: https://github.com/danroyrod/cfi-app-offline/settings/pages
2. Look for the URL at the top:
   - It should be: `https://danroyrod.github.io/cfi-app-offline/`
3. Or check the workflow run:
   - Go to **Actions** tab
   - Click on the successful workflow
   - Look for "Deploy to GitHub Pages" step
   - It will show the URL

---

## Step 3: Test Your Site

### Basic Test:
1. **Open the URL** in your browser:
   - `https://danroyrod.github.io/cfi-app-offline/`
2. **Check if it loads:**
   - ✅ Site loads = Good!
   - ❌ 404 error = Not deployed yet (wait a few more minutes)
   - ❌ Other error = Check the Actions tab

### Test Navigation:
1. Click through different pages:
   - Landing page
   - Areas
   - Lesson Plans
   - Flashcards
   - Quizzes
2. **Everything should work!**

---

## Step 4: Test Offline Functionality (Mobile)

### On Your Phone:
1. **Open the site** on your phone's browser:
   - `https://danroyrod.github.io/cfi-app-offline/`
2. **Visit several pages** to cache content:
   - Go to different areas
   - View lesson plans
   - Check flashcards
   - Browse quizzes
3. **Wait 30 seconds** for service worker to cache
4. **Turn on Airplane Mode** (or disable WiFi)
5. **Try navigating:**
   - ✅ App still works = Offline mode working!
   - ❌ Can't navigate = Service worker not working

### What Should Work Offline:
- ✅ All pages should load
- ✅ Navigation should work
- ✅ Data (ACS, lesson plans) should be available
- ✅ Images should load
- ✅ App should feel like a native app

---

## Step 5: Test PWA Installation

### On Mobile (iOS Safari):
1. Open the site in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. The app icon should appear on your home screen
5. Tap it - it should open like a native app!

### On Mobile (Android Chrome):
1. Open the site in Chrome
2. You should see an **"Install"** prompt
3. Or tap the menu (3 dots) → **"Install app"**
4. The app should install and appear on your home screen

---

## Step 6: Verify Service Worker

### In Browser DevTools:
1. Open your site: `https://danroyrod.github.io/cfi-app-offline/`
2. Press **F12** (or right-click → Inspect)
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Service Workers** in the left sidebar
5. You should see:
   - ✅ Service worker registered
   - ✅ Status: "activated and is running"

### Check Cache:
1. In DevTools, go to **Application** → **Cache Storage**
2. You should see multiple caches:
   - `workbox-precache-*` (main app files)
   - `data-cache` (JSON files)
   - `images-cache` (images)
   - `google-fonts-cache` (fonts)

---

## Quick Checklist

- [ ] Workflow shows green checkmark ✅
- [ ] Site URL is accessible
- [ ] Site loads correctly
- [ ] Navigation works
- [ ] Pages load properly
- [ ] Offline mode works (test on phone)
- [ ] Can install as PWA
- [ ] Service worker is registered

---

## Troubleshooting

### Site shows 404:
- Wait 5-10 minutes after deployment
- Clear browser cache
- Try incognito/private window

### Offline doesn't work:
- Make sure you visited pages while online first
- Wait 30 seconds after first visit
- Check service worker in DevTools

### Service worker not registering:
- Check browser console for errors
- Make sure you're using HTTPS (GitHub Pages uses HTTPS)
- Clear site data and reload

---

## Success Indicators

✅ **Everything is working if:**
- Site loads at the URL
- All pages navigate correctly
- App works offline on mobile
- Can install as PWA
- Service worker is active

🎉 **You're done!** Your app is live and working offline!

