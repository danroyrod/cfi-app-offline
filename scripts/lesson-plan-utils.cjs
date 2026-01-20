#!/usr/bin/env node
/**
 * Unified Lesson Plan Utilities
 * Combines functionality from multiple scripts into one tool
 * 
 * Usage:
 *   node scripts/lesson-plan-utils.cjs verify              - Verify JSON validity
 *   node scripts/lesson-plan-utils.cjs status [AREA]       - Check lesson status (all areas or specific area)
 *   node scripts/lesson-plan-utils.cjs duplicates [ID]    - Check for duplicates (all lessons or specific lesson)
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

// Area order for sorting
const AREA_ORDER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV'];

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    console.error('❌ Failed to load JSON:', e.message);
    process.exit(1);
  }
}

function verifyJSON() {
  console.log('Verifying JSON file...\n');
  
  try {
    const data = loadData();
    console.log('✅ JSON is valid');
    console.log(`   Total lessons: ${data.lessonPlans.length}`);
    
    const stats = fs.statSync(jsonPath);
    console.log(`   File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  } catch (e) {
    console.log('❌ JSON is invalid:');
    console.log(`   ${e.message}`);
    if (e.message.includes('position')) {
      const match = e.message.match(/position (\d+)/);
      if (match) {
        const pos = parseInt(match[1]);
        const content = fs.readFileSync(jsonPath, 'utf8');
        const line = content.substring(0, pos).split('\n').length;
        console.log(`   Line: ${line}`);
      }
    }
    process.exit(1);
  }
}

function checkStatus(areaFilter = null) {
  const data = loadData();
  
  // Group lessons by area
  const areas = {};
  data.lessonPlans.forEach(lp => {
    if (areaFilter && lp.areaNumber !== areaFilter) return;
    
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
    return AREA_ORDER.indexOf(a) - AREA_ORDER.indexOf(b);
  });
  
  if (areaFilter) {
    console.log(`=== AREA ${areaFilter} LESSON STATUS ===\n`);
    const a = areas[areaFilter];
    if (a) {
      a.lessons
        .sort((a, b) => a.id.localeCompare(b.id))
        .forEach(lesson => {
          const statusIcon = lesson.overall === 'complete' ? '✅' : lesson.overall === 'partial' ? '⚠️' : '⏳';
          console.log(`${lesson.id}: ${statusIcon} A:${lesson.actions} D:${lesson.diagrams} B:${lesson.briefing}`);
        });
      console.log(`\n✅ Complete: ${a.complete}/${a.total}`);
      console.log(`⚠️ Partial: ${a.partial}/${a.total}`);
      console.log(`⏳ Pending: ${a.pending}/${a.total}`);
    } else {
      console.log(`No lessons found for Area ${areaFilter}`);
    }
  } else {
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
  }
}

function checkDuplicates(lessonId = null) {
  const data = loadData();
  
  if (lessonId) {
    // Check specific lesson
    const lp = data.lessonPlans.find(l => l.id === lessonId);
    if (!lp) {
      console.log(`Error: ${lessonId} not found`);
      process.exit(1);
    }
    
    console.log(`Checking ${lp.id}: ${lp.title}\n`);
    
    let hasIssues = false;
    
    // Check for duplicate instructor actions
    lp.teachingScript.forEach((phase, phaseIdx) => {
      const duplicates = [];
      const seen = new Set();
      
      phase.instructorActions.forEach((action, idx) => {
        const normalized = action.replace(/['"]/g, '').trim().toLowerCase();
        const key = normalized.substring(0, 50);
        
        if (seen.has(key)) {
          duplicates.push({ phase: phaseIdx, index: idx, action: action.substring(0, 80) });
        } else {
          seen.add(key);
        }
      });
      
      if (duplicates.length > 0) {
        hasIssues = true;
        console.log(`Phase ${phaseIdx + 1} (${phase.phase}): ${duplicates.length} duplicate actions found`);
        duplicates.forEach(d => {
          console.log(`  - Action ${d.index + 1}: ${d.action}...`);
        });
      }
    });
    
    // Check for duplicate key points
    lp.teachingScript.forEach((phase, phaseIdx) => {
      const duplicates = [];
      const seen = new Set();
      
      phase.keyPoints.forEach((point, idx) => {
        const normalized = point.toLowerCase().trim();
        if (seen.has(normalized)) {
          duplicates.push({ phase: phaseIdx, index: idx, point });
          hasIssues = true;
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
    
    if (!hasIssues) {
      console.log('✅ No duplicates found');
    }
  } else {
    // Check all lessons
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
}

// Main command handler
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'verify':
    verifyJSON();
    break;
  case 'status':
    checkStatus(arg || null);
    break;
  case 'duplicates':
    checkDuplicates(arg || null);
    break;
  default:
    console.log('Usage: node scripts/lesson-plan-utils.cjs <command> [arg]');
    console.log('');
    console.log('Commands:');
    console.log('  verify              Verify JSON file validity');
    console.log('  status [AREA]      Check lesson status (all areas or specific area like "VII")');
    console.log('  duplicates [ID]    Check for duplicates (all lessons or specific lesson ID)');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/lesson-plan-utils.cjs verify');
    console.log('  node scripts/lesson-plan-utils.cjs status');
    console.log('  node scripts/lesson-plan-utils.cjs status VII');
    console.log('  node scripts/lesson-plan-utils.cjs duplicates');
    console.log('  node scripts/lesson-plan-utils.cjs duplicates LP-VII-A');
    process.exit(1);
}



