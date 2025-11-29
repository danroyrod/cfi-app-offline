import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load existing lesson plans text for reference
with open('C:/Users/danrr/Desktop/CFI/Lesson Plans - CFI-ASEL - text.txt', 'r', encoding='utf-8', errors='ignore') as f:
    reference_text = f.read()

# Load current lesson plans
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🔍 QUALITY AUDIT REPORT")
print("="*70)

# Identify quality tiers
high_quality = []  # Hand-crafted with detailed scripts
needs_enhancement = []  # Auto-generated with basic scripts

for lesson in data['lessonPlans']:
    # Check quality indicators
    script_quality = 0
    
    # Check teaching script detail level
    for phase in lesson['teachingScript']:
        if len(phase['instructorActions']) >= 4 and any('"' in action or "'" in action for action in phase['instructorActions']):
            script_quality += 2  # Has dialogue
        elif len(phase['instructorActions']) >= 3:
            script_quality += 1  # Has multiple actions
    
    # Check key points
    if len(lesson['keyTeachingPoints']) >= 6:
        script_quality += 1
    
    # Check common errors specificity
    if len(lesson['commonErrors']) >= 5 and any(len(error) > 50 for error in lesson['commonErrors']):
        script_quality += 1
    
    # Check diagrams
    if len(lesson['diagrams']) > 1 and any(len(d.get('asciiArt', '')) > 100 for d in lesson['diagrams']):
        script_quality += 1
    
    if script_quality >= 6:
        high_quality.append(lesson['id'])
    else:
        needs_enhancement.append((lesson['id'], script_quality, lesson['title']))

print(f"\n✅ High Quality (Detailed): {len(high_quality)} lessons")
for lp_id in high_quality[:10]:
    print(f"   {lp_id}")
if len(high_quality) > 10:
    print(f"   ... and {len(high_quality) - 10} more")

print(f"\n⚠️  Needs Enhancement: {len(needs_enhancement)} lessons")
print("\nPriority for Enhancement (by area):")

by_area = {}
for lp_id, quality, title in needs_enhancement:
    area = lp_id.split('-')[1]
    if area not in by_area:
        by_area[area] = []
    by_area[area].append((lp_id, quality, title))

for area in sorted(by_area.keys()):
    lessons = by_area[area]
    print(f"\n  Area {area}: {len(lessons)} lessons")
    for lp_id, q, title in lessons[:3]:
        print(f"    - {lp_id}: {title[:50]} (quality: {q}/10)")
    if len(lessons) > 3:
        print(f"    ... and {len(lessons) - 3} more")

print(f"\n{'='*70}")
print(f"📊 ENHANCEMENT STRATEGY:")
print(f"{'='*70}")
print(f"Total lessons needing enhancement: {len(needs_enhancement)}")
print(f"Priority areas: VII, X, IX, XI, XII (flight-critical)")
print(f"\nNext: Run enhancement scripts to improve teaching scripts,")
print(f"      diagrams, and specific content for each lesson.")

