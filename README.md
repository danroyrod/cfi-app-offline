# CFI Airplane ACS Study App

A comprehensive, offline-capable study application for the **Flight Instructor for Airplane Category Airman Certification Standards (FAA-S-ACS-25, April 2024)**.

Live: [danroyrod.github.io/cfi-app-offline](https://danroyrod.github.io/cfi-app-offline/)

## Features

- **ACS Standards** — Browse all 14 Areas of Operation (97 tasks) with Knowledge, Risk Management, and Skills breakdowns
- **Lesson Plans** — Complete teaching guides with scripts organized by area
- **Audio Lessons** — Text-to-speech narration (Full & Lite modes) with background playback
- **Flashcards** — Spaced repetition study with 2,000+ cards
- **Quizzes** — Test knowledge with timed, scored assessments
- **Bookmarks & Notes** — Personal annotations saved locally
- **Search** — Full-text search across all content
- **Dark Mode** — System-aware theme toggle
- **Offline/PWA** — Install as app, works without internet
- **iOS-ready** — Capacitor configured for native deployment

## Tech Stack

- React 19 + TypeScript 5.9 (strict mode)
- Vite 7 with PWA plugin
- React Router 7
- Capacitor 7 (iOS)
- CSS3 with variables (no framework)
- GitHub Actions CI/CD

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + Vite build |
| `npm run lint` | ESLint |
| `npm run validate:acs` | Verify ACS data coverage |
| `npm run audit:quality` | Score lesson plan quality |
| `npm run audit:flashcards` | Check flashcard coverage |
| `npm run cap:build` | Build + sync for iOS |

## Project Structure

```
src/
├── components/     # Reusable UI (AudioPlayer, Flashcards, Quiz, etc.)
├── contexts/       # React contexts (Audio, Auth)
├── hooks/          # Custom hooks (useTheme, useDebounce, useLocalStorage)
├── pages/          # Route-level components
├── services/       # Business logic (audio, search, quiz, flashcards, etc.)
├── types/          # TypeScript type definitions
├── utils/          # Utilities (Capacitor, performance, data loading)
├── acs_data.json   # FAA ACS structured data
├── lessonPlansData.json  # Lesson plan content
├── App.tsx         # Root component with routing
└── App.css         # Global styles
```

## Deployment

Pushes to `main` automatically deploy via GitHub Actions to GitHub Pages.

## Data Source

- **Document**: FAA-S-ACS-25 (April 2024)
- **Verified**: June 2026
- **Source**: [faa.gov](https://www.faa.gov/training_testing/testing/acs)

## License

Reference tool based on public FAA documents.
