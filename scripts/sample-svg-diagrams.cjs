/**
 * Sample SVG Diagrams — Add 3 sample diagrams to demonstrate quality.
 * 
 * Adds to:
 * - LP-II-B: Visual Scanning (scan pattern diagram)
 * - LP-II-M: Night Operations (night vision adaptation)
 * - LP-VI-B: Traffic Patterns (standard traffic pattern)
 * 
 * Run: node scripts/sample-svg-diagrams.cjs
 */

const fs = require('fs');
const path = require('path');

const LP_PATH = path.join(__dirname, '..', 'src', 'lessonPlansData.json');
const lp = JSON.parse(fs.readFileSync(LP_PATH, 'utf-8'));

function findPlan(id) {
  return lp.lessonPlans.find(p => p.id === id);
}

// ===================================================================
// Diagram 1: Visual Scanning Pattern (LP-II-B)
// ===================================================================
const scanSvg = `<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#2563eb"/>
    </marker>
  </defs>
  <!-- Background -->
  <rect width="600" height="320" fill="#f8fafc" rx="8"/>
  <!-- Title -->
  <text x="300" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="bold" fill="#1e293b">Effective Visual Scanning Pattern</text>
  <!-- Windscreen representation -->
  <rect x="50" y="50" width="500" height="220" rx="12" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="300" y="72" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#64748b">WINDSCREEN VIEW</text>
  <!-- Horizon line -->
  <line x1="60" y1="160" x2="540" y2="160" stroke="#94a3b8" stroke-width="1" stroke-dasharray="6,4"/>
  <text x="548" y="164" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">Horizon</text>
  <!-- Scan sectors -->
  <rect x="70" y="85" width="140" height="130" rx="4" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
  <rect x="230" y="85" width="140" height="130" rx="4" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
  <rect x="390" y="85" width="140" height="130" rx="4" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
  <text x="140" y="230" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Left Sector</text>
  <text x="300" y="230" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Center Sector</text>
  <text x="460" y="230" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#475569">Right Sector</text>
  <!-- Scan path arrows -->
  <path d="M100,150 Q140,120 180,150 Q220,180 260,150 Q300,120 340,150 Q380,180 420,150 Q460,120 500,150" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow)"/>
  <!-- Eye fixation points -->
  <circle cx="100" cy="150" r="6" fill="#2563eb" opacity="0.8"/>
  <circle cx="180" cy="150" r="6" fill="#2563eb" opacity="0.8"/>
  <circle cx="260" cy="150" r="6" fill="#2563eb" opacity="0.8"/>
  <circle cx="340" cy="150" r="6" fill="#2563eb" opacity="0.8"/>
  <circle cx="420" cy="150" r="6" fill="#2563eb" opacity="0.8"/>
  <circle cx="500" cy="150" r="6" fill="#2563eb" opacity="0.8"/>
  <!-- Timing labels -->
  <text x="140" y="258" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#1e40af">1-2 sec per fixation</text>
  <!-- Key notes -->
  <rect x="60" y="278" width="480" height="32" rx="4" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
  <text x="300" y="296" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af">Short, regularly-spaced eye movements • Don't fixate • 10° sections • Overlap scan areas</text>
</svg>`;

// ===================================================================
// Diagram 2: Night Vision Adaptation (LP-II-M)
// ===================================================================
const nightSvg = `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
  <rect width="600" height="360" fill="#f8fafc" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="bold" fill="#1e293b">Dark Adaptation &amp; Night Vision</text>
  <!-- Time axis -->
  <line x1="80" y1="280" x2="540" y2="280" stroke="#334155" stroke-width="1.5"/>
  <text x="310" y="310" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#475569">Time in Darkness (minutes)</text>
  <!-- Time labels -->
  <text x="80" y="296" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">0</text>
  <text x="172" y="296" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">5</text>
  <text x="264" y="296" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">10</text>
  <text x="356" y="296" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">20</text>
  <text x="448" y="296" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">30</text>
  <text x="540" y="296" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">40+</text>
  <!-- Sensitivity axis -->
  <line x1="80" y1="60" x2="80" y2="280" stroke="#334155" stroke-width="1.5"/>
  <text x="36" y="170" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#475569" transform="rotate(-90,36,170)">Sensitivity</text>
  <!-- Cone adaptation curve (fast, plateaus early) -->
  <path d="M80,270 Q120,200 172,160 Q220,140 264,135 Q350,130 540,128" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
  <circle cx="264" cy="135" r="4" fill="#f59e0b"/>
  <text x="280" y="125" font-family="system-ui,sans-serif" font-size="10" fill="#d97706" font-weight="bold">Cones (color vision)</text>
  <text x="280" y="138" font-family="system-ui,sans-serif" font-size="9" fill="#d97706">Complete ~10 min</text>
  <!-- Rod adaptation curve (slow, much higher sensitivity) -->
  <path d="M80,270 Q120,250 172,240 Q220,220 264,180 Q350,110 448,78 Q500,70 540,68" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
  <circle cx="448" cy="78" r="4" fill="#7c3aed"/>
  <text x="420" y="60" font-family="system-ui,sans-serif" font-size="10" fill="#6d28d9" font-weight="bold">Rods (night vision)</text>
  <text x="420" y="73" font-family="system-ui,sans-serif" font-size="9" fill="#6d28d9">Full adaptation ~30-40 min</text>
  <!-- 30-min marker -->
  <line x1="448" y1="60" x2="448" y2="280" stroke="#6d28d9" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
  <!-- Key notes box -->
  <rect x="60" y="322" width="480" height="30" rx="4" fill="#faf5ff" stroke="#e9d5ff" stroke-width="1"/>
  <text x="300" y="341" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#6d28d9">Red light preserves adaptation • Avoid bright light exposure • Off-center viewing uses rods</text>
</svg>`;

// ===================================================================
// Diagram 3: Standard Traffic Pattern (LP-VI-B)
// ===================================================================
const trafficSvg = `<svg viewBox="0 0 620 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:620px;height:auto">
  <defs>
    <marker id="arr2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#2563eb"/>
    </marker>
    <marker id="arr3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#16a34a"/>
    </marker>
  </defs>
  <rect width="620" height="420" fill="#f8fafc" rx="8"/>
  <text x="310" y="26" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="bold" fill="#1e293b">Standard Left Traffic Pattern</text>
  <!-- Runway -->
  <rect x="180" y="280" width="280" height="24" rx="2" fill="#475569"/>
  <line x1="200" y1="292" x2="440" y2="292" stroke="#fbbf24" stroke-width="2" stroke-dasharray="12,8"/>
  <text x="310" y="296" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" font-weight="bold">RUNWAY</text>
  <!-- Wind indicator -->
  <path d="M520,292 L560,292" stroke="#ef4444" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="540" y="282" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#ef4444">WIND</text>
  <!-- Traffic pattern legs -->
  <!-- Upwind -->
  <path d="M200,268 L440,268" fill="none" stroke="#16a34a" stroke-width="2.5" marker-end="url(#arr3)"/>
  <text x="320" y="260" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#16a34a" font-weight="bold">Upwind</text>
  <!-- Crosswind turn -->
  <path d="M440,268 Q480,268 480,228" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <!-- Crosswind -->
  <path d="M480,228 L480,130" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr2)"/>
  <text x="506" y="180" font-family="system-ui,sans-serif" font-size="10" fill="#2563eb" font-weight="bold">Crosswind</text>
  <!-- Turn to downwind -->
  <path d="M480,130 Q480,90 440,90" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <!-- Downwind -->
  <path d="M440,90 L160,90" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr2)"/>
  <text x="300" y="82" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#2563eb" font-weight="bold">Downwind</text>
  <!-- Abeam point marker -->
  <line x1="310" y1="96" x2="310" y2="274" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="310" cy="90" r="4" fill="#f59e0b"/>
  <text x="310" y="115" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#d97706">Abeam threshold</text>
  <text x="310" y="127" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#d97706">(reduce power)</text>
  <!-- Turn to base -->
  <path d="M160,90 Q120,90 120,130" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <!-- Base -->
  <path d="M120,130 L120,228" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arr2)"/>
  <text x="98" y="180" font-family="system-ui,sans-serif" font-size="10" fill="#2563eb" font-weight="bold">Base</text>
  <!-- Turn to final -->
  <path d="M120,228 Q120,268 160,268" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <!-- Final -->
  <path d="M160,268 L198,268" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <text x="160" y="258" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626" font-weight="bold">Final</text>
  <!-- Departure leg label -->
  <text x="440" y="258" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#16a34a">Departure</text>
  <!-- Pattern altitude note -->
  <rect x="140" y="44" width="340" height="24" rx="4" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
  <text x="310" y="60" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#1e40af">Standard pattern altitude: 1,000 ft AGL (unless published otherwise)</text>
  <!-- Entry point -->
  <path d="M540,90 L480,90" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#arr2)"/>
  <text x="550" y="86" font-family="system-ui,sans-serif" font-size="9" fill="#7c3aed">45° entry</text>
  <!-- Legend -->
  <rect x="100" y="350" width="420" height="56" rx="6" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
  <text x="120" y="370" font-family="system-ui,sans-serif" font-size="10" fill="#16a34a">■ Upwind/Departure</text>
  <text x="280" y="370" font-family="system-ui,sans-serif" font-size="10" fill="#2563eb">■ Pattern legs</text>
  <text x="420" y="370" font-family="system-ui,sans-serif" font-size="10" fill="#dc2626">■ Final</text>
  <text x="120" y="392" font-family="system-ui,sans-serif" font-size="10" fill="#7c3aed">- - 45° entry to downwind</text>
  <text x="340" y="392" font-family="system-ui,sans-serif" font-size="10" fill="#d97706">● Key decision point</text>
</svg>`;

// ===================================================================
// Apply to lesson plans
// ===================================================================

const lpIIB = findPlan('LP-II-B');
if (lpIIB) {
  if (!lpIIB.diagrams) lpIIB.diagrams = [];
  lpIIB.diagrams.push({
    title: "Effective Visual Scanning Pattern",
    description: "Shows the recommended scan technique: short, regularly-spaced eye movements across windscreen sectors with 1-2 second fixation points",
    type: "safety",
    svg: scanSvg
  });
  console.log('✅ LP-II-B: Added visual scanning SVG diagram');
}

const lpIIM = findPlan('LP-II-M');
if (lpIIM) {
  if (!lpIIM.diagrams) lpIIM.diagrams = [];
  lpIIM.diagrams.push({
    title: "Dark Adaptation & Night Vision",
    description: "Comparison of cone (color) vs rod (night) adaptation curves showing why 30+ minutes is needed for full night vision",
    type: "safety",
    svg: nightSvg
  });
  console.log('✅ LP-II-M: Added night vision adaptation SVG diagram');
}

const lpVIB = findPlan('LP-VI-B');
if (lpVIB) {
  if (!lpVIB.diagrams) lpVIB.diagrams = [];
  lpVIB.diagrams.push({
    title: "Standard Left Traffic Pattern",
    description: "Overhead view of a standard left-hand traffic pattern showing all legs, entry point, and key decision points",
    type: "overview",
    svg: trafficSvg
  });
  console.log('✅ LP-VI-B: Added traffic pattern SVG diagram');
}

// Save
fs.writeFileSync(LP_PATH, JSON.stringify(lp, null, 2) + '\n', 'utf-8');
console.log('\n✅ Sample SVG diagrams written. Check them in the app.');
