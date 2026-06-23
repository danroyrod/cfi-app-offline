/**
 * Enhance Weak Lesson Plans
 * Fixes LP-V-C (Grade F) and adds missing dimensions to bottom-10 plans.
 * 
 * Run: node scripts/enhance-weak-plans.cjs
 */

const fs = require('fs');
const path = require('path');

const LP_PATH = path.join(__dirname, '..', 'src', 'lessonPlansData.json');
const lp = JSON.parse(fs.readFileSync(LP_PATH, 'utf-8'));

function findPlan(id) {
  return lp.lessonPlans.find(p => p.id === id);
}

// =====================================================
// Part 1: Fix LP-V-C (Engine Starting) — Grade F → A
// =====================================================
const lpVC = findPlan('LP-V-C');
if (lpVC) {
  console.log('Enhancing LP-V-C (Engine Starting)...');

  lpVC.keyTeachingPoints = [
    "Always announce 'Clear!' loudly before engaging the starter — ensure the propeller area is free of people and obstacles",
    "Oil pressure must rise within 30 seconds of engine start; if it does not, shut down immediately to prevent engine damage",
    "For carbureted engines: mixture idle cutoff before start, then move to rich when engine fires; for fuel-injected: mixture full rich before start",
    "Hot start procedure differs significantly from cold start — recognize when engine is heat-soaked and adjust technique accordingly",
    "Engine fire during start: continue cranking to draw fuel into engine, mixture idle cutoff, throttle full open, master off, evacuate if fire persists",
    "Never over-prime the engine — excess fuel is the primary cause of engine fires during start",
    "Post-start verification sequence: oil pressure, RPM stable, engine instruments green, electrical system charging, controls free",
    "Teach students to develop a flow pattern for pre-start checks rather than relying solely on a checklist",
    "Each aircraft type has specific starting procedures in the POH — never assume procedures transfer between aircraft"
  ];

  lpVC.commonErrors = [
    "Failure to visually clear the propeller area and announce 'Clear!' before starting",
    "Over-priming the engine, leading to flooded condition or potential fire",
    "Not monitoring oil pressure immediately after start — missing the 30-second critical window",
    "Using cold-start procedure on a hot engine, causing flooding and difficult start",
    "Leaving the master switch on during pre-start checks, draining the battery",
    "Failure to set parking brake before start, allowing aircraft to move when engine catches"
  ];

  lpVC.completionStandards = [
    {
      standard: "Perform correct pre-start checks including clearing the propeller area, verifying controls, fuel system, and electrical system",
      acsReference: "AI.V.C.S1",
      tolerance: ""
    },
    {
      standard: "Execute engine starting procedure per POH for both carbureted and fuel-injected engines",
      acsReference: "AI.V.C.S2",
      tolerance: ""
    },
    {
      standard: "Demonstrate correct hot start procedure when engine is heat-soaked",
      acsReference: "AI.V.C.S3",
      tolerance: ""
    },
    {
      standard: "Describe and demonstrate immediate actions for engine fire during start",
      acsReference: "AI.V.C.S4",
      tolerance: ""
    },
    {
      standard: "Verify oil pressure rise within 30 seconds and complete post-start checks",
      acsReference: "AI.V.C.S5",
      tolerance: "Oil pressure within 30 seconds"
    }
  ];

  lpVC.safetyConsiderations = [
    "Engine fire on start is a serious emergency — know and practice immediate actions before first flight",
    "Never leave the throttle unattended during engine start; be ready to shut down immediately",
    "Hot propeller area: treat every propeller as if it could move at any time, even with the engine off",
    "Fuel vapors are highly flammable — avoid starting near fuel spills or in enclosed spaces"
  ];

  lpVC.instructorNotes = [
    "Demonstrate both cold and hot start procedures; explain the difference in fuel state clearly",
    "Practice engine fire response on the ground (simulated) before first flight — students must react instinctively",
    "Emphasize that each aircraft POH has specific procedures — never assume transfer from one type to another",
    "Use scenario-based questions: 'Oil pressure hasn't risen after 20 seconds — what do you do?'"
  ];

  lpVC.diagrams = [
    {
      title: "Engine Start Decision Flow",
      description: "Decision flowchart for engine starting covering cold start, hot start, and fire emergency paths",
      type: "overview",
      asciiArt: "START → Pre-Start Checks Complete? → [No] → Complete Checks\n                                    → [Yes] → Engine Cold or Hot?\n  COLD → Mixture ICO (carb) / Rich (injected) → Throttle Cracked → Starter Engage → Engine Fires?\n    → [Yes] → Mixture Rich → Oil Pressure in 30s? → [Yes] → Post-Start Checks → READY\n    → [No within 30s] → SHUT DOWN IMMEDIATELY\n  HOT → Mixture ICO → Throttle Full Open → Crank to Clear → Mixture Rich → Throttle Cracked → Start\n  FIRE → Continue Cranking → Mixture ICO → Throttle Full → Master Off → Evacuate if persists"
    }
  ];

  console.log('  ✅ LP-V-C enhanced: +9 key points, +6 errors, +5 standards, +4 safety, +4 notes, +1 diagram');
}

// =====================================================
// Part 2: Add missing diagrams and safety to bottom plans
// =====================================================

// LP-II-D: Principles of Flight
const lpIID = findPlan('LP-II-D');
if (lpIID) {
  console.log('Enhancing LP-II-D (Principles of Flight)...');
  lpIID.diagrams = [
    {
      title: "Four Forces of Flight",
      description: "Diagram showing the relationship between lift, weight, thrust, and drag in straight-and-level flight, climbs, and descents",
      type: "basic",
      asciiArt: "         LIFT ↑\n           |\n  DRAG ← ─┼─ → THRUST\n           |\n         ↓ WEIGHT\n\nStraight & Level: L=W, T=D\nClimb: Thrust component > Drag\nDescent: Weight component > Lift"
    },
    {
      title: "Angle of Attack vs Lift",
      description: "Shows how lift increases with angle of attack until critical angle (stall), emphasizing that stall occurs at a specific AOA regardless of airspeed",
      type: "basic",
      asciiArt: "Lift ↑\n     |        * (Critical AOA / Stall)\n     |      *\n     |    *\n     |  *\n     |*\n     +──────────→ Angle of Attack\n     0°   5°  10°  15°  18°(critical)"
    }
  ];
  lpIID.safetyConsiderations = [
    "Stall occurs at a critical angle of attack regardless of airspeed, attitude, or power setting — students must understand this fundamental principle",
    "Load factor increases in turns — at 60° bank, load factor is 2G and stall speed increases by 41%"
  ];
  console.log('  ✅ LP-II-D: +2 diagrams, +2 safety');
}

// LP-I-D: Student Evaluation, Assessment, and Testing
const lpID = findPlan('LP-I-D');
if (lpID) {
  console.log('Enhancing LP-I-D (Student Evaluation)...');
  lpID.diagrams = [
    {
      title: "Assessment Methods Overview",
      description: "Comparison of traditional vs authentic assessment methods and when to use each",
      type: "overview",
      asciiArt: "ASSESSMENT METHODS:\n├── Traditional (Written tests, oral quizzing)\n│   └── Best for: Knowledge recall, regulatory items\n├── Authentic (Scenario-based, performance)\n│   └── Best for: Decision-making, skill demonstration\n└── Oral Assessment\n    └── Best for: Real-time understanding check, ADM"
    }
  ];
  lpID.safetyConsiderations = [
    "Harsh or demoralizing critiques can cause students to hide mistakes rather than report them — creating hidden safety risks",
    "Recognize when a student is too stressed or fatigued to safely absorb evaluation feedback — defer critique if needed"
  ];
  console.log('  ✅ LP-I-D: +1 diagram, +2 safety');
}

// LP-I-E: Elements of Effective Teaching
const lpIE = findPlan('LP-I-E');
if (lpIE) {
  console.log('Enhancing LP-I-E (Effective Teaching)...');
  lpIE.diagrams = [
    {
      title: "Instructor Responsibilities Framework",
      description: "Overview of the five core instructor responsibilities and how they connect to safe flight training",
      type: "overview",
      asciiArt: "INSTRUCTOR RESPONSIBILITIES:\n1. Helping learners learn\n2. Providing adequate instruction\n3. Training to standards\n4. Emphasizing the positive\n5. Minimizing frustration\n   ↓\nAll support → SAFE, COMPETENT PILOTS"
    }
  ];
  lpIE.safetyConsiderations = [
    "An instructor who loses professional composure may cause students to feel unsafe, leading to reduced learning and hidden errors",
    "Recognize signs of student stress or overwhelm — pushing through when a student is saturated creates safety risks in the aircraft"
  ];
  console.log('  ✅ LP-I-E: +1 diagram, +2 safety');
}

// LP-II-C: Runway Incursion Avoidance
const lpIIC = findPlan('LP-II-C');
if (lpIIC) {
  console.log('Enhancing LP-II-C (Runway Incursion Avoidance)...');
  lpIIC.diagrams = [
    {
      title: "Airport Surface Markings & Signs",
      description: "Key surface markings and mandatory signs that prevent runway incursions",
      type: "safety",
      asciiArt: "HOLD SHORT MARKING: ══════ ─ ─ ─ ─ (two solid + two dashed)\n  → NEVER cross without clearance (or at non-towered: clear of traffic)\n\nSIGNS:\n  RED background = Mandatory (Hold position, runway boundary)\n  YELLOW background = Direction/Location (taxiway identifiers)\n  BLACK on YELLOW = Location sign (where you are)\n  YELLOW on BLACK = Direction sign (where to go)"
    },
    {
      title: "Hot Spot Awareness",
      description: "Concept of airport hot spots — areas with increased risk for runway incursions, found on airport diagrams",
      type: "safety",
      asciiArt: "HOT SPOTS (marked as HS-1, HS-2 on airport diagrams):\n  • Complex intersections\n  • Short taxiways between parallel runways\n  • Areas with limited visibility\n  → Always brief hot spots before taxi\n  → Extra vigilance at these locations"
    }
  ];
  lpIIC.safetyConsiderations = [
    "Never cross a hold-short line without explicit ATC clearance at towered airports, or without visually confirming the runway is clear at non-towered airports",
    "Maintain taxi speed slow enough to stop before any runway hold-short marking — if in doubt, STOP and clarify"
  ];
  console.log('  ✅ LP-II-C: +2 diagrams, +2 safety');
}

// LP-II-E: Aircraft Flight Controls and Operation of Systems
const lpIIE = findPlan('LP-II-E');
if (lpIIE) {
  console.log('Enhancing LP-II-E (Flight Controls/Systems)...');
  lpIIE.diagrams = [
    {
      title: "Primary Flight Controls",
      description: "The three primary flight controls, their axes of movement, and associated effects",
      type: "basic",
      asciiArt: "PRIMARY CONTROLS:\n  Ailerons  → Roll  (Longitudinal axis)  → Bank left/right\n  Elevator  → Pitch (Lateral axis)       → Nose up/down\n  Rudder    → Yaw   (Vertical axis)      → Nose left/right\n\nSECONDARY:\n  Flaps     → Lift/Drag modification\n  Trim      → Relieve control pressure"
    }
  ];
  lpIIE.safetyConsiderations = [
    "Always perform a control check before takeoff — verify free and correct movement of all flight controls",
    "Recognize symptoms of a jammed or disconnected control surface — immediate diversion and landing with available controls"
  ];
  console.log('  ✅ LP-II-E: +1 diagram, +2 safety');
}

// LP-II-A: Human Factors
const lpIIA = findPlan('LP-II-A');
if (lpIIA) {
  console.log('Enhancing LP-II-A (Human Factors)...');
  lpIIA.diagrams = [
    {
      title: "IMSAFE Checklist",
      description: "Personal fitness-for-flight assessment tool used before every flight",
      type: "safety",
      asciiArt: "I M S A F E:\n  I = Illness (Am I sick?)\n  M = Medication (Taking any?)\n  S = Stress (Emotional/mental load?)\n  A = Alcohol (8 hours/0.04% BAC rule)\n  F = Fatigue (Well rested?)\n  E = Eating/Emotion (Nourished? Emotional state?)\n\n→ ANY doubt = NO-GO decision"
    }
  ];
  lpIIA.safetyConsiderations = [
    "Hypoxia onset is insidious — symptoms are often unrecognized by the affected pilot; know personal altitude thresholds",
    "Recognize incapacitation signs in yourself and other pilots — practice assertive intervention when safety is at risk"
  ];
  console.log('  ✅ LP-II-A: +1 diagram, +2 safety');
}

// LP-II-F: Performance and Limitations
const lpIIF = findPlan('LP-II-F');
if (lpIIF) {
  console.log('Enhancing LP-II-F (Performance/Limitations)...');
  lpIIF.diagrams = [
    {
      title: "Density Altitude Effects",
      description: "How high elevation, high temperature, and high humidity degrade aircraft performance",
      type: "performance",
      asciiArt: "DENSITY ALTITUDE INCREASES WITH:\n  ↑ Field Elevation\n  ↑ Temperature (above standard)\n  ↑ Humidity (moisture displaces O2)\n\nEFFECTS:\n  • Longer takeoff roll\n  • Reduced climb rate\n  • Higher true airspeed for same indicated\n  • Reduced engine power output\n\nRULE: Hot + High + Humid = Dangerous"
    }
  ];
  lpIIF.safetyConsiderations = [
    "Weight and balance limits are structural limits — exceeding them risks structural failure, not just degraded performance",
    "High density altitude operations require planning: calculate takeoff distance and climb performance BEFORE committing to takeoff"
  ];
  console.log('  ✅ LP-II-F: +1 diagram, +2 safety');
}

// LP-III-A: Pilot Qualifications
const lpIIIA = findPlan('LP-III-A');
if (lpIIIA) {
  console.log('Enhancing LP-III-A (Pilot Qualifications)...');
  lpIIIA.diagrams = [
    {
      title: "Certificate & Privilege Structure",
      description: "Hierarchy of pilot certificates and the privileges/limitations at each level",
      type: "overview",
      asciiArt: "CERTIFICATE HIERARCHY:\n  Student → Sport → Recreational → Private → Commercial → ATP\n\nEACH REQUIRES:\n  • Age requirement\n  • Knowledge test\n  • Practical test (checkride)\n  • Medical certificate (appropriate class)\n  • English proficiency\n\nPRIVILEGES limited by:\n  • Certificate level\n  • Ratings held\n  • Currency requirements (90-day, BFR, medical)"
    }
  ];
  if (!lpIIIA.safetyConsiderations || lpIIIA.safetyConsiderations.length === 0) {
    lpIIIA.safetyConsiderations = [
      "Never exercise privileges beyond what your certificate, ratings, and currency allow — this is both a legal and safety issue"
    ];
  }
  console.log('  ✅ LP-III-A: +1 diagram, +1 safety');
}

// LP-I-B: Learning Process
const lpIB = findPlan('LP-I-B');
if (lpIB) {
  console.log('Enhancing LP-I-B (Learning Process)...');
  if (!lpIB.safetyConsiderations || lpIB.safetyConsiderations.length === 0) {
    lpIB.safetyConsiderations = [
      "Recognize when a student has hit a learning plateau or is overwhelmed — pushing through cognitive saturation in the aircraft creates safety risk",
      "Fatigue significantly impairs learning and memory formation — schedule demanding lessons when students are fresh, not at end of long days"
    ];
  }
  console.log('  ✅ LP-I-B: +2 safety');
}

// =====================================================
// Save
// =====================================================
fs.writeFileSync(LP_PATH, JSON.stringify(lp, null, 2) + '\n', 'utf-8');
console.log('\n✅ All enhancements written to lessonPlansData.json');
