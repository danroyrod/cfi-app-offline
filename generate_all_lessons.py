import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load current lessons and ACS data
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    current_data = json.load(f)

with open('src/acs_data.json', 'r', encoding='utf-8') as f:
    acs_data = json.load(f)

# Get existing lesson IDs
existing_ids = {lp['id'] for lp in current_data['lessonPlans']}

print(f"📊 Current Status:")
print(f"   Existing lessons: {len(existing_ids)}")
print(f"   Total ACS tasks: {sum(len(area['tasks']) for area in acs_data['areas'])}")
print(f"\n🚀 Starting autonomous lesson plan generation...\n")

# Define helper functions first
def generate_teaching_script(task_name, is_ground, is_flight):
    """Generate appropriate teaching script based on lesson type"""
    if is_ground:
        return [
            {
                "phase": "Introduction and Objectives",
                "duration": "10 minutes",
                "instructorActions": [
                    "Present lesson objectives clearly",
                    "Relate topic to previous knowledge",
                    f"Ask: 'What do you already know about {task_name.lower()}?'",
                    "Establish learning goals"
                ],
                "studentActions": [
                    "Review lesson objectives",
                    "Share prior knowledge",
                    "Ask clarifying questions"
                ],
                "keyPoints": [
                    "Connect to previous learning",
                    "Set clear expectations"
                ]
            },
            {
                "phase": "Core Content Presentation",
                "duration": "30 minutes",
                "instructorActions": [
                    "Present main concepts using visual aids",
                    "Provide examples and analogies",
                    "Check for understanding frequently",
                    "Encourage questions and discussion"
                ],
                "studentActions": [
                    "Take notes on key concepts",
                    "Ask questions when uncertain",
                    "Relate to personal experience"
                ],
                "keyPoints": [
                    "Use multiple teaching methods",
                    "Verify understanding through feedback"
                ]
            },
            {
                "phase": "Practical Application",
                "duration": "30 minutes",
                "instructorActions": [
                    "Present scenarios and case studies",
                    "Guide student through problem-solving",
                    "Demonstrate practical applications",
                    "Relate theory to actual flight operations"
                ],
                "studentActions": [
                    "Apply concepts to scenarios",
                    "Solve problems independently",
                    "Discuss real-world applications"
                ],
                "keyPoints": [
                    "Theory must connect to practice",
                    "Scenario-based learning enhances retention"
                ]
            },
            {
                "phase": "Assessment and Review",
                "duration": "20 minutes",
                "instructorActions": [
                    "Review key concepts",
                    "Assess student understanding",
                    "Address remaining questions",
                    "Assign homework and preview next lesson"
                ],
                "studentActions": [
                    "Demonstrate understanding",
                    "Summarize key learnings",
                    "Clarify any confusion"
                ],
                "keyPoints": [
                    "Verify all objectives met",
                    "Ensure student confident before next lesson"
                ]
            }
        ]
    else:  # Flight lesson
        return [
            {
                "phase": "Pre-Flight Ground Briefing",
                "duration": "15 minutes",
                "instructorActions": [
                    f"Brief {task_name.lower()} procedure and technique",
                    "Discuss performance standards and tolerances",
                    "Review safety considerations",
                    "Demonstrate with model or diagrams",
                    "Answer questions before flight"
                ],
                "studentActions": [
                    "Review procedure steps",
                    "Ask questions about technique",
                    "Understand ACS standards",
                    "Mentally prepare for flight portion"
                ],
                "keyPoints": [
                    "Clear mental model before flying",
                    "Understand what success looks like"
                ]
            },
            {
                "phase": "Instructor Demonstration",
                "duration": "15 minutes",
                "instructorActions": [
                    f"Demonstrate {task_name.lower()} while narrating",
                    "Call out key control inputs and attitudes",
                    "Emphasize critical technique points",
                    "Show common corrections",
                    "Explain sight pictures and references"
                ],
                "studentActions": [
                    "Observe instructor technique",
                    "Note control inputs and timing",
                    "Watch outside references",
                    "Ask questions during or after demo"
                ],
                "keyPoints": [
                    "Narration helps student follow thought process",
                    "Multiple demonstrations build understanding"
                ]
            },
            {
                "phase": "Guided Student Practice",
                "duration": "20 minutes",
                "instructorActions": [
                    "Coach student through first attempts",
                    "Provide verbal cues: 'Check your airspeed', 'Adjust pitch'",
                    "Make gentle control inputs if needed",
                    "Offer immediate, specific feedback",
                    "Build student confidence progressively"
                ],
                "studentActions": [
                    f"Perform {task_name.lower()} with instructor coaching",
                    "Verbalize actions and observations",
                    "Self-correct with instructor guidance",
                    "Practice 2-3 times"
                ],
                "keyPoints": [
                    "First attempts are learning opportunities",
                    "Praise specific good actions",
                    "Corrections should be immediate and clear"
                ]
            },
            {
                "phase": "Independent Practice with Teaching",
                "duration": "15 minutes",
                "instructorActions": [
                    "Have student teach while demonstrating",
                    "Play role of student: 'What should I do here?'",
                    "Make deliberate errors for student to catch",
                    "Evaluate teaching ability alongside flying",
                    "Provide constructive feedback on both"
                ],
                "studentActions": [
                    f"Perform {task_name.lower()} while explaining to instructor",
                    "Identify and correct instructor's deliberate errors",
                    "Maintain ACS standards while teaching",
                    "Demonstrate teaching proficiency"
                ],
                "keyPoints": [
                    "CFI must teach AND fly simultaneously",
                    "Recognizing errors in others improves own performance"
                ]
            },
            {
                "phase": "Post-Flight Debrief",
                "duration": "10 minutes",
                "instructorActions": [
                    "Review performance against ACS standards",
                    "Highlight improvements and successes",
                    "Address persistent errors constructively",
                    "Relate to real-world instruction scenarios",
                    "Preview next lesson and assign homework"
                ],
                "studentActions": [
                    "Self-assess performance honestly",
                    "Identify areas for improvement",
                    "Ask questions about technique",
                    "Note homework and next lesson preview"
                ],
                "keyPoints": [
                    "Honest self-assessment builds professionalism",
                    "Continuous improvement mindset essential"
                ]
            }
        ]

def generate_key_points(task, area_name):
    """Generate key teaching points from ACS knowledge/skills"""
    points = []
    
    # Extract from knowledge items
    for k_item in task['knowledge'][:3]:
        if k_item['content']:
            points.append(k_item['content'])
    
    # Extract from skills items
    for s_item in task['skills'][:3]:
        if s_item['content']:
            points.append(s_item['content'])
    
    # Add general ones if not enough
    while len(points) < 5:
        points.extend([
            f"Maintain ACS performance standards throughout",
            "Demonstrate proficiency while providing instruction",
            "Recognize and correct common errors",
            "Apply risk management principles",
            "Use appropriate references and resources"
        ])
    
    return points[:8]

def generate_common_errors(task_name, is_flight):
    """Generate realistic common errors"""
    if is_flight:
        return [
            "Inadequate pre-maneuver preparation or planning",
            "Failure to maintain specified airspeed tolerances",
            "Poor altitude control during maneuver",
            "Not maintaining coordinated flight",
            "Fixation on instruments instead of outside references",
            "Inadequate scanning for traffic",
            "Not providing clear instruction while demonstrating"
        ]
    else:
        return [
            "Insufficient preparation or organization",
            "Using overly technical language without explanation",
            "Not checking for student understanding",
            "Failing to relate theory to practical application",
            "Not adapting to student learning style",
            "Inadequate use of visual aids or examples"
        ]

def generate_diagrams(task_name):
    """Generate simple diagram"""
    return [
        {
            "title": f"{task_name} - Key Concept",
            "description": "Visual representation of main teaching points",
            "asciiArt": f"Refer to FAA publications for detailed diagrams\nand visual representations of {task_name}"
        }
    ]

def generate_standards(task):
    """Extract ACS completion standards"""
    standards = []
    for skill in task['skills']:
        standard = {
            "standard": skill['content'],
            "acsReference": skill['code']
        }
        # Check for tolerances
        if any(word in skill['content'].lower() for word in ['±', 'knots', 'feet', 'degrees']):
            import re
            tolerance_match = re.search(r'(±\d+\s*(?:knots?|feet|ft|degrees?|°))', skill['content'], re.IGNORECASE)
            if tolerance_match:
                standard['tolerance'] = tolerance_match.group(1)
        standards.append(standard)
    
    return standards if standards else [
        {"standard": "Demonstrate task proficiency", "acsReference": "See ACS"},
        {"standard": "Provide effective instruction", "acsReference": "See ACS"}
    ]

def generate_equipment(is_flight):
    """Generate equipment list"""
    base = ["POH/AFM", "Current aeronautical charts", "ACS reference"]
    if is_flight:
        base.insert(0, "Airworthy aircraft appropriate for training")
        base.append("Kneeboard and writing materials")
    else:
        base.insert(0, "Whiteboard or presentation materials")
        base.append("Relevant FAA handbooks")
        base.append("Visual aids and diagrams")
    return base

def generate_safety(task_name, is_flight):
    """Generate safety considerations"""
    if is_flight:
        return [
            "Complete thorough pre-flight briefing",
            "Ensure adequate altitude for maneuver practice",
            "Clear area before and during maneuvers",
            "Monitor student for signs of fatigue or stress",
            "Be prepared to take controls if necessary",
            "Maintain continuous traffic scan",
            "Ensure weather within student capability",
            f"Brief specific risks associated with {task_name.lower()}"
        ]
    else:
        return [
            "Create psychologically safe learning environment",
            "Ensure adequate time for questions",
            "Monitor student engagement and understanding",
            "Address any concerns or anxieties",
            "Maintain professional instructor-student relationship"
        ]

# Track what we're creating
new_lessons = []
skipped = []

# Generate all missing lessons
for area in acs_data['areas']:
    for task in area['tasks']:
        lesson_id = f"LP-{area['number']}-{task['letter']}"
        if lesson_id not in existing_ids:
            # Determine types
            is_ground = area['number'] in ['I', 'II', 'III']
            is_flight = area['number'] in ['VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII']
            
            lesson = {
                "id": lesson_id,
                "areaNumber": area['number'],
                "taskLetter": task['letter'],
                "title": task['name'],
                "estimatedTime": "1.5 hours" if is_ground else "0.8-1.0 hours",
                "objectives": [
                    f"Understand and explain {task['name'].lower()}",
                    "Demonstrate proficiency in this task",
                    "Apply risk management principles",
                    "Meet ACS completion standards",
                    "Identify and correct common errors"
                ],
                "references": [ref.strip() for ref in (task['references'].split(',') if task['references'] else ['FAA-H-8083-3', 'FAA-H-8083-9', 'POH/AFM'])][:5],
                "prerequisites": ["Previous lessons in sequence", "Basic understanding of related concepts"],
                "overview": task['objective'] if task['objective'] else f"This comprehensive lesson covers {task['name'].lower()} as specified in the CFI Airplane ACS. Students will demonstrate both proficiency in performing the task and the ability to teach it effectively.",
                "teachingScript": generate_teaching_script(task['name'], is_ground, is_flight),
                "keyTeachingPoints": generate_key_points(task, area['name']),
                "commonErrors": generate_common_errors(task['name'], is_flight),
                "diagrams": generate_diagrams(task['name']),
                "completionStandards": generate_standards(task),
                "equipment": generate_equipment(is_flight),
                "notes": [f"Reference ACS Area {area['number']}, Task {task['letter']} for complete requirements"],
                "suggestedHomework": [
                    f"Study {task['name'].lower()} procedures",
                    "Review related FAA handbook sections",
                    "Chair fly or visualize the task",
                    "Prepare questions for next lesson"
                ],
                "instructorNotes": [
                    "Adapt lesson to student learning style",
                    "Provide constructive, specific feedback",
                    "Monitor for fatigue or stress"
                ],
                "safetyConsiderations": generate_safety(task['name'], is_flight)
            }
            
            new_lessons.append(lesson)
            print(f"✅ Generated: {lesson_id} - {task['name'][:60]}")

# Merge and save
current_data['lessonPlans'].extend(new_lessons)

with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(current_data, f, indent=2, ensure_ascii=False)

print(f"\n{'='*70}")
print(f"🎉 GENERATION COMPLETE!")
print(f"{'='*70}")
print(f"Skipped (already exist):  {len(skipped)}")
print(f"Newly generated:          {len(new_lessons)}")
print(f"Total lesson plans:       {len(current_data['lessonPlans'])}")
print(f"\n✅ All {len(current_data['lessonPlans'])} lesson plans saved to src/lessonPlansData.json")
print(f"\n🎯 Next: Review and enhance generated lessons with specific content!")
#END OF SCRIPT
    if is_ground:
        return [
            {
                "phase": "Introduction and Objectives",
                "duration": "10 minutes",
                "instructorActions": [
                    "Present lesson objectives clearly",
                    "Relate topic to previous knowledge",
                    f"Ask: 'What do you already know about {task_name.lower()}?'",
                    "Establish learning goals"
                ],
                "studentActions": [
                    "Review lesson objectives",
                    "Share prior knowledge",
                    "Ask clarifying questions"
                ],
                "keyPoints": [
                    "Connect to previous learning",
                    "Set clear expectations"
                ]
            },
            {
                "phase": "Core Content Presentation",
                "duration": "30 minutes",
                "instructorActions": [
                    "Present main concepts using visual aids",
                    "Provide examples and analogies",
                    "Check for understanding frequently",
                    "Encourage questions and discussion"
                ],
                "studentActions": [
                    "Take notes on key concepts",
                    "Ask questions when uncertain",
                    "Relate to personal experience"
                ],
                "keyPoints": [
                    "Use multiple teaching methods",
                    "Verify understanding through feedback"
                ]
            },
            {
                "phase": "Practical Application",
                "duration": "30 minutes",
                "instructorActions": [
                    "Present scenarios and case studies",
                    "Guide student through problem-solving",
                    "Demonstrate practical applications",
                    "Relate theory to actual flight operations"
                ],
                "studentActions": [
                    "Apply concepts to scenarios",
                    "Solve problems independently",
                    "Discuss real-world applications"
                ],
                "keyPoints": [
                    "Theory must connect to practice",
                    "Scenario-based learning enhances retention"
                ]
            },
            {
                "phase": "Assessment and Review",
                "duration": "20 minutes",
                "instructorActions": [
                    "Review key concepts",
                    "Assess student understanding",
                    "Address remaining questions",
                    "Assign homework and preview next lesson"
                ],
                "studentActions": [
                    "Demonstrate understanding",
                    "Summarize key learnings",
                    "Clarify any confusion"
                ],
                "keyPoints": [
                    "Verify all objectives met",
                    "Ensure student confident before next lesson"
                ]
            }
        ]
    else:  # Flight lesson
        return [
            {
                "phase": "Pre-Flight Ground Briefing",
                "duration": "15 minutes",
                "instructorActions": [
                    f"Brief {task_name.lower()} procedure and technique",
                    "Discuss performance standards and tolerances",
                    "Review safety considerations",
                    "Demonstrate with model or diagrams",
                    "Answer questions before flight"
                ],
                "studentActions": [
                    "Review procedure steps",
                    "Ask questions about technique",
                    "Understand ACS standards",
                    "Mentally prepare for flight portion"
                ],
                "keyPoints": [
                    "Clear mental model before flying",
                    "Understand what success looks like"
                ]
            },
            {
                "phase": "Instructor Demonstration",
                "duration": "15 minutes",
                "instructorActions": [
                    f"Demonstrate {task_name.lower()} while narrating",
                    "Call out key control inputs and attitudes",
                    "Emphasize critical technique points",
                    "Show common corrections",
                    "Explain sight pictures and references"
                ],
                "studentActions": [
                    "Observe instructor technique",
                    "Note control inputs and timing",
                    "Watch outside references",
                    "Ask questions during or after demo"
                ],
                "keyPoints": [
                    "Narration helps student follow thought process",
                    "Multiple demonstrations build understanding"
                ]
            },
            {
                "phase": "Guided Student Practice",
                "duration": "20 minutes",
                "instructorActions": [
                    "Coach student through first attempts",
                    "Provide verbal cues: 'Check your airspeed', 'Adjust pitch'",
                    "Make gentle control inputs if needed",
                    "Offer immediate, specific feedback",
                    "Build student confidence progressively"
                ],
                "studentActions": [
                    f"Perform {task_name.lower()} with instructor coaching",
                    "Verbalize actions and observations",
                    "Self-correct with instructor guidance",
                    "Practice 2-3 times"
                ],
                "keyPoints": [
                    "First attempts are learning opportunities",
                    "Praise specific good actions",
                    "Corrections should be immediate and clear"
                ]
            },
            {
                "phase": "Independent Practice with Teaching",
                "duration": "15 minutes",
                "instructorActions": [
                    "Have student teach while demonstrating",
                    "Play role of student: 'What should I do here?'",
                    "Make deliberate errors for student to catch",
                    "Evaluate teaching ability alongside flying",
                    "Provide constructive feedback on both"
                ],
                "studentActions": [
                    f"Perform {task_name.lower()} while explaining to instructor",
                    "Identify and correct instructor's deliberate errors",
                    "Maintain ACS standards while teaching",
                    "Demonstrate teaching proficiency"
                ],
                "keyPoints": [
                    "CFI must teach AND fly simultaneously",
                    "Recognizing errors in others improves own performance"
                ]
            },
            {
                "phase": "Post-Flight Debrief",
                "duration": "10 minutes",
                "instructorActions": [
                    "Review performance against ACS standards",
                    "Highlight improvements and successes",
                    "Address persistent errors constructively",
                    "Relate to real-world instruction scenarios",
                    "Preview next lesson and assign homework"
                ],
                "studentActions": [
                    "Self-assess performance honestly",
                    "Identify areas for improvement",
                    "Ask questions about technique",
                    "Note homework and next lesson preview"
                ],
                "keyPoints": [
                    "Honest self-assessment builds professionalism",
                    "Continuous improvement mindset essential"
                ]
            }
        ]

def generate_key_points(task, area_name):
    """Generate key teaching points from ACS knowledge/skills"""
    points = []
    
    # Extract from knowledge items
    for k_item in task['knowledge'][:3]:
        if k_item['content']:
            points.append(k_item['content'])
    
    # Extract from skills items
    for s_item in task['skills'][:3]:
        if s_item['content']:
            points.append(s_item['content'])
    
    # Add general ones if not enough
    while len(points) < 5:
        points.extend([
            f"Maintain ACS performance standards throughout",
            "Demonstrate proficiency while providing instruction",
            "Recognize and correct common errors",
            "Apply risk management principles",
            "Use appropriate references and resources"
        ])
    
    return points[:8]

def generate_common_errors(task_name, is_flight):
    """Generate realistic common errors"""
    if is_flight:
        return [
            "Inadequate pre-maneuver preparation or planning",
            "Failure to maintain specified airspeed tolerances",
            "Poor altitude control during maneuver",
            "Not maintaining coordinated flight",
            "Fixation on instruments instead of outside references",
            "Inadequate scanning for traffic",
            "Not providing clear instruction while demonstrating"
        ]
    else:
        return [
            "Insufficient preparation or organization",
            "Using overly technical language without explanation",
            "Not checking for student understanding",
            "Failing to relate theory to practical application",
            "Not adapting to student learning style",
            "Inadequate use of visual aids or examples"
        ]

def generate_diagrams(task_name):
    """Generate simple diagram"""
    return [
        {
            "title": f"{task_name} - Key Concept",
            "description": "Visual representation of main teaching points",
            "asciiArt": f"Refer to FAA publications for detailed diagrams\nand visual representations of {task_name}"
        }
    ]

def generate_standards(task):
    """Extract ACS completion standards"""
    standards = []
    for skill in task['skills']:
        standard = {
            "standard": skill['content'],
            "acsReference": skill['code']
        }
        # Check for tolerances
        if any(word in skill['content'].lower() for word in ['±', 'knots', 'feet', 'degrees']):
            import re
            tolerance_match = re.search(r'(±\d+\s*(?:knots?|feet|ft|degrees?|°))', skill['content'], re.IGNORECASE)
            if tolerance_match:
                standard['tolerance'] = tolerance_match.group(1)
        standards.append(standard)
    
    return standards if standards else [
        {"standard": "Demonstrate task proficiency", "acsReference": "See ACS"},
        {"standard": "Provide effective instruction", "acsReference": "See ACS"}
    ]

def generate_equipment(is_flight):
    """Generate equipment list"""
    base = ["POH/AFM", "Current aeronautical charts", "ACS reference"]
    if is_flight:
        base.insert(0, "Airworthy aircraft appropriate for training")
        base.append("Kneeboard and writing materials")
    else:
        base.insert(0, "Whiteboard or presentation materials")
        base.append("Relevant FAA handbooks")
        base.append("Visual aids and diagrams")
    return base

def generate_safety(task_name, is_flight):
    """Generate safety considerations"""
    if is_flight:
        return [
            "Complete thorough pre-flight briefing",
            "Ensure adequate altitude for maneuver practice",
            "Clear area before and during maneuvers",
            "Monitor student for signs of fatigue or stress",
            "Be prepared to take controls if necessary",
            "Maintain continuous traffic scan",
            "Ensure weather within student capability",
            f"Brief specific risks associated with {task_name.lower()}"
        ]
    else:
        return [
            "Create psychologically safe learning environment",
            "Ensure adequate time for questions",
            "Monitor student engagement and understanding",
            "Address any concerns or anxieties",
            "Maintain professional instructor-student relationship"
        ]

# Generate all missing lessons
for area in acs_data['areas']:
    for task in area['tasks']:
        lesson_id = f"LP-{area['number']}-{task['letter']}"
        if lesson_id not in existing_ids:
            # Determine types
            is_ground = area['number'] in ['I', 'II', 'III']
            is_flight = area['number'] in ['VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII']
            
            lesson = {
                "id": lesson_id,
                "areaNumber": area['number'],
                "taskLetter": task['letter'],
                "title": task['name'],
                "estimatedTime": "1.5 hours" if is_ground else "0.8-1.0 hours",
                "objectives": [
                    f"Understand and explain {task['name'].lower()}",
                    "Demonstrate proficiency in this task",
                    "Apply risk management principles",
                    "Meet ACS completion standards",
                    "Identify and correct common errors"
                ],
                "references": [ref.strip() for ref in (task['references'].split(',') if task['references'] else ['FAA-H-8083-3', 'FAA-H-8083-9', 'POH/AFM'])][:5],
                "prerequisites": ["Previous lessons in sequence", "Basic understanding of related concepts"],
                "overview": task['objective'] if task['objective'] else f"This comprehensive lesson covers {task['name'].lower()} as specified in the CFI Airplane ACS. Students will demonstrate both proficiency in performing the task and the ability to teach it effectively.",
                "teachingScript": generate_teaching_script(task['name'], is_ground, is_flight),
                "keyTeachingPoints": generate_key_points(task, area['name']),
                "commonErrors": generate_common_errors(task['name'], is_flight),
                "diagrams": generate_diagrams(task['name']),
                "completionStandards": generate_standards(task),
                "equipment": generate_equipment(is_flight),
                "notes": [f"Reference ACS Area {area['number']}, Task {task['letter']} for complete requirements"],
                "suggestedHomework": [
                    f"Study {task['name'].lower()} procedures",
                    "Review related FAA handbook sections",
                    "Chair fly or visualize the task",
                    "Prepare questions for next lesson"
                ],
                "instructorNotes": [
                    "Adapt lesson to student learning style",
                    "Provide constructive, specific feedback",
                    "Monitor for fatigue or stress"
                ],
                "safetyConsiderations": generate_safety(task['name'], is_flight)
            }
            
            new_lessons.append(lesson)
            print(f"✅ Generated: {lesson_id} - {task['name'][:60]}")

# Merge and save
current_data['lessonPlans'].extend(new_lessons)

with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(current_data, f, indent=2, ensure_ascii=False)

print(f"\n{'='*70}")
print(f"🎉 GENERATION COMPLETE!")
print(f"{'='*70}")
print(f"Skipped (already exist):  {len(skipped)}")
print(f"Newly generated:          {len(new_lessons)}")
print(f"Total lesson plans:       {len(current_data['lessonPlans'])}")
print(f"\n✅ All {len(current_data['lessonPlans'])} lesson plans saved to src/lessonPlansData.json")
print(f"\n🎯 Next: Review and enhance generated lessons with specific content!")

