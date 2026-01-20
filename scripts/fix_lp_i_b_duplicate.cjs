#!/usr/bin/env node
/**
 * Fix duplicate key point in LP-I-B
 * Remove Primacy from Phase 1 key points (it belongs in Phase 4)
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lp = data.lessonPlans.find(l => l.id === 'LP-I-B');

if (!lp) {
  console.log('Error: LP-I-B not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);

// Remove the duplicate Primacy key point from Phase 1
const phase1 = lp.teachingScript[0];
const originalLength = phase1.keyPoints.length;

phase1.keyPoints = phase1.keyPoints.filter(point => 
  !point.includes('First learning is strongest (Primacy)')
);

if (phase1.keyPoints.length < originalLength) {
  console.log(`✅ Removed duplicate key point from Phase 1`);
  console.log(`   Key points: ${originalLength} → ${phase1.keyPoints.length}`);
} else {
  console.log('⚠️  Duplicate key point not found - may have already been removed');
}

// Save
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ Saved changes');

// Verify JSON
try {
  JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('✅ JSON validation passed');
} catch (e) {
  console.log('❌ JSON validation failed:', e.message);
  process.exit(1);
}
