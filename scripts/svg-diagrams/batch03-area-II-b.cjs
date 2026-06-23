// Batch 3: Area II plans part B (LP-II-M, LP-II-N, LP-II-O, LP-II-P, LP-II-L)
module.exports = function({ addDiagram }) {

// LP-II-M already got a diagram (night vision) from sample script
// Add second diagram: lighting systems
addDiagram('LP-II-M', {
  title: "Airport Lighting Systems at Night",
  description: "Key visual references and lighting aids for night operations",
  type: "safety",
  svg: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="280" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Airport Lighting at Night</text>
<rect x="40" y="42" width="160" height="60" rx="6" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
<text x="120" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b" font-weight="bold">VASI / PAPI</text>
<text x="120" y="78" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Red over White = Right</text>
<text x="120" y="92" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Red over Red = Dead</text>
<rect x="220" y="42" width="160" height="60" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
<text x="300" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" font-weight="bold">Runway Lights</text>
<text x="300" y="78" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">White edges = runway</text>
<text x="300" y="92" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Yellow last 2000ft/half</text>
<rect x="400" y="42" width="160" height="60" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
<text x="480" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#166534" font-weight="bold">Taxiway Lights</text>
<text x="480" y="78" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Blue edge lights</text>
<text x="480" y="92" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Green centerline</text>
<rect x="40" y="118" width="250" height="60" rx="6" fill="#fefce8" stroke="#f59e0b" stroke-width="1.5"/>
<text x="165" y="138" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#92400e" font-weight="bold">Rotating Beacon</text>
<text x="165" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">White-Green = civilian airport</text>
<text x="165" y="168" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">White-White-Green = military</text>
<rect x="310" y="118" width="250" height="60" rx="6" fill="#faf5ff" stroke="#7c3aed" stroke-width="1.5"/>
<text x="435" y="138" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#5b21b6" font-weight="bold">Pilot-Controlled Lighting</text>
<text x="435" y="154" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">7 clicks = high intensity</text>
<text x="435" y="168" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">5 clicks = medium / 3 = low</text>
<rect x="40" y="194" width="520" height="74" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="214" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">Night Flight Safety Essentials:</text>
<text x="300" y="232" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Carry at least 2 flashlights (one red) • Pre-adapt eyes 30 min before flight</text>
<text x="300" y="248" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Use off-center vision to detect traffic • Verify lighting operational in preflight</text>
<text x="300" y="264" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Review runway environment before descent — VASI/PAPI critical at unfamiliar airports</text>
</svg>`
});
console.log('  ✅ LP-II-M: +1 diagram (lighting)');

// LP-II-N: Supplemental Oxygen Requirements
addDiagram('LP-II-N', {
  title: "Supplemental Oxygen Requirements",
  description: "14 CFR 91.211 oxygen requirements by altitude and duration",
  type: "safety",
  svg: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="280" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Supplemental Oxygen Requirements (91.211)</text>
<rect x="60" y="44" width="480" height="40" rx="6" fill="#16a34a" opacity="0.15" stroke="#16a34a" stroke-width="1"/>
<text x="80" y="62" font-family="system-ui,sans-serif" font-size="10" fill="#166534" font-weight="bold">Sea Level — 12,500 MSL</text>
<text x="80" y="78" font-family="system-ui,sans-serif" font-size="9" fill="#166534">No supplemental oxygen required</text>
<rect x="60" y="90" width="480" height="50" rx="6" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" stroke-width="1"/>
<text x="80" y="110" font-family="system-ui,sans-serif" font-size="10" fill="#92400e" font-weight="bold">12,500 — 14,000 MSL cabin pressure altitude</text>
<text x="80" y="126" font-family="system-ui,sans-serif" font-size="9" fill="#92400e">Flight crew required O₂ if MORE than 30 minutes at these altitudes</text>
<text x="80" y="138" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">(The 30-minute clock starts when cabin altitude exceeds 12,500 MSL)</text>
<rect x="60" y="146" width="480" height="40" rx="6" fill="#dc2626" opacity="0.15" stroke="#dc2626" stroke-width="1"/>
<text x="80" y="164" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b" font-weight="bold">Above 14,000 MSL cabin pressure altitude</text>
<text x="80" y="180" font-family="system-ui,sans-serif" font-size="9" fill="#991b1b">Flight crew MUST use O₂ for entire time above this altitude</text>
<rect x="60" y="192" width="480" height="40" rx="6" fill="#1e293b" opacity="0.9"/>
<text x="80" y="210" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">Above 15,000 MSL cabin pressure altitude</text>
<text x="80" y="226" font-family="system-ui,sans-serif" font-size="9" fill="#e2e8f0">Each passenger MUST be provided supplemental oxygen</text>
<rect x="60" y="240" width="480" height="30" rx="4" fill="#eff6ff" stroke="#bfdbfe"/>
<text x="300" y="259" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#1e40af">Note: These are MINIMUM legal requirements — physiological effects begin much lower (as low as 5,000 ft at night)</text>
</svg>`
});
console.log('  ✅ LP-II-N: +1 diagram');

// LP-II-O: Pressurization
addDiagram('LP-II-O', {
  title: "Aircraft Pressurization System",
  description: "How cabin pressurization works and critical failure recognition",
  type: "safety",
  svg: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="280" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Pressurization Concepts</text>
<rect x="40" y="44" width="520" height="80" rx="8" fill="white" stroke="#2563eb" stroke-width="1.5"/>
<text x="300" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#1e40af" font-weight="bold">How It Works</text>
<text x="60" y="82" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Engine bleed air → compressed → heated/cooled → cabin</text>
<text x="60" y="96" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Outflow valve controls cabin altitude by regulating air escape rate</text>
<text x="60" y="110" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Differential pressure = Cabin pressure minus Ambient pressure (typically max 4-9 PSI)</text>
<rect x="40" y="132" width="250" height="70" rx="6" fill="#fef2f2" stroke="#dc2626" stroke-width="1.5"/>
<text x="165" y="152" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#991b1b" font-weight="bold">Rapid Decompression</text>
<text x="60" y="168" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Loud noise, fog, rushing air</text>
<text x="60" y="182" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Time of useful consciousness:</text>
<text x="60" y="196" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">  FL350=30s, FL300=1min, FL250=3min</text>
<rect x="310" y="132" width="250" height="70" rx="6" fill="#fefce8" stroke="#f59e0b" stroke-width="1.5"/>
<text x="435" y="152" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#92400e" font-weight="bold">Slow/Gradual Leak</text>
<text x="330" y="168" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Insidious — may not notice</text>
<text x="330" y="182" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Monitor cabin altitude gauge</text>
<text x="330" y="196" font-family="system-ui,sans-serif" font-size="9" fill="#475569">• Hypoxia symptoms appear slowly</text>
<rect x="40" y="214" width="520" height="54" rx="6" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="234" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">Emergency Response: DON OXYGEN → DESCEND → DECLARE</text>
<text x="300" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">1. Don oxygen mask immediately (crew and passengers)</text>
<text x="300" y="264" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">2. Emergency descent to safe altitude (below 10,000 MSL) 3. Declare emergency with ATC</text>
</svg>`
});

// LP-II-O: add second diagram
addDiagram('LP-II-O', {
  title: "Cabin Altitude vs Flight Altitude",
  description: "Relationship between actual altitude and cabin pressure altitude in a pressurized aircraft",
  type: "performance",
  svg: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="240" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Cabin Altitude vs Flight Level</text>
<line x1="80" y1="200" x2="540" y2="200" stroke="#334155" stroke-width="1.5"/>
<line x1="80" y1="40" x2="80" y2="200" stroke="#334155" stroke-width="1.5"/>
<text x="310" y="222" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Aircraft Flight Level</text>
<text x="40" y="120" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569" transform="rotate(-90,40,120)">Cabin Altitude</text>
<path d="M80,200 L200,170 L350,130 L450,100 L540,80" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3"/>
<text x="540" y="72" font-family="system-ui,sans-serif" font-size="8" fill="#94a3b8">Unpressurized</text>
<path d="M80,200 L200,190 L350,175 L450,165 L540,158" fill="none" stroke="#2563eb" stroke-width="2.5"/>
<text x="540" y="152" font-family="system-ui,sans-serif" font-size="8" fill="#2563eb" font-weight="bold">Pressurized cabin</text>
<text x="100" y="214" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">SL</text>
<text x="200" y="214" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">FL180</text>
<text x="350" y="214" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">FL250</text>
<text x="450" y="214" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">FL350</text>
<text x="540" y="214" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">FL450</text>
<line x1="80" y1="170" x2="540" y2="170" stroke="#dc2626" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
<text x="560" y="174" font-family="system-ui,sans-serif" font-size="7" fill="#dc2626">8,000 ft cabin</text>
</svg>`
});
console.log('  ✅ LP-II-O: +2 diagrams');

// LP-II-P: Vmc Factors
addDiagram('LP-II-P', {
  title: "Vmc — Factors That Increase It",
  description: "Understanding what conditions make minimum controllable airspeed higher (more dangerous)",
  type: "safety",
  svg: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="300" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Factors That Increase Vmc</text>
<text x="300" y="42" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">(Higher Vmc = Less safety margin = More dangerous)</text>
<rect x="200" y="54" width="200" height="30" rx="15" fill="#dc2626"/><text x="300" y="74" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Vmc INCREASES with:</text>
<rect x="40" y="100" width="250" height="36" rx="6" fill="#fef2f2" stroke="#fecaca" stroke-width="1"/>
<text x="54" y="118" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b">↑</text><text x="70" y="118" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">Max power on operative engine</text><text x="70" y="132" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">More asymmetric thrust = more yaw</text>
<rect x="310" y="100" width="250" height="36" rx="6" fill="#fef2f2" stroke="#fecaca" stroke-width="1"/>
<text x="324" y="118" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b">↑</text><text x="340" y="118" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">Low altitude (high density)</text><text x="340" y="132" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">More engine power available</text>
<rect x="40" y="146" width="250" height="36" rx="6" fill="#fef2f2" stroke="#fecaca" stroke-width="1"/>
<text x="54" y="164" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b">↑</text><text x="70" y="164" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">Landing gear retracted</text><text x="70" y="178" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">Less keel effect (directional stability)</text>
<rect x="310" y="146" width="250" height="36" rx="6" fill="#fef2f2" stroke="#fecaca" stroke-width="1"/>
<text x="324" y="164" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b">↑</text><text x="340" y="164" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">Flaps retracted (takeoff or up)</text><text x="340" y="178" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">Less drag on operative side</text>
<rect x="40" y="192" width="250" height="36" rx="6" fill="#fef2f2" stroke="#fecaca" stroke-width="1"/>
<text x="54" y="210" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b">↑</text><text x="70" y="210" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">CG at aft limit</text><text x="70" y="224" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">Shorter rudder moment arm</text>
<rect x="310" y="192" width="250" height="36" rx="6" fill="#fef2f2" stroke="#fecaca" stroke-width="1"/>
<text x="324" y="210" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b">↑</text><text x="340" y="210" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b">Bank toward dead engine</text><text x="340" y="224" font-family="system-ui,sans-serif" font-size="8" fill="#64748b">Reduces rudder effectiveness</text>
<rect x="60" y="244" width="480" height="44" rx="6" fill="#f0fdf4" stroke="#bbf7d0"/>
<text x="300" y="262" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#166534" font-weight="bold">Recovery: Bank 5° INTO operative engine (raise dead engine)</text>
<text x="300" y="278" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#166534">Dead Foot = Dead Engine • Reduce power if below Vmc • NEVER bank into dead engine</text>
</svg>`
});

// LP-II-P: OEI procedure
addDiagram('LP-II-P', {
  title: "Dead Foot = Dead Engine Identification",
  description: "The immediate technique for identifying the failed engine and maintaining control",
  type: "safety",
  svg: `<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="220" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Engine Failure Identification &amp; Control</text>
<rect x="40" y="44" width="240" height="80" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
<text x="160" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#dc2626" font-weight="bold">Dead Foot = Dead Engine</text>
<text x="60" y="84" font-family="system-ui,sans-serif" font-size="10" fill="#475569">The foot with NO rudder</text>
<text x="60" y="100" font-family="system-ui,sans-serif" font-size="10" fill="#475569">pressure identifies the</text>
<text x="60" y="116" font-family="system-ui,sans-serif" font-size="10" fill="#475569">FAILED engine side</text>
<rect x="320" y="44" width="240" height="80" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
<text x="440" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" fill="#16a34a" font-weight="bold">5° Bank Into Good Engine</text>
<text x="340" y="84" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Raise dead engine wing</text>
<text x="340" y="100" font-family="system-ui,sans-serif" font-size="10" fill="#475569">slightly (approx 5° bank)</text>
<text x="340" y="116" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Reduces Vmc by ~3 knots</text>
<rect x="40" y="138" width="520" height="32" rx="6" fill="#2563eb"/>
<text x="300" y="158" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="white" font-weight="bold">Immediate Actions: Mixtures • Props • Throttles • Flaps • Gear • Identify • Verify • Feather</text>
<rect x="40" y="180" width="520" height="30" rx="4" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="199" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">NEVER bank into the dead engine — this dramatically increases Vmc and can cause loss of control</text>
</svg>`
});
console.log('  ✅ LP-II-P: +2 diagrams');

// LP-II-L: Seaplane/Water
addDiagram('LP-II-L', {
  title: "Water Surface Conditions for Seaplanes",
  description: "Reading wind and water conditions for safe seaplane operations",
  type: "safety",
  svg: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
<rect width="600" height="240" fill="#f8fafc" rx="8"/>
<text x="300" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="bold" fill="#1e293b">Reading Water Conditions</text>
<rect x="40" y="44" width="160" height="70" rx="6" fill="#e0f2fe" stroke="#2563eb" stroke-width="1"/>
<text x="120" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af" font-weight="bold">Glassy Water</text>
<text x="120" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">No wind, mirror surface</text>
<text x="120" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">DANGEROUS: No depth</text>
<text x="120" y="106" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">perception on landing</text>
<rect x="220" y="44" width="160" height="70" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1"/>
<text x="300" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#166534" font-weight="bold">Light Chop</text>
<text x="300" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Light wind, small ripples</text>
<text x="300" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#16a34a">IDEAL: Good depth cues</text>
<text x="300" y="106" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#16a34a">Wind direction visible</text>
<rect x="400" y="44" width="160" height="70" rx="6" fill="#fef2f2" stroke="#dc2626" stroke-width="1"/>
<text x="480" y="64" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#991b1b" font-weight="bold">Rough Water</text>
<text x="480" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Strong wind, whitecaps</text>
<text x="480" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">CAUTION: Structural risk</text>
<text x="480" y="106" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#dc2626">to floats, spray damage</text>
<rect x="40" y="128" width="520" height="50" rx="6" fill="#f1f5f9" stroke="#e2e8f0"/>
<text x="300" y="148" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e293b" font-weight="bold">Wind Direction Indicators on Water:</text>
<text x="300" y="166" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Dark patches = wind (ripples) • Smooth streaks = sheltered • Boats face into wind/current</text>
<rect x="40" y="188" width="520" height="40" rx="6" fill="#fef2f2" stroke="#fecaca"/>
<text x="300" y="206" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">Glassy Water Landing Technique:</text>
<text x="300" y="222" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#475569">Set power + attitude for 150-200 fpm descent — fly INTO the water at constant rate (do NOT flare normally)</text>
</svg>`
});
console.log('  ✅ LP-II-L: +1 diagram');

}; // end module.exports
