import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check the 8 that are scoring low
low_scores = ['LP-X-C', 'LP-VIII-B', 'LP-XII-A', 'LP-VII-C', 'LP-VII-D', 'LP-VII-M', 'LP-X-H', 'LP-X-I']

for lp_id in low_scores:
    lesson = [l for l in data['lessonPlans'] if l['id'] == lp_id][0]
    print(f"\n{lp_id}: {lesson['title'][:50]}")
    print(f"  Phases: {len(lesson['teachingScript'])}")
    print(f"  Phase 1 actions: {len(lesson['teachingScript'][0]['instructorActions'])}")
    
    # Check for dialogue
    phase1_actions = lesson['teachingScript'][0]['instructorActions']
    has_dialogue = any('"' in a or "'" in a for a in phase1_actions)
    print(f"  Has dialogue: {has_dialogue}")
    print(f"  First action: {phase1_actions[0][:70]}...")
    
    # Check diagrams
    print(f"  Diagrams: {len(lesson['diagrams'])}")
    if lesson['diagrams']:
        print(f"  Diagram 1 length: {len(lesson['diagrams'][0].get('asciiArt', ''))} chars")

