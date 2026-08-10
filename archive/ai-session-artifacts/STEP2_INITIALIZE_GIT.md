# Step 2: Initialize Git - Detailed Instructions

## First: Install Git (if not installed)

1. **Download Git for Windows:**
   - Go to: https://git-scm.com/download/win
   - Click "Download" button
   - The download will start automatically

2. **Install Git:**
   - Run the downloaded `.exe` file
   - Click "Next" through all the installation screens
   - Use all the default options (they're fine)
   - Click "Install" and wait for it to finish
   - Click "Finish"

3. **Restart PowerShell:**
   - Close your current PowerShell/Terminal window
   - Open a new PowerShell window
   - Navigate back to your project:
     ```powershell
     cd C:\Users\danrr\Desktop\CFI\App\cfi-acs-app-v5
     ```

## Step 2: Initialize Git in Your Project

### Check if Git is already initialized:

```powershell
git status
```

**If you see:**
- ✅ "On branch main" or "On branch master" → Git is already initialized! Skip to Step 3.
- ❌ "fatal: not a git repository" → Continue below to initialize.

### Initialize Git (if needed):

```powershell
# Initialize Git repository
git init

# Add all files to Git
git add .

# Create your first commit
git commit -m "Initial commit - CFI ACS App v5"
```

### Verify it worked:

```powershell
git status
```

You should see: "On branch main" (or "master") and "nothing to commit, working tree clean"

---

## What's Next?

After Git is initialized, proceed to **Step 3** in `GITHUB_DEPLOYMENT_GUIDE.md`:
- Connect your local repository to GitHub
- Push your code

---

## Troubleshooting

**"git is not recognized"**
- Git is not installed or not in PATH
- Restart PowerShell after installing Git
- Or restart your computer

**"Permission denied"**
- Make sure you're in the correct folder
- Check that you have write permissions

**Need help?** Let me know what error message you see!

