/**
 * Master script: Applies all SVG diagrams + safety items to lesson plans.
 * Run: node scripts/svg-diagrams/index.cjs
 */
const fs = require('fs');
const path = require('path');
const LP_PATH = path.join(__dirname, '..', '..', 'src', 'lessonPlansData.json');
const lp = JSON.parse(fs.readFileSync(LP_PATH, 'utf-8'));

function findPlan(id) { return lp.lessonPlans.find(p => p.id === id); }
function addDiagram(id, diagram) {
  const plan = findPlan(id);
  if (!plan) { console.log(`  ⚠️ Plan ${id} not found`); return; }
  if (!plan.diagrams) plan.diagrams = [];
  plan.diagrams.push(diagram);
}
function addSafety(id, items) {
  const plan = findPlan(id);
  if (!plan) return;
  if (!plan.safetyConsiderations) plan.safetyConsiderations = [];
  plan.safetyConsiderations.push(...items);
}
function addNotes(id, items) {
  const plan = findPlan(id);
  if (!plan) return;
  if (!plan.instructorNotes) plan.instructorNotes = [];
  plan.instructorNotes.push(...items);
}

// Load all batch files
const batches = fs.readdirSync(__dirname)
  .filter(f => f.startsWith('batch') && f.endsWith('.cjs'))
  .sort();

for (const batch of batches) {
  console.log(`Loading ${batch}...`);
  const apply = require(path.join(__dirname, batch));
  apply({ addDiagram, addSafety, addNotes });
}

fs.writeFileSync(LP_PATH, JSON.stringify(lp, null, 2) + '\n', 'utf-8');
console.log('\n✅ All SVG diagrams and enhancements written.');
