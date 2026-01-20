#!/usr/bin/env node
/**
 * Check for duplicate instructions or points in a lesson
 * Usage: node scripts/check_duplicates.cjs <LESSON_ID>
 */

const data = require('../src/lessonPlansData.json');

const lessonId = process.argv[2];

if (!lessonId) {
  console.log('Usage: node scripts/check_duplicates.cjs <LESSON_ID>');
  console.log('Example: node scripts/check_duplicates.cjs LP-I-B');
  process.exit(1);
}

const lp = data.lessonPlans.find(l => l.id === lessonId);

if (!lp) {
  console.log(`Error: ${lessonId} not found`);
  process.exit(1);
}

console.log(`Checking ${lp.id}: ${lp.title}\n`);

// Check for duplicate instructor actions across all phases
const allActions = [];
lp.teachingScript.forEach((phase, phaseIdx) => {
  phase.instructorActions.forEach((action, actionIdx) => {
    // Extract the core message (remove action verb prefix)
    const coreMessage = action.split(": '")[1] || action;
    allActions.push({
      phase: phaseIdx + 1,
      phaseName: phase.phase,
      actionIdx: actionIdx + 1,
      action: action,
      core: coreMessage.substring(0, 100) // First 100 chars for comparison
    });
  });
});

// Find duplicates
const duplicates = [];
for (let i = 0; i < allActions.length; i++) {
  for (let j = i + 1; j < allActions.length; j++) {
    const similarity = calculateSimilarity(allActions[i].core, allActions[j].core);
    if (similarity > 0.7) { // 70% similarity threshold
      duplicates.push({
        action1: allActions[i],
        action2: allActions[j],
        similarity: similarity
      });
    }
  }
}

// Check for duplicate key points
const allKeyPoints = [];
lp.teachingScript.forEach((phase, phaseIdx) => {
  phase.keyPoints.forEach((point, pointIdx) => {
    allKeyPoints.push({
      phase: phaseIdx + 1,
      phaseName: phase.phase,
      pointIdx: pointIdx + 1,
      point: point
    });
  });
});

const duplicateKeyPoints = [];
for (let i = 0; i < allKeyPoints.length; i++) {
  for (let j = i + 1; j < allKeyPoints.length; j++) {
    const similarity = calculateSimilarity(allKeyPoints[i].point, allKeyPoints[j].point);
    if (similarity > 0.7) {
      duplicateKeyPoints.push({
        point1: allKeyPoints[i],
        point2: allKeyPoints[j],
        similarity: similarity
      });
    }
  }
}

// Report
if (duplicates.length > 0) {
  console.log('⚠️  DUPLICATE INSTRUCTOR ACTIONS FOUND:');
  duplicates.forEach(dup => {
    console.log(`\n  Phase ${dup.action1.phase} (${dup.action1.phaseName}), Action ${dup.action1.actionIdx}:`);
    console.log(`    "${dup.action1.action.substring(0, 80)}..."`);
    console.log(`  Phase ${dup.action2.phase} (${dup.action2.phaseName}), Action ${dup.action2.actionIdx}:`);
    console.log(`    "${dup.action2.action.substring(0, 80)}..."`);
    console.log(`  Similarity: ${(dup.similarity * 100).toFixed(0)}%`);
  });
} else {
  console.log('✅ No duplicate instructor actions found');
}

if (duplicateKeyPoints.length > 0) {
  console.log('\n⚠️  DUPLICATE KEY POINTS FOUND:');
  duplicateKeyPoints.forEach(dup => {
    console.log(`\n  Phase ${dup.point1.phase} (${dup.point1.phaseName}), Point ${dup.point1.pointIdx}:`);
    console.log(`    "${dup.point1.point}"`);
    console.log(`  Phase ${dup.point2.phase} (${dup.point2.phaseName}), Point ${dup.point2.pointIdx}:`);
    console.log(`    "${dup.point2.point}"`);
    console.log(`  Similarity: ${(dup.similarity * 100).toFixed(0)}%`);
  });
} else {
  console.log('✅ No duplicate key points found');
}

if (duplicates.length === 0 && duplicateKeyPoints.length === 0) {
  console.log('\n✅ No duplicates found - lesson is clean!');
}

function calculateSimilarity(str1, str2) {
  // Simple similarity based on common words
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}
