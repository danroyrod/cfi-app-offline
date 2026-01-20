#!/usr/bin/env node
/**
 * Enhance LP-II-C: Runway Incursion Avoidance
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lp = data.lessonPlans.find(l => l.id === 'LP-II-C');

if (!lp) {
  console.log('Error: LP-II-C not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Update phase 1
lp.teachingScript[0].phase = 'Introduction and Ground Briefing (20 minutes)';
lp.teachingScript[0].duration = '20 minutes';

lp.teachingScript[0].instructorActions = [
  "Greet student warmly: 'Welcome! Today we're covering one of the most critical ground safety topics - runway incursion avoidance. Runway incursions are serious safety events that can lead to catastrophic accidents. Understanding how to prevent them is essential for every pilot and instructor.'",
  
  "Write lesson title on whiteboard: 'Runway Incursion Avoidance'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: define runway incursions and their causes, identify airport markings and signs that prevent incursions, apply proper taxi procedures and communication, use effective read-back procedures, and teach runway incursion avoidance to students effectively. These skills directly impact ground safety for you and your students.'",
  
  "Ask opening question: 'Think about times you've taxied at an airport - especially a busy one. What challenges did you face? Did you ever feel uncertain about where you were or where you should go? What made it difficult?'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'Those are common experiences. I'm noting that airport complexity and communication were challenges. Let's explore how to manage these effectively.'",
  
  "Transition statement: 'Excellent observations. What you're describing touches on the core of runway incursion prevention: understanding airport layout, following proper procedures, and communicating effectively. These aren't just rules - they're survival skills. Let's explore them systematically.'",
  
  "Show reference materials: 'We'll be referencing AC 91-73, which provides comprehensive guidance on runway incursion avoidance. The AIM has important sections on airport operations and markings. Chart Supplements provide airport-specific information. The Aviation Instructor's Handbook covers how to teach this effectively. These are essential references for every CFI.'",
  
  "Explain the importance of runway incursion avoidance: 'Runway incursions are serious safety events that can lead to catastrophic accidents. Most incursions are caused by pilot error: confusion about location, failure to follow procedures, or poor communication. Understanding how to prevent incursions is essential for every pilot and instructor.'",
  
  "Explain runway incursion causes preview: 'We'll explore common causes of runway incursions: confusion about location, failure to read back clearances correctly, not understanding airport markings and signs, and poor situational awareness. Understanding these causes helps us prevent incursions.'",
  
  "Explain airport markings and signs preview: 'We'll discuss airport markings and signs: what they mean, where they're located, and how to use them to navigate safely. Proper understanding of markings and signs is fundamental to preventing incursions. We'll learn to identify and interpret them correctly.'",
  
  "Explain taxi procedures preview: 'We'll cover proper taxi procedures: how to read taxi clearances, how to follow taxi routes, and how to maintain situational awareness while taxiing. Proper procedures prevent confusion and reduce the risk of incursions.'",
  
  "Explain communication preview: 'We'll explore effective communication: proper read-back procedures, when to ask for clarification, and how to communicate clearly with ATC. Good communication is essential for preventing incursions. We'll learn how to communicate effectively and teach students to do the same.'",
  
  "Explain common errors in runway incursion avoidance: 'Common errors include: not reading back clearances correctly, not understanding airport markings, losing situational awareness while taxiing, not asking for clarification when uncertain, and not teaching students proper procedures. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate that you can teach proper taxi procedures, explain airport markings, and help students develop good communication habits. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore what runway incursions are and their causes. Then we'll discuss airport markings and signs. Next, we'll cover taxi procedures and communication. Finally, we'll explore hold short procedures and how to teach this effectively. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? What aspects of taxiing and runway incursion avoidance do you find most challenging?'"
];

lp.teachingScript[0].studentActions = [
  "Share personal experiences with taxiing and airport operations when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own experiences with airport navigation",
  "Participate in opening discussion about runway incursion prevention",
  "Ask clarifying questions about lesson structure",
  "Share examples of challenging airport situations",
  "Identify personal areas for improvement in taxi procedures",
  "Engage with instructor's questions and scenarios"
];

lp.teachingScript[0].keyPoints = [
  "Runway incursions are serious safety events - most are caused by pilot error and are preventable",
  "Airport markings and signs provide critical information - understanding them is essential for safe navigation",
  "Proper taxi procedures prevent confusion - follow clearances carefully and maintain situational awareness",
  "Effective communication prevents misunderstandings - read back clearances correctly and ask for clarification when needed",
  "Situational awareness is critical while taxiing - know where you are and where you're going at all times",
  "When uncertain, stop and verify - don't assume, don't guess, ask ATC for clarification",
  "Teaching proper procedures prevents incursions - help students develop good habits from the beginning",
  "Runway incursion avoidance requires constant vigilance - complacency leads to mistakes"
];

// Fix duplicate instructor action in Phase 4 and Phase 5
// Remove the duplicate from Phase 5 (keep the one in Phase 4 as it's more detailed)
const phase5 = lp.teachingScript.find(p => p.phase.includes('Hold Short'));
if (phase5) {
  phase5.instructorActions = phase5.instructorActions.filter(action => 
    !action.includes('Position and hold example:') || !action.includes('Line up and wait runway')
  );
  console.log('✅ Removed duplicate instructor action from Phase 5');
}

// Fix duplicate key point in Phase 6 (Summary)
const summaryPhase = lp.teachingScript.find(p => p.phase.includes('Summary'));
if (summaryPhase) {
  summaryPhase.keyPoints = summaryPhase.keyPoints.filter(point => 
    !point.toLowerCase().includes('when in doubt, stop and verify')
  );
  console.log('✅ Removed duplicate key point from Summary phase');
}

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-II-C`);
console.log(`   New phase 1: ${lp.teachingScript[0].phase}`);
console.log(`   New phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Verify JSON
try {
  JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('✅ JSON validation passed');
} catch (e) {
  console.log('❌ JSON validation failed:', e.message);
  process.exit(1);
}
