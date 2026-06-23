/**
 * ACS ↔ Lesson Plan Validation Script
 * 
 * Validates:
 * 1. Every acsReference in lesson plans points to a real ACS code
 * 2. Every ACS task (area+letter) has at least one corresponding lesson plan
 * 3. Reports orphaned references and missing coverage
 * 
 * Run: node scripts/validate-acs-coverage.cjs
 */

const acs = require('../src/acs_data.json');
const lp = require('../src/lessonPlansData.json');

const plans = lp.lessonPlans;

// --- Build ACS code index ---
// The ACS uses "FI." prefix for Area I and "AI." prefix for Areas II-XIV.
// Lesson plans may use "FI." universally. We normalize by stripping prefix and
// matching on the area.task.category portion, but also keep exact codes.
const allAcsCodes = new Set();
const normalizedAcsCodes = new Set(); // Without the FI./AI. prefix
const acsTaskMap = new Map(); // "I-A" => { area, task, codes: Set }

function normalizeCode(code) {
  // Strip FI. or AI. prefix to get the area-relative code (e.g., "III.A.K1")
  return code.replace(/^(FI|AI)\./, '');
}

for (const area of acs.areas) {
  for (const task of area.tasks) {
    const taskKey = `${area.number}-${task.letter}`;
    const taskCodes = new Set();

    for (const item of [...task.knowledge, ...task.risk_management, ...task.skills]) {
      allAcsCodes.add(item.code);
      normalizedAcsCodes.add(normalizeCode(item.code));
      taskCodes.add(item.code);
    }

    acsTaskMap.set(taskKey, {
      areaNumber: area.number,
      areaName: area.name,
      taskLetter: task.letter,
      taskName: task.name,
      codes: taskCodes
    });
  }
}

console.log('=== ACS ↔ Lesson Plan Validation Report ===\n');
console.log(`ACS Document: ${acs.document_number} (${acs.date})`);
if (acs.version_info) {
  console.log(`Last Verified: ${acs.version_info.last_verified}`);
}
console.log(`Total ACS Areas: ${acs.areas.length}`);
console.log(`Total ACS Tasks: ${acsTaskMap.size}`);
console.log(`Total ACS Codes (K/R/S): ${allAcsCodes.size}`);
console.log(`Total Lesson Plans: ${plans.length}`);
console.log('');

// --- Check 1: Validate acsReference codes in lesson plans ---
console.log('--- CHECK 1: Orphaned ACS References ---');
console.log('(Lesson plan references that do NOT match any ACS code)\n');

let orphanedCount = 0;
let prefixMismatchCount = 0;
const orphanedRefs = [];
const prefixMismatches = [];

for (const plan of plans) {
  if (plan.completionStandards && plan.completionStandards.length > 0) {
    for (const cs of plan.completionStandards) {
      if (cs.acsReference && cs.acsReference.trim() !== '') {
        const ref = cs.acsReference.trim();
        
        if (allAcsCodes.has(ref)) {
          // Exact match - all good
          continue;
        }
        
        // Check if it matches after normalizing prefix
        const normalizedRef = normalizeCode(ref);
        if (normalizedAcsCodes.has(normalizedRef)) {
          // It's a prefix mismatch (lesson plan uses FI. where ACS uses AI.)
          prefixMismatchCount++;
          prefixMismatches.push({
            lessonPlan: plan.id,
            reference: ref,
            expectedPrefix: plan.areaNumber === 'I' ? 'FI' : 'AI'
          });
        } else {
          // Truly orphaned - no match even after normalization
          orphanedCount++;
          orphanedRefs.push({
            lessonPlan: plan.id,
            title: plan.title,
            reference: ref,
            standard: cs.standard.substring(0, 80)
          });
        }
      }
    }
  }
}

if (prefixMismatchCount > 0) {
  console.log(`ℹ️  ${prefixMismatchCount} reference(s) have prefix mismatch (FI. vs AI.) but resolve correctly.`);
  console.log(`   These are valid references with a cosmetic prefix difference.\n`);
}

if (orphanedCount === 0) {
  console.log('✅ No truly orphaned references. All codes resolve to valid ACS items.\n');
} else {
  console.log(`⚠️  Found ${orphanedCount} truly orphaned reference(s) (no match even after normalization):\n`);
  for (const ref of orphanedRefs.slice(0, 30)) {
    console.log(`  [${ref.lessonPlan}] "${ref.reference}"`);
    console.log(`    Standard: ${ref.standard}`);
  }
  if (orphanedRefs.length > 30) {
    console.log(`  ... and ${orphanedRefs.length - 30} more`);
  }
  console.log('');
}

// --- Check 2: ACS Task Coverage ---
console.log('--- CHECK 2: ACS Task Coverage ---');
console.log('(ACS tasks with NO corresponding lesson plan)\n');

const coveredTasks = new Set();
for (const plan of plans) {
  const taskKey = `${plan.areaNumber}-${plan.taskLetter}`;
  coveredTasks.add(taskKey);
}

const uncoveredTasks = [];
for (const [taskKey, taskInfo] of acsTaskMap) {
  if (!coveredTasks.has(taskKey)) {
    uncoveredTasks.push(taskInfo);
  }
}

if (uncoveredTasks.length === 0) {
  console.log('✅ All ACS tasks have at least one lesson plan.\n');
} else {
  console.log(`⚠️  Found ${uncoveredTasks.length} ACS task(s) without lesson plans:\n`);
  for (const task of uncoveredTasks) {
    console.log(`  Area ${task.areaNumber} Task ${task.taskLetter}: ${task.taskName}`);
  }
  console.log('');
}

// --- Check 3: Lesson plans pointing to non-existent ACS tasks ---
console.log('--- CHECK 3: Lesson Plans with Invalid Area/Task ---');
console.log('(Lesson plans whose areaNumber+taskLetter do not match any ACS task)\n');

const invalidPlans = [];
for (const plan of plans) {
  const taskKey = `${plan.areaNumber}-${plan.taskLetter}`;
  if (!acsTaskMap.has(taskKey)) {
    invalidPlans.push({ id: plan.id, area: plan.areaNumber, task: plan.taskLetter, title: plan.title });
  }
}

if (invalidPlans.length === 0) {
  console.log('✅ All lesson plans map to valid ACS tasks.\n');
} else {
  console.log(`⚠️  Found ${invalidPlans.length} lesson plan(s) with invalid task mapping:\n`);
  for (const p of invalidPlans) {
    console.log(`  [${p.id}] Area ${p.area} Task ${p.task}: "${p.title}"`);
  }
  console.log('');
}

// --- Check 4: ACS code coverage depth ---
console.log('--- CHECK 4: ACS Code Coverage by Lesson Plans ---');
console.log('(How many individual ACS K/R/S codes are referenced in lesson plans)\n');

const referencedCodes = new Set();
for (const plan of plans) {
  if (plan.completionStandards) {
    for (const cs of plan.completionStandards) {
      if (cs.acsReference) {
        const normalized = normalizeCode(cs.acsReference.trim());
        referencedCodes.add(normalized);
      }
    }
  }
}

const totalCodes = normalizedAcsCodes.size;
const coveredCodes = [...referencedCodes].filter(c => normalizedAcsCodes.has(c)).length;
const coveragePercent = ((coveredCodes / totalCodes) * 100).toFixed(1);

console.log(`ACS codes referenced by lesson plans: ${coveredCodes} / ${totalCodes} (${coveragePercent}%)`);

// Find which areas have the least coverage
console.log('\nCoverage by Area:');
for (const area of acs.areas) {
  let areaTotalCodes = 0;
  let areaCoveredCodes = 0;
  for (const task of area.tasks) {
    for (const item of [...task.knowledge, ...task.risk_management, ...task.skills]) {
      areaTotalCodes++;
      if (referencedCodes.has(normalizeCode(item.code))) {
        areaCoveredCodes++;
      }
    }
  }
  const pct = areaTotalCodes > 0 ? ((areaCoveredCodes / areaTotalCodes) * 100).toFixed(0) : '0';
  const bar = '█'.repeat(Math.round(areaCoveredCodes / areaTotalCodes * 20)) + '░'.repeat(20 - Math.round(areaCoveredCodes / areaTotalCodes * 20));
  console.log(`  Area ${area.number.padEnd(5)} ${bar} ${pct.padStart(3)}% (${areaCoveredCodes}/${areaTotalCodes})`);
}

console.log('');

// --- Check 5: Coverage depth per task ---
console.log('--- CHECK 5: Task Plan Count ---');

const taskPlanCount = new Map();
for (const plan of plans) {
  const taskKey = `${plan.areaNumber}-${plan.taskLetter}`;
  taskPlanCount.set(taskKey, (taskPlanCount.get(taskKey) || 0) + 1);
}

const multiPlanTasks = [...taskPlanCount.entries()]
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]);

console.log(`Tasks with exactly 1 lesson plan: ${[...taskPlanCount.values()].filter(c => c === 1).length}`);
console.log(`Tasks with multiple lesson plans: ${multiPlanTasks.length}`);
console.log('');

// --- Summary ---
console.log('=== SUMMARY ===\n');
const totalIssues = orphanedCount + uncoveredTasks.length + invalidPlans.length;
if (totalIssues === 0) {
  console.log('✅ All checks passed. Lesson plans are aligned with ACS data.');
  if (prefixMismatchCount > 0) {
    console.log(`   Note: ${prefixMismatchCount} references use FI. prefix where ACS uses AI. (cosmetic only).`);
  }
  console.log(`   Code coverage: ${coveragePercent}% of ACS codes are referenced in completion standards.`);
} else {
  console.log(`⚠️  Found ${totalIssues} issue(s) to address:`);
  if (orphanedCount > 0) console.log(`  - ${orphanedCount} orphaned ACS reference(s) (code doesn't exist in ACS)`);
  if (uncoveredTasks.length > 0) console.log(`  - ${uncoveredTasks.length} ACS task(s) without lesson plans`);
  if (invalidPlans.length > 0) console.log(`  - ${invalidPlans.length} lesson plan(s) with invalid task mapping`);
}

// Exit with error code if issues found (useful for CI)
process.exit(totalIssues > 0 ? 1 : 0);
