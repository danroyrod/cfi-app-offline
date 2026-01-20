#!/usr/bin/env node
/**
 * Generic script to check and enhance a lesson plan
 * Usage: node scripts/check_and_enhance_lesson.cjs <LESSON_ID>
 * Example: node scripts/check_and_enhance_lesson.cjs LP-I-C
 */

const fs = require('fs');
const path = require('path');

const lessonId = process.argv[2];

if (!lessonId) {
  console.log('Usage: node scripts/check_and_enhance_lesson.cjs <LESSON_ID>');
  console.log('Example: node scripts/check_and_enhance_lesson.cjs LP-I-C');
  process.exit(1);
}

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log(`Loading lessonPlansData.json...`);
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find lesson
const lp = data.lessonPlans.find(l => l.id === lessonId);

if (!lp) {
  console.log(`Error: ${lessonId} not found`);
  process.exit(1);
}

console.log(`\n=== Analyzing ${lessonId}: ${lp.title} ===\n`);

// Check phase 1
const phase1 = lp.teachingScript[0];
const hasEnhancedPhase = phase1.phase.includes('Introduction and Ground Briefing');
const briefingActions = phase1.instructorActions.length;

console.log(`Phase 1: ${phase1.phase}`);
console.log(`Phase 1 actions: ${briefingActions} (need 15+)`);
console.log(`Has enhanced phase name: ${hasEnhancedPhase ? '✅' : '❌'}`);

// Count total actions
const totalActions = lp.teachingScript.reduce((sum, phase) => sum + phase.instructorActions.length, 0);
console.log(`Total actions: ${totalActions} (need 45-55)`);

// Check diagrams
console.log(`Diagrams: ${lp.diagrams.length} (need 2+)`);

// Check for duplicates in instructor actions
const allActions = [];
let duplicates = [];
lp.teachingScript.forEach((phase, phaseIdx) => {
  phase.instructorActions.forEach((action, actionIdx) => {
    const actionText = action.toLowerCase().substring(0, 50);
    if (allActions.includes(actionText)) {
      duplicates.push({ phase: phaseIdx + 1, phaseName: phase.phase, action: actionIdx + 1, text: action.substring(0, 80) });
    }
    allActions.push(actionText);
  });
});

if (duplicates.length > 0) {
  console.log(`\n⚠️ Found ${duplicates.length} potential duplicate actions:`);
  duplicates.forEach(d => console.log(`   Phase ${d.phase} (${d.phaseName}), Action ${d.action}: ${d.text}...`));
} else {
  console.log(`✅ No duplicate actions found`);
}

// Check key points for duplicates
const allKeyPoints = [];
let duplicateKeyPoints = [];
lp.teachingScript.forEach((phase, phaseIdx) => {
  phase.keyPoints.forEach((kp, kpIdx) => {
    const kpText = kp.toLowerCase().substring(0, 40);
    if (allKeyPoints.includes(kpText)) {
      duplicateKeyPoints.push({ phase: phaseIdx + 1, phaseName: phase.phase, kp: kpIdx + 1, text: kp.substring(0, 60) });
    }
    allKeyPoints.push(kpText);
  });
});

if (duplicateKeyPoints.length > 0) {
  console.log(`\n⚠️ Found ${duplicateKeyPoints.length} potential duplicate key points:`);
  duplicateKeyPoints.forEach(d => console.log(`   Phase ${d.phase} (${d.phaseName}), Key Point ${d.kp}: ${d.text}...`));
} else {
  console.log(`✅ No duplicate key points found`);
}

// Summary
console.log(`\n=== Summary ===`);
const issues = [];
if (!hasEnhancedPhase) issues.push('Phase name needs update');
if (briefingActions < 15) issues.push(`Briefing needs ${15 - briefingActions} more actions`);
if (totalActions < 45) issues.push(`Total actions below minimum (need ${45 - totalActions} more)`);
if (totalActions > 55 && lp.areaNumber !== 'I') issues.push(`Total actions above maximum (${totalActions})`);
if (lp.diagrams.length < 2) issues.push(`Need ${2 - lp.diagrams.length} more diagrams`);
if (duplicates.length > 0) issues.push(`${duplicates.length} duplicate actions`);
if (duplicateKeyPoints.length > 0) issues.push(`${duplicateKeyPoints.length} duplicate key points`);

if (issues.length === 0) {
  console.log(`✅ Lesson meets all quality standards!`);
} else {
  console.log(`⚠️ Issues found:`);
  issues.forEach(issue => console.log(`   - ${issue}`));
}

console.log(`\n✅ Analysis complete`);

// Verify JSON is valid
try {
  JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
  console.log(`❌ JSON validation failed: ${e.message}`);
  process.exit(1);
}
