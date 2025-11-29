#!/usr/bin/env python3
"""Check Area IX lessons and their diagrams."""

import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

ix_lessons = [lp for lp in data['lessonPlans'] if lp['areaNumber'] == 'IX']
print(f"Area IX lessons: {len(ix_lessons)}\n")

for lp in ix_lessons:
    print(f"{lp['taskLetter']}: {lp['title']}")
    print(f"  Diagrams: {len(lp.get('diagrams', []))}")
    if lp.get('diagrams'):
        for d in lp['diagrams']:
            print(f"    - {d.get('title', 'No title')}")

