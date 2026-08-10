"""Check diagrams that lack SVG content."""
import json

with open(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src\lessonPlansData.json", "r", encoding="utf-8") as f:
    data = json.load(f)

plans = data["lessonPlans"]
no_svg = []
has_svg = 0

for p in plans:
    for d in p.get("diagrams", []):
        svg = d.get("svgContent", "") or d.get("svg", "")
        if svg:
            has_svg += 1
        else:
            no_svg.append({
                "plan": p["id"],
                "title": d.get("title", ""),
                "type": d.get("type", ""),
                "keys": list(d.keys()),
                "has_url": bool(d.get("imageUrl", "")),
                "has_description": bool(d.get("description", "")),
                "has_keyPoints": bool(d.get("keyPoints", [])),
            })

print(f"Has SVG: {has_svg}")
print(f"No SVG: {len(no_svg)}")
print()

# Check what data they DO have
url_count = sum(1 for d in no_svg if d["has_url"])
desc_count = sum(1 for d in no_svg if d["has_description"])
kp_count = sum(1 for d in no_svg if d["has_keyPoints"])
print(f"No-SVG diagrams with external URL: {url_count}")
print(f"No-SVG diagrams with description: {desc_count}")
print(f"No-SVG diagrams with keyPoints: {kp_count}")
print()

# Show a sample
print("First 10 no-SVG diagrams:")
for d in no_svg[:10]:
    print(f"  [{d['plan']}] \"{d['title']}\" (type: {d['type']})")
    print(f"    Keys: {d['keys']}")
    print()

# Types breakdown
from collections import Counter
types = Counter(d["type"] for d in no_svg)
print("No-SVG diagram types:")
for t, c in types.most_common():
    print(f"  {t}: {c}")
