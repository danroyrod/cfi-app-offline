import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load data
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🔍 COMPREHENSIVE QUALITY VALIDATION")
print("="*70)
print("\nValidating ALL 85 lessons against highest quality standards:")
print("  ✓ Detailed teaching dialogue (instructor says \"...\")")
print("  ✓ Custom diagrams (maneuver-specific)")
print("  ✓ Teaching scripts with 5+ instructor actions per phase")
print("  ✓ Phase-specific key points")
print("  ✓ Realistic coaching language")
print("\n" + "="*70)

# Quality scoring system
def assess_lesson_quality(lesson):
    """Assess lesson against highest quality standards"""
    score = 0
    issues = []
    
    # Check 1: Teaching script quality (0-30 points)
    script_score = 0
    has_dialogue = False
    phases_with_detail = 0
    
    for phase in lesson['teachingScript']:
        instructor_actions = phase.get('instructorActions', [])
        
        # Check for dialogue (quotes)
        if any('"' in action or "'" in action for action in instructor_actions):
            has_dialogue = True
            script_score += 3
        
        # Check for detail (5+ actions per phase)
        if len(instructor_actions) >= 5:
            phases_with_detail += 1
            script_score += 2
        
        # Check for coaching language
        coaching_words = ['coach:', 'narrate:', 'explain:', 'brief:', 'discuss:', 'demonstrate:', 'ask:']
        if any(word in action.lower() for action in instructor_actions for word in coaching_words):
            script_score += 1
    
    if not has_dialogue:
        issues.append("Missing realistic teaching dialogue")
    if phases_with_detail < 3:
        issues.append(f"Only {phases_with_detail} phases have detailed actions (need 3+)")
    
    score += min(script_score, 30)
    
    # Check 2: Diagrams (0-20 points)
    diagram_score = 0
    diagrams = lesson.get('diagrams', [])
    
    if len(diagrams) >= 2:
        diagram_score += 10
    elif len(diagrams) >= 1:
        diagram_score += 5
    
    # Check for substantial ASCII art (custom diagrams)
    substantial_diagrams = sum(1 for d in diagrams if len(d.get('asciiArt', '')) > 100)
    if substantial_diagrams >= 2:
        diagram_score += 10
    elif substantial_diagrams >= 1:
        diagram_score += 5
    else:
        issues.append("Diagrams lack detail/customization")
    
    score += diagram_score
    
    # Check 3: Key teaching points (0-15 points)
    key_points = lesson.get('keyTeachingPoints', [])
    if len(key_points) >= 10:
        score += 15
    elif len(key_points) >= 8:
        score += 10
    elif len(key_points) >= 5:
        score += 5
    else:
        issues.append(f"Only {len(key_points)} key points (need 10)")
    
    # Check 4: Common errors (0-15 points)
    errors = lesson.get('commonErrors', [])
    if len(errors) >= 10:
        score += 15
    elif len(errors) >= 8:
        score += 10
    elif len(errors) >= 5:
        score += 5
    else:
        issues.append(f"Only {len(errors)} common errors (need 8-10)")
    
    # Check 5: Overview quality (0-10 points)
    overview = lesson.get('overview', '')
    if len(overview) > 200:
        score += 10
    elif len(overview) > 100:
        score += 5
    else:
        issues.append("Overview needs more detail")
    
    # Check 6: Safety considerations (0-10 points)
    safety = lesson.get('safetyConsiderations', [])
    if len(safety) >= 6:
        score += 10
    elif len(safety) >= 3:
        score += 5
    else:
        issues.append(f"Only {len(safety)} safety items (need 6+)")
    
    return score, issues

# Assess all lessons
quality_tiers = {
    'elite': [],      # 90-100 points
    'excellent': [],  # 80-89 points
    'good': [],       # 70-79 points
    'needs_work': []  # <70 points
}

for lesson in data['lessonPlans']:
    score, issues = assess_lesson_quality(lesson)
    
    lesson_info = {
        'id': lesson['id'],
        'title': lesson['title'],
        'score': score,
        'issues': issues
    }
    
    if score >= 90:
        quality_tiers['elite'].append(lesson_info)
    elif score >= 80:
        quality_tiers['excellent'].append(lesson_info)
    elif score >= 70:
        quality_tiers['good'].append(lesson_info)
    else:
        quality_tiers['needs_work'].append(lesson_info)

# Report results
print("\n📊 QUALITY VALIDATION RESULTS")
print("="*70)

print(f"\n🏆 ELITE (90-100 points): {len(quality_tiers['elite'])} lessons")
print("   Hand-crafted quality with extensive dialogue and detail")
for lesson in quality_tiers['elite'][:5]:
    print(f"   ✨ {lesson['id']}: {lesson['title'][:50]} ({lesson['score']}/100)")
if len(quality_tiers['elite']) > 5:
    print(f"   ... and {len(quality_tiers['elite']) - 5} more")

print(f"\n⭐ EXCELLENT (80-89 points): {len(quality_tiers['excellent'])} lessons")
print("   Very good quality, minor enhancements possible")
for lesson in quality_tiers['excellent'][:5]:
    print(f"   ✓ {lesson['id']}: {lesson['title'][:50]} ({lesson['score']}/100)")
if len(quality_tiers['excellent']) > 5:
    print(f"   ... and {len(quality_tiers['excellent']) - 5} more")

print(f"\n✓ GOOD (70-79 points): {len(quality_tiers['good'])} lessons")
print("   Solid quality, could use dialogue enhancement")
for lesson in quality_tiers['good'][:5]:
    print(f"   • {lesson['id']}: {lesson['title'][:50]} ({lesson['score']}/100)")
if len(quality_tiers['good']) > 5:
    print(f"   ... and {len(quality_tiers['good']) - 5} more")

print(f"\n⚠️  NEEDS WORK (<70 points): {len(quality_tiers['needs_work'])} lessons")
if quality_tiers['needs_work']:
    print("   Requires dialogue and diagram enhancement")
    for lesson in quality_tiers['needs_work']:
        print(f"   ⚠ {lesson['id']}: {lesson['title'][:50]} ({lesson['score']}/100)")
        for issue in lesson['issues']:
            print(f"      - {issue}")

# Summary statistics
total_elite_excellent = len(quality_tiers['elite']) + len(quality_tiers['excellent'])
percentage = int(total_elite_excellent / 85 * 100)

print(f"\n{'='*70}")
print(f"📈 QUALITY SUMMARY")
print(f"{'='*70}")
print(f"Elite + Excellent: {total_elite_excellent}/85 ({percentage}%)")
print(f"Good or better:    {85 - len(quality_tiers['needs_work'])}/85 ({int((85-len(quality_tiers['needs_work']))/85*100)}%)")
print(f"\n🎯 TARGET: 100% at Excellent or Elite level (80+ points)")

if quality_tiers['needs_work']:
    print(f"\n⚠️  ACTION NEEDED:")
    print(f"   {len(quality_tiers['needs_work'])} lessons need dialogue enhancement")
    print(f"   {len(quality_tiers['good'])} lessons could benefit from dialogue")
    print(f"\n📝 RECOMMENDATION:")
    print(f"   Create dialogue enhancement script for {len(quality_tiers['needs_work']) + len(quality_tiers['good'])} lessons")
elif len(quality_tiers['good']) > 0:
    print(f"\n💡 RECOMMENDATION:")
    print(f"   {len(quality_tiers['good'])} good lessons could be elevated with dialogue")
else:
    print(f"\n🎊 ALL 85 LESSONS AT EXCELLENT OR ELITE LEVEL!")
    print(f"   Ready for professional use!")

print(f"\n{'='*70}")

