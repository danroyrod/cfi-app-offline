/**
 * Audio Lesson Quality Audit (#4)
 * 
 * Checks the lesson plan data that feeds audio generation for:
 * - Missing teaching script content that would result in empty/thin audio
 * - Aviation abbreviations that need pronunciation guidance
 * - Completion standards/tolerances that might be skipped in lite mode
 * - Overall "speakability" of content
 * 
 * Run: node scripts/audit-audio-quality.cjs
 */

const lp = require('../src/lessonPlansData.json');
const plans = lp.lessonPlans;

// Aviation abbreviations that TTS typically mispronounces
const AVIATION_ABBREVS = [
  'Vx', 'Vy', 'Vso', 'Vs1', 'Vs0', 'Va', 'Vne', 'Vno', 'Vfe', 'Vle', 'Vr', 'Vlof',
  'KIAS', 'KCAS', 'KTAS', 'AGL', 'MSL', 'VFR', 'IFR', 'VMC', 'IMC',
  'ATC', 'ATIS', 'CTAF', 'UNICOM', 'NOTAM', 'METAR', 'TAF', 'SIGMET', 'AIRMET',
  'POH', 'AFM', 'ACS', 'PTS', 'DPE', 'CFI', 'CFII', 'MEI',
  'ADM', 'CRM', 'SRM', 'PAVE', 'IMSAFE', 'FRAT',
  'RPM', 'MP', 'CHT', 'EGT', 'TAS', 'CAS',
  'NDB', 'VOR', 'ILS', 'GPS', 'RNAV', 'LPV', 'LNAV', 'VNAV',
  'AOA', 'CG', 'MAC', 'P-factor'
];

console.log('=== Audio Lesson Quality Audit ===\n');
console.log(`Total Lesson Plans: ${plans.length}\n`);

// --- Check 1: Plans with thin/missing teaching script content ---
console.log('--- CHECK 1: Plans with Thin Teaching Content ---');
console.log('(Plans that would produce thin/empty audio lessons)\n');

const thinPlans = [];
for (const plan of plans) {
  const phases = plan.teachingScript || [];
  const totalKeyPoints = phases.reduce((s, p) => s + (p.keyPoints?.length || 0), 0);
  const totalActions = phases.reduce((s, p) => s + (p.instructorActions?.length || 0), 0);
  
  if (totalKeyPoints < 5 || totalActions < 3) {
    thinPlans.push({
      id: plan.id,
      title: plan.title,
      phases: phases.length,
      keyPoints: totalKeyPoints,
      actions: totalActions
    });
  }
}

if (thinPlans.length === 0) {
  console.log('✅ All plans have sufficient content for audio generation.\n');
} else {
  console.log(`⚠️  ${thinPlans.length} plan(s) may produce thin audio:\n`);
  for (const p of thinPlans) {
    console.log(`  [${p.id}] ${p.title}`);
    console.log(`    Phases: ${p.phases}, Key Points: ${p.keyPoints}, Actions: ${p.actions}`);
  }
  console.log('');
}

// --- Check 2: Aviation abbreviations in content ---
console.log('--- CHECK 2: Aviation Abbreviations in Content ---');
console.log('(Terms that TTS may mispronounce without guidance)\n');

const abbrevUsage = new Map(); // abbreviation -> count of plans using it

for (const plan of plans) {
  const allText = [
    plan.overview || '',
    ...(plan.keyTeachingPoints || []),
    ...(plan.commonErrors || []),
    ...(plan.teachingScript || []).flatMap(p => [...(p.keyPoints || []), ...(p.instructorActions || [])]),
    ...(plan.completionStandards || []).map(cs => cs.standard),
    ...(plan.instructorNotes || []),
  ].join(' ');

  for (const abbrev of AVIATION_ABBREVS) {
    // Case-sensitive match for abbreviations
    const regex = new RegExp(`\\b${abbrev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (regex.test(allText)) {
      abbrevUsage.set(abbrev, (abbrevUsage.get(abbrev) || 0) + 1);
    }
  }
}

const sortedAbbrevs = [...abbrevUsage.entries()].sort((a, b) => b[1] - a[1]);
console.log(`Found ${sortedAbbrevs.length} aviation abbreviations used across lesson plans:`);
console.log('  Most common (would benefit from pronunciation rules):');
for (const [abbrev, count] of sortedAbbrevs.slice(0, 20)) {
  console.log(`    ${abbrev.padEnd(10)} used in ${count} plan(s)`);
}
console.log('');

// --- Check 3: Completion standards with tolerances ---
console.log('--- CHECK 3: Tolerances for Audio ---');
console.log('(Standards with specific tolerances that must be spoken clearly)\n');

let totalStandards = 0;
let standardsWithTolerance = 0;
const tolerancePatterns = [];

for (const plan of plans) {
  for (const cs of (plan.completionStandards || [])) {
    totalStandards++;
    if (cs.tolerance && cs.tolerance.trim()) {
      standardsWithTolerance++;
    }
    // Also check for inline tolerances in the standard text
    const stdText = cs.standard || '';
    const inlineTol = stdText.match(/[±+\-]\d+\s*(?:knots?|feet|ft|degrees?|°|kts|mph)/gi);
    if (inlineTol) {
      tolerancePatterns.push(...inlineTol);
    }
  }
}

console.log(`Total completion standards: ${totalStandards}`);
console.log(`Standards with explicit tolerance field: ${standardsWithTolerance} (${(standardsWithTolerance/totalStandards*100).toFixed(0)}%)`);
console.log(`Unique inline tolerance patterns found: ${[...new Set(tolerancePatterns)].length}`);
console.log('  Common patterns:');
const patternCount = {};
for (const p of tolerancePatterns) {
  const normalized = p.toLowerCase().trim();
  patternCount[normalized] = (patternCount[normalized] || 0) + 1;
}
const topPatterns = Object.entries(patternCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
for (const [pat, count] of topPatterns) {
  console.log(`    "${pat}" — ${count} occurrence(s)`);
}
console.log('');

// --- Check 4: Lite mode content completeness ---
console.log('--- CHECK 4: Lite Audio Mode Coverage ---');
console.log('(Checks what content is available for the lite/summary audio mode)\n');

let plansWithObjectives = 0;
let plansWithKTP = 0;
let plansWithStandards = 0;
let plansAllThree = 0;

for (const plan of plans) {
  const hasObj = plan.objectives && plan.objectives.length > 0;
  const hasKTP = plan.keyTeachingPoints && plan.keyTeachingPoints.length > 0;
  const hasStd = plan.completionStandards && plan.completionStandards.length > 0;

  if (hasObj) plansWithObjectives++;
  if (hasKTP) plansWithKTP++;
  if (hasStd) plansWithStandards++;
  if (hasObj && hasKTP && hasStd) plansAllThree++;
}

console.log(`Plans with objectives: ${plansWithObjectives}/${plans.length}`);
console.log(`Plans with key teaching points: ${plansWithKTP}/${plans.length}`);
console.log(`Plans with completion standards: ${plansWithStandards}/${plans.length}`);
console.log(`Plans with ALL three (ideal for lite mode): ${plansAllThree}/${plans.length}`);
console.log('');

if (plansAllThree < plans.length) {
  console.log('Plans missing content for lite mode:');
  for (const plan of plans) {
    const missing = [];
    if (!plan.objectives || plan.objectives.length === 0) missing.push('objectives');
    if (!plan.keyTeachingPoints || plan.keyTeachingPoints.length === 0) missing.push('keyTeachingPoints');
    if (!plan.completionStandards || plan.completionStandards.length === 0) missing.push('completionStandards');
    if (missing.length > 0) {
      console.log(`  [${plan.id}] ${plan.title} — missing: ${missing.join(', ')}`);
    }
  }
}
console.log('');

// --- Summary ---
console.log('=== AUDIO QUALITY SUMMARY ===\n');
console.log(`Plans ready for full audio: ${plans.length - thinPlans.length}/${plans.length}`);
console.log(`Plans ready for lite audio: ${plansAllThree}/${plans.length}`);
console.log(`Aviation abbreviations needing pronunciation: ${sortedAbbrevs.length}`);
console.log(`Tolerance patterns to speak clearly: ${[...new Set(tolerancePatterns)].length}`);
