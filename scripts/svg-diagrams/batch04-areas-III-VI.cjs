// Batch 4: Areas III, IV, V, VI remaining plans
module.exports = function({ addDiagram, addSafety }) {

// LP-III-A: already has 1 diagram, add 1 more
addDiagram('LP-III-A', {
  title: "Currency Requirements Summary",
  description: "Key recurrency requirements every pilot must maintain",
  type: "overview",
  svg: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="260" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Pilot Currency Requirements</text>
<rect x="40" y="44" width="250" height="56" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="165" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#1e40af" font-weight="bold">Flight Review (61.56)</text>
<text x="165" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Every 24 calendar months</text>
<text x="165" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">1hr ground + 1hr flight minimum</text>
<rect x="310" y="44" width="250" height="56" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
<text x="435" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#166534" font-weight="bold">Passenger Currency (61.57)</text>
<text x="435" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">3 takeoffs/landings in 90 days</text>
<text x="435" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Same category/class/type</text>
<rect x="40" y="112" width="250" height="56" rx="6" fill="#fefce8" stroke="#f59e0b" stroke-width="1.5"/>
<text x="165" y="132" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#92400e" font-weight="bold">Night Currency (61.57)</text>
<text x="165" y="148" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">3 T/Os and landings to full stop</text>
<text x="165" y="164" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">1hr after sunset to 1hr before sunrise</text>
<rect x="310" y="112" width="250" height="56" rx="6" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.5"/>
<text x="435" y="132" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#5b21b6" font-weight="bold">Medical Certificate</text>
<text x="435" y="148" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">1st class: 12 mo (6 if over 40)</text>
<text x="435" y="164" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">3rd class: 60 mo (24 if over 40)</text>
<rect x="40" y="180" width="520" height="34" rx="6" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="198" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">CFI-Specific: CFI certificate expires 24 calendar months from issuance</text>
<text x="300" y="212" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Renew via FIRC, practical test, or other approved activity (61.197)</text>
<rect x="100" y="224" width="400" height="26" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
<text x="300" y="241" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#1e40af">Proficiency ≠ Currency — legal to fly does not mean safe to fly. Set personal minimums higher.</text>
</svg>`
});
console.log('  ✅ LP-III-A: +1 diagram');

// LP-III-B: Airworthiness
addDiagram('LP-III-B', {
  title: "Required Inspections & Documents (AROW + AV1ATE)",
  description: "Aircraft airworthiness documents and inspection requirements memory aids",
  type: "overview",
  svg: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="260" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Airworthiness: AROW &amp; AV1ATE</text>
<rect x="40" y="42" width="250" height="120" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="165" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#1e40af" font-weight="bold">AROW (Documents on board)</text>
<text x="60" y="82" font-family="system-ui,sans-serif" font-size="10" fill="#475569">A = Airworthiness Certificate</text>
<text x="60" y="98" font-family="system-ui,sans-serif" font-size="10" fill="#475569">R = Registration</text>
<text x="60" y="114" font-family="system-ui,sans-serif" font-size="10" fill="#475569">O = Operating Limitations (POH)</text>
<text x="60" y="130" font-family="system-ui,sans-serif" font-size="10" fill="#475569">W = Weight &amp; Balance data</text>
<text x="60" y="150" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">91.203 — Must be in aircraft for flight</text>
<rect x="310" y="42" width="250" height="120" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
<text x="435" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#166534" font-weight="bold">AV1ATE (Inspections)</text>
<text x="330" y="82" font-family="system-ui,sans-serif" font-size="10" fill="#475569">A = Annual (12 calendar months)</text>
<text x="330" y="98" font-family="system-ui,sans-serif" font-size="10" fill="#475569">V = VOR check (IFR, 30 days)</text>
<text x="330" y="114" font-family="system-ui,sans-serif" font-size="10" fill="#475569">1 = 100-hour (if for hire)</text>
<text x="330" y="130" font-family="system-ui,sans-serif" font-size="10" fill="#475569">A = Altimeter/Pitot (IFR, 24 mo)</text>
<text x="330" y="146" font-family="system-ui,sans-serif" font-size="10" fill="#475569">T = Transponder (24 calendar mo)</text>
<text x="330" y="158" font-family="system-ui,sans-serif" font-size="10" fill="#475569">E = ELT (12 mo / 1hr / 50%)</text>
<rect x="40" y="174" width="520" height="36" rx="6" fill="#fefce8" stroke="#fde68a"/>
<text x="300" y="192" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#92400e" font-weight="bold">Also check: ADs (Airworthiness Directives) — mandatory, recurring or one-time</text>
<text x="300" y="206" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">Life-limited parts • Progressive inspection program (if applicable) • MEL items</text>
<rect x="80" y="220" width="440" height="28" rx="4" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">An aircraft is NOT airworthy if ANY required inspection is overdue or any AD is not complied with</text>
</svg>`
});
console.log('  ✅ LP-III-B: +1 diagram');

// LP-III-C: Weather
addDiagram('LP-III-C', {
  title: "Weather Briefing Sources & Types",
  description: "Where to get weather information and the three types of briefings",
  type: "overview",
  svg: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="240" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Weather Briefing Types &amp; Sources</text>
<rect x="40" y="44" width="160" height="60" rx="6" fill="#2563eb"/><text x="120" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Standard Briefing</text><text x="120" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bfdbfe">Complete overview</text><text x="120" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bfdbfe">6+ hrs before departure</text>
<rect x="220" y="44" width="160" height="60" rx="6" fill="#16a34a"/><text x="300" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Abbreviated Briefing</text><text x="300" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bbf7d0">Update/supplement</text><text x="300" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bbf7d0">Already briefed earlier</text>
<rect x="400" y="44" width="160" height="60" rx="6" fill="#7c3aed"/><text x="480" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Outlook Briefing</text><text x="480" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#e9d5ff">Planning purposes</text><text x="480" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#e9d5ff">6+ hrs before departure</text>
<rect x="40" y="118" width="520" height="60" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="136" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">Key Products:</text>
<text x="60" y="154" font-family="system-ui,sans-serif" font-size="9" fill="#475569">METAR (current obs) • TAF (terminal forecast 24-30hr) • Prog Charts (surface/upper)</text>
<text x="60" y="170" font-family="system-ui,sans-serif" font-size="9" fill="#475569">SIGMET (severe: TS, icing, turb) • AIRMET (moderate: IFR, turb, icing) • PIREPs (pilot reports)</text>
<rect x="40" y="188" width="520" height="42" rx="6" fill="#eff6ff" stroke="#bfdbfe"/>
<text x="300" y="206" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" font-weight="bold">Sources: 1800wxbrief.com • ForeFlight/Garmin Pilot • FSS (1-800-WX-BRIEF)</text>
<text x="300" y="222" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#1e40af">CFI responsibility: Teach students to get AND interpret their own briefings — not just read them</text>
</svg>`
});
console.log('  ✅ LP-III-C: +1 diagram');

// LP-IV-A: Maneuver Lesson
addDiagram('LP-IV-A', {
  title: "Maneuver Teaching Sequence",
  description: "The demonstration-performance method applied to flight maneuvers",
  type: "overview",
  svg: `<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="220" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Maneuver Teaching Sequence</text>
<rect x="30" y="48" width="100" height="50" rx="6" fill="#2563eb"/><text x="80" y="70" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">Ground</text><text x="80" y="84" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bfdbfe">Explain &amp;</text><text x="80" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bfdbfe">visualize</text>
<path d="M130,73 L145,73" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="148" y="48" width="100" height="50" rx="6" fill="#1d4ed8"/><text x="198" y="70" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">Instructor</text><text x="198" y="84" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bfdbfe">Demonstrates</text><text x="198" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bfdbfe">in flight</text>
<path d="M248,73 L263,73" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="266" y="48" width="100" height="50" rx="6" fill="#16a34a"/><text x="316" y="70" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">Student</text><text x="316" y="84" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bbf7d0">Practices with</text><text x="316" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bbf7d0">guidance</text>
<path d="M366,73 L381,73" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="384" y="48" width="100" height="50" rx="6" fill="#7c3aed"/><text x="434" y="70" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">Student</text><text x="434" y="84" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#e9d5ff">Solo practice</text><text x="434" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#e9d5ff">(independent)</text>
<path d="M484,73 L499,73" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="502" y="48" width="70" height="50" rx="6" fill="#dc2626"/><text x="537" y="70" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">Evaluate</text><text x="537" y="84" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#fecaca">ACS</text><text x="537" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#fecaca">standards</text>
<rect x="40" y="116" width="520" height="44" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="134" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">During demonstration, explain:</text>
<text x="300" y="150" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">What you're doing • Why • What to look for • Common errors • ACS standards/tolerances</text>
<rect x="40" y="172" width="520" height="36" rx="6" fill="#fefce8" stroke="#fde68a"/>
<text x="300" y="190" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#92400e" font-weight="bold">Key CFI skill: Simultaneously demonstrate AND explain clearly</text>
<text x="300" y="204" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">This is THE core competency evaluated on the CFI checkride</text>
</svg>`
});
addSafety('LP-IV-A', [
  "Always maintain aircraft control priority over teaching — if the aircraft is in a dangerous state, stop instructing and fly first",
  "Set clear positive exchange of controls ('I have the aircraft' / 'You have the aircraft') before and after each demonstration"
]);
console.log('  ✅ LP-IV-A: +1 diagram, +2 safety');

// LP-V-A: Preflight Assessment
addDiagram('LP-V-A', {
  title: "Systematic Preflight Inspection Flow",
  description: "Organized approach to exterior and interior preflight checks",
  type: "safety",
  svg: `<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="220" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Preflight Inspection: Systematic Flow</text>
<rect x="40" y="44" width="520" height="36" rx="6" fill="#2563eb"/><text x="300" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">1. Cockpit → 2. Left side → 3. Nose → 4. Right side → 5. Tail → 6. Cockpit final</text>
<rect x="40" y="92" width="160" height="50" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1"/>
<text x="120" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#1e40af" font-weight="bold">Interior First</text>
<text x="120" y="124" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#475569">Docs (AROW), controls,</text>
<text x="120" y="136" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#475569">fuel selector, master OFF</text>
<rect x="220" y="92" width="160" height="50" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1"/>
<text x="300" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#166534" font-weight="bold">Exterior Walk-Around</text>
<text x="300" y="124" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#475569">Structure, skin, controls</text>
<text x="300" y="136" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#475569">Fuel (quantity + quality)</text>
<rect x="400" y="92" width="160" height="50" rx="6" fill="#fefce8" stroke="#f59e0b" stroke-width="1"/>
<text x="480" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#92400e" font-weight="bold">Final Cockpit</text>
<text x="480" y="124" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#475569">Seat/belts, controls free,</text>
<text x="480" y="136" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#475569">instruments set, ready</text>
<rect x="40" y="154" width="520" height="54" rx="6" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="172" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">Critical Items (Never Skip):</text>
<text x="300" y="188" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Fuel quantity + contamination check (drain sumps) • Oil quantity • Control surface security</text>
<text x="300" y="202" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Pitot tube clear • Static ports clear • Tires condition/inflation • Remove all tie-downs &amp; chocks</text>
</svg>`
});

// LP-V-B: Flight Deck Management
addDiagram('LP-V-B', {
  title: "Flight Deck Organization Principles",
  description: "Organized cockpit environment for safe and efficient operations",
  type: "overview",
  svg: `<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="220" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Flight Deck Management</text>
<rect x="40" y="44" width="250" height="70" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="165" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" font-weight="bold">Sterile Cockpit Concept</text>
<text x="60" y="82" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Below 10,000 ft / critical phases:</text>
<text x="60" y="96" font-family="system-ui,sans-serif" font-size="9" fill="#475569">NO non-essential conversation</text>
<text x="60" y="110" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Focus on flying duties only</text>
<rect x="310" y="44" width="250" height="70" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
<text x="435" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#166534" font-weight="bold">Organized Materials</text>
<text x="330" y="82" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Charts accessible, current page up</text>
<text x="330" y="96" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Kneeboard/iPad secured</text>
<text x="330" y="110" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Loose objects secured (FOD prevention)</text>
<rect x="40" y="126" width="520" height="42" rx="6" fill="#fefce8" stroke="#fde68a"/>
<text x="300" y="144" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#92400e" font-weight="bold">Flow Patterns (not just checklists):</text>
<text x="300" y="160" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Develop a systematic scan of instruments/switches in a logical left-to-right, top-to-bottom flow</text>
<rect x="40" y="178" width="520" height="32" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="198" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">Checklist philosophy: Do the flow (from memory) → Verify with checklist (catch missed items)</text>
</svg>`
});
console.log('  ✅ LP-V-A, LP-V-B: +1 diagram each');

// LP-V-D: Taxiing/Signs/Lighting — add 1 more diagram (already has 1 from earlier fix)
addDiagram('LP-V-D', {
  title: "Taxi Technique & Crosswind Positioning",
  description: "Control positioning during taxi in crosswind and the key taxi safety rules",
  type: "basic",
  svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="200" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Taxi Wind Positioning (Memory Aid)</text>
<rect x="40" y="44" width="250" height="60" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="165" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" font-weight="bold">Headwind Component:</text>
<text x="165" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">DIVE into the wind</text>
<text x="165" y="96" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">(Stick forward + into wind)</text>
<rect x="310" y="44" width="250" height="60" rx="6" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
<text x="435" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b" font-weight="bold">Tailwind Component:</text>
<text x="435" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">DIVE away from the wind</text>
<text x="435" y="96" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">(Stick forward + away from wind)</text>
<rect x="40" y="116" width="520" height="30" rx="6" fill="#f0fdf4" stroke="#bbf7d0"/>
<text x="300" y="135" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#166534" font-weight="bold">Rule: Climb INTO headwind, Dive AWAY from tailwind</text>
<rect x="40" y="156" width="520" height="34" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="172" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Taxi speed: Not faster than a brisk walk • Always able to stop before any marking or obstruction</text>
<text x="300" y="186" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Nosewheel steering: Use rudder pedals • Differential braking for tight turns only</text>
</svg>`
});

// LP-V-E: Taxiing and Sailing (seaplane)
addDiagram('LP-V-E', {
  title: "Seaplane Taxi Modes",
  description: "Idle taxi, plow taxi, and step taxi techniques for seaplanes",
  type: "basic",
  svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="200" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Seaplane Taxi Modes</text>
<rect x="30" y="46" width="170" height="70" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="115" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" font-weight="bold">Idle (Displacement)</text>
<text x="115" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Slow, hull in water</text>
<text x="115" y="96" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Best control near docks</text>
<text x="115" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#16a34a">SAFEST mode</text>
<rect x="215" y="46" width="170" height="70" rx="6" fill="#fefce8" stroke="#f59e0b" stroke-width="1.5"/>
<text x="300" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#92400e" font-weight="bold">Plow Taxi</text>
<text x="300" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Moderate power, nose high</text>
<text x="300" y="96" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Bow wave, limited visibility</text>
<text x="300" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#f59e0b">TRANSITION zone</text>
<rect x="400" y="46" width="170" height="70" rx="6" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
<text x="485" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b" font-weight="bold">Step Taxi</text>
<text x="485" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">High power, on step</text>
<text x="485" y="96" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">High speed, porpoising risk</text>
<text x="485" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">CAUTION: near flight</text>
<rect x="40" y="128" width="520" height="26" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="145" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Sailing: Use wind, water rudders, and flight controls to maneuver with engine at idle or off</text>
<rect x="40" y="162" width="520" height="28" rx="4" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="180" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">Step taxi only in open water with clear path ahead — never near docks, boats, or swimmers</text>
</svg>`
});

// LP-V-F: Before Takeoff Check
addDiagram('LP-V-F', {
  title: "Before Takeoff Check Flow",
  description: "Critical items in the run-up and before-takeoff verification",
  type: "safety",
  svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="200" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Before Takeoff Check Essentials</text>
<rect x="40" y="44" width="250" height="100" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="165" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" font-weight="bold">Engine Run-Up</text>
<text x="60" y="78" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• RPM per POH (typically 1700-2000)</text>
<text x="60" y="92" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Mag check (max 125 RPM drop)</text>
<text x="60" y="106" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Carb heat check (drop then rise)</text>
<text x="60" y="120" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Oil pressure/temp in green</text>
<text x="60" y="134" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Suction/vacuum gauge check</text>
<rect x="310" y="44" width="250" height="100" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
<text x="435" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#166534" font-weight="bold">Final Checks Before Takeoff</text>
<text x="330" y="78" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Controls free and correct</text>
<text x="330" y="92" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Trim set for takeoff</text>
<text x="330" y="106" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Fuel on proper tank, sufficient</text>
<text x="330" y="120" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Flaps set per POH</text>
<text x="330" y="134" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Doors/windows latched</text>
<rect x="40" y="154" width="520" height="36" rx="6" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="170" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">Briefing (every takeoff): Abort criteria, departure procedure, emergency plan</text>
<text x="300" y="184" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">"If engine fails below 500 AGL: land straight ahead. Above 500: return or divert. Call out V-speeds."</text>
</svg>`
});

// LP-VI-A: Communications & Light Signals
addDiagram('LP-VI-A', {
  title: "ATC Light Gun Signals",
  description: "Light signals for radio failure situations at towered airports",
  type: "safety",
  svg: `<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="220" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">ATC Light Gun Signals</text>
<rect x="40" y="42" width="80" height="24" rx="4" fill="#94a3b8"/><text x="80" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">Color</text>
<rect x="130" y="42" width="200" height="24" rx="4" fill="#94a3b8"/><text x="230" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">In Flight</text>
<rect x="340" y="42" width="220" height="24" rx="4" fill="#94a3b8"/><text x="450" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">On Ground</text>
<rect x="40" y="70" width="80" height="28" rx="4" fill="#16a34a"/><text x="80" y="88" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Steady Green</text>
<rect x="130" y="70" width="200" height="28" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/><text x="230" y="88" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#166534">Cleared to land</text>
<rect x="340" y="70" width="220" height="28" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/><text x="450" y="88" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#166534">Cleared for takeoff</text>
<rect x="40" y="102" width="80" height="28" rx="4" fill="#dc2626"/><text x="80" y="120" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Steady Red</text>
<rect x="130" y="102" width="200" height="28" rx="4" fill="#fef2f2" stroke="#fecaca"/><text x="230" y="120" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#991b1b">Give way / continue circling</text>
<rect x="340" y="102" width="220" height="28" rx="4" fill="#fef2f2" stroke="#fecaca"/><text x="450" y="120" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#991b1b">STOP</text>
<rect x="40" y="134" width="80" height="28" rx="4" fill="#16a34a" opacity="0.7"/><text x="80" y="152" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">Flash Green</text>
<rect x="130" y="134" width="200" height="28" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/><text x="230" y="152" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#166534">Return for landing</text>
<rect x="340" y="134" width="220" height="28" rx="4" fill="#f0fdf4" stroke="#bbf7d0"/><text x="450" y="152" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#166534">Cleared to taxi</text>
<rect x="40" y="166" width="80" height="28" rx="4" fill="#dc2626" opacity="0.7"/><text x="80" y="184" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">Flash Red</text>
<rect x="130" y="166" width="200" height="28" rx="4" fill="#fef2f2" stroke="#fecaca"/><text x="230" y="184" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#991b1b">Airport unsafe — do not land</text>
<rect x="340" y="166" width="220" height="28" rx="4" fill="#fef2f2" stroke="#fecaca"/><text x="450" y="184" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#991b1b">Taxi clear of runway in use</text>
<rect x="40" y="198" width="80" height="16" rx="4" fill="white" stroke="#1e293b"/><text x="80" y="209" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#1e293b">Flash White</text>
<text x="230" y="209" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">N/A</text>
<text x="450" y="209" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">Return to starting point</text>
</svg>`
});
console.log('  ✅ LP-V-D, LP-V-E, LP-V-F, LP-VI-A: +1 diagram each');

// LP-VI-B already got traffic pattern diagram from sample script — done

}; // end module.exports
