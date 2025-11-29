import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load lesson plans
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Remove duplicates by id
seen_ids = set()
unique_lessons = []

for lesson in data['lessonPlans']:
    if lesson['id'] not in seen_ids:
        seen_ids.add(lesson['id'])
        unique_lessons.append(lesson)
    else:
        print(f"⚠️  Removing duplicate: {lesson['id']}")

data['lessonPlans'] = unique_lessons

# Save cleaned data
with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n✅ Cleaned successfully!")
print(f"Total unique lesson plans: {len(unique_lessons)}")
print("\nLesson plans by area:")

from collections import defaultdict
by_area = defaultdict(list)
for lp in unique_lessons:
    by_area[lp['areaNumber']].append(f"{lp['taskLetter']}: {lp['title'][:40]}")

for area in sorted(by_area.keys()):
    print(f"\n  Area {area}:")
    for lesson in by_area[area]:
        print(f"    - {lesson}")

