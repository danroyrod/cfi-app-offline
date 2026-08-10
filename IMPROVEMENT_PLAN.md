# CFI ACS App — Improvement Plan

## Status: IN PROGRESS

### Progress Checkpoint (Current Session)
- [x] Phase 1: Code cleanup complete (177 files archived, root clean)
- [x] Phase 2.1: Extraction complete (74 standard lessons + 71 PowerPoints extracted)
- [x] Phase 2.3: Enrichment complete (82/85 plans enriched with George's content)
- [x] Phase 2.3: Diagram references extracted (1,626 references from PowerPoints)
- [x] Deployed enriched `lessonPlansData.json` to src/ (4.12 MB)
- [x] Created `deepDiveLessonsData.json` with 19 deep dives (0.45 MB)  
- [x] App builds successfully with enriched data (verified)
- [x] **Diagrams**: Generated inline SVGs for all 250 diagrams (116 new + 134 existing)
- [x] **Diagrams**: Replaced 2 external Wikipedia URLs with inline SVGs (fully offline)
- [x] **Performance**: Split data bundle into separate acs-data (44KB gz) and lesson-plans (830KB gz) chunks
- [x] **Performance**: Verified build passes clean (2.3s, 83 precache entries)
- [x] **Docs**: Created .kiro/steering/project-context.md for future development guidance
- [x] **Docs**: Updated README.md with accurate architecture and features
- [ ] Phase 2.4: Extra Detail extraction BLOCKED (OneDrive cloud files need manual sync)
- [ ] Content sync: Update audio lessons, quizzes, flashcards to reflect enriched content

### What Was Added to Each Plan
For the 82 enriched plans, George's content added:
- **~5 new teaching points** per plan (from George's structured lesson material)
- **~3-5 new common errors** per plan (from George's error sections)
- **~1-3 completion standards** per plan (ACS tolerance patterns)
- **~3 safety considerations** per plan (from George's safety emphasis)
- **Diagram references** from PowerPoint slides (where applicable)

### TODO: OneDrive Extra Detail Files (Deep Dives)
Most "Extra Detail" .docx files in `3. CFI Extra Detail Lessons/` are still cloud-only on OneDrive.

**Currently have deep dives for:** II-A, V-B, V-C, VI-B, VIII-B, VIII-C, VIII-D, IX-A through IX-F, X-I, XII-C, XII-D, XIV-A (19 total)

**Still need (once files sync):** All of Area I, most of II, III, IV, V-A/D/F, VI-A, all of VII, VIII-A, all of X (except Spins), XI, most of XII

**To complete when files are available:**
1. Open each subfolder in Windows Explorer under:
   `_-_CFI_Lesson_Pack_from_George\...\3. CFI Extra Detail Lessons\CFI Extra Detail Individual Files - Nov25\`
2. Select all → Right-click → "Always keep on this device"
3. Wait for green checkmarks on all files
4. Run these scripts in order:
   ```bash
   python scripts/extract-available-extra-detail.py
   python scripts/build-deep-dives.py
   ```
5. Copy output to src:
   ```bash
   copy scripts\enrichment-output\deepDiveLessonsData.json src\deepDiveLessonsData.json
   ```
6. Rebuild: `npx vite build`

This will expand from 19 to ~70 deep dive entries.

---

## Phase 1: Code Organization & Cleanup ✅ COMPLETE

- [x] Archived 177 non-essential root files (Python scripts, emoji markdown status docs, session artifacts) to `archive/ai-session-artifacts/`
- [x] Archived `.cursorrules` and `.cursorignore` (Cursor-specific, not needed)
- [x] Archived `src/lessonPlansData.json.backup`
- [x] Updated README.md to reflect actual app features and architecture

**Root directory now contains only**: `.gitignore`, `capacitor.config.ts`, `eslint.config.js`, `index.html`, `package.json`, `package-lock.json`, `tsconfig*.json`, `vite.config.ts`

---

## Phase 2: Content Quality Improvement (Lesson Plans)

### Current State

The app has **85 lesson plans** covering all 14 ACS Areas. Each plan includes:
- Overview, objectives, prerequisites, equipment, estimated time
- Key teaching points, common errors, completion standards
- Teaching scripts with phased instruction (instructor/student actions)
- Diagrams (external image URLs + SVG descriptions)
- Interactive elements, safety considerations, homework

### Raw Material Available (George's CFI Lesson Pack)

Source: `_-_CFI_Lesson_Pack_from_George/Download All (PC) - CFI Lesson Pack/`

| Folder | Content | Count |
|--------|---------|-------|
| 1. CFI Lessons (Standard) | Individual .docx per ACS task | ~74 files across 14 areas |
| 2. CFI PowerPoints | Slides per ACS task | 72 .pptx files |
| 3. CFI Extra Detail Lessons | Expanded versions with deeper content | ~74 files |
| 4. CFI-I Lessons & PPTs | Instrument instructor content | Additional |
| 5. Syllabi | Training syllabi (Private, Commercial, CFI, etc.) | 5 syllabi |

### Coverage Comparison

| Area | App Plans | George's Lessons | George's Extra Detail | Gap? |
|------|-----------|-----------------|---------------------|------|
| I. FOI | 6 | 6 | 6 | ✅ Full coverage |
| II. Technical Subjects | 16 | 14 | 14 | ⚠️ App has 2 more (L. Weather, P. High Altitude?) |
| III. Preflight Prep | 3 | 4 | 4 | ⚠️ George has 1 more |
| IV. Preflight Maneuver | 1 | 1 | 1 | ✅ |
| V. Preflight Procedures | 6 | 5 | 5 | ⚠️ App has 1 more |
| VI. Airport Ops | 2 | 2 | 2 | ✅ |
| VII. Takeoffs/Landings | 15 | 9 | 9 | ⚠️ George only covers A-F, M-O (missing G-L) |
| VIII. Fundamentals | 4 | 4 | 4 | ✅ |
| IX. Maneuvers | 6 | 8 | 8 | ⚠️ George has more (ground ref split) |
| X. Slow Flight/Stalls | 9 | 9 | 9 | ✅ |
| XI. Instruments | 5 | 2 | 2 | ⚠️ App has 3 more than George |
| XII. Emergency Ops | 7 | 4 | 4 | ⚠️ App has 3 more than George |
| XIII. Multi-engine | 3 | - | - | No George source (separate MEI pack) |
| XIV. Postflight | 2 | 1 | 1 | ⚠️ App has 1 more |

### Improvement Tasks

#### Task 2.1: Extract George's .docx Content
- Convert George's .docx lessons to structured text
- Parse teaching points, procedures, standards, common errors
- Map each file to its corresponding ACS task

#### Task 2.2: Cross-Reference & Gap Analysis
- Compare George's content against current app lesson plan data field by field
- Identify where George's material provides richer/different information:
  - More specific teaching techniques
  - Better instructor phrasing/scripts
  - Additional common errors or safety notes
  - ACS-specific completion standards
  - Procedure steps with specific numbers/tolerances

#### Task 2.3: Enrich Lesson Plan Content
For each of the 85 lesson plans, merge improvements:
- **Teaching scripts**: Incorporate George's instructor language and technique suggestions
- **Key teaching points**: Add any points from George not already captured
- **Common errors**: Add specific errors George identifies
- **Completion standards**: Ensure they match ACS tolerances exactly
- **Safety considerations**: Add George's safety emphasis points
- **Diagrams/Images**: Identify where George's PowerPoints reference diagrams that could improve the app's visual content

#### Task 2.4: Extract & Integrate Extra Detail Content
The "Extra Detail" versions provide deeper explanations. For complex maneuvers (stalls, spins, steep turns, chandelles, lazy eights, etc.):
- Add expanded explanations to teaching scripts
- Include additional scenario-based teaching examples
- Add "why it matters" context from George's expanded content

#### Task 2.5: Validate Against ACS April 2024
- Ensure all lesson plans reference the correct FAA-S-ACS-25 April 2024 codes
- Verify completion standards match current ACS tolerances
- Flag any outdated references (e.g., old handbook editions)

---

## Phase 3: Additional Improvements (After Content)

### 3.1 Diagram/Image Improvements
- Replace external Wikipedia image URLs with self-hosted SVGs or diagrams
- Extract diagram concepts from George's PowerPoints
- Create inline SVG diagrams for maneuvers (traffic patterns, maneuver profiles, etc.)
- Ensure all diagrams work offline

### 3.2 Flashcard Quality
- Cross-reference flashcard content with George's material
- Ensure flashcards cover key teaching points from improved lesson plans
- Remove duplicates or poorly-worded cards

### 3.3 Quiz Quality
- Ensure quiz questions align with improved lesson content
- Add questions based on George's common errors (great quiz material)

### 3.4 Accessibility
- Add ARIA labels to interactive components
- Ensure keyboard navigation works throughout
- Verify color contrast in both light and dark modes

### 3.5 Performance
- Audit bundle size (flashcards JSON is 2.23 MB)
- Consider splitting large data files
- Verify PWA caching strategy is optimal

### 3.6 UX Polish
- Modernize landing page
- Improve navigation breadcrumbs consistency
- Add progress tracking across study modes

---

## Execution Approach

I'll work through Phase 2 autonomously after approval:

1. **Read each .docx file** from George's pack using text extraction
2. **Parse and structure** the content for comparison
3. **Update `lessonPlansData.json`** with enriched content
4. **Validate** that the app still builds and renders correctly
5. **Document changes** in a summary

**Estimated scope**: 85 lesson plans × comparison + enrichment = significant but systematic work.

**I cannot read .docx files directly** — I'll need to extract text from them using a Python script or PowerShell. I'll handle this in the execution phase.

---

## Questions for You

1. **Priority**: Should I focus on all 85 plans or prioritize specific areas (e.g., flight maneuvers over FOI)?
2. **George's Extra Detail**: Should the extra detail content go into the main lesson plans, or would you prefer a separate "deep dive" mode?
3. **PowerPoints**: Should I extract visual descriptions from the .pptx files to improve diagrams?
4. **Commit strategy**: Should I commit changes in batches (per area) or all at once?
