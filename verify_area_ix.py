import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

area_ix = [l for l in data['lessonPlans'] if l.get('areaNumber') == 'IX']

print('Area IX Final State:')
print('=' * 80)
total = 0
for lesson in area_ix:
    diagrams = lesson.get('diagrams', [])
    total += len(diagrams)
    print(f"{lesson['id']}: {lesson['title']}")
    print(f"  Diagrams: {len(diagrams)}")
    for i, d in enumerate(diagrams, 1):
        print(f"    {i}. {d.get('title')} -> {d.get('imageUrl', 'N/A')}")
    print()

print(f'Total: {total} imageUrl diagrams (all custom SVGs removed)')

