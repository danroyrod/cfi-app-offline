# CFI ACS App Structure

## Visual Application Map

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│              LANDING PAGE (/)                       │
│                                                     │
│     Flight Instructor Airplane, ACS                │
│        Airman Certification Standards               │
│              FAA-S-ACS-25                           │
│              November 2023                          │
│                                                     │
│     [View Areas of Operation →]                     │
│                                                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                                                     │
│         AREAS INDEX (/areas)                        │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │   I.    │  │   II.   │  │  III.   │           │
│  │  Funds  │  │ Technical│  │ Preflight│          │
│  │   of    │  │ Subject  │  │   Prep  │           │
│  │Instruct │  │  Areas   │  │         │           │
│  │ 6 tasks │  │ 16 tasks │  │ 3 tasks │           │
│  └─────────┘  └─────────┘  └─────────┘           │
│                                                     │
│  ... (14 areas total) ...                          │
│                                                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                                                     │
│    AREA DETAIL (/area/I)                           │
│                                                     │
│    Area I: Fundamentals of Instructing             │
│    6 Tasks                                          │
│                                                     │
│    Note: The evaluator must select...              │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │ A │ Effects of Human Behavior and...      │   │
│  │   │ References: FAA-H-8083-2...          │   │
│  └────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────┐   │
│  │ B │ Learning Process                      │   │
│  │   │ References: FAA-H-8083-2...          │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
│  ... (6 tasks total) ...                           │
│                                                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                                                     │
│    TASK DETAIL (/area/I/task/A)                    │
│                                                     │
│    Task A: Effects of Human Behavior and           │
│    Communication on the Learning Process           │
│                                                     │
│    References: FAA-H-8083-2, FAA-H-8083-9...      │
│                                                     │
│    ┌─────────────────────────────────────────┐    │
│    │ 🎯 Objective                            │    │
│    │ To determine the applicant...           │    │
│    └─────────────────────────────────────────┘    │
│                                                     │
│    ┌─────────────────────────────────────────┐    │
│    │ 📚 Knowledge                            │    │
│    │ FI.I.A.K1                               │    │
│    │ Elements of human behavior...           │    │
│    │                                          │    │
│    │ FI.I.A.K2                               │    │
│    │ Learner emotional reactions...          │    │
│    └─────────────────────────────────────────┘    │
│                                                     │
│    ┌─────────────────────────────────────────┐    │
│    │ ⚠️ Risk Management                      │    │
│    │ FI.I.A.R1                               │    │
│    │ Recognizing and accommodating...        │    │
│    └─────────────────────────────────────────┘    │
│                                                     │
│    ┌─────────────────────────────────────────┐    │
│    │ ✈️ Skills                               │    │
│    │ FI.I.A.S1                               │    │
│    │ Give examples of how human...           │    │
│    │                                          │    │
│    │ Maintain altitude ±100 feet             │    │
│    │              ^^^^ highlighted!           │    │
│    └─────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx (Router)
├── LandingPage.tsx
├── AreasIndex.tsx
├── AreaDetail.tsx
│   └── Task Cards (clickable)
└── TaskDetail.tsx
    ├── Objective Section
    ├── Notes Section
    ├── Knowledge Section
    ├── Risk Management Section
    └── Skills Section
```

## Data Flow

```
acs_data.json (source)
       ↓
  types.ts (TypeScript interfaces)
       ↓
  Components import and use
       ↓
  React Router handles navigation
       ↓
  CSS provides styling
```

## File Relationships

```
src/
│
├── main.tsx ─────────────→ App.tsx
│                              │
├── types.ts ←────────────────┼─────────┐
│                              │         │
├── acs_data.json ←───────────┼─────────┤
│                              │         │
└── pages/                     │         │
    ├── LandingPage.tsx ←──────┤         │
    ├── AreasIndex.tsx ←───────┼─────────┤
    ├── AreaDetail.tsx ←───────┼─────────┤
    └── TaskDetail.tsx ←───────┘─────────┘
```

## URL Structure

```
/
└── Landing Page

/areas
└── All 14 Areas

/area/I
├── /area/II
├── /area/III
│   ...
└── /area/XIV
    └── Area Detail (list of tasks)

/area/I/task/A
├── /area/I/task/B
├── /area/I/task/C
│   ...
└── /area/XIV/task/N
    └── Task Detail (full information)
```

## Navigation Patterns

```
User Action          Route Change              Component Loaded
───────────────────────────────────────────────────────────────
Click "View Areas"   / → /areas               AreasIndex
Click Area Card      /areas → /area/I         AreaDetail
Click Task Card      /area/I → /area/I/task/A TaskDetail
Click "Back"         /area/I/task/A → /area/I AreaDetail
Click Header         any → /areas             AreasIndex
```

## State Management

```
No Redux or Context needed!
├── Data is static (imported JSON)
├── Navigation via React Router
└── No shared state between components
```

## Styling Approach

```
App.css (Global Styles)
├── CSS Variables (colors, shadows)
├── Responsive Breakpoints
├── Component-specific classes
└── Utility classes
```

## Color System

```
Primary Flow:
Landing → Blue Gradient Background
Areas   → Blue Cards with White Background
Tasks   → Blue Headers, Color-coded Sections

Section Colors:
🎯 Objective      → Gray Background
📝 Notes          → Yellow Background
📚 Knowledge      → Gray with Blue Border
⚠️ Risk Mgmt      → Gray with Blue Border
✈️ Skills         → Gray with Blue Border
   Tolerances     → Green Highlight
```

## Responsive Breakpoints

```
Desktop (1200px+)
├── 3 column grid for areas
├── Full width content
└── Large typography

Tablet (768px - 1199px)
├── 2 column grid for areas
├── Medium width content
└── Medium typography

Mobile (< 768px)
├── 1 column layout
├── Full width cards
└── Smaller typography
```

## Future Architecture (iOS)

```
Current Web               Future iOS
────────────────         ────────────────
React                    React Native
React Router       →     React Navigation
CSS                →     StyleSheet
JSON Import        →     Bundled JSON
Browser            →     iOS Native
```

---

## Development Workflow

```
1. Edit Code
   ↓
2. Vite Hot Reloads
   ↓
3. See Changes Instantly
   ↓
4. Test on Different Screens
   ↓
5. Build for Production
   ↓
6. Deploy
```

## Testing Strategy

```
Manual Testing:
├── Navigate through all pages
├── Click all links and buttons
├── Test on mobile devices
├── Test on tablets
└── Test on desktop

Browser Testing:
├── Chrome/Edge (Chromium)
├── Safari (especially iOS)
├── Firefox
└── Mobile browsers
```

---

This structure provides a clear, maintainable, and scalable foundation for the CFI ACS reference application.

