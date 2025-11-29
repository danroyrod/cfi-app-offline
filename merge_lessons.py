import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load existing lesson plans
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    main_data = json.load(f)

# Load additional lesson plans
with open('additional_lessons.json', 'r', encoding='utf-8') as f:
    additional = json.load(f)

# Merge
main_data['lessonPlans'].extend(additional)

# Save
with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(main_data, f, indent=2, ensure_ascii=False)

print(f"✅ Merged successfully!")
print(f"Total lesson plans: {len(main_data['lessonPlans'])}")
print("\nLesson plans by area:")
from collections import defaultdict
by_area = defaultdict(list)
for lp in main_data['lessonPlans']:
    by_area[lp['areaNumber']].append(lp['id'])

for area in sorted(by_area.keys()):
    print(f"  Area {area:>4}: {len(by_area[area])} lessons - {', '.join(by_area[area])}")

