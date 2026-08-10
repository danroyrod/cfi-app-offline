import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check LP-I-A (should have 0 diagrams)
lp_i_a = [l for l in data['lessonPlans'] if l['id'] == 'LP-I-A'][0]
print(f"LP-I-A has {len(lp_i_a.get('diagrams', []))} diagrams (should be 0)")

# Check LP-IX-B (should have 3 diagrams: 1 improved SVG + 2 imageUrl)
lp_ix_b = [l for l in data['lessonPlans'] if l['id'] == 'LP-IX-B'][0]
print(f"\nLP-IX-B has {len(lp_ix_b['diagrams'])} diagrams:")
for i, d in enumerate(lp_ix_b['diagrams'], 1):
    print(f"  {i}. {d['title']}")
    print(f"     Type: {d.get('type', 'N/A')}")
    print(f"     Has imageUrl: {bool(d.get('imageUrl'))}")
    print(f"     Has SVG: {bool(d.get('svg'))}")
    if d.get('imageUrl'):
        print(f"     Image: {d['imageUrl']}")

# Count total diagrams
total_diagrams = sum(len(l.get('diagrams', [])) for l in data['lessonPlans'])
print(f"\nTotal diagrams remaining: {total_diagrams}")

