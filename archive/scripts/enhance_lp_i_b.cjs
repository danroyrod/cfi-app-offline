#!/usr/bin/env node
/**
 * Enhance LP-I-B: Learning Process
 * Updates phase name, expands ground briefing to 15+ actions, and adds diagrams
 * Usage: node scripts/enhance_lp_i_b.cjs
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find LP-I-B
const lp = data.lessonPlans.find(l => l.id === 'LP-I-B');

if (!lp) {
  console.log('Error: LP-I-B not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);
console.log(`Current diagrams: ${lp.diagrams.length}`);

// Update phase 1: Introduction and Ground Briefing (20 minutes)
lp.teachingScript[0].phase = 'Introduction and Ground Briefing (20 minutes)';
lp.teachingScript[0].duration = '20 minutes';

// Enhanced ground briefing with 15+ detailed actions
lp.teachingScript[0].instructorActions = [
  "Greet student warmly: 'Welcome! Today we're exploring one of the most fundamental topics for flight instructors - understanding how people actually learn. This isn't academic theory; it's the practical foundation that will make you an effective instructor. Without understanding the learning process, you're teaching blind.'",
  
  "Write lesson title on whiteboard: 'The Learning Process'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: explain how learning occurs and what makes it effective, apply learning theories (behaviorism, cognitive, constructivism) to flight instruction, recognize and develop all three domains of learning (cognitive, affective, psychomotor), use the laws of learning (REEPIR) in your lesson planning, and identify learning plateaus with practical strategies to overcome them. These skills directly determine your effectiveness as an instructor.'",
  
  "Ask opening question: 'Think about when you first learned to fly. Can you recall a specific moment when something 'clicked' - when you truly understood a concept or mastered a skill? What made that moment different from other learning experiences? What did your instructor do that helped or hindered your learning?'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'That's a powerful example. I'm noting that understanding the 'why' made the difference for you. Let's explore how we can create those 'click' moments for our students.'",
  
  "Transition statement: 'Excellent examples. What you're describing touches on several key concepts we'll explore today: how learning happens, why some methods work better than others, and how to recognize when a student is truly learning versus just going through motions. These aren't abstract concepts - they're practical tools you'll use every day.'",
  
  "Show reference materials: 'We'll be referencing the Aviation Instructor's Handbook, Chapter 3, which covers the learning process in detail. I also recommend reviewing Chapter 2 on human behavior, as learning and behavior are interconnected. Keep these handy for deeper exploration and lesson planning.'",
  
  "Explain the importance of learning theory: 'Understanding how learning works isn't optional for CFIs - it's essential. Every decision you make as an instructor should be informed by how people actually learn. When a student struggles, the question isn't 'What's wrong with them?' but 'How can I adapt my teaching to how they learn?''",
  
  "Explain learning theories preview: 'We'll explore three major learning theories: behaviorism (repetition and reinforcement), cognitive theory (understanding and mental models), and constructivism (building on experience). The best instruction uses elements from all three - we'll see how to integrate them.'",
  
  "Explain domains of learning preview: 'We'll cover the three domains of learning: cognitive (knowing), affective (feeling/judging), and psychomotor (doing). Most flight training involves all three simultaneously, but we often overemphasize one and neglect others. We'll learn to develop all three.'",
  
  "Explain laws of learning preview: 'We'll study the laws of learning - REEPIR: Readiness, Exercise, Effect, Primacy, Intensity, and Recency. These aren't suggestions; they're principles that govern how learning actually works. Violate them at your peril - follow them and watch your students succeed.'",
  
  "Explain learning plateaus preview: 'We'll discuss learning plateaus - those frustrating periods when progress seems to stop. Understanding why they happen and how to overcome them prevents both instructor and student frustration. This is practical knowledge you'll use immediately.'",
  
  "Explain common errors in teaching learning: 'Common errors instructors make include: teaching without understanding how learning works, focusing only on one domain (usually cognitive or psychomotor), violating the laws of learning, not recognizing learning plateaus, and using one-size-fits-all approaches. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate that you can recognize how students learn, adapt your teaching methods, and use the laws of learning in your lesson planning. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore learning theories and how they apply to flight instruction. Then we'll discuss the three domains of learning and how to develop all three. Next, we'll dive into the laws of learning and how to use them. Finally, we'll cover learning plateaus and practical strategies. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? Are there specific learning challenges you've observed in students that you'd like us to address?'"
];

// Update student actions for ground briefing
lp.teachingScript[0].studentActions = [
  "Share personal learning experiences when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own learning experiences",
  "Participate in opening discussion about learning",
  "Ask clarifying questions about lesson structure",
  "Share examples of effective or ineffective learning experiences",
  "Identify personal learning preferences",
  "Engage with instructor's questions and scenarios"
];

// Update key points for ground briefing
lp.teachingScript[0].keyPoints = [
  "Learning is a change in behavior resulting from experience - not just memorization or repetition",
  "Every student learns differently - there's no one-size-fits-all approach, adapt your teaching",
  "Understanding learning theory directly improves instructional effectiveness - it's not optional",
  "Learning happens in three interconnected domains: cognitive (knowing), affective (feeling), psychomotor (doing)",
  "The laws of learning (REEPIR) govern how learning works - follow them for effective instruction",
  "Learning plateaus are normal - understanding them prevents frustration and guides intervention",
  "Effective instruction integrates multiple learning theories - use repetition, understanding, and experience",
  "First learning is strongest (Primacy) - teach correctly the FIRST time, mistakes are hard to unlearn"
];

// Add diagrams (ground lesson - 2 diagrams minimum)
lp.diagrams = [
  {
    "title": "Learning Theories Comparison",
    "description": "Visual comparison of the three major learning theories and how they apply to flight instruction",
    "type": "basic",
    "asciiArt": `
    BEHAVIORISM          COGNITIVE THEORY      CONSTRUCTIVISM
    ┌─────────────┐      ┌─────────────┐    ┌─────────────┐
    │ Repetition │       │ Understanding│    │ Experience  │
    │    +       │       │      +       │    │     +       │
    │Reinforcement│      │ Mental Models│    │ Build on    │
    │            │       │             │    │ Prior Knowledge│
    └─────────────┘      └─────────────┘    └─────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  EFFECTIVE        │
                    │  INSTRUCTION      │
                    │  Uses All Three  │
                    └──────────────────┘
    `,
    "keyPoints": [
      "Behaviorism: Repetition and reinforcement build automatic responses - essential for emergency procedures",
      "Cognitive Theory: Understanding enables transfer of learning to new situations - critical for decision-making",
      "Constructivism: Learners build knowledge from experience - connect new learning to what students already know",
      "Best instruction integrates all three theories - use repetition, understanding, and experience-based learning"
    ]
  },
  {
    "title": "Three Domains of Learning",
    "description": "Illustration of the three interconnected domains of learning and their relationship in flight training",
    "type": "basic",
    "asciiArt": `
                    COGNITIVE
                    (Knowing)
                    ┌─────────┐
                    │ Facts   │
                    │ Concepts│
                    │ Procedures│
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    AFFECTIVE        INTERCONNECTED    PSYCHOMOTOR
    (Feeling)        (All Three        (Doing)
    ┌─────────┐      Work Together)   ┌─────────┐
    │Attitudes│                        │Physical │
    │Values   │                        │Skills   │
    │Emotions │                        │Coordination│
    │Judgment │                        │Muscle Memory│
    └─────────┘                        └─────────┘
    
    Example: Short-Field Landing
    • Cognitive: Knows procedure and speeds
    • Affective: Has confidence and judgment
    • Psychomotor: Can execute landing precisely
    `,
    "keyPoints": [
      "Cognitive domain: Knowledge and understanding - 'knowing what and why'",
      "Affective domain: Attitudes and values - 'feeling and judging' - often neglected but critical for safety",
      "Psychomotor domain: Physical skills - 'doing' - muscle memory and coordination",
      "All three domains are interconnected - effective instruction develops cognitive, affective, AND psychomotor skills simultaneously"
    ]
  }
];

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-I-B`);
console.log(`   New phase 1: ${lp.teachingScript[0].phase}`);
console.log(`   New phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);
console.log(`   New diagrams: ${lp.diagrams.length}`);

// Verify JSON is valid
try {
  JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('✅ JSON validation passed');
} catch (e) {
  console.log('❌ JSON validation failed:', e.message);
  process.exit(1);
}

