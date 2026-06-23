/**
 * Lesson Plan Quality Scoring Script (#3)
 * 
 * Evaluates each lesson plan on multiple dimensions and produces
 * a quality score + gap analysis.
 * 
 * Scoring criteria (max 100 points):
 *   - Teaching script phases (0-20): number and depth of phases
 *   - Key teaching points (0-15): count and specificity  
 *   - Common errors (0-10): coverage of common mistakes
 *   - Completion standards (0-20): count + ACS references + tolerances
 *   - Diagrams (0-10): visual aids present
 *   - Instructor notes (0-10): guidance for the instructor
 *   - Safety considerations (0-5): safety items present
 *   - Prerequisites & equipment (0-5): lesson readiness info
 *   - Overview quality (0-5): overview length and substance
 * 
 * Run: node scripts/quality-score-lessons.cjs
 */

const lp = require('../src/lessonPlansData.json');
const acs = require('../src/acs_data.json');

const plans = lp.lessonPlans;

function scorePlan(plan) {
  const scores = {};
  let total = 0;

  // 1. Teaching script phases (0-20)
  const phases = plan.teachingScript || [];
  const phaseCount = phases.length;
  const avgKeyPoints = phases.length > 0
    ? phases.reduce((s, p) => s + (p.keyPoints?.length || 0), 0) / phases.length
    : 0;
  const avgActions = phases.length > 0
    ? phases.reduce((s, p) => s + (p.instructorActions?.length || 0) + (p.studentActions?.length || 0), 0) / phases.length
    : 0;

  let phaseScore = 0;
  if (phaseCount >= 4) phaseScore += 8;
  else if (phaseCount >= 3) phaseScore += 6;
  else if (phaseCount >= 2) phaseScore += 4;
  else if (phaseCount >= 1) phaseScore += 2;

  if (avgKeyPoints >= 4) phaseScore += 6;
  else if (avgKeyPoints >= 3) phaseScore += 5;
  else if (avgKeyPoints >= 2) phaseScore += 3;
  else if (avgKeyPoints >= 1) phaseScore += 1;

  if (avgActions >= 4) phaseScore += 6;
  else if (avgActions >= 3) phaseScore += 5;
  else if (avgActions >= 2) phaseScore += 3;
  else if (avgActions >= 1) phaseScore += 1;

  scores.teachingScript = Math.min(20, phaseScore);
  total += scores.teachingScript;

  // 2. Key teaching points (0-15)
  const ktp = plan.keyTeachingPoints || [];
  let ktpScore = 0;
  if (ktp.length >= 8) ktpScore = 15;
  else if (ktp.length >= 6) ktpScore = 12;
  else if (ktp.length >= 4) ktpScore = 9;
  else if (ktp.length >= 2) ktpScore = 5;
  else if (ktp.length >= 1) ktpScore = 2;
  scores.keyTeachingPoints = ktpScore;
  total += ktpScore;

  // 3. Common errors (0-10)
  const errors = plan.commonErrors || [];
  let errScore = 0;
  if (errors.length >= 5) errScore = 10;
  else if (errors.length >= 4) errScore = 8;
  else if (errors.length >= 3) errScore = 6;
  else if (errors.length >= 2) errScore = 4;
  else if (errors.length >= 1) errScore = 2;
  scores.commonErrors = errScore;
  total += errScore;

  // 4. Completion standards (0-20)
  const stds = plan.completionStandards || [];
  let stdScore = 0;
  
  // Count
  if (stds.length >= 5) stdScore += 8;
  else if (stds.length >= 3) stdScore += 6;
  else if (stds.length >= 2) stdScore += 4;
  else if (stds.length >= 1) stdScore += 2;

  // ACS references present
  const refsPresent = stds.filter(s => s.acsReference && s.acsReference.trim() !== '').length;
  if (refsPresent === stds.length && stds.length > 0) stdScore += 6;
  else if (refsPresent > stds.length * 0.5) stdScore += 4;
  else if (refsPresent > 0) stdScore += 2;

  // Tolerances present
  const tolPresent = stds.filter(s => s.tolerance && s.tolerance.trim() !== '').length;
  if (tolPresent >= 3) stdScore += 6;
  else if (tolPresent >= 2) stdScore += 4;
  else if (tolPresent >= 1) stdScore += 2;

  scores.completionStandards = Math.min(20, stdScore);
  total += scores.completionStandards;

  // 5. Diagrams (0-10)
  const diagrams = plan.diagrams || [];
  let diagScore = 0;
  if (diagrams.length >= 3) diagScore = 10;
  else if (diagrams.length >= 2) diagScore = 7;
  else if (diagrams.length >= 1) diagScore = 4;
  scores.diagrams = diagScore;
  total += diagScore;

  // 6. Instructor notes (0-10)
  const instrNotes = plan.instructorNotes || [];
  let instrScore = 0;
  if (instrNotes.length >= 4) instrScore = 10;
  else if (instrNotes.length >= 3) instrScore = 8;
  else if (instrNotes.length >= 2) instrScore = 5;
  else if (instrNotes.length >= 1) instrScore = 3;
  scores.instructorNotes = instrScore;
  total += instrScore;

  // 7. Safety considerations (0-5)
  const safety = plan.safetyConsiderations || [];
  let safetyScore = 0;
  if (safety.length >= 3) safetyScore = 5;
  else if (safety.length >= 2) safetyScore = 4;
  else if (safety.length >= 1) safetyScore = 2;
  scores.safety = safetyScore;
  total += safetyScore;

  // 8. Prerequisites & equipment (0-5)
  const prereqs = plan.prerequisites || [];
  const equip = plan.equipment || [];
  let readyScore = 0;
  if (prereqs.length >= 2) readyScore += 3;
  else if (prereqs.length >= 1) readyScore += 2;
  if (equip.length >= 2) readyScore += 2;
  else if (equip.length >= 1) readyScore += 1;
  scores.readiness = Math.min(5, readyScore);
  total += scores.readiness;

  // 9. Overview quality (0-5)
  const overview = plan.overview || '';
  let overviewScore = 0;
  if (overview.length >= 200) overviewScore = 5;
  else if (overview.length >= 100) overviewScore = 3;
  else if (overview.length >= 30) overviewScore = 1;
  scores.overview = overviewScore;
  total += overviewScore;

  return { total, scores, maxPossible: 100 };
}

// Score all plans
const results = plans.map(plan => {
  const { total, scores } = scorePlan(plan);
  return {
    id: plan.id,
    title: plan.title,
    area: plan.areaNumber,
    task: plan.taskLetter,
    total,
    scores,
    grade: total >= 85 ? 'A' : total >= 70 ? 'B' : total >= 55 ? 'C' : total >= 40 ? 'D' : 'F'
  };
}).sort((a, b) => a.total - b.total);

// Report
console.log('=== Lesson Plan Quality Score Report ===\n');
console.log(`Total Lesson Plans: ${results.length}`);

const avgScore = (results.reduce((s, r) => s + r.total, 0) / results.length).toFixed(1);
console.log(`Average Score: ${avgScore}/100\n`);

// Grade distribution
const gradeCount = { A: 0, B: 0, C: 0, D: 0, F: 0 };
for (const r of results) gradeCount[r.grade]++;
console.log('Grade Distribution:');
console.log(`  A (85-100): ${gradeCount.A} plans`);
console.log(`  B (70-84):  ${gradeCount.B} plans`);
console.log(`  C (55-69):  ${gradeCount.C} plans`);
console.log(`  D (40-54):  ${gradeCount.D} plans`);
console.log(`  F (0-39):   ${gradeCount.F} plans`);
console.log('');

// Bottom 10 (weakest)
console.log('--- BOTTOM 10 (Weakest Lesson Plans) ---\n');
for (const r of results.slice(0, 10)) {
  console.log(`  [${r.id}] ${r.title}`);
  console.log(`    Score: ${r.total}/100 (Grade: ${r.grade})`);
  const weakest = Object.entries(r.scores)
    .filter(([, v]) => v === 0)
    .map(([k]) => k);
  if (weakest.length > 0) {
    console.log(`    Missing: ${weakest.join(', ')}`);
  }
  console.log('');
}

// Top 10 (strongest)
console.log('--- TOP 10 (Strongest Lesson Plans) ---\n');
for (const r of results.slice(-10).reverse()) {
  console.log(`  [${r.id}] ${r.title} — ${r.total}/100 (${r.grade})`);
}
console.log('');

// Area averages
console.log('--- AVERAGE SCORE BY AREA ---\n');
const areaScores = new Map();
for (const r of results) {
  if (!areaScores.has(r.area)) areaScores.set(r.area, []);
  areaScores.get(r.area).push(r.total);
}

const areaOrder = [...areaScores.entries()].sort((a, b) => {
  const romanOrder = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV'];
  return romanOrder.indexOf(a[0]) - romanOrder.indexOf(b[0]);
});

for (const [area, scores] of areaOrder) {
  const avg = (scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(0);
  const areaInfo = acs.areas.find(a => a.number === area);
  const name = areaInfo ? areaInfo.name.substring(0, 40) : '';
  const bar = '█'.repeat(Math.round(avg / 5)) + '░'.repeat(20 - Math.round(avg / 5));
  console.log(`  Area ${area.padEnd(5)} ${bar} ${avg.padStart(3)}%  ${name}`);
}
console.log('');

// Dimension-level gaps
console.log('--- DIMENSION GAPS (Lowest average scores) ---\n');
const dimensionTotals = {};
const dimensionMaxes = {
  teachingScript: 20,
  keyTeachingPoints: 15,
  commonErrors: 10,
  completionStandards: 20,
  diagrams: 10,
  instructorNotes: 10,
  safety: 5,
  readiness: 5,
  overview: 5
};

for (const r of results) {
  for (const [dim, val] of Object.entries(r.scores)) {
    if (!dimensionTotals[dim]) dimensionTotals[dim] = 0;
    dimensionTotals[dim] += val;
  }
}

const dimAvgs = Object.entries(dimensionTotals)
  .map(([dim, total]) => ({
    dim,
    avg: total / results.length,
    max: dimensionMaxes[dim],
    pct: ((total / results.length) / dimensionMaxes[dim] * 100).toFixed(0)
  }))
  .sort((a, b) => a.pct - b.pct);

for (const d of dimAvgs) {
  console.log(`  ${d.dim.padEnd(22)} ${d.avg.toFixed(1).padStart(5)} / ${d.max}  (${d.pct}%)`);
}
