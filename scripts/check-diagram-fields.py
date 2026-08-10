import json

with open(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src\lessonPlansData.json", "r", encoding="utf-8") as f:
    data = json.load(f)

plans = data["lessonPlans"]
svg_count = 0
svgContent_count = 0
neither = 0

for p in plans:
    for d in p.get("diagrams", []):
        if d.get("svg"):
            svg_count += 1
        elif d.get("svgContent"):
            svgContent_count += 1
        else:
            neither += 1

print(f"Using 'svg' field: {svg_count}")
print(f"Using 'svgContent' field: {svgContent_count}")
print(f"Neither: {neither}")

# Show keys of first diagram with svgContent
for p in plans:
    for d in p.get("diagrams", []):
        if d.get("svgContent"):
            print(f"\nSample diagram keys: {list(d.keys())}")
            print(f"svgContent starts with: {d['svgContent'][:80]}")
            break
    else:
        continue
    break
