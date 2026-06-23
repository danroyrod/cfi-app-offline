// Batch 2: Area II plans part A (LP-II-J, LP-II-K, LP-II-G, LP-II-H, LP-II-I)
module.exports = function({ addDiagram }) {

// LP-II-J: FAA Publication Hierarchy
addDiagram('LP-II-J', {
  title: "FAA Publication Hierarchy",
  description: "Relationship between regulations, advisory materials, and guidance documents",
  type: "overview",
  svg: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="300" fill="#f8fafc" rx="8"/>
<text x="300" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">FAA Publication Hierarchy</text>
<rect x="180" y="42" width="240" height="36" rx="6" fill="#dc2626"/><text x="300" y="60" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">14 CFR (Federal Aviation Regulations)</text><text x="300" y="73" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#fecaca">REGULATORY — Must comply</text>
<path d="M300,78 L300,90" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="60" y="92" width="220" height="36" rx="6" fill="#f59e0b"/><text x="170" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Advisory Circulars (ACs)</text><text x="170" y="123" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#fef3c7">Guidance — Not regulatory</text>
<rect x="320" y="92" width="220" height="36" rx="6" fill="#f59e0b"/><text x="430" y="110" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">AIM (Aeronautical Info Manual)</text><text x="430" y="123" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#fef3c7">Procedures — Best practices</text>
<path d="M300,78 L170,92" stroke="#94a3b8" stroke-width="1"/><path d="M300,78 L430,92" stroke="#94a3b8" stroke-width="1"/>
<rect x="40" y="150" width="160" height="36" rx="6" fill="#2563eb"/><text x="120" y="168" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Handbooks (8083 series)</text><text x="120" y="181" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bfdbfe">Knowledge reference</text>
<rect x="220" y="150" width="160" height="36" rx="6" fill="#2563eb"/><text x="300" y="168" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">ACS / PTS</text><text x="300" y="181" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bfdbfe">Testing standards</text>
<rect x="400" y="150" width="160" height="36" rx="6" fill="#2563eb"/><text x="480" y="168" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">NOTAMs / Charts</text><text x="480" y="181" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#bfdbfe">Operational info</text>
<rect x="60" y="210" width="480" height="36" rx="4" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="226" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">Key CFR Parts:</text>
<text x="300" y="240" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Part 61 (Certification) • Part 91 (Operating) • Part 43 (Maintenance) • Part 830 (NTSB)</text>
<rect x="60" y="256" width="480" height="34" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
<text x="300" y="272" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" font-weight="bold">Remember: Only 14 CFR is regulatory. ACs and AIM are guidance.</text>
<text x="300" y="285" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#1e40af">However, deviating from AIM procedures requires justification.</text>
</svg>`
});

// LP-II-J: Key CFR Parts
addDiagram('LP-II-J', {
  title: "Key 14 CFR Parts for Pilots",
  description: "The most important regulatory parts every CFI must know",
  type: "overview",
  svg: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="260" fill="#f8fafc" rx="8"/>
<text x="300" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Key 14 CFR Parts</text>
<rect x="40" y="46" width="250" height="56" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="165" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#1e40af" font-weight="bold">Part 61 — Certification</text>
<text x="165" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Pilot certificates, ratings, privileges,</text>
<text x="165" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">limitations, currency, endorsements</text>
<rect x="310" y="46" width="250" height="56" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
<text x="435" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#166534" font-weight="bold">Part 91 — General Operating</text>
<text x="435" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Flight rules, equipment requirements,</text>
<text x="435" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">maintenance, operations</text>
<rect x="40" y="118" width="250" height="56" rx="6" fill="#fefce8" stroke="#f59e0b" stroke-width="1.5"/>
<text x="165" y="138" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#92400e" font-weight="bold">Part 43 — Maintenance</text>
<text x="165" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Preventive maintenance, alterations,</text>
<text x="165" y="166" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">inspections, return to service</text>
<rect x="310" y="118" width="250" height="56" rx="6" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
<text x="435" y="138" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#991b1b" font-weight="bold">NTSB Part 830 — Reporting</text>
<text x="435" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Accident/incident notification,</text>
<text x="435" y="166" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">reporting requirements, preservation</text>
<rect x="80" y="192" width="440" height="56" rx="6" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.5"/>
<text x="300" y="212" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#5b21b6" font-weight="bold">Also Important:</text>
<text x="300" y="230" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Part 67 (Medicals) • Part 71 (Airspace) • Part 73 (Special Use) • Part 97 (IAPs)</text>
<text x="300" y="244" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Part 141 (Flight Schools) • Part 142 (Training Centers)</text>
</svg>`
});
console.log('  ✅ LP-II-J: +2 diagrams');

// LP-II-K: Endorsement Flow
addDiagram('LP-II-K', {
  title: "Student Solo Endorsement Flow",
  description: "Required endorsements for student pilot solo flight privileges",
  type: "overview",
  svg: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="280" fill="#f8fafc" rx="8"/>
<text x="300" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Student Solo Endorsement Flow</text>
<rect x="180" y="44" width="240" height="34" rx="6" fill="#2563eb"/><text x="300" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">1. Pre-Solo Knowledge Test</text>
<path d="M300,78 L300,92" stroke="#2563eb" stroke-width="2"/>
<text x="420" y="88" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">61.87(b) — written test</text>
<rect x="180" y="92" width="240" height="34" rx="6" fill="#1d4ed8"/><text x="300" y="114" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">2. Pre-Solo Flight Training</text>
<path d="M300,126 L300,140" stroke="#2563eb" stroke-width="2"/>
<text x="420" y="136" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">61.87(c) — training received</text>
<rect x="180" y="140" width="240" height="34" rx="6" fill="#16a34a"/><text x="300" y="162" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">3. 90-Day Solo Endorsement</text>
<path d="M300,174 L300,188" stroke="#16a34a" stroke-width="2"/>
<text x="420" y="183" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">61.87(n) — valid 90 days</text>
<rect x="180" y="188" width="240" height="34" rx="6" fill="#7c3aed"/><text x="300" y="210" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">4. Solo XC Endorsement</text>
<text x="420" y="208" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">61.93 — specific route/airport</text>
<rect x="80" y="238" width="440" height="32" rx="4" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="258" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">Each endorsement is date-specific and make/model-specific — verify before each solo</text>
</svg>`
});

// LP-II-K: Logbook entries
addDiagram('LP-II-K', {
  title: "Required Logbook Entry Elements",
  description: "What must be recorded in each flight training logbook entry per 61.51",
  type: "overview",
  svg: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="240" fill="#f8fafc" rx="8"/>
<text x="300" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Logbook Entry Requirements (14 CFR 61.51)</text>
<rect x="40" y="48" width="520" height="150" rx="8" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>
<text x="60" y="72" font-family="system-ui,sans-serif" font-size="11" fill="#1e40af" font-weight="bold">Required Elements:</text>
<text x="60" y="92" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Date</text>
<text x="200" y="92" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Total flight or lesson time</text>
<text x="400" y="92" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Departure/arrival location</text>
<text x="60" y="112" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Aircraft make/model</text>
<text x="200" y="112" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Aircraft identification (N-number)</text>
<text x="400" y="112" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Name of pilot (if PIC)</text>
<text x="60" y="136" font-family="system-ui,sans-serif" font-size="11" fill="#16a34a" font-weight="bold">Type of Experience:</text>
<text x="60" y="156" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Solo / PIC / SIC / Dual</text>
<text x="200" y="156" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Day / Night</text>
<text x="340" y="156" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Cross-country / Instrument</text>
<text x="60" y="180" font-family="system-ui,sans-serif" font-size="11" fill="#dc2626" font-weight="bold">For Training:</text>
<text x="60" y="196" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Description of training received</text>
<text x="260" y="196" font-family="system-ui,sans-serif" font-size="10" fill="#475569">• Instructor signature + certificate # + expiration</text>
<rect x="80" y="208" width="440" height="24" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
<text x="300" y="224" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#1e40af">CFI tip: Write clear, specific descriptions of what was accomplished — vague entries don't help the student or next instructor</text>
</svg>`
});
console.log('  ✅ LP-II-K: +2 diagrams');

// LP-II-G: National Airspace System
addDiagram('LP-II-G', {
  title: "National Airspace System Classes",
  description: "Airspace classification from surface to FL600 with VFR weather minimums",
  type: "overview",
  svg: `<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="320" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Airspace Classes &amp; VFR Minimums</text>
<rect x="100" y="38" width="400" height="28" rx="4" fill="#1e293b"/><text x="300" y="56" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Class A — FL180 to FL600 (IFR only, no VFR)</text>
<rect x="140" y="70" width="320" height="28" rx="4" fill="#2563eb"/><text x="300" y="88" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Class B — Major airports (clearance required)</text>
<text x="480" y="88" font-family="system-ui,sans-serif" font-size="8" fill="#2563eb">3sm / clear of clouds</text>
<rect x="160" y="102" width="280" height="28" rx="4" fill="#16a34a"/><text x="300" y="120" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Class C — Radar approach (2-way radio)</text>
<text x="480" y="120" font-family="system-ui,sans-serif" font-size="8" fill="#16a34a">3sm / 152-1-2</text>
<rect x="180" y="134" width="240" height="28" rx="4" fill="#7c3aed"/><text x="300" y="152" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Class D — Control tower (2-way radio)</text>
<text x="480" y="152" font-family="system-ui,sans-serif" font-size="8" fill="#7c3aed">3sm / 152-1-2</text>
<rect x="60" y="170" width="480" height="28" rx="4" fill="#f59e0b"/><text x="300" y="188" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Class E — Controlled airspace (most common en route)</text>
<text x="480" y="204" font-family="system-ui,sans-serif" font-size="8" fill="#92400e">3sm / 152-1-2 (below 10k)</text>
<rect x="60" y="206" width="480" height="28" rx="4" fill="#64748b"/><text x="300" y="224" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Class G — Uncontrolled airspace</text>
<text x="480" y="240" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">Day: 1sm clear of clouds (below 1200)</text>
<rect x="60" y="254" width="480" height="54" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="272" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">Memory Aid: "152-1-2" = 1000ft above, 500ft below, 2000ft horizontal</text>
<text x="300" y="288" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Class B is the exception: 3sm visibility, clear of clouds (no distance requirement)</text>
<text x="300" y="302" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Above 10,000 MSL: 5sm / 1000-1000-1 (all classes)</text>
</svg>`
});

// LP-II-H: VOR Navigation
addDiagram('LP-II-H', {
  title: "VOR Navigation Basics",
  description: "How VOR works: radials, CDI, and OBS relationship",
  type: "basic",
  svg: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="300" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">VOR Navigation Concept</text>
<circle cx="300" cy="160" r="80" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4,3"/>
<circle cx="300" cy="160" r="6" fill="#2563eb"/><text x="300" y="180" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#2563eb">VOR Station</text>
<line x1="300" y1="80" x2="300" y2="60" stroke="#dc2626" stroke-width="2"/><text x="300" y="54" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">360° (N)</text>
<line x1="380" y1="160" x2="400" y2="160" stroke="#16a34a" stroke-width="2"/><text x="420" y="164" font-family="system-ui,sans-serif" font-size="9" fill="#16a34a">090°</text>
<line x1="300" y1="240" x2="300" y2="260" stroke="#7c3aed" stroke-width="2"/><text x="300" y="274" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#7c3aed">180° (S)</text>
<line x1="220" y1="160" x2="200" y2="160" stroke="#f59e0b" stroke-width="2"/><text x="180" y="164" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#f59e0b">270°</text>
<text x="340" y="110" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">Radials go</text>
<text x="340" y="122" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">FROM station</text>
<rect x="440" y="60" width="140" height="100" rx="6" fill="white" stroke="#e2e8f0" stroke-width="1.5"/>
<text x="510" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">CDI Instrument</text>
<line x1="510" y1="90" x2="510" y2="140" stroke="#1e293b" stroke-width="1.5"/>
<text x="510" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">OBS selects radial</text>
<text x="510" y="100" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">TO/FROM flag</text>
<rect x="40" y="260" width="520" height="30" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
<text x="300" y="279" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af">Key rule: Radials radiate FROM the station — you are ON the radial you are receiving</text>
</svg>`
});

// LP-II-I: XC Flight Planning
addDiagram('LP-II-I', {
  title: "Cross-Country Flight Planning Steps",
  description: "Systematic approach to VFR cross-country planning",
  type: "overview",
  svg: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="260" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">VFR Cross-Country Planning Steps</text>
<rect x="20" y="44" width="110" height="50" rx="6" fill="#2563eb"/><text x="75" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">1. Weather</text><text x="75" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bfdbfe">METAR/TAF/Prog</text>
<path d="M130,69 L140,69" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="145" y="44" width="110" height="50" rx="6" fill="#1d4ed8"/><text x="200" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">2. Route</text><text x="200" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bfdbfe">Chart/checkpoints</text>
<path d="M255,69 L265,69" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="270" y="44" width="110" height="50" rx="6" fill="#7c3aed"/><text x="325" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">3. Performance</text><text x="325" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#e9d5ff">W&amp;B, TO/LDG dist</text>
<path d="M380,69 L390,69" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="395" y="44" width="110" height="50" rx="6" fill="#16a34a"/><text x="450" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">4. Nav Log</text><text x="450" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#bbf7d0">TC/WCA/TH/fuel</text>
<path d="M505,69 L515,69" stroke="#94a3b8" stroke-width="1.5"/>
<rect x="520" y="44" width="60" height="50" rx="6" fill="#dc2626"/><text x="550" y="66" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="white" font-weight="bold">5. GO/</text><text x="550" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#fecaca">NO-GO</text>
<rect x="40" y="110" width="520" height="70" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="60" y="130" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">Nav Log Calculations:</text>
<text x="60" y="148" font-family="system-ui,sans-serif" font-size="9" fill="#475569">TC (True Course from chart) → WCA (Wind Correction Angle) → TH (True Heading)</text>
<text x="60" y="163" font-family="system-ui,sans-serif" font-size="9" fill="#475569">TH ± Variation = MH (Magnetic Heading) ± Deviation = CH (Compass Heading)</text>
<text x="60" y="178" font-family="system-ui,sans-serif" font-size="9" fill="#475569">GS (Groundspeed from wind triangle) → ETE per leg → Fuel required + reserves</text>
<rect x="40" y="192" width="520" height="54" rx="6" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="212" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">Critical Checks:</text>
<text x="300" y="228" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Fuel: Day VFR = 30 min reserve / Night VFR = 45 min reserve (14 CFR 91.151)</text>
<text x="300" y="242" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">NOTAMs checked • TFRs checked • Alternates identified • Flight plan filed (recommended)</text>
</svg>`
});
console.log('  ✅ LP-II-G, LP-II-H, LP-II-I: +1 diagram each');

}; // end module.exports
