#!/usr/bin/env node
/**
 * Enhance LP-I-C: Course Development, Lesson Plans, and Classroom Training Techniques
 * Updates phase name and expands ground briefing to 15+ actions
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lp = data.lessonPlans.find(l => l.id === 'LP-I-C');

if (!lp) {
  console.log('Error: LP-I-C not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Update phase 1: Introduction and Ground Briefing (20 minutes)
lp.teachingScript[0].phase = 'Introduction and Ground Briefing (20 minutes)';
lp.teachingScript[0].duration = '20 minutes';

// Enhanced ground briefing with 15+ detailed actions
lp.teachingScript[0].instructorActions = [
  "Greet student warmly: 'Welcome! Today we're covering one of the most practical topics for flight instructors - how to develop courses, create effective lesson plans, and use classroom training techniques. This is where theory meets practice. These skills determine whether your students learn effectively or waste their time and money.'",
  
  "Write lesson title on whiteboard: 'Course Development, Lesson Plans, and Classroom Training Techniques'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: understand and explain course development principles, create comprehensive lesson plans that guide effective instruction, select and apply appropriate teaching methods for different content types, demonstrate effective classroom training techniques including questioning and verification, and integrate risk management and ACS standards into your course structure. These aren't just checkride topics - these are daily tools you'll use throughout your CFI career.'",
  
  "Ask opening question: 'Have you ever sat through a ground school class that was boring or confusing? What made it ineffective? Conversely, what made a good ground school class effective? Think about both the structure and the teaching techniques used.'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'Excellent observations. I'm noting that clear organization and engaging techniques made the difference. Let's explore how to create that structure and engagement.'",
  
  "Transition statement: 'Great observations. What you're describing touches on course structure, lesson planning, and teaching techniques - exactly what we'll cover today. These skills separate effective instructors from ineffective ones. Without proper course development and lesson planning, even the best technical knowledge won't help you teach effectively.'",
  
  "Show reference materials: 'We'll be referencing the Aviation Instructor's Handbook, which has excellent sections on course development and lesson planning. The ACS also provides standards we must meet. I also recommend reviewing the Risk Management Handbook for integrating safety into your course structure. These aren't optional - they're essential references you'll use constantly.'",
  
  "Explain the importance of course development: 'Course development provides the overall structure and sequence for training. Without a well-designed course, lessons feel disconnected, students get confused, and learning suffers. A good course builds systematically from basic to complex, ensuring each lesson prepares students for the next.'",
  
  "Explain lesson plans preview: 'Lesson plans are the detailed roadmap for each individual lesson. They're not scripts to read from - they're guides that ensure you cover all objectives, use effective techniques, and verify understanding. A well-designed lesson plan makes instruction smooth and effective.'",
  
  "Explain classroom techniques preview: 'Classroom training techniques include questioning methods, visual aids, demonstrations, and interactive activities. The best instructors use a variety of techniques to engage different learning styles and maintain student attention. We'll explore specific techniques you can use immediately.'",
  
  "Explain course structure preview: 'We'll cover how to organize a course: determining objectives, sequencing lessons logically, integrating ground and flight training, and ensuring all ACS standards are met. This is the big picture that makes individual lessons effective.'",
  
  "Explain teaching methods preview: 'We'll discuss different teaching methods: lecture, demonstration, discussion, guided practice, and independent practice. Each has its place, and effective instruction uses the right method for the right content at the right time.'",
  
  "Explain common errors in course development: 'Common errors instructors make include: creating lessons without clear objectives, failing to sequence lessons logically, using only one teaching method, not verifying understanding, and creating lesson plans that are too rigid or too vague. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate that you can develop a course structure, create effective lesson plans, and use classroom techniques appropriately. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore course development principles and structure. Then we'll dive deep into lesson plan creation, including objectives, content organization, and teaching methods. Next, we'll cover specific classroom training techniques. Finally, we'll discuss integration of risk management and ACS standards. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? Have you started creating any lesson plans yet, and if so, what challenges have you encountered?'"
];

// Update student actions for ground briefing
lp.teachingScript[0].studentActions = [
  "Share experiences with effective and ineffective instruction when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own learning experiences",
  "Participate in opening discussion about course structure and teaching",
  "Ask clarifying questions about lesson structure",
  "Share examples of well-structured or poorly-structured courses",
  "Identify personal preferences for teaching methods",
  "Engage with instructor's questions and scenarios"
];

// Update key points for ground briefing
lp.teachingScript[0].keyPoints = [
  "Course development provides the overall structure and sequence for training - without it, lessons feel disconnected",
  "Lesson plans are the detailed roadmap for each individual lesson - they guide effective instruction, not scripts to read",
  "Effective classroom techniques engage students and enhance learning - use variety to reach different learning styles",
  "Course structure must build systematically from basic to complex - each lesson prepares students for the next",
  "Teaching methods must match content type - use the right method for the right content at the right time",
  "Clear objectives are essential - they guide both instruction and assessment",
  "Verification of understanding is critical - never assume students understand, always check",
  "Integration of risk management and ACS standards ensures comprehensive, safe training"
];

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-I-C`);
console.log(`   New phase 1: ${lp.teachingScript[0].phase}`);
console.log(`   New phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Verify JSON is valid
try {
  JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('✅ JSON validation passed');
} catch (e) {
  console.log('❌ JSON validation failed:', e.message);
  process.exit(1);
}
