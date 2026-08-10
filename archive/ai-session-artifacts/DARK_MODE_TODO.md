# Dark Mode Implementation - TODO

## 🌙 Feature Request: Add Dark Mode

### Implementation Plan:

1. **Add Dark Mode Toggle**
   - Add button in header
   - Store preference in localStorage
   - Icon: ☀️ / 🌙

2. **CSS Variables for Dark Mode**
```css
[data-theme="dark"] {
  --primary-color: #3b82f6;
  --bg-primary: #1f2937;
  --bg-secondary: #111827;
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  /* etc. */
}
```

3. **Components to Update**
   - All pages
   - Header
   - Cards
   - Forms
   - Lesson plan viewer

4. **Considerations**
   - Maintain readability
   - Test with all components
   - Smooth transition
   - System preference detection

### Priority: Medium
### Status: Saved for Later

---

**Note**: Focus on content (lesson plans) first, then polish with dark mode!

