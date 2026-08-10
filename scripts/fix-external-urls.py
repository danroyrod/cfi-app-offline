"""Replace the 2 remaining external image URLs with inline SVGs."""
import json
from pathlib import Path

SRC_FILE = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src\lessonPlansData.json")

# Maslow's Hierarchy of Needs SVG
MASLOW_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 360" style="font-family: -apple-system, sans-serif;">
  <rect width="500" height="360" fill="#f8fafc" rx="8"/>
  <text x="250" y="25" text-anchor="middle" fill="#1e40af" font-size="14" font-weight="bold">Maslow&apos;s Hierarchy of Needs</text>
  <!-- Pyramid levels (bottom to top) -->
  <polygon points="50,340 450,340 400,280 100,280" fill="#dc2626" opacity="0.8"/>
  <text x="250" y="318" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Physiological: Food, Water, Sleep</text>
  <polygon points="100,280 400,280 360,220 140,220" fill="#f59e0b" opacity="0.8"/>
  <text x="250" y="258" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Safety: Security, Health, Stability</text>
  <polygon points="140,220 360,220 320,160 180,160" fill="#16a34a" opacity="0.8"/>
  <text x="250" y="198" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Belonging: Relationships, Community</text>
  <polygon points="180,160 320,160 290,100 210,100" fill="#3b82f6" opacity="0.8"/>
  <text x="250" y="138" text-anchor="middle" fill="white" font-size="11" font-weight="bold">Esteem: Respect, Confidence</text>
  <polygon points="210,100 290,100 260,50 240,50" fill="#7c3aed" opacity="0.8"/>
  <text x="250" y="82" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Self-Actualization</text>
  <!-- Learning annotation -->
  <text x="250" y="352" text-anchor="middle" fill="#64748b" font-size="9">Lower needs must be met before effective learning can occur</text>
</svg>'''

# Yerkes-Dodson Stress-Performance Curve SVG
YERKES_DODSON_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 320" style="font-family: -apple-system, sans-serif;">
  <rect width="500" height="320" fill="#f8fafc" rx="8"/>
  <text x="250" y="25" text-anchor="middle" fill="#1e40af" font-size="14" font-weight="bold">Stress-Performance Curve (Yerkes-Dodson Law)</text>
  <!-- Axes -->
  <line x1="60" y1="270" x2="460" y2="270" stroke="#374151" stroke-width="2"/>
  <line x1="60" y1="270" x2="60" y2="50" stroke="#374151" stroke-width="2"/>
  <!-- Axis labels -->
  <text x="250" y="295" text-anchor="middle" fill="#374151" font-size="12">Stress/Arousal Level →</text>
  <text x="25" y="160" text-anchor="middle" fill="#374151" font-size="12" transform="rotate(-90, 25, 160)">Performance →</text>
  <!-- Inverted U curve -->
  <path d="M 80 260 Q 150 240 200 180 Q 250 90 280 80 Q 310 90 340 140 Q 400 220 440 260" fill="none" stroke="#1e40af" stroke-width="3"/>
  <!-- Zones -->
  <text x="130" y="240" text-anchor="middle" fill="#dc2626" font-size="10">Low Stress</text>
  <text x="130" y="252" text-anchor="middle" fill="#dc2626" font-size="9">(Boredom)</text>
  <text x="280" y="65" text-anchor="middle" fill="#16a34a" font-size="11" font-weight="bold">Optimal</text>
  <text x="280" y="78" text-anchor="middle" fill="#16a34a" font-size="9">Performance</text>
  <text x="400" y="240" text-anchor="middle" fill="#dc2626" font-size="10">High Stress</text>
  <text x="400" y="252" text-anchor="middle" fill="#dc2626" font-size="9">(Anxiety)</text>
  <!-- Peak indicator -->
  <line x1="280" y1="80" x2="280" y2="270" stroke="#16a34a" stroke-width="1" stroke-dasharray="4,3"/>
  <!-- Shaded optimal zone -->
  <rect x="220" y="50" width="120" height="220" fill="#16a34a" opacity="0.05" rx="4"/>
  <!-- Note -->
  <text x="250" y="310" text-anchor="middle" fill="#64748b" font-size="9">Instructors must manage student stress to keep them in the optimal zone</text>
</svg>'''


def main():
    with open(SRC_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    plans = data["lessonPlans"]
    replaced = 0

    for plan in plans:
        for diagram in plan.get("diagrams", []):
            url = diagram.get("imageUrl", "")
            if "Maslow" in url or "maslow" in url or "hierarchy_of_needs" in url:
                diagram["svgContent"] = MASLOW_SVG
                diagram.pop("imageUrl", None)
                replaced += 1
                print(f"  Replaced Maslow's Hierarchy URL with inline SVG")
            elif "Yerkes" in url or "yerkes" in url or "Dodson" in url:
                diagram["svgContent"] = YERKES_DODSON_SVG
                diagram.pop("imageUrl", None)
                replaced += 1
                print(f"  Replaced Yerkes-Dodson URL with inline SVG")

    with open(SRC_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nReplaced {replaced} external URLs with inline SVGs")
    print("All diagrams now work fully offline!")


if __name__ == "__main__":
    main()
