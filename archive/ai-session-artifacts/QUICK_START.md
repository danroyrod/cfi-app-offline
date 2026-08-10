# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:5173`

---

## 📱 Application Flow

### User Journey:
```
Landing Page
    ↓ (Click "View Areas of Operation")
Areas Index (All 14 Areas)
    ↓ (Click any area card)
Area Detail (All tasks in that area)
    ↓ (Click any task card)
Task Detail (Complete task information)
```

### Navigation:
- **Home Icon**: Click header title to go home
- **Back Buttons**: Navigate up one level
- **Breadcrumbs**: Visual location indicators

---

## 🎨 What You'll See

### Landing Page
- Beautiful gradient background
- Document title and FAA number
- Single call-to-action button

### Areas Index
- Grid of 14 area cards
- Roman numeral indicators
- Task counts

### Area Detail
- List of all tasks in the area
- Quick reference to task names
- Tap any task to dive deeper

### Task Detail
- **Objective**: What the task tests
- **Notes**: Important considerations
- **Knowledge**: What you need to know
- **Risk Management**: What to consider
- **Skills**: What you need to demonstrate
- **Tolerances**: Highlighted in green (±5 knots, etc.)

---

## 💡 Tips

### For Developers
- Hot reload is enabled - changes appear instantly
- TypeScript errors will show in console
- Component files are in `src/pages/`
- All styles are in `src/App.css`

### For Students
- Bookmark specific tasks for quick access
- Use browser's back button - it works!
- Works great on phones and tablets
- Save to home screen on iOS for app-like experience

### For Instructors
- Share direct task links with students
- Reference tasks during lessons
- Use on any device during ground school

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` directory, ready to deploy.

---

## 🚢 Deploy Options

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Drag `dist/` folder to Netlify drop zone
2. Done!

### GitHub Pages
1. Push `dist/` to gh-pages branch
2. Enable GitHub Pages in repo settings

---

## 📱 Add to iOS Home Screen

1. Open app in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Enjoy app-like experience!

---

## 🛠️ Troubleshooting

### Port 5173 already in use?
```bash
# Kill the process and restart
npm run dev -- --port 3000
```

### Dependencies not installing?
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### Build errors?
```bash
# Check TypeScript
npm run build
# Fix any errors shown
```

---

## 📚 Learn More

- **React**: [react.dev](https://react.dev)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)
- **Vite**: [vitejs.dev](https://vitejs.dev)
- **React Router**: [reactrouter.com](https://reactrouter.com)

---

## ✈️ Ready to Fly!

Your CFI ACS reference app is ready to use. Happy studying and good luck on your checkride!

**Questions? Issues? Check the README.md and PROJECT_SUMMARY.md files.**

