#!/usr/bin/env node
/**
 * Check for duplicate instructions or points in lesson plans
 * Usage: node scripts/check_duplicates.cjs [LESSON_ID]
 */

const data = require('../src/lessonPlansData.json');

const lessonId = process.argv[2];

if (lessonId) {
  // Check specific lesson
  const lp = data.lessonPlans.find(l => l.id === lessonId);
  if (!lp) {
    console.log(`Error: ${lessonId} not found`);
    process.exit(1);
  }
  
  console.log(`Checking ${lp.id}: ${lp.title}\n`);
  
  // Check for duplicate instructor actions
  lp.teachingScript.forEach((phase, phaseIdx) => {
    const duplicates = [];
    const seen = new Set();
    
    phase.instructorActions.forEach((action, idx) => {
      // Normalize action (remove quotes, trim)
      const normalized = action.replace(/['"]/g, '').trim().toLowerCase();
      const key = normalized.substring(0, 50); // First 50 chars as key
      
      if (seen.has(key)) {
        duplicates.push({ phase: phaseIdx, index: idx, action: action.substring(0, 80) });
      } else {
        seen.add(key);
      }
    });
    
    if (duplicates.length > 0) {
      console.log(`Phase ${phaseIdx + 1} (${phase.phase}): ${duplicates.length} duplicate actions found`);
      duplicates.forEach(d => {
        console.log(`  - Action ${d.index + 1}: ${d.action}...`);
      });
    }
  });
  
  // Check for duplicate key points
  let hasKeyPointDuplicates = false;
  lp.teachingScript.forEach((phase, phaseIdx) => {
    const duplicates = [];
    const seen = new Set();
    
    phase.keyPoints.forEach((point, idx) => {
      const normalized = point.toLowerCase().trim();
      if (seen.has(normalized)) {
        duplicates.push({ phase: phaseIdx, index: idx, point });
        hasKeyPointDuplicates = true;
      } else {
        seen.add(normalized);
      }
    });
    
    if (duplicates.length > 0) {
      console.log(`Phase ${phaseIdx + 1} (${phase.phase}): ${duplicates.length} duplicate key points found`);
      duplicates.forEach(d => {
        console.log(`  - Point ${d.index + 1}: ${d.point}`);
      });
    }
  });
  
  if (!hasKeyPointDuplicates) {
    console.log('✅ No duplicates found');
  }
} else {
  // Check all lessons for common issues
  console.log('Checking all lessons for duplicates...\n');
  
  let totalIssues = 0;
  
  data.lessonPlans.forEach(lp => {
    let hasIssues = false;
    const issues = [];
    
    lp.teachingScript.forEach((phase, phaseIdx) => {
      // Check duplicate actions
      const actionSet = new Set();
      phase.instructorActions.forEach((action, idx) => {
        const key = action.replace(/['"]/g, '').trim().toLowerCase().substring(0, 50);
        if (actionSet.has(key)) {
          hasIssues = true;
          issues.push(`Phase ${phaseIdx + 1}: duplicate action at index ${idx + 1}`);
        }
        actionSet.add(key);
      });
      
      // Check duplicate key points
      const pointSet = new Set();
      phase.keyPoints.forEach((point, idx) => {
        const normalized = point.toLowerCase().trim();
        if (pointSet.has(normalized)) {
          hasIssues = true;
          issues.push(`Phase ${phaseIdx + 1}: duplicate key point at index ${idx + 1}`);
        }
        pointSet.add(normalized);
      });
    });
    
    if (hasIssues) {
      console.log(`⚠️ ${lp.id}: ${issues.length} issue(s)`);
      issues.forEach(i => console.log(`   ${i}`));
      totalIssues++;
    }
  });
  
  console.log(`\nTotal lessons with issues: ${totalIssues}/${data.lessonPlans.length}`);
}

