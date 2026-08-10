# CFI ACS App — Project Context

## What This Is
A comprehensive offline-capable study app for the FAA CFI Airplane ACS (FAA-S-ACS-25, April 2024). Used by flight instructor candidates preparing for their checkride.

## Tech Stack
- React 19 + TypeScript 5.9 (strict mode)
- Vite 7 with PWA plugin (vite-plugin-pwa)
- React Router 7
- Capacitor 7 (iOS native)
- Plain CSS3 with variables (no Tailwind, no CSS-in-JS)
- GitHub Actions CI/CD to GitHub Pages

## Key Architecture Decisions
- **Static data**: ACS content and lesson plans are bundled as JSON (no backend API)
- **Offline-first**: PWA with service worker, all content works without internet
- **Lazy loading**: All page components are lazy-loaded via React.lazy()
- **Data splitting**: ACS data and lesson plans are in separate Vite chunks
- **Auth**: Client-side password protection (not real security, just access gating)
- **Audio**: Browser TTS (SpeechSynthesis API), no pre-recorded audio files

## Data Files (DO NOT manually edit - use scripts)
- `src/acs_data.json` — Structured ACS data (14 areas, 97 tasks)
- `src/lessonPlansData.json` — 85 lesson plans with teaching scripts, SVG diagrams
- `src/deepDiveLessonsData.json` — Extended "deep dive" content from extra detail sources
- `public/enhancedFlashcards.json` — 2,000+ flashcards (runtime-loaded, not bundled)

## Scripts (in scripts/)
- `extract-george-content.py` — Extracts .docx/.pptx content from George's lesson pack
- `enrich-lesson-plans.py` — Cross-references and enriches lesson plan data
- `build-deep-dives.py` — Builds deep-dive content from extra detail files
- `generate-svgs.py` — Generates inline SVG diagrams for all lesson plans
- `fix-external-urls.py` — Replaces external image URLs with inline SVGs

## Content Source
George's CFI Lesson Pack (Nov 2025) — professional CFI teaching materials with:
- Standard lessons per ACS task
- Extra Detail expanded versions
- PowerPoints with diagrams
- Located at: `_-_CFI_Lesson_Pack_from_George/` (OneDrive)

## Coding Standards
- Strict TypeScript (no `any`, no unused vars)
- Functional components only (no class components)
- Custom hooks for reusable logic
- Services layer for business logic (not in components)
- CSS naming: kebab-case class names
- File naming: PascalCase for components, camelCase for services/utils

## Build & Deploy
```bash
npm run dev          # Local dev server
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
```
Push to `main` branch → GitHub Actions auto-deploys to Pages.

## Important Notes
- Large JSON files should NOT be loaded into editor/analysis tools whole
- The lesson plans file is ~4MB — changes should be made via Python scripts
- Always verify build after data changes: `npx vite build`
- The `archive/` folder contains historical AI session artifacts (not needed for development)
