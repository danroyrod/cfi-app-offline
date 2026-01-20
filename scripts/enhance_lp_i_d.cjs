#!/usr/bin/env node
/**
 * Enhance LP-I-D: Student Evaluation, Assessment, and Testing
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lp = data.lessonPlans.find(l => l.id === 'LP-I-D');

if (!lp) {
  console.log('Error: LP-I-D not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Update phase 1
lp.teachingScript[0].phase = 'Introduction and Ground Briefing (20 minutes)';
lp.teachingScript[0].duration = '20 minutes';

lp.teachingScript[0].instructorActions = [
  "Greet student warmly: 'Welcome! Today we're covering one of the most important but often misunderstood topics for flight instructors - how to evaluate, assess, and test students effectively. This isn't about passing or failing; it's about ensuring learning and safety. Effective evaluation guides instruction and ensures students are ready to progress safely.'",
  
  "Write lesson title on whiteboard: 'Student Evaluation, Assessment, and Testing'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: distinguish between evaluation, assessment, and testing and when to use each, use formative and summative assessment appropriately throughout training, select appropriate testing methods for different learning objectives, provide constructive feedback that promotes learning, and use assessment results to guide and adapt instruction. These skills determine whether your students progress safely and effectively.'",
  
  "Ask opening question: 'Think about your own flight training. When did you feel most confident that you had truly learned something? Was it when you passed a written test, or when you could actually perform the skill? What's the difference? What did your instructor do that helped you understand your progress?'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'That's a powerful distinction. I'm noting that performance-based assessment felt more meaningful to you. Let's explore how to create that clarity for our students.'",
  
  "Transition statement: 'Excellent observations. What you're describing touches on the difference between testing knowledge versus assessing performance, and how evaluation guides learning. These are exactly the concepts we'll explore today. Understanding evaluation, assessment, and testing is critical for effective instruction.'",
  
  "Show reference materials: 'We'll be referencing the Aviation Instructor's Handbook, which has comprehensive sections on student evaluation and assessment. The ACS provides standards we must assess against. I also recommend reviewing the Risk Management Handbook for integrating safety assessment. These are essential references for every CFI.'",
  
  "Explain the importance of evaluation: 'Evaluation is the process of determining student progress and readiness. It's not just about grades or pass/fail - it's about understanding where students are in their learning journey and what they need next. Without effective evaluation, instruction is blind.'",
  
  "Explain assessment types preview: 'We'll cover different types of assessment: formative (ongoing, during learning) versus summative (final, after learning), formal versus informal, and knowledge versus performance-based. Each type serves different purposes and must be used appropriately.'",
  
  "Explain testing methods preview: 'We'll discuss different testing methods: written tests, oral exams, practical tests, and integrated assessments. The best instruction uses multiple methods to get a complete picture of student learning. We'll learn when to use each method.'",
  
  "Explain feedback preview: 'We'll explore how to provide constructive feedback that promotes learning. Feedback must be specific, timely, and actionable. It should focus on performance, not personality, and guide students toward improvement. This is a critical skill for CFIs.'",
  
  "Explain common errors in evaluation: 'Common errors instructors make include: confusing evaluation with judgment, using only one assessment method, providing vague or delayed feedback, not using assessment to guide instruction, and focusing on grades rather than learning. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate that you can evaluate student performance, provide constructive feedback, and use assessment to guide instruction. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore the concepts of evaluation, assessment, and testing and how they differ. Then we'll discuss different types of assessment and when to use each. Next, we'll cover testing methods and how to select appropriate methods. Finally, we'll explore feedback techniques and using assessment to guide instruction. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? Have you observed different evaluation methods in your own training, and what worked or didn't work for you?'"
];

lp.teachingScript[0].studentActions = [
  "Share personal experiences with evaluation and assessment when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own learning experiences",
  "Participate in opening discussion about evaluation methods",
  "Ask clarifying questions about lesson structure",
  "Share examples of effective or ineffective feedback",
  "Identify personal preferences for assessment methods",
  "Engage with instructor's questions and scenarios"
];

lp.teachingScript[0].keyPoints = [
  "Evaluation determines student progress and readiness - it guides instruction, not just grades",
  "Assessment types serve different purposes - use formative during learning, summative after learning",
  "Testing methods must match learning objectives - written tests assess knowledge, practical tests assess performance",
  "Constructive feedback promotes learning - it must be specific, timely, and actionable",
  "Assessment results guide instruction - adapt teaching based on what assessment reveals",
  "Multiple assessment methods provide complete picture - don't rely on only one method",
  "Feedback focuses on performance, not personality - guide improvement, not judgment",
  "Effective evaluation ensures students progress safely and are ready for next steps"
];

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-I-D`);
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
