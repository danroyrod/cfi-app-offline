// Batch 1: Area I plans (LP-I-C, LP-I-F, LP-I-A, LP-I-B)
module.exports = function({ addDiagram, addSafety, addNotes }) {

// LP-I-C: Lesson Plan Structure
addDiagram('LP-I-C', {
  title: "Lesson Plan Structure",
  description: "Sequential components of an effective lesson plan",
  type: "overview",
  svg: `<svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="340" fill="#f8fafc" rx="8"/>
<text x="300" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Lesson Plan Components</text>
<rect x="200" y="42" width="200" height="32" rx="6" fill="#2563eb" opacity="0.9"/><text x="300" y="63" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Objective</text>
<path d="M300,74 L300,86" stroke="#94a3b8" stroke-width="2"/>
<rect x="200" y="86" width="200" height="32" rx="6" fill="#2563eb" opacity="0.8"/><text x="300" y="107" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Content / Key Points</text>
<path d="M300,118 L300,130" stroke="#94a3b8" stroke-width="2"/>
<rect x="200" y="130" width="200" height="32" rx="6" fill="#2563eb" opacity="0.7"/><text x="300" y="151" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Teaching Method</text>
<path d="M300,162 L300,174" stroke="#94a3b8" stroke-width="2"/>
<rect x="200" y="174" width="200" height="32" rx="6" fill="#2563eb" opacity="0.6"/><text x="300" y="195" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Practice / Application</text>
<path d="M300,206 L300,218" stroke="#94a3b8" stroke-width="2"/>
<rect x="200" y="218" width="200" height="32" rx="6" fill="#2563eb" opacity="0.5"/><text x="300" y="239" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Assessment / Evaluation</text>
<path d="M300,250 L300,262" stroke="#94a3b8" stroke-width="2"/>
<rect x="200" y="262" width="200" height="32" rx="6" fill="#16a34a"/><text x="300" y="283" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Completion Standards</text>
<rect x="80" y="304" width="440" height="26" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
<text x="300" y="321" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af">Each component builds on the previous — skip none</text>
</svg>`
});

// LP-I-C: Training Delivery Methods
addDiagram('LP-I-C', {
  title: "Training Delivery Methods",
  description: "Comparison of methods and when to use each in flight instruction",
  type: "overview",
  svg: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="300" fill="#f8fafc" rx="8"/>
<text x="300" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Training Delivery Methods</text>
<rect x="30" y="46" width="160" height="70" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="110" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#1e40af" font-weight="bold">Lecture</text>
<text x="110" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Best for: Introducing</text>
<text x="110" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">new concepts, regulations</text>
<text x="110" y="108" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">One-way delivery</text>
<rect x="220" y="46" width="160" height="70" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
<text x="300" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#166534" font-weight="bold">Demo-Performance</text>
<text x="300" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Best for: Maneuvers,</text>
<text x="300" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">procedures, skills</text>
<text x="300" y="108" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">Show → Try → Practice</text>
<rect x="410" y="46" width="160" height="70" rx="6" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.5"/>
<text x="490" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#5b21b6" font-weight="bold">Guided Discussion</text>
<text x="490" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Best for: ADM, risk</text>
<text x="490" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">mgmt, scenario analysis</text>
<text x="490" y="108" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">Learner-centered</text>
<rect x="125" y="140" width="160" height="70" rx="6" fill="#fefce8" stroke="#f59e0b" stroke-width="1.5"/>
<text x="205" y="160" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#92400e" font-weight="bold">Cooperative Learning</text>
<text x="205" y="176" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Best for: Problem-solving,</text>
<text x="205" y="188" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">peer teaching, CRM</text>
<text x="205" y="202" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">Group interaction</text>
<rect x="315" y="140" width="160" height="70" rx="6" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
<text x="395" y="160" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#991b1b" font-weight="bold">Scenario-Based (SBT)</text>
<text x="395" y="176" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Best for: Integration,</text>
<text x="395" y="188" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">judgment, real-world prep</text>
<text x="395" y="202" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">Highest-order learning</text>
<rect x="80" y="234" width="440" height="50" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="254" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">Progression principle:</text>
<text x="300" y="272" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Lecture → Demo-Performance → Guided Discussion → SBT (simple to complex)</text>
</svg>`
});

// LP-I-C: Safety
addSafety('LP-I-C', [
  "Inadequate lesson preparation can lead to missed safety-critical content — always verify lesson covers all ACS requirements before teaching",
  "Training to standards means students meet minimum safe performance levels — never sign off a student who has not demonstrated competence"
]);
console.log('  ✅ LP-I-C: +2 diagrams, +2 safety');

// LP-I-F: PAVE Model
addDiagram('LP-I-F', {
  title: "PAVE Risk Assessment Model",
  description: "Four categories of risk to evaluate before every flight",
  type: "safety",
  svg: `<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="320" fill="#f8fafc" rx="8"/>
<text x="300" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">PAVE Risk Assessment</text>
<rect x="40" y="50" width="240" height="110" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="160" y="72" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#1e40af" font-weight="bold">P — Pilot</text>
<text x="60" y="92" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Currency &amp; proficiency</text>
<text x="60" y="107" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Physical condition (IMSAFE)</text>
<text x="60" y="122" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Emotional state &amp; stress</text>
<text x="60" y="137" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Recency with aircraft type</text>
<rect x="320" y="50" width="240" height="110" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
<text x="440" y="72" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#166534" font-weight="bold">A — Aircraft</text>
<text x="340" y="92" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Airworthiness status</text>
<text x="340" y="107" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Performance for conditions</text>
<text x="340" y="122" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Equipment required/available</text>
<text x="340" y="137" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• W&amp;B within limits</text>
<rect x="40" y="180" width="240" height="110" rx="8" fill="#fefce8" stroke="#f59e0b" stroke-width="1.5"/>
<text x="160" y="202" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#92400e" font-weight="bold">V — enVironment</text>
<text x="60" y="222" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Weather (ceilings, vis, wind)</text>
<text x="60" y="237" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Terrain &amp; obstacles</text>
<text x="60" y="252" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Airport conditions</text>
<text x="60" y="267" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Night / day considerations</text>
<rect x="320" y="180" width="240" height="110" rx="8" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.5"/>
<text x="440" y="202" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#5b21b6" font-weight="bold">E — External Pressures</text>
<text x="340" y="222" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Schedule / time pressure</text>
<text x="340" y="237" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Passenger expectations</text>
<text x="340" y="252" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Business demands</text>
<text x="340" y="267" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• "Get-there-itis"</text>
<rect x="140" y="298" width="320" height="18" rx="4" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="311" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">Any single category can be a NO-GO — evaluate ALL four before every flight</text>
</svg>`
});

// LP-I-F: ADM DECIDE Model
addDiagram('LP-I-F', {
  title: "ADM DECIDE Model",
  description: "Six-step structured decision-making process for aeronautical decisions",
  type: "safety",
  svg: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="280" fill="#f8fafc" rx="8"/>
<text x="300" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">DECIDE Model — Aeronautical Decision Making</text>
<rect x="30" y="50" width="160" height="44" rx="6" fill="#2563eb"/><text x="110" y="69" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="white" font-weight="bold">D — Detect</text><text x="110" y="84" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bfdbfe">A change has occurred</text>
<path d="M190,72 L210,72" stroke="#94a3b8" stroke-width="2" marker-end="url(#a1)"/>
<rect x="220" y="50" width="160" height="44" rx="6" fill="#1d4ed8"/><text x="300" y="69" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="white" font-weight="bold">E — Estimate</text><text x="300" y="84" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bfdbfe">Need to react?</text>
<path d="M380,72 L400,72" stroke="#94a3b8" stroke-width="2"/>
<rect x="410" y="50" width="160" height="44" rx="6" fill="#1e40af"/><text x="490" y="69" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="white" font-weight="bold">C — Choose</text><text x="490" y="84" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bfdbfe">Desired outcome</text>
<rect x="30" y="120" width="160" height="44" rx="6" fill="#7c3aed"/><text x="110" y="139" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="white" font-weight="bold">I — Identify</text><text x="110" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#e9d5ff">Options available</text>
<path d="M190,142 L210,142" stroke="#94a3b8" stroke-width="2"/>
<rect x="220" y="120" width="160" height="44" rx="6" fill="#6d28d9"/><text x="300" y="139" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="white" font-weight="bold">D — Do</text><text x="300" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#e9d5ff">Take action</text>
<path d="M380,142 L400,142" stroke="#94a3b8" stroke-width="2"/>
<rect x="410" y="120" width="160" height="44" rx="6" fill="#16a34a"/><text x="490" y="139" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="white" font-weight="bold">E — Evaluate</text><text x="490" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bbf7d0">Did it work?</text>
<path d="M490,164 Q490,195 300,195 Q110,195 110,164" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4,3"/>
<text x="300" y="210" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#16a34a">Continuous loop — re-evaluate after action</text>
<rect x="80" y="234" width="440" height="34" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="249" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">Key: This is not linear in an emergency — detect threats early</text>
<text x="300" y="262" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">Practice DECIDE on every flight so it becomes automatic under stress</text>
</svg>`
});

// LP-I-F: Safety
addSafety('LP-I-F', [
  "Risk management during flight instruction requires maintaining BOTH teaching awareness AND pilot-in-command awareness simultaneously",
  "A go/no-go decision should be modeled for students on every flight — demonstrate that canceling is a professional decision, not a failure"
]);
console.log('  ✅ LP-I-F: +2 diagrams, +2 safety');

// LP-I-A: Safety (needs +2 to reach 85)
addSafety('LP-I-A', [
  "Miscommunication between instructor and student can lead to unsafe actions — always verify understanding of critical instructions",
  "Defense mechanisms in students can mask dangerous knowledge gaps — probe beyond surface-level answers"
]);
console.log('  ✅ LP-I-A: +2 safety');

// LP-I-B: Additional instructor note (needs +6, already got +2 safety earlier)
addNotes('LP-I-B', [
  "Use the concept of primacy strategically — what is taught first is remembered most strongly, so lead with correct technique",
  "When a student hits a learning plateau, change the training environment or approach rather than repeating the same exercise"
]);
console.log('  ✅ LP-I-B: +2 instructor notes');

}; // end module.exports
