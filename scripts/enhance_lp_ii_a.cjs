#!/usr/bin/env node
/**
 * Enhance LP-II-A: Human Factors
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lp = data.lessonPlans.find(l => l.id === 'LP-II-A');

if (!lp) {
  console.log('Error: LP-II-A not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Update phase 1
lp.teachingScript[0].phase = 'Introduction and Ground Briefing (20 minutes)';
lp.teachingScript[0].duration = '20 minutes';

lp.teachingScript[0].instructorActions = [
  "Greet student warmly: 'Welcome! Today we're covering one of the most critical topics in aviation - human factors. This isn't about the airplane; it's about the human operating it. Most aviation accidents aren't caused by mechanical failure - they're caused by human error. Understanding human factors is essential for safe flight operations.'",
  
  "Write lesson title on whiteboard: 'Human Factors'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: identify human factors that affect flight safety and performance, recognize hazardous attitudes and their antidotes, apply aeronautical decision-making processes effectively, manage workload and stress to maintain performance, and maintain situational awareness throughout flight operations. These skills directly impact safety and your effectiveness as both a pilot and instructor.'",
  
  "Ask opening question: 'Think about a time when you made a mistake during flight training - maybe you forgot a checklist item, or made a poor decision. What factors contributed to that mistake? Was it stress, distraction, fatigue, or something else?'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'Those are excellent examples. I'm noting that human factors like stress and distraction played a role. Let's explore how to recognize and manage these factors.'",
  
  "Transition statement: 'Excellent observations. What you're describing touches on the core of human factors: how our physical and mental state affects our performance. These factors are present in every flight, and understanding them is critical for safety. Let's explore these systematically.'",
  
  "Show reference materials: 'We'll be referencing the Risk Management Handbook, which has comprehensive coverage of human factors. The Aviation Instructor's Handbook covers how human factors affect learning and instruction. The AIM and PHAK also have relevant sections. These are essential references for understanding human factors.'",
  
  "Explain the importance of human factors: 'Human factors are the physical and mental characteristics that affect human performance. They include things like stress, fatigue, workload, situational awareness, and decision-making. These factors affect every flight, and understanding them is essential for safe operations. Most accidents involve human factors, not mechanical failure.'",
  
  "Explain hazardous attitudes preview: 'We'll explore the five hazardous attitudes: anti-authority, impulsivity, invulnerability, machismo, and resignation. Each has an antidote that helps us make better decisions. Recognizing these attitudes in ourselves and our students is critical for safety.'",
  
  "Explain decision-making preview: 'We'll discuss aeronautical decision-making: the DECIDE model and how to apply it in flight. Good decision-making requires recognizing problems early, evaluating options, and choosing the best course of action. We'll learn how to teach this effectively.'",
  
  "Explain workload and stress preview: 'We'll cover workload management and stress: how to recognize when workload is too high, how stress affects performance, and strategies for managing both. High workload and stress are major contributors to accidents - we must learn to manage them.'",
  
  "Explain situational awareness preview: 'We'll explore situational awareness: what it is, why it matters, and how to maintain it. Loss of situational awareness is a common factor in accidents. We'll learn how to develop and maintain situational awareness in ourselves and our students.'",
  
  "Explain common errors in human factors: 'Common errors include: ignoring human factors as 'soft' topics, not recognizing hazardous attitudes, making poor decisions under pressure, allowing workload to become unmanageable, and losing situational awareness. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate that you can recognize human factors, teach decision-making, and help students manage workload and stress. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore what human factors are and why they matter. Then we'll discuss hazardous attitudes and their antidotes. Next, we'll cover aeronautical decision-making and how to apply it. Finally, we'll explore workload management, stress, and situational awareness. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? What human factors do you think are most important to address in flight training?'"
];

lp.teachingScript[0].studentActions = [
  "Share personal experiences with human factors when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own experiences with stress, workload, and decision-making",
  "Participate in opening discussion about human factors",
  "Ask clarifying questions about lesson structure",
  "Share examples of how human factors affected flight operations",
  "Identify personal hazardous attitudes or decision-making patterns",
  "Engage with instructor's questions and scenarios"
];

lp.teachingScript[0].keyPoints = [
  "Human factors affect every flight - physical and mental characteristics directly impact performance and safety",
  "Most aviation accidents involve human factors, not mechanical failure - understanding human factors is essential for safety",
  "Hazardous attitudes contribute to poor decisions - recognize them and apply antidotes",
  "Aeronautical decision-making is a skill that can be learned - use structured processes like DECIDE",
  "Workload and stress significantly affect performance - manage both to maintain safety",
  "Situational awareness must be actively maintained - loss of SA is a common factor in accidents",
  "Human factors affect learning - instructors must recognize and address human factors in students",
  "Proactive management of human factors prevents accidents - teach students to recognize and manage these factors"
];

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-II-A`);
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
