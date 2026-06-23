# Content Update Pipeline

This guide documents the workflow for maintaining ACS data, lesson plans, audio lessons, and flashcards.

## Quick Commands

```bash
# Run all audits at once
npm run audit:all

# Individual audits
npm run validate:acs      # Check lesson plan ↔ ACS alignment
npm run audit:quality     # Score lesson plan quality (grade A-F)
npm run audit:audio       # Check audio lesson readiness
npm run audit:flashcards  # Check flashcard coverage
```

---

## When the FAA Releases a New ACS Revision

### Detection
- The ACS Version Badge in the app turns **yellow** after 90 days and **red** after 180 days since last verification
- Visit https://www.faa.gov/training_testing/testing/acs to check for updates
- Look for a new effective date on FAA-S-ACS-25

### Update Workflow

1. **Download the new ACS document** from the FAA website

2. **Update `src/acs_data.json`**:
   - Update the `date` field
   - Update `version_info.acs_revision` to the new revision date
   - Add/modify/remove areas, tasks, knowledge items, risk management items, and skills as needed
   - Update `version_info.last_verified` to today's date

3. **Run validation**:
   ```bash
   npm run validate:acs
   ```
   This will flag:
   - Orphaned lesson plan references (pointing to removed ACS codes)
   - Missing coverage (new ACS tasks without lesson plans)
   - Invalid mappings

4. **Fix lesson plans** to match ACS changes:
   - Update `acsReference` codes in completion standards
   - Add lesson plans for any new tasks
   - Remove references to deleted ACS codes

5. **Re-run all audits**:
   ```bash
   npm run audit:all
   ```

6. **Rebuild and test**:
   ```bash
   npm run build
   npm run preview
   ```

7. **Deploy** (after review)

---

## Regular Verification (No ACS Changes)

If you check the FAA site and confirm no new revision exists:

1. Update `src/acs_data.json`:
   ```json
   "last_verified": "YYYY-MM-DD"  ← today's date
   ```

2. Rebuild and deploy — the badge goes back to green.

---

## Improving Lesson Plan Quality

### Identify weak plans
```bash
npm run audit:quality
```
Focus on plans graded B or below. The report shows which dimensions are weakest.

### Common gaps to fill
- **Diagrams** (43% average) — Add visual aids where possible
- **Safety considerations** — Add safety notes to plans missing them
- **Completion standards** — Ensure all have ACS references and tolerances

### After making changes
```bash
npm run validate:acs      # Verify references are still valid
npm run audit:quality     # Confirm score improved
```

---

## Improving Audio Lessons

### Check readiness
```bash
npm run audit:audio
```

### Key issues to address
- **LP-V-C (Engine Starting)** is missing key teaching points and completion standards — audio will be thin
- **38 aviation abbreviations** need pronunciation handling in `src/services/audioService.ts`
- Tolerances like "±10 knots" must be spoken as "plus or minus ten knots"

### Adding pronunciation rules
In `src/services/audioService.ts`, the `cleanTextForSpeech()` method handles text transformation before TTS. Add aviation term expansions there:

```typescript
// Example additions to cleanTextForSpeech():
text = text.replace(/\bVx\b/g, 'V-X');
text = text.replace(/\bVy\b/g, 'V-Y');
text = text.replace(/\bKIAS\b/g, 'knots indicated airspeed');
text = text.replace(/\bAGL\b/g, 'above ground level');
text = text.replace(/±/g, 'plus or minus');
```

---

## Improving Flashcards

### Check coverage
```bash
npm run audit:flashcards
```

### Key findings
- **4,448 enhanced flashcards** exist in `public/enhancedFlashcards.json`
- **90% are specific/scenario-based** (good quality)
- **Areas VI and VII** have lowest cards-per-ACS-item ratio
- Auto-generation from lesson plans can produce ~4,658 cards

### Adding flashcards
- Enhanced flashcards live in `public/enhancedFlashcards.json`
- Auto-generated cards come from `src/services/flashcardGenerator.ts`
- Priority: Add tolerance-based and scenario-based cards for risk management items

---

## File Reference

| File | Purpose |
|------|---------|
| `src/acs_data.json` | Master ACS data (areas, tasks, K/R/S codes) |
| `src/lessonPlansData.json` | All 85 lesson plans |
| `public/enhancedFlashcards.json` | Pre-built flashcard deck (4,448 cards) |
| `src/services/audioService.ts` | TTS audio generation logic |
| `src/services/flashcardGenerator.ts` | Auto-generates cards from lesson plans |
| `scripts/validate-acs-coverage.cjs` | ACS ↔ lesson plan alignment check |
| `scripts/quality-score-lessons.cjs` | Quality scoring for lesson plans |
| `scripts/audit-audio-quality.cjs` | Audio readiness audit |
| `scripts/audit-flashcard-coverage.cjs` | Flashcard coverage audit |

---

## CI Integration (Future)

To run validation on every push, add to `.github/workflows/`:

```yaml
name: Content Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm run validate:acs
```

This will fail the build if lesson plans reference non-existent ACS codes.
