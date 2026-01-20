#!/usr/bin/env node
/**
 * Add diagrams to a specific lesson plan
 * Usage: node scripts/add_diagrams.js <LESSON_ID>
 * Example: node scripts/add_diagrams.js LP-VII-L
 */

const fs = require('fs');
const path = require('path');

const lessonId = process.argv[2];

if (!lessonId) {
  console.log('Usage: node scripts/add_diagrams.js <LESSON_ID>');
  console.log('Example: node scripts/add_diagrams.js LP-VII-L');
  process.exit(1);
}

const jsonPath = path.join(__dirname, '..', 'src', 'lessonPlansData.json');

// Load JSON
console.log(`Loading ${jsonPath}...`);
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Find lesson
const lp = data.lessonPlans.find(l => l.id === lessonId);

if (!lp) {
  console.log(`Error: ${lessonId} not found`);
  process.exit(1);
}

console.log(`Found: ${lp.title}`);
console.log(`Current diagrams: ${lp.diagrams.length}`);

// Define diagrams for each lesson
const diagramsMap = {
  'LP-VII-L': [
    {
      "title": "Rough Water Landing Profile",
      "description": "Visual representation of rough water landing showing higher approach speed, power-on approach, wave crest touchdown technique, and firm touchdown acceptance.",
      "type": "landing-sequence",
      "imageUrl": "/images/mark-berry/landing_sequence.png",
      "keyPoints": [
        "Higher approach speed needed - typically 5-10 knots faster than calm water",
        "Power-on approach provides active control throughout",
        "Wave crest touchdown reduces impact when timing allows",
        "Firm touchdown acceptable and safer than trying to make it soft"
      ]
    },
    {
      "title": "Wave Crest Touchdown - Rough Water",
      "description": "Diagram explaining wave crest touchdown technique and why touching down on the crest of a wave reduces impact.",
      "type": "basic",
      "asciiArt": "ROUGH WATER LANDING - WAVE CREST TOUCHDOWN\n\nWAVE PROFILE:\n        ╱╲\n       ╱  ╲\n      ╱    ╲  ← Wave crest (moving up)\n     ╱      ╲\n    ╱        ╲\n   ╱          ╲\n  ╱            ╲\n ╱              ╲\n╱                ╲\n│   AIRCRAFT      │  ← Touch down here\n│   TOUCHDOWN     │     (crest moving up)\n│   ON CREST      │     (reduces impact)\n│────────────────│\n\nKEY POINTS:\n✓ Touch down on wave crest - crest moving up reduces impact\n✓ Don't force timing - if can't time it, accept firm touchdown\n✓ Higher approach speed - 5-10 knots faster than calm water\n✓ Power-on approach - provides control authority\n✗ Don't try to make touchdown soft - causes ballooning\n✗ Don't force wave crest timing - causes errors",
      "keyPoints": [
        "Touch down on wave crest when timing allows - crest moving up reduces impact",
        "Don't force wave crest timing - if can't time it right, accept firm touchdown",
        "Higher approach speed provides control authority in rough conditions",
        "Power-on approach essential - provides active control throughout"
      ]
    },
    {
      "title": "Power-On Approach - Rough Water",
      "description": "Illustration showing why power-on approach is essential for rough water landings, demonstrating control authority provided by power.",
      "type": "basic",
      "imageUrl": "/images/mark-berry/landing_sequence.png",
      "keyPoints": [
        "Power-on approach provides control authority - can correct for wave effects",
        "Rough water requires active control - can't just glide in",
        "Power controls approach speed and descent rate in rough conditions",
        "Without power, lose control authority when waves affect airplane"
      ]
    }
  ],
  'LP-VII-N': [
    {
      "title": "Go-Around Sequence",
      "description": "Visual representation of the complete go-around sequence showing power application, rudder control, pitch for VY, and incremental flap retraction.",
      "type": "basic",
      "asciiArt": "GO-AROUND SEQUENCE\n\nAPPROACH (UNSTABLE):\n    ╱╲\n   ╱  ╲  ← Too high, too fast\n  ╱    ╲\n ╱      ╲\n╱        ╲\n│         │\n│ DECISION│  ← By 500 AGL\n│ POINT   │\n│         │\n│         │\n│─────────│\n\nGO-AROUND EXECUTION:\n1. Announce: 'Going around!' (radio)\n2. Full power smoothly but decisively\n3. Right rudder immediately (with power)\n4. Pitch for VY (power first, then pitch)\n5. Retract flaps incrementally\n6. Establish positive rate of climb\n7. Climb to pattern altitude\n\nKEY POINTS:\n✓ Decision by 500 AGL - earlier is better\n✓ Power and rudder simultaneous\n✓ Power first, then pitch (prevents settling)\n✓ Flaps incremental (prevents sink)\n✗ Don't hesitate - immediate execution\n✗ Don't pitch before power - causes settling\n✗ Don't retract all flaps at once - causes sink",
      "keyPoints": [
        "Decision must be made by 500 AGL - earlier is better",
        "Power and rudder application must be simultaneous",
        "Power first, then pitch - prevents settling",
        "Flaps retracted incrementally - prevents sink"
      ]
    },
    {
      "title": "Settling Prevention - Go-Around",
      "description": "Diagram explaining why power must be applied before pitch to prevent settling during go-around.",
      "type": "basic",
      "imageUrl": "/images/mark-berry/landing_sequence.png",
      "keyPoints": [
        "Pitching up before power causes settling - airplane loses altitude",
        "Power first provides energy to climb - then pitch for VY",
        "Settling can result in ground contact or obstacle strike",
        "Sequence: power, rudder, pitch - not pitch, power"
      ]
    },
    {
      "title": "Go-Around Decision Criteria",
      "description": "Visual guide showing when a go-around is necessary, emphasizing early decision making.",
      "type": "basic",
      "imageUrl": "/images/mark-berry/landing_sequence.png",
      "keyPoints": [
        "Unstabilized approach requires go-around",
        "Too high, too low, too fast, too slow - go around",
        "Not aligned, obstacles, traffic - go around",
        "Decision by 500 AGL - don't wait until over runway"
      ]
    }
  ],
  'LP-VII-O': [
    {
      "title": "Power-Off 180° Approach Profile",
      "description": "Visual representation of power-off 180° accuracy approach showing the complete sequence from abeam touchdown point through base and final turns to touchdown.",
      "type": "landing-sequence",
      "imageUrl": "/images/mark-berry/landing_sequence.png",
      "keyPoints": [
        "Abeam touchdown point - power to idle, establish best glide speed",
        "Base turn timing is critical - too early = too high, too late = too low",
        "Final turn timing is critical - judgment determines when to turn",
        "Adjustments using slips and flaps manage energy throughout approach"
      ]
    },
    {
      "title": "Energy Management - Power-Off 180°",
      "description": "Diagram explaining energy management principles in power-off 180° approaches.",
      "type": "basic",
      "asciiArt": "POWER-OFF 180° - ENERGY MANAGEMENT\n\nENERGY TYPES:\n  Potential Energy = Altitude\n  Kinetic Energy = Airspeed\n\nENERGY CONVERSION:\n  Descending = Potential → Kinetic\n  Climbing = Kinetic → Potential\n\nTOO HIGH (Too much energy):\n  ✓ Use forward slip - steepens descent\n  ✓ Extend flaps - increases drag\n  ✓ Turn base/final earlier - uses more distance\n\nTOO LOW (Too little energy):\n  ✓ Reduce drag - extend glide\n  ✓ Turn base/final later - uses less distance\n  ✓ Maintain best glide speed precisely\n\nJUDGMENT:\n  Assess energy state continuously\n  Make adjustments early\n  Too high = can fix with slips/flaps\n  Too low = committed, may not make runway",
      "keyPoints": [
        "Energy management is continuous - assess altitude and distance throughout",
        "Too high: use slips and flaps to increase drag and steepen descent",
        "Too low: reduce drag, extend glide, may be committed to landing",
        "Best glide speed is critical - maintains maximum glide distance"
      ]
    },
    {
      "title": "Turn Timing Judgment - Power-Off 180°",
      "description": "Illustration showing how turn timing affects approach path, demonstrating why judgment is critical.",
      "type": "basic",
      "imageUrl": "/images/mark-berry/landing_sequence.png",
      "keyPoints": [
        "Base turn too early = too high = must use slips/flaps to lose altitude",
        "Base turn too late = too low = may not make runway",
        "Final turn timing is equally critical - judgment determines when to turn",
        "Practice builds judgment and sight picture recognition"
      ]
    }
  ]
};

if (!diagramsMap[lessonId]) {
  console.log(`Error: No diagrams defined for ${lessonId}`);
  console.log(`Available lessons: ${Object.keys(diagramsMap).join(', ')}`);
  process.exit(1);
}

// Add diagrams
lp.diagrams = diagramsMap[lessonId];

// Save
console.log(`Saving ${jsonPath}...`);
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Successfully added ${lp.diagrams.length} diagrams to ${lessonId}`);

// Verify JSON is valid
try {
  JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log('✅ JSON validation passed');
} catch (e) {
  console.log('❌ JSON validation failed:', e.message);
  process.exit(1);
}
