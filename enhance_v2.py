import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load data
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# High-quality lesson IDs (keep as-is)
high_quality_ids = {'LP-I-A', 'LP-VII-A', 'LP-VII-B', 'LP-X-C', 'LP-II-D', 'LP-XII-A', 
                    'LP-VII-E', 'LP-VII-F', 'LP-VII-N', 'LP-IX-A', 'LP-X-A', 'LP-X-D',
                    'LP-VIII-A', 'LP-VIII-B', 'LP-I-B'}

print("ðŸš€ Starting Comprehensive Enhancement Process...")
print("="*70)

# Define all functions FIRST
def enhance_objectives(title, is_ground, is_flight):
    base_title_lower = title.lower()
    objs = [f"Demonstrate and explain {base_title_lower} procedures and techniques"]
    
    if is_flight:
        objs.extend([
            "Maintain all specified ACS performance standards and tolerances",
            "Recognize and correct common errors during execution",
            "Apply appropriate risk management throughout the maneuver",
            "Provide effective instruction while simultaneously demonstrating"
        ])
    else:
        objs.extend([
            "Explain concepts clearly using appropriate teaching methods",
            "Apply instructional knowledge to realistic scenarios",
            "Identify and mitigate risks associated with this subject",
            "Assess student understanding and provide effective feedback"
        ])
    
    return objs

def enhance_teaching_script(title, area, task, is_ground, is_flight):
    title_lower = title.lower()
    
    if is_ground:
        return create_ground_teaching_script(title, area, task)
    else:
        return create_flight_teaching_script(title, area, task)

def create_ground_teaching_script(title, area, task):
    return [
        {
            "phase": "Introduction & Motivation (10 minutes)",
            "duration": "10 minutes",
            "instructorActions": [
                f"Welcome and introduce {title.lower()}",
                f"Ask: 'What experience do you have with {title.lower()}?'",
                "Present lesson objectives on board",
                f"Explain why {title.lower()} is critical for flight instructors",
                "Share a real-world scenario or story related to topic"
            ],
            "studentActions": [
                "Share prior knowledge or experience",
                "Review written objectives",
                "Ask initial questions",
                "Connect topic to personal experience"
            ],
            "keyPoints": [
                "Establish relevance from the start",
                "Connect to student's existing knowledge",
                "Set clear, achievable expectations"
            ]
        },
        {
            "phase": "Core Content Teaching (30 minutes)",
            "duration": "30 minutes",
            "instructorActions": [
                f"Present main concepts of {title.lower()} using whiteboard",
                "Use diagrams, charts, and visual aids",
                "Provide concrete examples from aviation",
                "Check understanding: 'Can you explain this back to me?'",
                "Encourage questions throughout",
                "Use analogies to make complex concepts clear"
            ],
            "studentActions": [
                "Take organized notes",
                "Ask questions when concepts unclear",
                "Provide examples from own experience",
                "Engage in discussion actively"
            ],
            "keyPoints": [
                "Use multiple teaching methods (visual, auditory, kinesthetic)",
                "Frequent understanding checks prevent confusion",
                "Concrete examples beat abstract theory",
                "Student engagement improves retention"
            ]
        },
        {
            "phase": "Practical Application & Scenarios (30 minutes)",
            "duration": "30 minutes",
            "instructorActions": [
                f"Present 3-5 realistic scenarios involving {title.lower()}",
                "Guide student through problem-solving process",
                f"Ask: 'How would you handle this situation as a CFI?'",
                "Discuss multiple approaches and their trade-offs",
                "Relate scenarios to actual checkride situations",
                "Have student explain their reasoning"
            ],
            "studentActions": [
                "Analyze scenarios provided",
                "Apply learned concepts to solve problems",
                "Explain reasoning and decision-making",
                "Discuss alternative approaches",
                "Connect theory to practical situations"
            ],
            "keyPoints": [
                "Scenario-based training enhances transfer of learning",
                "Multiple correct approaches exist - teach judgment",
                "Student must articulate reasoning, not just answers",
                "Checkride scenarios help with preparation"
            ]
        },
        {
            "phase": "Assessment & Review (15 minutes)",
            "duration": "15 minutes",
            "instructorActions": [
                "Review all key concepts covered today",
                f"Ask: 'What are the most important points about {title.lower()}?'",
                "Have student teach back one concept to you",
                "Address any remaining questions or confusion",
                "Assign specific homework with clear expectations",
                f"Preview next lesson and how it builds on {title.lower()}"
            ],
            "studentActions": [
                "Summarize key learnings in own words",
                "Teach one concept back to instructor",
                "Ask final clarifying questions",
                "Note homework assignments",
                "Review for understanding"
            ],
            "keyPoints": [
                "Teaching back ensures true understanding",
                "Spaced practice (homework) enhances retention",
                "Preview next lesson provides continuity",
                "Student should leave confident and clear"
            ]
        }
    ]

def create_flight_teaching_script(title, area, task):
    return [
        {
            "phase": "Pre-Flight Ground Briefing (15 minutes)",
            "duration": "15 minutes",
            "instructorActions": [
                f"Brief complete {title.lower()} procedure step-by-step",
                "Draw the maneuver profile or pattern on whiteboard",
                "Demonstrate with model airplane showing control inputs",
                f"Explain: 'Here's what you'll see and feel during {title.lower()}'",
                "Review ACS standards: 'You need to maintain altitude Â±X feet'",
                "Discuss common student difficulties with this maneuver",
                "Answer all questions before flight - ensure mental model clear"
            ],
            "studentActions": [
                "Study the drawn diagram carefully",
                "Visualize the complete maneuver sequence",
                "Ask questions about technique",
                "Review ACS performance standards",
                "Mentally rehearse the procedure"
            ],
            "keyPoints": [
                "Clear mental model before flying reduces errors",
                "Visual aids (diagram, model) enhance understanding",
                "Student should be able to verbalize procedure before flying",
                "Address concerns before getting in airplane"
            ]
        },
        {
            "phase": "Instructor Demonstration (15 minutes)",
            "duration": "15 minutes",
            "instructorActions": [
                f"Narrate entire {title.lower()} sequence: 'First I'll...'",
                "Call out every control input: 'Applying back pressure... feeling the buffet'",
                "Verbalize sight pictures: 'Notice the horizon position here'",
                f"Execute perfect {title.lower()} while explaining",
                "Point out key moments: 'This is where students often...'",
                "After completing: 'What did you observe?'",
                "Demonstrate again if needed with different emphasis"
            ],
            "studentActions": [
                "Watch instructor's hands and feet on controls",
                "Observe aircraft attitude and outside references",
                "Note instrument indications during maneuver",
                "Feel control pressures if possible",
                "Ask questions about what you observed",
                "Mentally rehearse what you just saw"
            ],
            "keyPoints": [
                "Narrated demonstration is powerful teaching tool",
                "Student learns sequence, timing, and technique",
                "Multiple demonstrations from different angles helpful",
                "Seeing proper execution sets the standard"
            ]
        },
        {
            "phase": "Guided Student Practice (20 minutes)",
            "duration": "20 minutes",
            "instructorActions": [
                f"Coach: 'Okay, you've got the controls, let's try {title.lower()}'",
                "Provide verbal prompts: 'Check your altitude... adjust power'",
                "Make gentle physical corrections if needed: 'Feel this rudder input'",
                "Give immediate feedback: 'Good! That's exactly the right technique'",
                "If error occurs: 'Let's talk about what happened there'",
                "Build confidence: 'That one was much better than the first!'",
                "Gradually reduce coaching as proficiency improves"
            ],
            "studentActions": [
                f"Perform {title.lower()} with instructor coaching",
                "Verbalize your actions: 'Now I'm adjusting pitch for...'",
                "Self-correct when you notice deviations",
                "Ask for help when uncertain: 'How much bank should I have?'",
                "Practice 3-5 times with decreasing instructor input",
                "Focus on meeting ACS standards"
            ],
            "keyPoints": [
                "First attempts will have errors - this is learning!",
                "Verbalization helps instructor follow student thinking",
                "Positive specific feedback accelerates learning",
                "Gradual reduction of coaching builds independence",
                "Safety: instructor ready to take controls anytime"
            ]
        },
        {
            "phase": "Teaching While Flying (15 minutes)",
            "duration": "15 minutes",
            "instructorActions": [
                "Explain: 'Now I'm your student - teach me while you demonstrate'",
                f"Ask questions: 'Why do we do {title.lower()} this way?'",
                "Make a deliberate error: 'I'm letting my altitude slip...'",
                "Student must catch and correct your error",
                "Evaluate: Can student maintain standards while teaching?",
                "Provide feedback on both flying and teaching quality"
            ],
            "studentActions": [
                f"Perform {title.lower()} while explaining to instructor",
                "Describe what you're doing and why",
                "Identify and correct instructor's deliberate errors",
                "Maintain ACS standards while dividing attention",
                "Answer instructor's questions clearly",
                "Demonstrate both proficiency and teaching ability"
            ],
            "keyPoints": [
                "CFI checkride requires simultaneous demonstration and instruction",
                "Teaching while flying is challenging - requires practice",
                "Student must maintain standards despite divided attention",
                "Error recognition shows deep understanding"
            ]
        },
        {
            "phase": "Post-Flight Debrief & Assessment (10 minutes)",
            "duration": "10 minutes",
            "instructorActions": [
                "Ask: 'How do you think you did? Which was your best attempt?'",
                "Review each attempt: 'On attempt #1, your altitude was...'",
                "Highlight specific improvements seen",
                "Address persistent errors constructively",
                "Show how performance compares to ACS standards",
                "Assign specific homework for continued improvement",
                "Preview next lesson and how it builds on this one"
            ],
            "studentActions": [
                "Honestly self-assess performance",
                "Identify what went well and what needs work",
                "Ask questions about persistent difficulties",
                "Discuss how to improve for next time",
                "Note homework assignments",
                "Set personal goals for next lesson"
            ],
            "keyPoints": [
                "Self-assessment develops professionalism",
                "Specific feedback is actionable feedback",
                "Improvement trajectory matters more than perfection",
                "Homework and next lesson create continuity"
            ]
        }
    ]

def enhance_key_points(title, area, existing_points):
    # Keep existing points from ACS if they're good, add specific teaching points
    enhanced = list(existing_points[:5])  # Keep first 5 from ACS
    
    # Add teaching-specific points
    enhanced.extend([
        f"Maintain all ACS performance standards for {title.lower()}",
        "Clear, systematic teaching approach essential",
        "Student proficiency improves with consistent practice",
        "Safety considerations must be briefed before every lesson"
    ])
    
    return enhanced[:8]

def enhance_common_errors(title, area, is_flight):
    title_lower = title.lower()
    
    if is_flight:
        if 'takeoff' in title_lower:
            return [
                "Inadequate right rudder during power application - left yaw",
                "Not maintaining centerline during takeoff roll",
                "Rotating at incorrect airspeed (too early or too late)",
                "Poor directional control after liftoff",
                "Not establishing proper climb airspeed quickly",
                "Forgetting to retract flaps at appropriate altitude",
                "Not completing after-takeoff checklist",
                "Inadequate traffic scan during departure"
            ]
        elif 'landing' in title_lower or 'approach' in title_lower:
            return [
                "Unstabilized approach - varying airspeeds and descent rates",
                "Too fast on final approach - leads to floating",
                "Late or premature flare resulting in hard landing",
                "Not maintaining centerline during landing roll",
                "Inadequate crosswind correction throughout approach",
                "Attempting to salvage bad approach instead of going around",
                "Fixation on instruments instead of outside visual references",
                "Improper power management on short final"
            ]
        elif 'stall' in title_lower:
            return [
                "Not clearing area adequately before stall practice",
                "Inadequate altitude for stall recovery practice",
                "Uncoordinated stall entry - spin risk",
                "Hesitant or delayed stall recovery",
                "Secondary stall during recovery - excessive back pressure",
                "Not maintaining awareness of heading during recovery",
                "Fixating on airspeed instead of angle of attack",
                "Not briefing stall recovery procedure adequately"
            ]
        elif 'turn' in title_lower:
            return [
                "Inadequate back pressure - altitude loss in turn",
                "Uncoordinated flight - ball not centered",
                "Rolling in/out without sufficient rudder - adverse yaw",
                "Bank angle too shallow or too steep",
                "Late rollout - overshooting target heading",
                "Fixation inside cockpit during turns",
                "Not maintaining constant airspeed through turn",
                "Forgetting to look for traffic before/during turns"
            ]
        else:
            return [
                "Inadequate pre-maneuver planning and preparation",
                "Not maintaining specified performance tolerances",
                "Poor altitude and/or airspeed control",
                "Uncoordinated flight - ball not centered",
                "Fixation on instruments vs outside references",
                "Inadequate traffic scanning throughout",
                "Not completing appropriate checklists",
                "Providing unclear or incomplete instruction while demonstrating"
            ]
    else:  # Ground lesson
        return [
            "Insufficient lesson organization and preparation",
            "Using overly technical jargon without explanation",
            "Not checking for student understanding frequently enough",
            "Failing to use visual aids effectively",
            "Not relating theory to practical flight applications",
            "Moving too quickly without ensuring comprehension",
            "Not adapting teaching style to student needs",
            "Inadequate use of examples and scenarios"
        ]

def create_specific_diagrams(title, area, task):
    title_lower = title.lower()
    
    # Create task-specific diagrams
    if 'takeoff' in title_lower:
        return [
            {
                "title": "Takeoff Profile",
                "description": "Complete takeoff sequence from ground roll to climbout",
                "asciiArt": "Ground Roll â†’ Rotation â†’ Liftoff â†’ Initial Climb â†’ VY Climb\n[Rudder mgmt] [Ease back] [Pos rate]  [Accel to VY] [Maintain VY]"
            },
            {
                "title": "Left-Turning Tendencies",
                "description": "Four factors causing left yaw requiring right rudder",
                "asciiArt": "P-Factor (descending blade has more thrust) â†’\nTorque (engine rotation reaction)        â†’\nSpiraling Slipstream (hits left tail)   â†’\nGyroscopic Precession (prop acts like gyro) â†’\n                    ALL REQUIRE â†’ RIGHT RUDDER"
            }
        ]
    elif 'landing' in title_lower or 'approach' in title_lower:
        return [
            {
                "title": "Stabilized Approach Criteria",
                "description": "Four elements of a stabilized approach",
                "asciiArt": "Stabilized Approach =\n  1. On Correct Glidepath    âœ“\n  2. At Correct Airspeed     âœ“\n  3. Configured for Landing  âœ“\n  4. Aligned with Runway     âœ“\nAll four must be met by 500' AGL"
            },
            {
                "title": "Landing Phases",
                "description": "Roundout, hold-off, touchdown sequence",
                "asciiArt": "Approach â†’ Roundout (20ft) â†’ Hold-Off (10ft) â†’ Touchdown â†’ Rollout\n   65kts      [ease back]     [progressive]    [mains first] [maintain ctr]"
            }
        ]
    elif 'stall' in title_lower:
