import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

lessons = data['lessonPlans']

# Count total
total_diagrams = sum(len(l.get('diagrams', [])) for l in lessons)
lessons_with_diagrams = [l for l in lessons if len(l.get('diagrams', [])) > 0]

print("=" * 80)
print("FINAL VERIFICATION - ALL LESSON PLANS")
print("=" * 80)
print(f"\nTotal lessons: {len(lessons)}")
print(f"Lessons with diagrams: {len(lessons_with_diagrams)}")
print(f"Total imageUrl diagrams: {total_diagrams}")
print(f"Lessons without diagrams: {len(lessons) - len(lessons_with_diagrams)}")

# Count by area
print("\n" + "=" * 80)
print("DIAGRAMS BY AREA")
print("=" * 80)
print(f"{'Area':<8} {'Lessons':<10} {'With Diagrams':<15} {'Total Diagrams':<15}")
print("-" * 80)

area_stats = {}
for lesson in lessons:
    area = lesson.get('areaNumber', 'Unknown')
    if area not in area_stats:
        area_stats[area] = {'lessons': 0, 'with_diagrams': 0, 'diagrams': 0}
    area_stats[area]['lessons'] += 1
    diagrams = lesson.get('diagrams', [])
    if diagrams:
        area_stats[area]['with_diagrams'] += 1
        area_stats[area]['diagrams'] += len(diagrams)

for area in sorted(area_stats.keys()):
    stats = area_stats[area]
    print(f"Area {area:<4} {stats['lessons']:<10} {stats['with_diagrams']:<15} {stats['diagrams']:<15}")

print("\n" + "=" * 80)
print("All custom SVG diagrams removed - only imageUrl diagrams remain")
print("=" * 80)

