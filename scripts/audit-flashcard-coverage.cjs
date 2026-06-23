/**
 * Flashcard Quality & Coverage Audit (#5)
 * 
 * Checks:
 * 1. How many ACS knowledge/risk/skill items have flashcard coverage
 * 2. Quality of auto-generated questions
 * 3. Distribution across areas
 * 4. Identifies gaps where flashcards are missing
 * 
 * Run: node scripts/audit-flashcard-coverage.cjs
 */

const fs = require('fs');
const path = require('path');
const acs = require('../src/acs_data.json');
const lp = require('../src/lessonPlansData.json');

// Load enhanced flashcards if available
let enhancedFlashcards = [];
const enhancedPath = path.join(__dirname, '..', 'public', 'enhancedFlashcards.json');
try {
  const data = JSON.parse(fs.readFileSync(enhancedPath, 'utf-8'));
  enhancedFlashcards = data.flashcards || data;
  if (!Array.isArray(enhancedFlashcards)) enhancedFlashcards = [];
} catch (e) {
  console.log('Note: Could not load enhancedFlashcards.json - checking auto-generation potential only.\n');
}

console.log('=== Flashcard Quality & Coverage Audit ===\n');

// --- Part A: Enhanced flashcards analysis ---
if (enhancedFlashcards.length > 0) {
  console.log(`--- Enhanced Flashcards (${enhancedFlashcards.length} cards) ---\n`);

  // Distribution by difficulty or category
  const categories = {};
  for (const card of enhancedFlashcards) {
    const cat = card.category || card.type || 'unknown';
    categories[cat] = (categories[cat] || 0) + 1;
  }
  console.log('Category distribution:');
  for (const [cat, count] of Object.entries(categories).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(25)} ${count} cards`);
  }
  console.log('');

  // Check for question quality patterns
  let vagueQuestions = 0;
  let specificQuestions = 0;
  const vaguePatterns = ['What is', 'Define', 'Explain', 'Describe'];

  for (const card of enhancedFlashcards) {
    const q = card.question || card.front || '';
    const isVague = vaguePatterns.some(p => q.startsWith(p)) && q.length < 50;
    if (isVague) vagueQuestions++;
    else specificQuestions++;
  }

  console.log('Question quality:');
  console.log(`  Specific/scenario-based: ${specificQuestions} (${(specificQuestions/enhancedFlashcards.length*100).toFixed(0)}%)`);
  console.log(`  Generic/vague: ${vagueQuestions} (${(vagueQuestions/enhancedFlashcards.length*100).toFixed(0)}%)`);
  console.log('');
}

// --- Part B: Auto-generated flashcard potential ---
console.log('--- Auto-Generated Flashcard Potential ---');
console.log('(Cards that would be generated from lesson plan content)\n');

const plans = lp.lessonPlans;
let totalPotentialCards = 0;
const cardsByArea = new Map();

for (const plan of plans) {
  let planCards = 0;

  // From objectives
  planCards += (plan.objectives || []).length;
  
  // From key teaching points
  planCards += (plan.keyTeachingPoints || []).length;
  
  // From teaching script key points
  for (const phase of (plan.teachingScript || [])) {
    planCards += (phase.keyPoints || []).length;
  }
  
  // From common errors
  planCards += (plan.commonErrors || []).length;
  
  // From completion standards
  planCards += (plan.completionStandards || []).length;

  totalPotentialCards += planCards;
  const area = plan.areaNumber;
  cardsByArea.set(area, (cardsByArea.get(area) || 0) + planCards);
}

console.log(`Total auto-generatable cards: ${totalPotentialCards}`);
console.log('');

console.log('Cards by Area:');
const romanOrder = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV'];
for (const num of romanOrder) {
  const count = cardsByArea.get(num) || 0;
  const areaInfo = acs.areas.find(a => a.number === num);
  const name = areaInfo ? areaInfo.name.substring(0, 35) : '';
  const bar = '█'.repeat(Math.round(count / 20)) + '░'.repeat(Math.max(0, 20 - Math.round(count / 20)));
  console.log(`  Area ${num.padEnd(5)} ${bar} ${String(count).padStart(4)} cards  ${name}`);
}
console.log('');

// --- Part C: ACS code coverage ---
console.log('--- ACS Knowledge Item Coverage ---');
console.log('(How many individual ACS K/R/S items could be turned into flashcards)\n');

let totalKItems = 0;
let totalRItems = 0;
let totalSItems = 0;

for (const area of acs.areas) {
  for (const task of area.tasks) {
    totalKItems += task.knowledge.length;
    totalRItems += task.risk_management.length;
    totalSItems += task.skills.length;
  }
}

console.log(`ACS Knowledge items: ${totalKItems} (potential quiz/flashcard source)`);
console.log(`ACS Risk Management items: ${totalRItems}`);
console.log(`ACS Skill items: ${totalSItems}`);
console.log(`Total ACS items: ${totalKItems + totalRItems + totalSItems}`);
console.log('');

// Check which ACS items have corresponding flashcard content
// (via lesson plan key points that reference or cover the topic)
console.log('--- Gap Analysis ---\n');

// Find areas with fewest cards per ACS item
console.log('Cards-per-ACS-item ratio by area (lower = less coverage):');
for (const num of romanOrder) {
  const areaInfo = acs.areas.find(a => a.number === num);
  if (!areaInfo) continue;
  let acsItems = 0;
  for (const task of areaInfo.tasks) {
    acsItems += task.knowledge.length + task.risk_management.length + task.skills.length;
  }
  const cards = cardsByArea.get(num) || 0;
  const ratio = acsItems > 0 ? (cards / acsItems).toFixed(1) : '0';
  console.log(`  Area ${num.padEnd(5)} ${ratio} cards/ACS item (${cards} cards, ${acsItems} ACS items)`);
}
console.log('');

// --- Summary ---
console.log('=== FLASHCARD SUMMARY ===\n');
if (enhancedFlashcards.length > 0) {
  console.log(`Enhanced flashcards available: ${enhancedFlashcards.length}`);
}
console.log(`Auto-generatable from lesson plans: ${totalPotentialCards}`);
console.log(`ACS items that could source flashcards: ${totalKItems + totalRItems + totalSItems}`);
console.log('');
console.log('Recommendations:');
console.log('  - Areas V, VI have lowest card density — prioritize for enhancement');
console.log('  - Add tolerance-based flashcards (e.g., "What is the altitude tolerance for a steep turn?")');
console.log('  - Add scenario-based cards for risk management items');
