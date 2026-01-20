#!/usr/bin/env node
/**
 * Enhance LP-I-E: Elements of Effective Teaching in a Professional Environment
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

console.log('Loading lessonPlansData.json...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const lp = data.lessonPlans.find(l => l.id === 'LP-I-E');

if (!lp) {
  console.log('Error: LP-I-E not found');
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current phase 1: ${lp.teachingScript[0].phase}`);
console.log(`Current phase 1 actions: ${lp.teachingScript[0].instructorActions.length}`);

// Update phase 1
lp.teachingScript[0].phase = 'Introduction and Ground Briefing (20 minutes)';
lp.teachingScript[0].duration = '20 minutes';

lp.teachingScript[0].instructorActions = [
  "Greet student warmly: 'Welcome! Today we're exploring what makes teaching truly effective in a professional aviation environment. This goes beyond just knowing the material - it's about how you deliver it, how you connect with students, and how you maintain professionalism. These elements separate excellent instructors from mediocre ones.'",
  
  "Write lesson title on whiteboard: 'Elements of Effective Teaching in a Professional Environment'",
  
  "Present objectives clearly: 'By the end of this lesson, you'll be able to: identify key elements of effective teaching and how they work together, demonstrate professional characteristics that build trust and respect, apply instructional techniques appropriately for different situations, maintain professional boundaries while building rapport, and create a positive learning environment that promotes success. These skills determine your effectiveness and reputation as a CFI.'",
  
  "Ask opening question: 'Think about the best instructor you've ever had - in aviation or any other field. What made them effective? What specific behaviors or characteristics stood out? What did they do that helped you learn?'",
  
  "Listen actively to student response, nodding and taking notes on their examples: 'Those are excellent examples. I'm noting that professionalism and clear communication made the difference. Let's explore how to develop those characteristics.'",
  
  "Transition statement: 'Excellent observations. What you're describing touches on several key elements we'll explore today: professional characteristics, instructional techniques, communication skills, and creating the right learning environment. These aren't abstract concepts - they're practical behaviors you can develop and apply immediately.'",
  
  "Show reference materials: 'We'll be referencing the Aviation Instructor's Handbook, which covers professional characteristics and teaching techniques in detail. I also recommend reviewing the Risk Management Handbook for understanding how professionalism relates to safety. These are essential references for every CFI.'",
  
  "Explain the importance of professional teaching: 'Effective teaching in a professional environment requires more than technical knowledge. It requires professional characteristics like integrity, responsibility, and respect. It requires instructional competence - knowing how to teach, not just what to teach. And it requires creating an environment where students can learn effectively.'",
  
  "Explain professional characteristics preview: 'We'll explore professional characteristics: integrity, responsibility, respect, professionalism, and ethical behavior. These aren't optional - they're the foundation of trust between instructor and student. Without trust, effective teaching is impossible.'",
  
  "Explain instructional techniques preview: 'We'll discuss instructional techniques: organization, clarity, enthusiasm, and adaptability. The best instructors organize material logically, explain clearly, show enthusiasm for teaching, and adapt their methods to student needs. We'll explore how to develop each of these.'",
  
  "Explain communication skills preview: 'We'll cover communication skills: active listening, effective questioning, clear explanations, and appropriate feedback. Communication is the foundation of instruction - without effective communication, even the best knowledge won't transfer to students.'",
  
  "Explain learning environment preview: 'We'll explore how to create a positive learning environment: establishing rapport, maintaining professionalism, managing the classroom effectively, and promoting student engagement. The environment you create directly affects student learning and motivation.'",
  
  "Explain common errors in professional teaching: 'Common errors instructors make include: focusing only on technical knowledge and ignoring teaching skills, failing to maintain professional boundaries, using inappropriate communication styles, not adapting to student needs, and creating negative learning environments. We'll address each of these today.'",
  
  "Set CFI context: 'On your CFI checkride, you'll be asked to teach this topic. The examiner wants to see that you understand not just the theory, but how to apply it. You'll need to demonstrate professional characteristics, effective instructional techniques, and the ability to create a positive learning environment. This lesson prepares you for that.'",
  
  "Preview lesson structure: 'We'll cover this in several phases: first, we'll explore professional characteristics and why they matter. Then we'll discuss instructional techniques and how to develop them. Next, we'll cover communication skills and their role in effective teaching. Finally, we'll explore how to create and maintain a positive learning environment. Each phase builds on the previous one.'",
  
  "Ask for questions before proceeding: 'Before we dive in, do you have any questions about what we'll cover today? What professional characteristics do you think are most important for flight instructors?'"
];

lp.teachingScript[0].studentActions = [
  "Share personal experiences with effective instructors when prompted",
  "Engage in discussion and ask questions",
  "Review reference materials when shown",
  "Take notes on key concepts",
  "Reflect on own learning experiences",
  "Participate in opening discussion about effective teaching",
  "Ask clarifying questions about lesson structure",
  "Share examples of professional or unprofessional instructor behavior",
  "Identify personal strengths and areas for improvement",
  "Engage with instructor's questions and scenarios"
];

lp.teachingScript[0].keyPoints = [
  "Professional characteristics are the foundation of effective teaching - integrity, responsibility, and respect build trust",
  "Instructional competence requires knowing how to teach, not just what to teach - develop teaching skills deliberately",
  "Communication skills are essential - effective instruction requires clear explanations, active listening, and appropriate feedback",
  "Learning environment directly affects student success - create positive, professional, engaging environments",
  "Professional boundaries must be maintained - build rapport while maintaining appropriate instructor-student relationships",
  "Instructional techniques must be developed - organization, clarity, enthusiasm, and adaptability are skills to practice",
  "Effective teaching integrates multiple elements - professional characteristics, instructional techniques, and communication work together",
  "Continuous improvement is essential - excellent instructors constantly develop their teaching skills and professional characteristics"
];

// Save
console.log('\nSaving enhanced lesson...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully enhanced LP-I-E`);
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

