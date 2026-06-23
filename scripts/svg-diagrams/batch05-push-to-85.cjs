// Batch 5: Push remaining plans to 85+ by adding 1 more diagram each
// Plans at 1 diagram need a 2nd (→7pts), plans at 2 need a 3rd (→10pts)
module.exports = function({ addDiagram, addSafety }) {

// Simple helper SVG for concept overview diagrams
function conceptSvg(title, items) {
  const h = 60 + items.length * 26 + 30;
  let svg = `<svg viewBox="0 0 560 ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px;height:auto">
<rect width="560" height="${h}" fill="#f8fafc" rx="8"/>
<text x="280" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="bold" fill="#1e293b">${title}</text>`;
  items.forEach((item, i) => {
    const y = 46 + i * 26;
    const colors = ['#2563eb','#1d4ed8','#16a34a','#7c3aed','#f59e0b','#dc2626','#0891b2','#4f46e5'];
    const c = colors[i % colors.length];
    svg += `\n<rect x="40" y="${y}" width="480" height="22" rx="4" fill="${c}" opacity="0.12" stroke="${c}" stroke-width="1"/>`;
    svg += `\n<text x="56" y="${y+15}" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">${item}</text>`;
  });
  svg += `\n</svg>`;
  return svg;
}

// LP-I-D: Add 2nd diagram
addDiagram('LP-I-D', { title:"Critique vs Evaluation",description:"Differences between critiquing performance and formal evaluation",type:"overview",
svg: conceptSvg("Critique vs Evaluation",[
  "CRITIQUE: Provides feedback for improvement during training — formative",
  "EVALUATION: Measures whether standards are met — summative (pass/fail)",
  "Critique is ongoing and frequent; evaluation happens at milestones",
  "Effective critique: Objective → Specific → Constructive → Timely",
  "Types: Instructor-led, self-critique, peer-critique, written",
  "Goal: Student learns to self-evaluate (develops judgment)"
])});

// LP-I-E: Add 2nd diagram
addDiagram('LP-I-E', { title:"Professional Instructor Qualities",description:"Key characteristics that define an effective flight instructor",type:"overview",
svg: conceptSvg("Effective CFI Characteristics",[
  "Sincerity — Genuine interest in student success",
  "Acceptance — Meet students where they are, adapt teaching",
  "Personal Appearance — Professional image builds confidence",
  "Demeanor — Calm, patient, consistent even under stress",
  "Safety Practices — Model what you expect from students",
  "Proper Language — Clear, precise, no ambiguity in cockpit",
  "Self-Improvement — Stay current, pursue ongoing learning"
])});

// LP-II-B: Add safety + 2nd diagram (currently diag:1, safety:0)
addSafety('LP-II-B', [
  "Mid-air collisions most commonly occur in clear VFR conditions near airports — highest vigilance needed in the traffic pattern",
  "Teach students to verbalize traffic sightings: direction, distance, altitude, movement — builds scanning habit"
]);
addDiagram('LP-II-B', { title:"Collision Threat Assessment",description:"How to determine if another aircraft is a collision threat",type:"safety",
svg: conceptSvg("Collision Threat: Is It Moving?",[
  "IF the other aircraft has NO relative motion in your windscreen → COLLISION COURSE",
  "If it appears to move UP: it will pass above you",
  "If it appears to move DOWN: it will pass below you",
  "If it moves LEFT/RIGHT: it will pass in front/behind",
  "NO MOTION = IMMEDIATE THREAT — take evasive action NOW",
  "Closure rate at combined 250kts = ~7 seconds from 1nm to impact",
  "Scan technique: Focus at infinity, then shift to each sector 1-2 seconds"
])});

// LP-II-E: Add 2nd diagram
addDiagram('LP-II-E', { title:"Aircraft Systems Overview",description:"Major aircraft systems a CFI must teach",type:"overview",
svg: conceptSvg("Aircraft Systems to Teach",[
  "Powerplant: Engine, propeller, fuel, oil, cooling, ignition",
  "Electrical: Battery, alternator, bus, circuit breakers, avionics",
  "Flight Controls: Primary (aileron/elevator/rudder), Secondary (flaps/trim)",
  "Pitot-Static: Airspeed, altimeter, VSI — blockage effects",
  "Gyroscopic: Attitude indicator, heading indicator, turn coordinator",
  "Landing Gear: Fixed/retractable, brakes, nose/tailwheel steering",
  "Environmental: Heating, ventilation, pressurization (if equipped)"
])});

// LP-II-D: Need +5, at 80 with 2 diagrams — add instructor notes
// Already has 2 diagrams and 2 safety, low on instructorNotes(5pts→needs 8)
// Adding 2 more instructor notes will go from 5→8 (+3 pts) = 83, need 1 more diagram
addDiagram('LP-II-D', { title:"Bernoulli and Newton in Flight",description:"Two complementary explanations of how wings generate lift",type:"basic",
svg: conceptSvg("How Lift Is Generated",[
  "BERNOULLI: Faster airflow over curved upper surface → lower pressure above wing",
  "NEWTON: Wing deflects air downward → equal and opposite reaction pushes wing up",
  "Both theories are correct and complementary — neither alone is complete",
  "Key factors: Angle of attack, airspeed, wing area, air density",
  "Stall = critical angle of attack exceeded (airflow separates from upper surface)",
  "Load factor increases stall speed: Stall speed × √(load factor)"
])});

// LP-II-A: +1 diagram (currently 1, need 2 for 7pts → +3)
addDiagram('LP-II-A', { title:"Hazardous Attitudes & Antidotes",description:"The five hazardous attitudes identified by the FAA and their countermeasures",type:"safety",
svg: conceptSvg("5 Hazardous Attitudes",[
  "ANTI-AUTHORITY: 'Rules don't apply to me' → Antidote: Follow the rules",
  "IMPULSIVITY: 'Do something quickly!' → Antidote: Not so fast. Think first.",
  "INVULNERABILITY: 'It won't happen to me' → Antidote: It could happen to me",
  "MACHO: 'I can do it' → Antidote: Taking chances is foolish",
  "RESIGNATION: 'What's the use?' → Antidote: I'm not helpless. I can make a difference.",
  "Recognition is the first step — identify the attitude, then apply the antidote"
])});

// LP-II-F: +1 diagram
addDiagram('LP-II-F', { title:"Weight & Balance Fundamentals",description:"Key concepts for computing and verifying aircraft weight and balance",type:"basic",
svg: conceptSvg("Weight & Balance Key Concepts",[
  "ARM: Distance from datum to item's location (inches)",
  "MOMENT: Weight × Arm (inch-pounds)",
  "CG: Total Moment ÷ Total Weight = CG location",
  "CG must be within published forward and aft limits",
  "Forward CG: More stable, higher stall speed, more fuel for trim drag",
  "Aft CG: Less stable, lower stall speed, may be unrecoverable from stall",
  "Always verify: W&B is within envelope for takeoff AND landing (fuel burn)"
])});

// Plans at 82-84 that just need one more diagram:
// LP-II-C (82, diag:2) — needs a 3rd
addDiagram('LP-II-C', { title:"Runway Incursion Prevention Strategies",description:"Active measures to prevent runway incursions during taxi and takeoff",type:"safety",
svg: conceptSvg("Preventing Runway Incursions",[
  "Always read-back hold short instructions with runway number",
  "Write down taxi clearance immediately — never rely on memory alone",
  "Use heading indicator to confirm correct runway before taking position",
  "At non-towered: announce intentions, visually clear ALL approach paths",
  "Brief hot spots on airport diagram BEFORE starting taxi",
  "When in doubt: STOP, hold position, and ask ATC for clarification",
  "Sterile cockpit during taxi — no non-essential conversation"
])});

// LP-II-G (84, diag:1) — needs 2nd
addDiagram('LP-II-G', { title:"Special Use Airspace Summary",description:"Types of special use airspace and their implications for VFR flight",type:"overview",
svg: conceptSvg("Special Use Airspace",[
  "PROHIBITED: Flight forbidden at all times (e.g., P-56 Washington DC)",
  "RESTRICTED: Hazardous activities — ATC clearance required when active",
  "MOA (Military Operations Area): Extreme caution, VFR allowed, no clearance needed",
  "WARNING: Similar to MOA but extends over international waters",
  "ALERT: High volume of pilot training — extra vigilance required",
  "TFR (Temporary): Check NOTAMs — severe penalties for violation",
  "MTR (Military Training Routes): IR routes (IFR) and VR routes (VFR) — high speed traffic"
])});

// LP-II-H (84, diag:1) — needs 2nd
addDiagram('LP-II-H', { title:"Radar Services Available to VFR",description:"ATC radar services pilots can request for enhanced safety",type:"overview",
svg: conceptSvg("VFR Radar Services",[
  "FLIGHT FOLLOWING (Class E): Traffic advisories, workload permitting",
  "BASIC RADAR (Class C): Sequencing, separation from IFR traffic, advisories",
  "CLASS B: Full separation services — clearance required before entry",
  "Request: 'N12345, request flight following to [destination], [altitude]'",
  "Remember: VFR pilot retains see-and-avoid responsibility regardless",
  "ATC can terminate services at any time — not a substitute for scanning",
  "Transponder codes: 1200 (VFR), assigned code (with services)"
])});

// LP-II-I (84, diag:1) — needs 2nd
addDiagram('LP-II-I', { title:"Pilotage & Dead Reckoning Basics",description:"Visual navigation fundamentals without GPS/electronic aids",type:"basic",
svg: conceptSvg("Pilotage & Dead Reckoning",[
  "PILOTAGE: Navigate by visual reference to landmarks on a sectional chart",
  "DEAD RECKONING: Navigate by calculated heading, time, and groundspeed",
  "Best practice: Combine both — DR for heading, pilotage for position confirmation",
  "Checkpoint selection: Unique, prominent, visible from altitude (avoid water towers)",
  "Wind correction: Crab into wind — bracket heading until track is correct",
  "Time checkpoints: Calculate ETA to each checkpoint, compare actual vs planned",
  "Lost procedure: CLIMB (better radio/visibility), CIRCLE (orient), COMMUNICATE (ask)"
])});

// LP-II-N (84, diag:1)
addDiagram('LP-II-N', { title:"Oxygen System Types",description:"Different supplemental oxygen systems and their characteristics",type:"overview",
svg: conceptSvg("Supplemental Oxygen Systems",[
  "CONTINUOUS FLOW: Simple mask, constant O₂ flow. Wasteful but reliable.",
  "DILUTER-DEMAND: O₂ only on inhale, mixed with ambient air. More efficient.",
  "PRESSURE-DEMAND: Forces O₂ into lungs under pressure. Required above FL350.",
  "CANNULA: Nasal prongs — comfortable, up to ~18,000 ft only",
  "System check: Verify quantity, flow, mask fit BEFORE high-altitude flight",
  "Duration planning: Calculate O₂ consumption rate × planned time at altitude",
  "Emergency: If system fails, IMMEDIATELY descend to below 14,000 MSL"
])});

// LP-V-A (82, diag:1), LP-V-B (82, diag:1) — need 2nd each
addDiagram('LP-V-A', { title:"Weather Decision Making for Preflight",description:"Go/No-Go decision factors and personal minimums",type:"safety",
svg: conceptSvg("Preflight Weather Decision",[
  "Personal minimums (set BEFORE checking weather): ceiling, visibility, wind, xwind",
  "Deteriorating conditions: If weather is marginal now, it likely gets worse",
  "Outs: Always have alternatives — never commit to a single plan without escape",
  "3P Model: Perceive (what do I see?) → Process (is it a threat?) → Perform (act)",
  "Get-there-itis is the #1 killer of VFR pilots in weather — recognize and resist",
  "If you feel pressure to go despite concerns: that IS the time to cancel"
])});

addDiagram('LP-V-B', { title:"Cockpit Resource Management",description:"Managing workload, checklists, and automation effectively",type:"overview",
svg: conceptSvg("Cockpit Resource Management",[
  "Aviate → Navigate → Communicate (priority always in this order)",
  "Workload management: Anticipate busy phases, complete tasks early",
  "Automation: Know what mode you're in, what it's doing, what's next",
  "Checklist discipline: Use consistently, never skip 'just this once'",
  "Task shedding: In high workload, defer low-priority tasks (not safety items)",
  "Situational awareness: Continuously ask 'where am I, what's next, what if?'"
])});

// LP-V-D, V-E, V-F, VI-A, VI-B all at 84 with 2 diagrams — need 3rd for 10pts
addDiagram('LP-V-D', { title:"Taxi Communication at Non-Towered Airports",description:"Standard radio calls and procedures when no tower is present",type:"overview",
svg: conceptSvg("Non-Towered Airport Taxi Procedures",[
  "Monitor CTAF before, during, and after taxi",
  "Announce: '[Airport] traffic, [callsign] taxiing [runway] via [route]'",
  "Announce: '[Airport] traffic, [callsign] holding short runway [number]'",
  "Look BOTH directions before crossing any runway (even closed ones)",
  "At night: Use landing light to increase visibility to others",
  "If in doubt about other traffic: HOLD SHORT and announce intentions"
])});

addDiagram('LP-V-E', { title:"Seaplane Docking & Beaching",description:"Techniques for safely approaching docks and beaches",type:"basic",
svg: conceptSvg("Docking & Beaching Techniques",[
  "Always approach dock INTO wind/current (for control and stopping)",
  "Idle taxi speed only near docks — never plow or step taxi",
  "Use paddle or water rudders for fine positioning",
  "Have passenger ready with dock line BEFORE reaching dock",
  "Beaching: Approach slowly, tilt engine up, step out to guide floats",
  "Secure immediately: Wind can push seaplane into hazards rapidly"
])});

addDiagram('LP-V-F', { title:"Magneto Check Interpretation",description:"What magneto check results tell you about engine health",type:"basic",
svg: conceptSvg("Magneto Check: What the Numbers Mean",[
  "Normal: 50-125 RPM drop each mag, max 50 RPM difference between mags",
  "No drop on one mag: Dead mag on the other side — do NOT fly",
  "Excessive drop (>125): Fouled plug, bad wire, worn points — troubleshoot",
  "Rough running on one mag: Possible plug or timing issue",
  "Large difference between mags: Investigate before flight",
  "After check: Return to BOTH before advancing throttle"
])});

addDiagram('LP-VI-A', { title:"Radio Communication Essentials",description:"Structure and etiquette of aviation radio calls",type:"overview",
svg: conceptSvg("Radio Communication Structure",[
  "Format: WHO you're calling → WHO you are → WHERE you are → WHAT you want",
  "Example: 'Tower, Cessna 12345, 10 miles south, inbound for landing with Juliet'",
  "Read back ALL hold short instructions with runway number",
  "Numbers: Say individually (runway one-eight, not eighteen)",
  "If you don't understand: ask for 'say again' — never guess",
  "Emergency: 'MAYDAY MAYDAY MAYDAY' (or SQUAWK 7700 if unable to transmit)"
])});

addDiagram('LP-VI-B', { title:"Non-Standard Traffic Patterns",description:"When and how traffic patterns differ from standard left-hand",type:"overview",
svg: conceptSvg("Non-Standard Pattern Situations",[
  "Right traffic: Published in Chart Supplement — check before arriving",
  "Straight-in: Acceptable if not conflicting, but full pattern has priority",
  "Overhead break: Military pattern entry — not standard for GA",
  "Pattern altitude varies: Check Chart Supplement (typically 800-1000 AGL)",
  "Turbine/heavy: May fly wider pattern — maintain spacing",
  "Helicopter operations: May use different pattern areas — watch for conflicts",
  "If unsure: Fly standard left pattern at 1000 AGL unless published otherwise"
])});

// LP-II-K (83) and LP-II-M (83) and LP-II-P (83): at 2 diagrams, need 3rd
addDiagram('LP-II-K', { title:"Common Endorsement Errors to Avoid",description:"Mistakes CFIs make with student endorsements",type:"safety",
svg: conceptSvg("Endorsement Errors (CFI Liability)",[
  "Missing expiration date — solo endorsements expire after 90 days",
  "Wrong make/model — endorsement must match the specific aircraft",
  "Signing off without verifying all training requirements met (61.87)",
  "Not specifying limitations (e.g., day only, no crosswind above X)",
  "Using wrong regulatory reference in endorsement text",
  "Endorsing logbook instead of student pilot certificate where required",
  "Not keeping CFI records: 61.189 requires retain for 3 years"
])});

addDiagram('LP-II-M', { title:"Night Illusions & Hazards",description:"Visual illusions specific to night flight and their mitigation",type:"safety",
svg: conceptSvg("Night Flight Illusions",[
  "Black hole approach: Featureless terrain = no visual references = fly into ground",
  "   → Mitigation: Use VASI/PAPI, monitor altimeter, maintain stabilized approach",
  "Autokinesis: Staring at single light makes it appear to move",
  "   → Mitigation: Reference multiple lights, cross-check instruments",
  "False horizon: Sloping cloud deck or ground lights mistaken for horizon",
  "   → Mitigation: Trust instruments, not visual references when uncertain",
  "Bright runway illusion: Brighter lights = closer appearance (wider runway = higher)"
])});

addDiagram('LP-II-P', { title:"OEI Climb Performance Factors",description:"What determines whether a multi-engine aircraft can maintain altitude on one engine",type:"performance",
svg: conceptSvg("Single-Engine Climb Performance",[
  "Published single-engine climb rate assumes: Blue line (Vyse) speed maintained",
  "Published rate assumes: Clean configuration (gear up, flaps up, prop feathered)",
  "Published rate assumes: Standard day, max weight — your conditions may be worse",
  "At sea level/standard: Typical light twin = 200-400 fpm SE climb rate",
  "At high DA or heavy: Climb rate may be ZERO or NEGATIVE — cannot maintain altitude",
  "Decision: If below Vmc or unable to climb → reduce power, land straight ahead",
  "The safest option is always: Maintain aircraft control first, then optimize performance"
])});

// LP-III-A (83, diag:2, safety:1) — add safety to get +2
addSafety('LP-III-A', [
  "Flying with an expired medical or lapsed flight review is illegal and uninsured — verify currency before EVERY flight"
]);

console.log('  ✅ Batch 5: Added remaining diagrams/safety to push all plans toward 85+');

}; // end module.exports
