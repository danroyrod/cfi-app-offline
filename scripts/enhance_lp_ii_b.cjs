#!/usr/bin/env node
/**
 * Enhance LP-II-B: Visual Scanning and Collision Avoidance
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lp = data.lessonPlans.find(l => l.id === 'LP-II-B');

if (!lp) {
  console.log('Error: LP-II-B not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Update phase 1
lp.teachingScript[0].phase = 'Introduction and Ground Briefing (20 minutes)';
lp.teachingScript[0].duration = '20 minutes';

lp.teachingScript[0].instructorActions = [
  "Greet student warmly: 'Welcome! Today we're covering one of the most critical safety topics in aviation - visual scanning and collision avoidance. This isn't optional knowledge; it's essential for survival. Mid-air collisions are among the most catastrophic accidents in aviation, and effective scanning is our primary defense.'",
  
  "Write lesson title on whiteboard: 'Visual Scanning and Collision Avoidance'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: explain effective visual scanning techniques and why they work, identify collision threats in various flight environments, apply proper clearing procedures before maneuvers, use electronic traffic systems appropriately as supplements to visual scanning, and teach collision avoidance techniques to students effectively. These skills directly impact safety for you and your students.'",
  
  "Ask opening question: 'Think about a time when you saw another aircraft in flight - maybe during a training flight or while flying cross-country. How did you spot it? What were you looking for? Did you feel confident you would have seen it in time to avoid a collision?'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'Those are good observations. I'm noting that you were actively looking, which is key. Let's explore how to make that scanning more systematic and effective.'",
  
  "Transition statement: 'Excellent observations. What you're describing touches on the core of visual scanning: being systematic, looking in the right places, and understanding what makes aircraft hard to see. These aren't just techniques - they're survival skills. Let's explore them systematically.'",
  
  "Show reference materials: 'We'll be referencing AC 90-48, which provides comprehensive guidance on collision avoidance. The AIM has important sections on right-of-way rules and traffic patterns. The Aviation Instructor's Handbook covers how to teach scanning effectively. These are essential references for every CFI.'",
  
  "Explain the importance of visual scanning: 'Visual scanning is our primary method of collision avoidance. The 'see and avoid' concept is fundamental to aviation safety. However, effective scanning isn't natural - it must be learned and practiced. Most mid-air collisions occur because pilots weren't looking in the right place at the right time.'",
  
  "Explain scanning techniques preview: 'We'll explore effective scanning techniques: the block system, where to look, how long to look, and what to look for. We'll discuss why some techniques work better than others and how to develop effective scanning habits. This is a skill that must be developed and maintained.'",
  
  "Explain collision threats preview: 'We'll discuss collision threats: where other aircraft are most likely to be, blind spots, converging traffic, and high-traffic areas. Understanding where threats come from helps us scan more effectively. We'll learn to identify and prioritize threats.'",
  
  "Explain clearing procedures preview: 'We'll cover proper clearing procedures: when to clear, how to clear, and what to look for. Clearing before maneuvers is required, but many pilots do it incorrectly or incompletely. We'll learn how to clear effectively and teach students to do the same.'",
  
  "Explain electronic traffic systems preview: 'We'll discuss electronic traffic systems like ADS-B and TCAS: what they are, how they work, and their limitations. These systems are valuable supplements to visual scanning, but they're not replacements. We must understand both their capabilities and limitations.'",
  
  "Explain common errors in scanning: 'Common errors include: not scanning systematically, fixating inside the cockpit, not clearing before maneuvers, over-relying on electronic systems, and not teaching students proper scanning techniques. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate that you can teach effective scanning techniques, explain clearing procedures, and help students develop good scanning habits. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore visual scanning techniques and why they work. Then we'll discuss collision threats and where to look for them. Next, we'll cover clearing procedures and when to use them. Finally, we'll explore electronic traffic systems and how they supplement visual scanning. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? What scanning techniques have you found most effective in your own flying?'"
];

lp.teachingScript[0].studentActions = [
  "Share personal experiences with visual scanning and traffic when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own scanning habits and techniques",
  "Participate in opening discussion about collision avoidance",
  "Ask clarifying questions about lesson structure",
  "Share examples of effective or ineffective scanning",
  "Identify personal scanning strengths and weaknesses",
  "Engage with instructor's questions and scenarios"
];

lp.teachingScript[0].keyPoints = [
  "Visual scanning is our primary collision avoidance method - see and avoid is fundamental to aviation safety",
  "Effective scanning must be systematic and continuous - random looking is ineffective",
  "Scanning is a skill that must be developed and maintained - practice continuously to maintain proficiency",
  "Collision threats are most common in specific areas - understand where to look and when",
  "Clearing procedures are required before maneuvers - teach students to clear properly and completely",
  "Electronic traffic systems supplement but don't replace visual scanning - use both together",
  "Blind spots exist in every aircraft - understand them and compensate with scanning",
  "Teaching effective scanning requires demonstration and practice - students must develop the skill, not just memorize procedures"
];

// Fix duplicate key point in Summary phase
const summaryPhase = lp.teachingScript.find(p => p.phase.includes('Summary'));
if (summaryPhase) {
  summaryPhase.keyPoints = summaryPhase.keyPoints.filter(point => 
    !point.includes('Effective scanning is a skill that must be developed and maintained')
  );
  console.log('✅ Removed duplicate key point from Summary phase');
}

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-II-B`);
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
