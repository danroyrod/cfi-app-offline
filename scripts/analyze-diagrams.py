"""Analyze current diagram usage in lesson plans."""
import json
from collections import Counter

with open(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src\lessonPlansData.json", "r", encoding="utf-8") as f:
    data = json.load(f)

plans = data["lessonPlans"]
all_diagrams = []
external_urls = []
types = Counter()
svg_diagrams = []
reference_diagrams = []

for p in plans:
    diagrams = p.get("diagrams", [])
    for d in diagrams:
        all_diagrams.append(d)
        dtype = d.get("type", "unknown")
        types[dtype] += 1
        url = d.get("imageUrl", "")
        svg = d.get("svgContent", "") or d.get("svg", "")
        
        if url and url.startswith("http"):
            external_urls.append({"plan": p["id"], "title": d.get("title", ""), "url": url, "type": dtype})
        if svg:
            svg_diagrams.append({"plan": p["id"], "title": d.get("title", "")})
        if dtype == "reference":
            reference_diagrams.append({"plan": p["id"], "title": d.get("title", ""), "source": d.get("source", "")})

print(f"Total diagrams across all plans: {len(all_diagrams)}")
print(f"  With external URLs: {len(external_urls)}")
print(f"  With SVG content: {len(svg_diagrams)}")
print(f"  Reference type (from George PPT): {len(reference_diagrams)}")
print()
print("Diagram types:")
for t, c in types.most_common():
    print(f"  {t}: {c}")
print()

domains = Counter()
for d in external_urls:
    url = d["url"]
    parts = url.split("/")
    domain = parts[2] if len(parts) > 2 else url
    domains[domain] += 1
print("External URL domains:")
for dom, c in domains.most_common(10):
    print(f"  {dom}: {c}")
print()

print("Sample external URLs (first 15):")
for d in external_urls[:15]:
    print(f"  [{d['plan']}] {d['title']}")
    print(f"    {d['url'][:100]}")
    print()
