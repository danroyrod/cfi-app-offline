#!/usr/bin/env node
/**
 * Enhance LP-I-B: Learning Process
 * Checks quality, adds diagrams if missing, ensures no duplicates
 * Usage: node scripts/enhance_lp_i_b.cjs
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find LP-I-B
const lp = data.lessonPlans.find(l => l.id === 'LP-I-B');

if (!lp) {
  console.log('Error: LP-I-B not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Count total actions
const totalActions = lp.teachingScript.reduce((sum, phase) => sum + phase.instructorActions.length, 0);
console.log(`Total actions: ${totalActions}`);
console.log(`Current diagrams: ${lp.diagrams.length}`);

// Check for duplicates in instructor actions
const allActions = [];
let duplicates = [];
lp.teachingScript.forEach((phase, phaseIdx) => {
  phase.instructorActions.forEach((action, actionIdx) => {
    const actionText = action.toLowerCase().substring(0, 50);
    if (allActions.includes(actionText)) {
      duplicates.push({ phase: phaseIdx + 1, action: actionIdx + 1, text: action.substring(0, 80) });
    }
    allActions.push(actionText);
  });
});

if (duplicates.length > 0) {
  console.log(`\n⚠️ Found ${duplicates.length} potential duplicate actions:`);
  duplicates.forEach(d => console.log(`   Phase ${d.phase}, Action ${d.action}: ${d.text}...`));
} else {
  console.log('✅ No duplicate actions found');
}

// Check key points for duplicates
const allKeyPoints = [];
let duplicateKeyPoints = [];
lp.teachingScript.forEach((phase, phaseIdx) => {
  phase.keyPoints.forEach((kp, kpIdx) => {
    const kpText = kp.toLowerCase().substring(0, 40);
    if (allKeyPoints.includes(kpText)) {
      duplicateKeyPoints.push({ phase: phaseIdx + 1, kp: kpIdx + 1, text: kp.substring(0, 60) });
    }
    allKeyPoints.push(kpText);
  });
});

if (duplicateKeyPoints.length > 0) {
  console.log(`\n⚠️ Found ${duplicateKeyPoints.length} potential duplicate key points:`);
  duplicateKeyPoints.forEach(d => console.log(`   Phase ${d.phase}, Key Point ${d.kp}: ${d.text}...`));
} else {
  console.log('✅ No duplicate key points found');
}

// Add diagrams if missing (ground lesson - needs conceptual diagrams)
if (lp.diagrams.length < 2) {
  console.log(`\n📊 Adding diagrams (currently ${lp.diagrams.length}, need 2+)...`);
  
  lp.diagrams = [
    {
      "title": "Three Domains of Learning",
      "description": "Visual representation of the three interconnected domains of learning: Cognitive (knowing), Affective (feeling/judging), and Psychomotor (doing). All three must be developed simultaneously in flight training.",
      "type": "basic",
      "asciiArt": "     COGNITIVE\n        /\\\n       /  \\\n      /    \\\n     /      \\\n    /        \\\n   /          \\\n  /            \\\n /              \\\n/________________\\\n\\                /\n \\              /\n  \\            /\n   \\          /\n    \\        /\n     \\      /\n      \\    /\n       \\  /\n        \\/\n   AFFECTIVE    PSYCHOMOTOR",
      "keyPoints": [
        "Cognitive domain involves knowledge, facts, and understanding",
        "Affective domain involves attitudes, values, and judgment",
        "Psychomotor domain involves physical skills and muscle memory",
        "All three domains are interconnected and must be developed together",
        "Most flight training requires development in all three domains simultaneously"
      ]
    },
    {
      "title": "Laws of Learning - REEPIR",
      "description": "Memory aid and visual representation of the six laws of learning: Readiness, Exercise, Effect, Primacy, Intensity, and Recency. These principles govern how learning actually works.",
      "type": "basic",
      "asciiArt": "REEPIR - Laws of Learning\n\nR - Readiness: Student must be ready to learn\nE - Exercise: Practice strengthens learning\nE - Effect: Learning strengthened by pleasant feelings\nP - Primacy: First learning is strongest\nI - Intensity: Vivid experiences are better remembered\nR - Recency: Most recent learning is best remembered\n\n[Visual: Pyramid showing Primacy at base, Recency at top]",
      "keyPoints": [
        "Readiness: Ensure student is prepared and motivated before teaching",
        "Exercise: Repetition and practice are essential for skill development",
        "Effect: Positive reinforcement strengthens learning more than punishment",
        "Primacy: First impressions are lasting - teach correctly the FIRST time",
        "Intensity: Vivid, realistic experiences create stronger memories",
        "Recency: Review recently learned material to maintain retention"
      ]
    },
    {
      "title": "Learning Plateau Curve",
      "description": "Graph showing the typical learning curve with plateaus. Understanding this helps instructors recognize when students hit learning plateaus and how to help them overcome these periods of apparent stagnation.",
      "type": "basic",
      "asciiArt": "Learning Progress Over Time\n\nPerformance\n    |\n    |     /---\\\n    |    /     \\---\\\n    |   /           \\---\\\n    |  /                 \\---\\\n    | /                       \\---\\\n    |/                             \\---\\\n    +------------------------------------> Time\n         Plateau  Plateau  Plateau\n\nPlateaus are normal - progress continues at subconscious level",
      "keyPoints": [
        "Learning plateaus are normal periods when progress seems to stop",
        "Progress often continues at subconscious level during plateaus",
        "Plateaus may indicate need for different teaching approach",
        "Overcoming plateaus requires patience and varied practice",
        "Recognizing plateaus prevents instructor and student frustration"
      ]
    }
  ];
  
  console.log(`✅ Added ${lp.diagrams.length} diagrams`);
}

// Verify total actions meet standard (45-55)
if (totalActions < 45) {
  console.log(`\n⚠️ Total actions (${totalActions}) below minimum (45). May need enhancement.`);
} else if (totalActions > 55) {
  console.log(`\n⚠️ Total actions (${totalActions}) above maximum (55). Consider if any can be consolidated.`);
} else {
  console.log(`✅ Total actions (${totalActions}) within standard range (45-55)`);
}

// Save
console.log('\nSaving lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`\n✅ LP-I-B analysis and enhancement complete`);
console.log(`   Phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);
console.log(`   Total actions: ${totalActions}`);
console.log(`   Diagrams: ${lp.diagrams.length}`);

// Verify JSON is valid
try {
  JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('✅ JSON validation passed');
} catch (e) {
  console.log('❌ JSON validation failed:', e.message);
  process.exit(1);
}
