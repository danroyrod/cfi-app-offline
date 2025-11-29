import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

lessons = data['lessonPlans']

# Check a few lessons from different areas
test_lessons = ['LP-I-A', 'LP-I-B', 'LP-II-A', 'LP-VII-A', 'LP-IX-B', 'LP-X-A']

print("=" * 80)
print("FINAL REVIEW - Sample Lessons")
print("=" * 80)

for lesson_id in test_lessons:
    lesson = [l for l in lessons if l['id'] == lesson_id]
    if lesson:
        lesson = lesson[0]
        diagrams = lesson.get('diagrams', [])
        print(f"\n{lesson_id}: {lesson['title']}")
        print(f"  Diagrams: {len(diagrams)}")
        for i, d in enumerate(diagrams, 1):
            print(f"    {i}. {d['title']} ({d.get('type', 'N/A')})")
            if d.get('imageUrl'):
                print(f"       -> Image: {d['imageUrl']}")
            if d.get('svg'):
                svg_len = len(d['svg'])
                print(f"       -> SVG ({svg_len} chars)")

# Count by area
print("\n" + "=" * 80)
print("DIAGRAM COUNT BY AREA")
print("=" * 80)

area_counts = {}
for lesson in lessons:
    area = lesson.get('areaNumber', 'Unknown')
    if area not in area_counts:
        area_counts[area] = {'lessons': 0, 'diagrams': 0}
    area_counts[area]['lessons'] += 1
    area_counts[area]['diagrams'] += len(lesson.get('diagrams', []))

for area in sorted(area_counts.keys()):
    info = area_counts[area]
    avg = info['diagrams'] / info['lessons'] if info['lessons'] > 0 else 0
    print(f"Area {area}: {info['lessons']} lessons, {info['diagrams']} diagrams (avg: {avg:.1f})")

print("\n" + "=" * 80)
total_lessons = len(lessons)
total_diagrams = sum(len(l.get('diagrams', [])) for l in lessons)
print(f"TOTAL: {total_lessons} lessons, {total_diagrams} diagrams")
print("=" * 80)

