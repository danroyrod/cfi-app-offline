#!/usr/bin/env node
/**
 * Enhance LP-I-F: Elements of Effective Teaching that Include Risk Management and Accident Prevention
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lp = data.lessonPlans.find(l => l.id === 'LP-I-F');

if (!lp) {
  console.log('Error: LP-I-F not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Update phase 1
lp.teachingScript[0].phase = 'Introduction and Ground Briefing (20 minutes)';
lp.teachingScript[0].duration = '20 minutes';

lp.teachingScript[0].instructorActions = [
  "Greet student warmly: 'Welcome! Today we're covering one of the most critical topics for flight instructors - integrating risk management and accident prevention into effective teaching. This isn't a separate topic; it's woven into everything we do as instructors. Safety isn't something we add to instruction - it's the foundation of effective instruction.'",
  
  "Write lesson title on whiteboard: 'Elements of Effective Teaching that Include Risk Management and Accident Prevention'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: integrate risk management principles into all aspects of instruction, teach accident prevention proactively rather than reactively, use scenario-based training to develop risk management skills, identify and mitigate risks before they become hazards, and create a safety culture in your instruction that promotes continuous improvement. These skills directly impact student safety and your effectiveness as an instructor.'",
  
  "Ask opening question: 'Think about aviation accidents you've heard about. What do most of them have in common? What role do you think instruction plays in preventing accidents? How can we teach students to recognize and manage risks before they become problems?'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'Those are insightful observations. I'm noting that proactive risk management could have prevented many accidents. Let's explore how to teach that proactively.'",
  
  "Transition statement: 'Excellent observations. What you're describing touches on the core of this lesson: integrating risk management and accident prevention into effective teaching. This isn't about adding safety as an afterthought - it's about teaching students to think safely from day one. Let's explore how to do that systematically.'",
  
  "Show reference materials: 'We'll be referencing the Risk Management Handbook extensively, which provides comprehensive guidance on risk management principles. The Aviation Instructor's Handbook covers how to integrate safety into instruction. The NTSB accident reports provide real-world examples. These are essential references for every CFI.'",
  
  "Explain the importance of risk management in teaching: 'Risk management isn't optional - it's fundamental to effective instruction. Every lesson, every maneuver, every decision involves risk. Our job as instructors is to teach students to recognize, assess, and manage those risks. This isn't just about preventing accidents - it's about developing safe, competent pilots.'",
  
  "Explain risk management principles preview: 'We'll explore risk management principles: identifying hazards, assessing risks, mitigating risks, and making go/no-go decisions. These principles apply to every aspect of flight training, from preflight planning to in-flight decision-making. We'll learn how to teach these principles effectively.'",
  
  "Explain accident prevention preview: 'We'll discuss accident prevention strategies: teaching students to recognize accident chains, understand human factors that contribute to accidents, and develop habits that prevent accidents. Prevention is always better than reaction - we'll explore how to teach prevention proactively.'",
  
  "Explain scenario-based training preview: 'We'll cover scenario-based training: using realistic scenarios to develop risk management skills, teaching decision-making under pressure, and preparing students for real-world situations. Scenarios make risk management tangible and memorable.'",
  
  "Explain safety culture preview: 'We'll explore how to create a safety culture in your instruction: modeling safe behavior, encouraging open discussion of risks, promoting continuous improvement, and making safety a priority, not an afterthought. Culture shapes behavior more than rules do.'",
  
  "Explain common errors in risk management teaching: 'Common errors instructors make include: treating safety as a separate topic rather than integrated into everything, not teaching risk management proactively, using fear-based rather than skill-based approaches, not modeling safe behavior, and failing to create a safety culture. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate that you can integrate risk management into instruction, teach accident prevention proactively, and create a safety culture. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore risk management principles and how they apply to instruction. Then we'll discuss accident prevention strategies and how to teach them proactively. Next, we'll cover scenario-based training and its role in developing risk management skills. Finally, we'll explore how to create and maintain a safety culture. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? What risks do you think are most important to address in flight training?'"
];

lp.teachingScript[0].studentActions = [
  "Share personal experiences with risk management and safety when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own learning experiences",
  "Participate in opening discussion about accident prevention",
  "Ask clarifying questions about lesson structure",
  "Share examples of effective or ineffective safety instruction",
  "Identify personal risk management practices",
  "Engage with instructor's questions and scenarios"
];

lp.teachingScript[0].keyPoints = [
  "Risk management is fundamental to effective instruction - integrate it into everything, not as a separate topic",
  "Accident prevention must be taught proactively - teach students to recognize and manage risks before they become hazards",
  "Scenario-based training develops risk management skills - use realistic scenarios to make risk management tangible",
  "Safety culture shapes behavior - model safe behavior and create an environment where safety is a priority",
  "Risk management principles apply to every aspect of training - from preflight planning to in-flight decision-making",
  "Human factors contribute to most accidents - teach students to recognize and manage human factors",
  "Prevention is always better than reaction - teach students to prevent accidents, not just react to emergencies",
  "Continuous improvement in safety requires open discussion - encourage students to discuss risks and learn from experiences"
];

// Fix duplicate key point in Phase 6 (Summary)
const summaryPhase = lp.teachingScript.find(p => p.phase.includes('Summary'));
if (summaryPhase) {
  summaryPhase.keyPoints = summaryPhase.keyPoints.filter(point => 
    !point.includes('Instructors have a responsibility to teach safety, not just skills')
  );
  console.log('✅ Removed duplicate key point from Summary phase');
}

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-I-F`);
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

