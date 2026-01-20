#!/usr/bin/env node
/**
 * Check status of Area VII lessons
 * Usage: node scripts/check_status.js
 */

const data = require('../src/lessonPlansData.json');

const areaVII = data.lessonPlans
  .filter(l => l.areaNumber === 'VII')
  .sort((a, b) => a.taskLetter.localeCompare(b.taskLetter));

console.log('=== AREA VII LESSON STATUS ===\n');

let complete = 0;
let partial = 0;
let pending = 0;

areaVII.forEach(lp => {
  const actions = lp.teachingScript.reduce((s, p) => s + p.instructorActions.length, 0);
  const diagrams = lp.diagrams.length;
  const briefing = lp.teachingScript[0].instructorActions.length;
  const hasEnhanced = lp.teachingScript[0].phase.includes('Introduction and Ground Briefing');
  
  const status = hasEnhanced && actions >= 45 && diagrams >= 2 ? '✅' : 
                 hasEnhanced && actions >= 40 ? '⚠️' : '⏳';
  
  if (status === '✅') complete++;
  else if (status === '⚠️') partial++;
  else pending++;
  
  console.log(`${lp.id}: ${status} A:${actions} D:${diagrams} B:${briefing}`);
});

console.log(`\n✅ Complete: ${complete}/15`);
console.log(`⚠️ Partial: ${partial}/15`);
console.log(`⏳ Pending: ${pending}/15`);
