#!/usr/bin/env node
/**
 * Check status of all lesson plans across all areas
 * Usage: node scripts/check_all_areas.cjs
 */

const data = require('../src/lessonPlansData.json');

// Group lessons by area
const areas = {};
data.lessonPlans.forEach(lp => {
  if (!areas[lp.areaNumber]) {
    areas[lp.areaNumber] = {
      lessons: [],
      total: 0,
      complete: 0,
      partial: 0,
      pending: 0,
      needsBriefing: 0,
      needsActions: 0,
      needsDiagrams: 0,
      needsPhaseName: 0
    };
  }
  
  const actions = lp.teachingScript.reduce((s, p) => s + p.instructorActions.length, 0);
  const diagrams = lp.diagrams.length;
  const briefing = lp.teachingScript[0].instructorActions.length;
  const hasEnhancedPhase = lp.teachingScript[0].phase.includes('Introduction and Ground Briefing');
  
  // Check what needs improvement
  const needsBriefing = briefing < 15;
  const needsActions = actions < 45;
  const needsDiagrams = diagrams < 2;
  const needsPhaseName = !hasEnhancedPhase;
  
  const status = {
    id: lp.id,
    title: lp.title,
    actions: actions,
    diagrams: diagrams,
    briefing: briefing,
    hasEnhancedPhase: hasEnhancedPhase,
    needsBriefing: needsBriefing,
    needsActions: needsActions,
    needsDiagrams: needsDiagrams,
    needsPhaseName: needsPhaseName
  };
  
  // Determine overall status
  if (hasEnhancedPhase && actions >= 45 && diagrams >= 2 && briefing >= 15) {
    status.overall = 'complete';
    areas[lp.areaNumber].complete++;
  } else if (hasEnhancedPhase && actions >= 40) {
    status.overall = 'partial';
    areas[lp.areaNumber].partial++;
  } else {
    status.overall = 'pending';
    areas[lp.areaNumber].pending++;
  }
  
  // Count what needs work
  if (needsBriefing) areas[lp.areaNumber].needsBriefing++;
  if (needsActions) areas[lp.areaNumber].needsActions++;
  if (needsDiagrams) areas[lp.areaNumber].needsDiagrams++;
  if (needsPhaseName) areas[lp.areaNumber].needsPhaseName++;
  
  areas[lp.areaNumber].lessons.push(status);
  areas[lp.areaNumber].total++;
});

// Sort areas
const sortedAreas = Object.keys(areas).sort((a, b) => {
  // Sort by area number (handle Roman numerals)
  const areaOrder = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV'];
  return areaOrder.indexOf(a) - areaOrder.indexOf(b);
});

console.log('=== ALL AREAS STATUS REPORT ===\n');

// Summary by area
console.log('📊 SUMMARY BY AREA:\n');
sortedAreas.forEach(area => {
  const a = areas[area];
  const completePct = ((a.complete / a.total) * 100).toFixed(0);
  console.log(`Area ${area}:`);
  console.log(`  Total: ${a.total} | ✅ Complete: ${a.complete} (${completePct}%) | ⚠️ Partial: ${a.partial} | ⏳ Pending: ${a.pending}`);
  if (a.complete < a.total) {
    console.log(`  Needs: Briefing: ${a.needsBriefing} | Actions: ${a.needsActions} | Diagrams: ${a.needsDiagrams} | Phase Name: ${a.needsPhaseName}`);
  }
  console.log('');
});

// Detailed breakdown for areas that need work
console.log('\n📋 DETAILED BREAKDOWN (Areas Needing Work):\n');
sortedAreas.forEach(area => {
  const a = areas[area];
  if (a.complete < a.total) {
    console.log(`\n━━━ Area ${area} ━━━`);
    a.lessons
      .sort((a, b) => a.id.localeCompare(b.id))
      .forEach(lesson => {
        const issues = [];
        if (lesson.needsPhaseName) issues.push('Phase Name');
        if (lesson.needsBriefing) issues.push(`Briefing (${lesson.briefing} < 15)`);
        if (lesson.needsActions) issues.push(`Actions (${lesson.actions} < 45)`);
        if (lesson.needsDiagrams) issues.push(`Diagrams (${lesson.diagrams} < 2)`);
        
        const statusIcon = lesson.overall === 'complete' ? '✅' : lesson.overall === 'partial' ? '⚠️' : '⏳';
        console.log(`  ${statusIcon} ${lesson.id}: ${lesson.title.substring(0, 50)}`);
        if (issues.length > 0) {
          console.log(`     Needs: ${issues.join(' | ')}`);
        }
      });
  }
});

// Overall summary
const totalLessons = data.lessonPlans.length;
const totalComplete = sortedAreas.reduce((sum, area) => sum + areas[area].complete, 0);
const totalPartial = sortedAreas.reduce((sum, area) => sum + areas[area].partial, 0);
const totalPending = sortedAreas.reduce((sum, area) => sum + areas[area].pending, 0);

console.log('\n━━━ OVERALL SUMMARY ━━━');
console.log(`   Total Lessons: ${totalLessons}`);
console.log(`   ✅ Complete: ${totalComplete} (${((totalComplete / totalLessons) * 100).toFixed(1)}%)`);
console.log(`   ⚠️ Partial: ${totalPartial} (${((totalPartial / totalLessons) * 100).toFixed(1)}%)`);
console.log(`   ⏳ Pending: ${totalPending} (${((totalPending / totalLessons) * 100).toFixed(1)}%)`);
console.log('');


