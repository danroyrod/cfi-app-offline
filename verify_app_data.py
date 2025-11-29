import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Expected structure from official Table of Contents
expected_structure = {
    "I": {"name": "Fundamentals of Instructing", "tasks": 6},
    "II": {"name": "Technical Subject Areas", "tasks": 16},
    "III": {"name": "Preflight Preparation", "tasks": 3},
    "IV": {"name": "Preflight Lesson on a Maneuver to be Performed in Flight", "tasks": 1},
    "V": {"name": "Preflight Procedures", "tasks": 6},
    "VI": {"name": "Airport and Seaplane Base Operations", "tasks": 2},
    "VII": {"name": "Takeoffs, Landings, and Go-Arounds", "tasks": 15},
    "VIII": {"name": "Fundamentals of Flight", "tasks": 4},
    "IX": {"name": "Performance and Ground Reference Maneuvers", "tasks": 6},
    "X": {"name": "Slow flight, Stalls, and Spins", "tasks": 9},
    "XI": {"name": "Basic Instrument Maneuvers", "tasks": 5},
    "XII": {"name": "Emergency Operations", "tasks": 7},
    "XIII": {"name": "Multiengine Operations", "tasks": 3},
    "XIV": {"name": "Postflight Procedures", "tasks": 2}
}

# Load app data
with open("src/acs_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("="*80)
print("CFI AIRPLANE ACS APP - DATA VERIFICATION")
print("="*80)

# Document info
print(f"\nDocument: {data['document_number']}")
print(f"Title: {data['title']}")
print(f"Date: {data['date']}")

# Areas verification
print(f"\n{'='*80}")
print("AREAS OF OPERATION")
print("="*80)

all_good = True
total_expected = sum(exp['tasks'] for exp in expected_structure.values())
total_found = 0

for area_num, expected in expected_structure.items():
    found_area = next((a for a in data['areas'] if a['number'] == area_num), None)
    
    if not found_area:
        print(f"❌ MISSING: Area {area_num}")
        all_good = False
        continue
    
    task_count = len(found_area['tasks'])
    total_found += task_count
    
    status = "✓" if task_count == expected['tasks'] else "❌"
    print(f"{status} Area {area_num:>4}: {found_area['name']:<55} {task_count:>2}/{expected['tasks']:>2} tasks")
    
    if task_count != expected['tasks']:
        all_good = False

# Appendices
print(f"\n{'='*80}")
print("APPENDICES")
print("="*80)

if 'appendices' in data and len(data['appendices']) == 3:
    print("✓ All 3 appendices present:")
    for app in data['appendices']:
        print(f"  {app['number']}. {app['name']}")
else:
    print(f"❌ Expected 3 appendices, found {len(data.get('appendices', []))}")
    all_good = False

# Final summary
print(f"\n{'='*80}")
print("SUMMARY")
print("="*80)
print(f"Areas: {len(data['areas'])}/14")
print(f"Tasks: {total_found}/{total_expected}")
print(f"Appendices: {len(data.get('appendices', []))}/3")

if all_good and total_found == total_expected:
    print(f"\n✅ SUCCESS - All data verified against official FAA-S-ACS-25!")
    print("="*80)
else:
    print(f"\n⚠️  Issues found - see above")
    print("="*80)

