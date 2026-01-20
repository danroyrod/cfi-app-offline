#!/usr/bin/env node
/**
 * Enhance LP-I-A: Effects of Human Behavior and Communication on the Learning Process
 * Updates phase name and expands ground briefing to 15+ actions
 * Usage: node scripts/enhance_lp_i_a.cjs
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find LP-I-A
const lp = data.lessonPlans.find(l => l.id === 'LP-I-A');

if (!lp) {
  console.log('Error: LP-I-A not found');
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
  "Greet student warmly: 'Good morning! Today we're diving into one of the most important topics for flight instructors - understanding how human behavior and communication directly impact learning. This isn't just theory; it's the foundation of effective instruction. Without understanding psychology, even the best technical knowledge won't help you teach effectively.'",
  
  "Write lesson title on whiteboard: 'Effects of Human Behavior and Communication on the Learning Process'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: understand how human behavior affects learning and motivation, identify defense mechanisms and emotional reactions in students, apply effective communication techniques during instruction, recognize barriers to communication and strategies to overcome them, and adapt teaching methods to accommodate different learning styles and behaviors. These aren't just checkride topics - these skills determine whether your students succeed or fail.'",
  
  "Ask opening question: 'Think about your own flight training experience. Can you recall a time when you felt particularly motivated to learn something? What made that experience different? What did your instructor do that helped or hindered your learning?'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'That's a great example. I'm noting that your instructor's positive feedback made a difference. Let's explore why that worked.'",
  
  "Transition statement: 'Great examples. What you're describing touches on several key concepts we'll cover today: motivation, emotional state, and how the instructor's approach affected your learning. These psychological factors are just as important as technical knowledge. Let's explore these systematically.'",
  
  "Show reference materials: 'We'll be referencing the Aviation Instructor's Handbook, specifically Chapters 2 and 3, which cover human behavior and communication in detail. I also recommend the Risk Management Handbook for understanding how stress affects decision-making. These aren't optional reading - they're essential for effective instruction.'",
  
  "Explain the importance of psychology in teaching: 'Here's why this matters: every student brings a unique psychological makeup to training. Their motivation, fears, past experiences, and learning style all affect how they learn. As instructors, we must recognize these factors and adapt our teaching accordingly. A one-size-fits-all approach fails because students are individuals, not robots.'",
  
  "Explain Maslow's Hierarchy preview: 'We'll start with Maslow's Hierarchy of Needs, which shows that before a student can effectively learn, their basic needs must be satisfied. If a student is hungry, tired, or feels unsafe, their brain literally cannot focus on learning. This isn't theoretical - I've seen students struggle with landings simply because they skipped breakfast or are worried about their job.'",
  
  "Explain defense mechanisms preview: 'We'll also cover defense mechanisms - unconscious ways students protect their ego when they feel threatened. When a student makes excuses or blames external factors, they're not being difficult - they're protecting themselves. Understanding this helps us address the underlying fear, not just the behavior.'",
  
  "Explain stress and emotional reactions: 'Stress and emotional reactions significantly impact learning. Some stress enhances performance, but too much stress completely shuts down learning. We'll learn to recognize the signs of stress overload and intervene appropriately. This is critical for safety - stressed students make poor decisions.'",
  
  "Explain communication barriers: 'Communication is the foundation of instruction, but it's more complex than just talking. We'll explore barriers to communication: lack of common experience, confusion between symbols and what they represent, abstractions, and interference. Many teaching failures are actually communication failures.'",
  
  "Explain common errors in teaching psychology: 'Common errors instructors make include: ignoring student stress signals, using fear-based motivation, not adapting to different learning styles, assuming understanding without verification, and failing to create psychological safety. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate that you can recognize student behavior patterns, adapt your teaching style, and create a safe learning environment. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore human behavior and motivation, including Maslow's Hierarchy. Then we'll discuss defense mechanisms and how to address them. Next, we'll cover emotional reactions and stress management. Finally, we'll dive deep into effective communication techniques. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? Are there specific situations from your own training where you've seen these concepts in action?'"
];

// Update student actions for ground briefing
lp.teachingScript[0].studentActions = [
  "Share personal flight training experiences when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own learning experiences",
  "Participate in opening discussion about motivation",
  "Ask clarifying questions about lesson structure",
  "Share examples of effective or ineffective instruction",
  "Identify personal learning style preferences",
  "Engage with instructor's questions and scenarios"
];

// Update key points for ground briefing
lp.teachingScript[0].keyPoints = [
  "Motivation drives all learning - without it, even perfect instruction fails",
  "Every student brings unique psychological makeup to training - one size does not fit all",
  "Psychology and teaching are inseparable - you can't teach effectively without understanding human behavior",
  "Basic needs must be satisfied before learning can occur - hungry, tired, or stressed students cannot learn effectively",
  "Defense mechanisms are unconscious protective responses - address underlying fears, not the behavior",
  "Stress exists on a continuum - optimal stress enhances learning, excessive stress shuts it down",
  "Communication requires verification - never assume understanding, always check",
  "Effective instruction adapts to individual students - recognize patterns and adjust teaching style accordingly"
];

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-I-A`);
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


