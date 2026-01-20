#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const lp = data.lessonPlans.find(l => l.id === 'LP-I-B');
const p4 = lp.teachingScript.find(p => p.phase.includes('Laws of Learning'));
p4.instructorActions[12] = "Ask for application examples: 'Can you think of a time during your flight training when one of these laws was violated? For example, maybe your instructor taught you something incorrectly the first time (violating Primacy), or you practiced a maneuver once and never reviewed it (violating Exercise and Recency). How did that affect your learning?'";
if (lp.diagrams.length < 2) {
  lp.diagrams = [
    {
      title: 'Three Domains of Learning',
      description: 'Visual representation of the three interconnected domains of learning: Cognitive (knowing), Affective (feeling/judging), and Psychomotor (doing).',
      type: 'basic',
      asciiArt: '     ┌─────────────┐\n     │  COGNITIVE  │\n     │   (Knowing) │\n     └──────┬──────┘\n            │\n  ┌────────┴────────┐\n  │                 │\n┌─┴────┐      ┌─────┴─┐\n│AFFECT│      │PSYCHO│\n│(Feel)│      │(Doing)│\n└──────┘      └──────┘',
      keyPoints: ['Cognitive: Facts, concepts, procedures', 'Affective: Attitudes, values, emotions', 'Psychomotor: Physical skills, coordination', 'All three domains are interconnected', 'Most flight training involves all three domains at once']
    },
    {
      title: 'Laws of Learning - REEPIR',
      description: 'The six fundamental laws of learning that govern how people learn effectively.',
      type: 'basic',
      asciiArt: 'REEPIR - Laws of Learning\n\nR - Readiness: Student must be ready to learn\nE - Exercise: Practice strengthens learning\nE - Effect: Learning strengthened by pleasant experiences\nP - Primacy: First learning is strongest\nI - Intensity: Vivid experiences are better remembered\nR - Recency: Most recent learning is best remembered',
      keyPoints: ['Readiness: Ensure student is prepared', 'Exercise: Repetition strengthens skills', 'Effect: Positive experiences enhance learning', 'Primacy: First impressions are lasting', 'Intensity: Vivid experiences are better remembered', 'Recency: Review recently learned material']
    }
  ];
}
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ Fixed LP-I-B - removed duplicate, added diagrams');
try { JSON.parse(fs.readFileSync(jsonPath, 'utf8')); console.log('✅ JSON valid'); } catch(e) { console.log('❌ JSON invalid:', e.message); process.exit(1); }


