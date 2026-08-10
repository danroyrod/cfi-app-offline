import json
import sys
import re
sys.stdout.reconfigure(encoding='utf-8')

# Load data
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    current_data = json.load(f)
with open('src/acs_data.json', 'r', encoding='utf-8') as f:
    acs_data = json.load(f)

existing_ids = {lp['id'] for lp in current_data['lessonPlans']}

print(f"📊 Starting with {len(existing_ids)} existing lessons")
print(f"🎯 Target: {sum(len(a['tasks']) for a in acs_data['areas'])} total\n")

def create_teaching_script(task_name, is_ground, is_flight):
    if is_ground:
        return [
            {"phase": "Introduction", "duration": "10 min", "instructorActions": ["Present objectives", "Connect to prior knowledge"], "studentActions": ["Review objectives"], "keyPoints": ["Set clear expectations"]},
            {"phase": "Content Presentation", "duration": "30 min", "instructorActions": ["Teach main concepts", "Use visual aids"], "studentActions": ["Take notes", "Ask questions"], "keyPoints": ["Multiple teaching methods"]},
            {"phase": "Application", "duration": "30 min", "instructorActions": ["Present scenarios"], "studentActions": ["Apply concepts"], "keyPoints": ["Connect theory to practice"]},
            {"phase": "Assessment", "duration": "20 min", "instructorActions": ["Review key points"], "studentActions": ["Demonstrate understanding"], "keyPoints": ["Verify objectives met"]}
        ]
    else:
        return [
            {"phase": "Ground Brief", "duration": "15 min", "instructorActions": [f"Brief {task_name.lower()} procedure", "Review standards"], "studentActions": ["Review procedures"], "keyPoints": ["Clear mental model"]},
            {"phase": "Demonstration", "duration": "15 min", "instructorActions": [f"Demonstrate {task_name.lower()}", "Narrate actions"], "studentActions": ["Observe technique"], "keyPoints": ["Learn from demonstration"]},
            {"phase": "Guided Practice", "duration": "20 min", "instructorActions": ["Coach student"], "studentActions": ["Practice with coaching"], "keyPoints": ["Build proficiency"]},
            {"phase": "Independent Practice", "duration": "15 min", "instructorActions": ["Student teaches"], "studentActions": ["Demonstrate while teaching"], "keyPoints": ["CFI must teach and fly"]},
            {"phase": "Debrief", "duration": "10 min", "instructorActions": ["Review performance"], "studentActions": ["Self-assess"], "keyPoints": ["Continuous improvement"]}
        ]

new_lessons = []

for area in acs_data['areas']:
    for task in area['tasks']:
        lesson_id = f"LP-{area['number']}-{task['letter']}"
        if lesson_id in existing_ids:
            continue
        
        is_ground = area['number'] in ['I', 'II', 'III']
        is_flight = area['number'] in ['VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII']
        
        # Extract key points from ACS
        key_points = []
        for item in (task['knowledge'] + task['skills'])[:6]:
            if item['content']:
                key_points.append(item['content'])
        if len(key_points) < 5:
            key_points.extend(["Apply ACS standards", "Demonstrate proficiency", "Teach effectively"])
        
        # Extract completion standards
        standards = []
        for skill in task['skills']:
            std = {"standard": skill['content'], "acsReference": skill['code']}
            tol_match = re.search(r'(±\d+\s*(?:knots?|feet|ft|degrees?|°))', skill['content'], re.I)
            if tol_match:
                std['tolerance'] = tol_match.group(1)
            standards.append(std)
        if not standards:
            standards = [{"standard": "Meet ACS requirements", "acsReference": f"AI.{area['number']}.{task['letter']}"}]
        
        lesson = {
            "id": lesson_id,
            "areaNumber": area['number'],
            "taskLetter": task['letter'],
            "title": task['name'],
            "estimatedTime": "1.5 hours" if is_ground else "0.8-1.0 hours",
            "objectives": [
                f"Understand and explain {task['name'].lower()}",
                "Demonstrate task proficiency",
                "Apply risk management",
                "Meet ACS standards",
                "Identify and correct errors"
            ],
            "references": [r.strip() for r in (task['references'].split(',') if task['references'] else ['FAA-H-8083-3', 'POH/AFM'])][:5],
            "prerequisites": ["Previous lessons", "Basic understanding of concepts"],
            "overview": task['objective'] or f"Comprehensive lesson on {task['name'].lower()} per CFI Airplane ACS. Students demonstrate proficiency and teaching ability.",
            "teachingScript": create_teaching_script(task['name'], is_ground, is_flight),
            "keyTeachingPoints": key_points[:8],
            "commonErrors": [
                "Inadequate preparation",
                "Poor performance standards",
                "Not maintaining tolerances",
                "Inadequate instruction quality",
                "Missing safety considerations"
            ] if is_flight else [
                "Insufficient organization",
                "Unclear explanations",
                "Not checking understanding",
                "Poor visual aids",
                "Not relating to practice"
            ],
            "diagrams": [{"title": f"{task['name']}", "description": "Key concepts", "asciiArt": f"See FAA handbooks for detailed diagrams"}],
            "completionStandards": standards[:10],
            "equipment": ["Airworthy aircraft", "POH/AFM"] if is_flight else ["Whiteboard", "FAA handbooks"],
            "notes": [f"ACS Area {area['number']}, Task {task['letter']}"],
            "suggestedHomework": [f"Study {task['name'].lower()}", "Review FAA handbook", "Chair fly procedure"],
            "instructorNotes": ["Adapt to student", "Provide feedback", "Monitor progress"],
            "safetyConsiderations": [
                "Clear area", "Monitor student", "Be ready to intervene", "Check weather"
            ] if is_flight else [
                "Safe learning environment", "Time for questions", "Monitor engagement"
            ]
        }
        
        new_lessons.append(lesson)
        print(f"✅ {lesson_id}: {task['name'][:55]}")

current_data['lessonPlans'].extend(new_lessons)

with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(current_data, f, indent=2, ensure_ascii=False)

print(f"\n{'='*70}")
print(f"🎉 ALL LESSON PLANS GENERATED!")
print(f"{'='*70}")
print(f"Newly created:  {len(new_lessons)}")
print(f"Total lessons:  {len(current_data['lessonPlans'])}/85")
print(f"Coverage:       {int(len(current_data['lessonPlans'])/85*100)}%")
print(f"\n✅ Saved to src/lessonPlansData.json")
print(f"🌐 Refresh browser to see all lessons!")

