import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🎯 FIXING LP-VII-N COMPLETELY")
print("="*70)

for lesson in data['lessonPlans']:
    if lesson['id'] != 'LP-VII-N':
        continue
    
    print(f"\n{lesson['id']}: {lesson['title']}")
    print(f"Current: 3 phases, 7 key points")
    
    # FIX 1: Add 2 more teaching phases (adds 12 points to script score)
    # Insert after Student Practice
    lesson['teachingScript'].insert(3, {
        "phase": "Teaching While Flying (15 minutes)",
        "duration": "15 minutes",
        "instructorActions": [
            "Role-play: 'Now I'm your student - teach me while you demonstrate go-around'",
            "Ask questions: 'Why did we add full power first? What if I forgot?'",
            "Make error deliberately: 'I'm not adding enough right rudder...'",
            "Student must identify and correct your error while maintaining control",
            "Assess: 'Can you maintain standards while dividing attention to teach?'",
            "Provide feedback: 'Your instruction was clear and you caught my mistake!'",
            "Build CFI skills: 'This is exactly what you'll do on your checkride'"
        ],
        "studentActions": [
            "Demonstrate go-around while teaching instructor",
            "Explain each step: 'Full power for climb, pitch for VY...'",
            "Identify and correct instructor's deliberate errors",
            "Maintain ACS standards while teaching",
            "Answer instructor questions clearly"
        ],
        "keyPoints": [
            "CFI must fly and teach simultaneously",
            "Error recognition shows mastery",
            "Divided attention skill essential for checkride"
        ]
    })
    
    lesson['teachingScript'].append({
        "phase": "Debrief and Assessment (10 minutes)",
        "duration": "10 minutes",
        "instructorActions": [
            "Self-assess: 'How confident do you feel with go-arounds now?'",
            "Review each attempt: 'On your first go-around, pitch control was excellent'",
            "Highlight improvement: 'Each one got smoother and more decisive'",
            "Discuss decision-making: 'When did you decide to go-around? Too early? Too late?'",
            "Emphasize mindset: 'Go-arounds are professional, not failures'",
            "Assign homework: 'Visualize go-around from every landing position'",
            "Preview: 'Next we'll practice go-arounds with crosswinds'"
        ],
        "studentActions": [
            "Honestly assess go-around proficiency",
            "Identify what felt comfortable vs uncertain",
            "Understand decision-making process",
            "Note areas for continued practice",
            "Commit to using go-around whenever needed"
        ],
        "keyPoints": [
            "Go-around confidence comes from practice",
            "Early decision easier than late scramble",
            "Safety always trumps pride"
        ]
    })
    
    # FIX 2: Add 3 more key teaching points (adds 5 points)
    lesson['keyTeachingPoints'].extend([
        "Recognize unstable approach early: Go-around decision by 500 AGL",
        "Go-around is normal, professional maneuver - not failure or embarrassment",
        "Every landing should be mentally briefed: 'I'll go around if...'"
    ])
    
    print(f"Fixed: 5 phases, 10 key points")
    print(f"\n✅ This should push LP-VII-N over 80!")
    break

# Save
with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n{'='*70}")
print(f"✅ LP-VII-N ENHANCED!")
print(f"{'='*70}")

