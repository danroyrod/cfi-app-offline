import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def score_lesson(lesson):
    score = 0
    for phase in lesson['teachingScript']:
        acts = phase.get('instructorActions', [])
        if any('"' in a or "'" in a for a in acts):
            score += 3
        if len(acts) >= 5:
            score += 2
        if any(w in a.lower() for a in acts for w in ['coach:', 'narrate:', 'explain:', 'brief:', 'ask:']):
            score += 1
    score = min(score, 30)
    diags = lesson.get('diagrams', [])
    if len(diags) >= 2:
        score += 10
    if sum(1 for d in diags if len(d.get('asciiArt', '')) > 100) >= 2:
        score += 10
    elif sum(1 for d in diags if len(d.get('asciiArt', '')) > 100) >= 1:
        score += 5
    if len(lesson.get('keyTeachingPoints', [])) >= 10:
        score += 15
    if len(lesson.get('commonErrors', [])) >= 10:
        score += 15
    if len(lesson.get('overview', '')) > 200:
        score += 10
    if len(lesson.get('safetyConsiderations', [])) >= 6:
        score += 10
    return score

remaining = []
for lesson in data['lessonPlans']:
    s = score_lesson(lesson)
    if 70 <= s < 80:
        remaining.append((lesson['id'], s, lesson['title']))

print(f"📋 THE FINAL 27 LESSONS IN GOOD TIER (70-79):")
print("="*70)
for lp_id, score, title in sorted(remaining, key=lambda x: x[1]):
    print(f"  {lp_id}: {title[:50]} ({score}/100)")

print(f"\n{'='*70}")
print(f"Total: {len(remaining)} lessons need final push to 80+")

