// Batch 6: Final push — get last 7 plans to 85+
module.exports = function({ addDiagram, addSafety, addNotes }) {

function conceptSvg(title, items) {
  const h = 60 + items.length * 26 + 30;
  let svg = `<svg viewBox="0 0 560 ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:560px;height:auto">
<rect width="560" height="${h}" fill="#f8fafc" rx="8"/>
<text x="280" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="bold" fill="#1e293b">${title}</text>`;
  items.forEach((item, i) => {
    const y = 46 + i * 26;
    const colors = ['#2563eb','#1d4ed8','#16a34a','#7c3aed','#f59e0b','#dc2626','#0891b2','#4f46e5'];
    svg += `\n<rect x="40" y="${y}" width="480" height="22" rx="4" fill="${colors[i%colors.length]}" opacity="0.12" stroke="${colors[i%colors.length]}" stroke-width="1"/>`;
    svg += `\n<text x="56" y="${y+15}" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">${item}</text>`;
  });
  svg += `\n</svg>`;
  return svg;
}

// LP-I-D (82): needs +3. Add 3rd diagram.
addDiagram('LP-I-D', { title:"Oral Assessment Best Practices",description:"Techniques for effective oral questioning during training",type:"overview",
svg: conceptSvg("Effective Oral Assessment Techniques",[
  "Ask open-ended questions (How? Why?) — not yes/no",
  "Use higher-order questions to test understanding, not just recall",
  "Wait after asking — give student time to think (5+ seconds)",
  "Avoid leading questions that contain the answer",
  "Follow up: 'Can you explain why?' or 'What would you do if...?'",
  "Avoid trick questions — they test cleverness, not competence",
  "Assess understanding throughout, not just at the end"
])});

// LP-I-E (82): needs +3. Add 3rd diagram.
addDiagram('LP-I-E', { title:"Instructor Ethics & Boundaries",description:"Professional ethical standards for flight instructors",type:"overview",
svg: conceptSvg("CFI Professional Ethics",[
  "Never sign off a student who is not ready — even under pressure",
  "Maintain appropriate student-instructor boundaries at all times",
  "Disclose limitations honestly — refer out when beyond your expertise",
  "Be consistent in standards — don't lower bars for favored students",
  "Document thoroughly — protect yourself and your students",
  "Stay current: fly regularly, attend FIRC, read safety publications",
  "Model the behavior you expect: if you skip checklists, they will too"
])});

// LP-II-E (82): needs +3. Add 3rd diagram.
addDiagram('LP-II-E', { title:"Pitot-Static System & Failures",description:"How pitot-static instruments work and what happens when they fail",type:"basic",
svg: conceptSvg("Pitot-Static System Failures",[
  "PITOT BLOCKED (ram air): Airspeed acts like altimeter (increases in climb)",
  "PITOT + DRAIN BLOCKED: Airspeed freezes at current reading",
  "STATIC BLOCKED: Altimeter frozen, VSI zero, airspeed inaccurate",
  "  → Use alternate static source (slightly different readings expected)",
  "Pitot heat: Turn ON in visible moisture or suspected icing",
  "Instrument cross-check: If one disagrees with all others, suspect that one",
  "Glass cockpit: AHRS/ADC failures — know reversion modes for your aircraft"
])});

// LP-II-D (83): needs +2. Has 3 diagrams already (10pts). Add instructor notes.
addNotes('LP-II-D', [
  "Use physical models (hands as wings) to demonstrate angle of attack changes — kinesthetic learning reinforces the concept",
  "Relate every theory concept to practical flight: 'This is why the stall horn goes off in a steep turn at higher speed'"
]);

// LP-I-B (84): needs +1. Add 1 more safety consideration.
addSafety('LP-I-B', [
  "Students experiencing negative transfer (applying old incorrect habits) need explicit correction — uncorrected habits become safety hazards in the aircraft"
]);

// LP-II-A (84): needs +1. Already has 2 diagrams (7pts), 2 safety (4pts). Add 1 safety for +1.
addSafety('LP-II-A', [
  "Spatial disorientation kills experienced pilots — teach students that the ONLY reliable response is to trust instruments, never inner-ear sensations"
]);

// LP-II-F (84): needs +1. Add 1 safety.
addSafety('LP-II-F', [
  "Students must demonstrate they can calculate takeoff distance for actual conditions — a 'gut feel' approach to performance is unacceptable for safe operations"
]);

console.log('  ✅ Batch 6: Final enhancements applied to last 7 plans');

}; // end module.exports
