import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Force fresh load
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🔍 FRESH VALIDATION - True Current State")
print("="*70)

def score(lesson):
    s = 0
    
    # Teaching script (0-30)
    for p in lesson['teachingScript']:
        acts = p.get('instructorActions', [])
        if any(('"' in a or "'" in a) for a in acts):
            s += 3
        if len(acts) >= 5:
            s += 2
        if any(w in a.lower() for a in acts for w in ['coach:', 'narrate:', 'explain:', 'brief:', 'discuss:', 'demonstrate:', 'ask:']):
            s += 1
    s = min(s, 30)
    
    # Diagrams (0-20)
    diags = lesson.get('diagrams', [])
    if len(diags) >= 2:
        s += 10
    big_diags = sum(1 for d in diags if len(d.get('asciiArt', '')) > 100)
    if big_diags >= 2:
        s += 10
    elif big_diags >= 1:
        s += 5
    
    # Key points (0-15)
    if len(lesson.get('keyTeachingPoints', [])) >= 10:
        s += 15
    elif len(lesson.get('keyTeachingPoints', [])) >= 8:
        s += 10
    
    # Common errors (0-15)
    if len(lesson.get('commonErrors', [])) >= 10:
        s += 15
    elif len(lesson.get('commonErrors', [])) >= 8:
        s += 10
    
    # Overview (0-10)
    if len(lesson.get('overview', '')) > 200:
        s += 10
    elif len(lesson.get('overview', '')) > 100:
        s += 5
    
    # Safety (0-10)
    if len(lesson.get('safetyConsiderations', [])) >= 6:
        s += 10
    
    return s

elite = []
excellent = []
good = []

for lesson in data['lessonPlans']:
    s = score(lesson)
    if s >= 90:
        elite.append((lesson['id'], s, lesson['title']))
    elif s >= 80:
        excellent.append((lesson['id'], s, lesson['title']))
    else:
        good.append((lesson['id'], s, lesson['title']))

print(f"\n🏆 ELITE (90-100): {len(elite)} lessons")
print(f"⭐ EXCELLENT (80-89): {len(excellent)} lessons")
print(f"✓ GOOD (70-79): {len(good)} lessons")
print(f"\n{'='*70}")
print(f"Elite + Excellent: {len(elite) + len(excellent)}/85 ({int((len(elite)+len(excellent))/85*100)}%)")

if good:
    print(f"\n📋 {len(good)} lessons still in Good tier:")
    for lp_id, s, title in sorted(good, key=lambda x: x[1]):
        print(f"  {lp_id}: {title[:50]} ({s}/100)")

