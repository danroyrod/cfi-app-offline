import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

target_ids = ['LP-VII-C', 'LP-VII-D', 'LP-VII-E', 'LP-VII-F', 'LP-VII-M']

for lp_id in target_ids:
    lesson = [l for l in data['lessonPlans'] if l['id'] == lp_id][0]
    print(f"\n{lp_id}: {lesson['title']}")
    print(f"  Teaching phases: {len(lesson['teachingScript'])}")
    print(f"  Diagrams: {len(lesson['diagrams'])}")
    print(f"  First diagram length: {len(lesson['diagrams'][0].get('asciiArt', ''))}")
    print(f"  Key points: {len(lesson['keyTeachingPoints'])}")
    print(f"  Common errors: {len(lesson['commonErrors'])}")
    print(f"  Instructor actions in phase 1: {len(lesson['teachingScript'][0]['instructorActions'])}")
    
    # Check if has realistic dialogue
    has_dialogue = any('"' in action or "'" in action 
                      for phase in lesson['teachingScript'] 
                      for action in phase['instructorActions'])
    print(f"  Has dialogue: {has_dialogue}")

