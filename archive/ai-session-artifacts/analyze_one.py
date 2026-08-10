import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check LP-VII-N to see what's missing
lesson = [l for l in data['lessonPlans'] if l['id'] == 'LP-VII-N'][0]

print(f"Analyzing: {lesson['id']} - {lesson['title']}")
print("="*70)

# Teaching script analysis
print(f"\nTeaching Script: {len(lesson['teachingScript'])} phases")
for i, phase in enumerate(lesson['teachingScript'], 1):
    acts = phase['instructorActions']
    dialogue_count = sum(1 for a in acts if '"' in a or "'" in a)
    coaching_count = sum(1 for a in acts if any(w in a.lower() for w in ['coach:', 'narrate:', 'explain:', 'brief:', 'discuss:', 'demonstrate:', 'ask:']))
    
    print(f"  Phase {i}: {phase['phase']}")
    print(f"    Actions: {len(acts)}")
    print(f"    With dialogue: {dialogue_count}/{len(acts)}")
    print(f"    With coaching word: {coaching_count}/{len(acts)}")
    if acts:
        print(f"    Sample: {acts[0][:70]}")
    
    # Points from this phase
    pts = 0
    if dialogue_count > 0:
        pts += 3
    if len(acts) >= 5:
        pts += 2
    if coaching_count > 0:
        pts += 1
    print(f"    Points from phase: {pts}/6")

print(f"\nDiagrams: {len(lesson['diagrams'])}")
for i, d in enumerate(lesson['diagrams'], 1):
    print(f"  Diagram {i}: {len(d.get('asciiArt', ''))} chars")

print(f"\nKey Points: {len(lesson['keyTeachingPoints'])}")
print(f"Common Errors: {len(lesson['commonErrors'])}")
print(f"Overview: {len(lesson['overview'])} chars")
print(f"Safety: {len(lesson['safetyConsiderations'])}")

# Calculate score breakdown
script_pts = 0
for p in lesson['teachingScript']:
    acts = p['instructorActions']
    if any('"' in a or "'" in a for a in acts):
        script_pts += 3
    if len(acts) >= 5:
        script_pts += 2
    if any(w in a.lower() for a in acts for w in ['coach:', 'narrate:', 'explain:', 'brief:', 'discuss:', 'demonstrate:', 'ask:']):
        script_pts += 1

print(f"\n📊 SCORE BREAKDOWN:")
print(f"  Teaching Script: {min(script_pts, 30)}/30")
diag_pts = 10 if len(lesson['diagrams']) >= 2 else 0
big = sum(1 for d in lesson['diagrams'] if len(d.get('asciiArt', '')) > 100)
diag_pts += (10 if big >= 2 else (5 if big >= 1 else 0))
print(f"  Diagrams: {diag_pts}/20")
print(f"  Key Points: {15 if len(lesson['keyTeachingPoints']) >= 10 else 10}/15")
print(f"  Common Errors: {15 if len(lesson['commonErrors']) >= 10 else 10}/15")
print(f"  Overview: {10 if len(lesson['overview']) > 200 else 5}/10")
print(f"  Safety: {10 if len(lesson['safetyConsiderations']) >= 6 else 0}/10")
print(f"  TOTAL: {min(script_pts,30) + diag_pts + (15 if len(lesson['keyTeachingPoints'])>=10 else 10) + (15 if len(lesson['commonErrors'])>=10 else 10) + (10 if len(lesson['overview'])>200 else 5) + (10 if len(lesson['safetyConsiderations'])>=6 else 0)}/100")

print(f"\n🎯 TO REACH 80:")
needed = 80 - (min(script_pts,30) + diag_pts + (15 if len(lesson['keyTeachingPoints'])>=10 else 10) + (15 if len(lesson['commonErrors'])>=10 else 10) + (10 if len(lesson['overview'])>200 else 5) + (10 if len(lesson['safetyConsiderations'])>=6 else 0))
print(f"  Need: {needed} more points")
print(f"  Options:")
print(f"    - Add more safety items to reach 6 ({6-len(lesson['safetyConsiderations'])} more needed) = +10 pts")
print(f"    - Extend overview to 200+ chars = +5 pts")
print(f"    - More dialogue in phases = up to +{30 - min(script_pts, 30)} pts")

