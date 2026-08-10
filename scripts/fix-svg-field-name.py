"""Fix diagram field name: rename 'svgContent' to 'svg' for consistency with DiagramViewer."""
import json
from pathlib import Path

SRC_FILE = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src\lessonPlansData.json")

with open(SRC_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

fixed = 0
for plan in data["lessonPlans"]:
    for diagram in plan.get("diagrams", []):
        if "svgContent" in diagram and not diagram.get("svg"):
            diagram["svg"] = diagram.pop("svgContent")
            fixed += 1
        elif "svgContent" in diagram and diagram.get("svg"):
            # Both exist, remove svgContent
            del diagram["svgContent"]

with open(SRC_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Renamed 'svgContent' → 'svg' for {fixed} diagrams")
print("All diagrams now use the 'svg' field consistently")
