import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load data
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🌟 ELEVATING NEXT 20 LESSONS TO EXCEPTIONAL DETAIL")
print("="*70)
print("\nPriority Selection (Most Frequently Taught):")
print("  Area VII: Remaining takeoff/landing variations")
print("  Area X: Remaining stall demonstrations") 
print("  Area IX: Performance maneuvers")
print("  Area XI: Instrument maneuvers")
print("  Area V: Preflight procedures")
print("\n" + "="*70)

# Target the next 20 most important lessons
batch_1_targets = [
    # Area VII - Critical takeoff/landing variations (10)
    'LP-VII-G',  # Confined Area Takeoff
    'LP-VII-H',  # Confined Area Landing
    'LP-VII-I',  # Glassy Water Takeoff
    'LP-VII-J',  # Glassy Water Landing
    'LP-VII-K',  # Rough Water Takeoff
    'LP-VII-L',  # Rough Water Landing
    'LP-VII-O',  # Power-Off 180° Landing
    'LP-VIII-C', # Climbs and Climbing Turns
    'LP-VIII-D', # Descents and Descending Turns
    'LP-VI-B',   # Traffic Patterns
    
    # Area X - Stall demonstrations (4)
    'LP-X-B',    # Flight Characteristics Demo
    'LP-X-E',    # Accelerated Stalls
    'LP-X-F',    # Cross-Controlled Stall
    'LP-X-G',    # Elevator Trim Stall
    
    # Area IX - Performance maneuvers (4)
    'LP-IX-B',   # Steep Spiral
    'LP-IX-C',   # Chandelles
    'LP-IX-D',   # Lazy Eights
    'LP-IX-E',   # Ground Reference Maneuvers
    
    # Area XI - Instrument fundamentals (2)
    'LP-XI-D',   # Turns to Headings
    'LP-XI-E',   # Unusual Attitudes Recovery
]

elevated = 0

for lesson in data['lessonPlans']:
    if lesson['id'] not in batch_1_targets:
        continue
    
    print(f"\n💎 Elevating: {lesson['id']} - {lesson['title']}")
    
    # Store original for comparison
    area = lesson['areaNumber']
    task = lesson['taskLetter']
    title = lesson['title']
    
    # ELEVATION STRATEGIES based on lesson type
    
    if lesson['id'] == 'LP-VIII-C':  # Climbs and Climbing Turns
        lesson['teachingScript'] = [
            {
                "phase": "Ground Briefing (15 minutes)",
                "duration": "15 minutes",
                "instructorActions": [
                    "Brief: 'Today we're perfecting climbs - both straight and turning'",
                    "Draw on board: Power + Pitch = Climb performance",
                    "Explain: 'We have three climb speeds: VX (angle), VY (rate), cruise climb'",
                    "Show POH: 'VY for this airplane is 79 knots - gives best rate of climb'",
                    "Demonstrate with model: Bank angle during climbing turns",
                    "Discuss: 'In climbing turns, we need extra back pressure - why?'",
                    "Brief standards: 'Maintain climb speed ±5 knots, heading ±10 degrees'"
                ],
                "studentActions": [
                    "Study the pitch-power-performance relationship",
                    "Identify VX, VY, and cruise climb speeds from POH",
                    "Understand why climbing turns need more back pressure",
                    "Review climb performance standards"
                ],
                "keyPoints": [
                    "Power primarily controls climb rate",
                    "Pitch controls airspeed during climb",
                    "Trim reduces control pressures",
                    "Climbing turns increase load factor - need more back pressure"
                ]
            },
            {
                "phase": "Demonstration - Straight Climbs (10 minutes)",
                "duration": "10 minutes",
                "instructorActions": [
                    "Set up: 'Starting from level flight at cruise power'",
                    "Narrate: 'Adding climb power smoothly... about 2400 RPM'",
                    "Pitch: 'Raising nose to climb attitude... establishing VY'",
                    "Trim: 'Trimming for hands-off climb at 79 knots'",
                    "Monitor: 'Checking climb rate... about 700 feet per minute... good'",
                    "Explain sight picture: 'Notice the horizon position? Remember this'",
                    "Call out: 'Maintaining VY... 79 knots... heading 360... climbing through 3500'"
                ],
                "studentActions": [
                    "Observe pitch attitude change",
                    "Note power setting for climb",
                    "Watch trim technique",
                    "Remember visual sight picture",
                    "Observe instrument indications"
                ],
                "keyPoints": [
                    "Smooth power transition prevents pitch change",
                    "Trim is essential for consistent climb speed",
                    "Visual attitude primary, instruments confirm",
                    "Monitor engine temperatures in prolonged climb"
                ]
            },
            {
                "phase": "Demonstration - Climbing Turns (10 minutes)",
                "duration": "10 minutes",
                "instructorActions": [
                    "Brief: 'Now I'll demonstrate a climbing turn - watch the back pressure'",
                    "Execute: 'Climbing at VY... 79 knots... now rolling into 20 degree bank'",
                    "Narrate: 'Adding back pressure... maintaining VY... notice extra pressure needed?'",
                    "Explain: 'The bank increased our load factor - more back pressure for same performance'",
                    "Rollout: 'Rolling out on heading 090... relaxing back pressure slightly'",
                    "Discuss: 'In steeper climbing turns, you need even more back pressure'",
                    "Common error: 'Students often let airspeed decay in climbing turns'"
                ],
                "studentActions": [
                    "Observe increased back pressure in turn",
                    "Note airspeed management",
                    "Watch coordination (ball centered)",
                    "Feel the different control pressures"
                ],
                "keyPoints": [
                    "Bank angle increases load factor in climb",
                    "More back pressure needed to maintain VY",
                    "Coordination critical - ball centered",
                    "Airspeed management more challenging in climbing turn"
                ]
            },
            {
                "phase": "Student Practice - Straight Climbs (15 minutes)",
                "duration": "15 minutes",
                "instructorActions": [
                    "Coach: 'Add your climb power... there you go'",
                    "If pitch too high: 'Lower the nose slightly... there's VY'",
                    "If airspeed varies: 'Check your pitch... small adjustments'",
                    "Praise: 'Good! You're holding 79 knots perfectly'",
                    "Prompt: 'Don't forget to trim... feel those pressures disappear?'",
                    "Build confidence: 'That climb looked great - nice stable VY'"
                ],
                "studentActions": [
                    "Perform 3-4 climbs from level flight",
                    "Establish and maintain VY ±5 knots",
                    "Use trim to remove control pressures",
                    "Maintain assigned heading ±10 degrees"
                ],
                "keyPoints": [
                    "First attempts may have airspeed variations - normal",
                    "Trim discipline develops with practice",
                    "Consistent sight picture comes with experience"
                ]
            },
            {
                "phase": "Student Practice - Climbing Turns (20 minutes)",
                "duration": "20 minutes",
                "instructorActions": [
                    "Set up: 'Establish VY climb, then turn to heading 180'",
                    "During turn: 'Remember extra back pressure... keep VY'",
                    "If airspeed decays: 'You're slowing - need more power or lower nose'",
                    "If climbing turn is rough: 'Smooth, coordinated - roll, bank, back pressure together'",
                    "Praise specifics: 'Perfect coordination on that one!'",
                    "Build proficiency: 'Each turn is getting smoother'"
                ],
                "studentActions": [
                    "Perform climbing turns to various headings",
                    "Maintain VY ±5 knots throughout turn",
                    "Maintain coordinated flight (ball centered)",
                    "Roll out on assigned heading ±10 degrees",
                    "Practice both left and right turns"
                ],
                "keyPoints": [
                    "Climbing turns require finesse",
                    "Load factor management is key",
                    "Practice both directions - left feels different from right"
                ]
            },
            {
                "phase": "Debrief (10 minutes)",
                "duration": "10 minutes",
                "instructorActions": [
                    "Review: 'Your straight climbs were solid - good VY control'",
                    "Discuss: 'In climbing turns, what did you notice about back pressure?'",
                    "Highlight: 'Your coordination improved significantly by the last turn'",
                    "Connect: 'This skill is essential for departure procedures and traffic patterns'",
                    "Assign: 'Chair fly: Visualize climbs and climbing turns with proper technique'"
                ],
                "studentActions": [
                    "Self-assess climb performance",
                    "Understand load factor effects",
                    "Identify personal areas for improvement",
                    "Note homework assignments"
                ],
                "keyPoints": [
                    "Climbs are fundamental to every flight",
                    "Climbing turns common in traffic patterns",
                    "Precision improves with continued practice"
                ]
            }
        ]
        
        lesson['keyTeachingPoints'] = [
            "Straight climb: Add power, establish pitch for VY, trim",
            "VY provides best rate of climb - fastest way to gain altitude",
            "Pitch controls airspeed during climb, power controls rate",
            "Trim is essential for consistent climb performance",
            "Climbing turns increase load factor - need more back pressure",
            "Bank angle in climbing turn typically 15-20 degrees maximum",
            "Steeper bank requires significantly more back pressure",
            "Maintain VY ±5 knots throughout climb and climbing turns",
            "Monitor engine temperatures during prolonged climbs",
            "Return to level flight: reduce power first, then lower nose"
        ]
        
        lesson['commonErrors'] = [
            "Not adding enough power - inadequate climb performance",
            "Pitch attitude too high - airspeed below VY",
            "Not using trim - fighting controls throughout climb",
            "In climbing turns: not adding extra back pressure - airspeed decays",
            "Rolling into climbing turn without sufficient back pressure ready",
            "Letting ball drift off center in climbing turns",
            "Chasing airspeed with pitch - over-controlling",
            "Not monitoring engine temperatures during climb",
            "Fixating on instruments instead of attitude flying",
            "Forgetting to return to cruise power and pitch when leveling off"
        ]
        
        lesson['diagrams'] = [
            {
                "title": "Climb Performance Relationship",
                "description": "How power and pitch work together in climbs",
                "asciiArt": "CLIMB PERFORMANCE:\n\nPower Setting → Determines climb RATE\n  (More power = faster climb)\n\nPitch Attitude → Determines climb AIRSPEED\n  (Higher nose = slower speed)\n\nOptimal Climb:\n  Power: Climb power (2400-2500 RPM typical)\n  Pitch: VY attitude (nose above horizon)\n  Result: Best rate of climb"
            },
            {
                "title": "Load Factor in Climbing Turns",
                "description": "Why extra back pressure is needed",
                "asciiArt": "STRAIGHT CLIMB:    CLIMBING TURN:\n   Load: 1.0 G        Load: 1.15-1.2 G (at 20° bank)\n   Back pressure      MORE back pressure needed\n   needed            to maintain same performance\n\n[✈] Level           [✈] Banked & climbing\n                    ↗\n                Need more lift = more back pressure"
            },
            {
                "title": "Climbing Turn Coordination",
                "description": "Maintaining coordinated flight during climbing turn",
                "asciiArt": "Entry to Climbing Turn:\n1. Already established in VY climb\n2. Roll to 15-20° bank (aileron + rudder)\n3. Add back pressure (maintain VY)\n4. Monitor ball - keep centered ( O )\n5. Roll out on heading - reduce back pressure\n\nCommon: Left climbing turn easier than right\n(P-factor helps left turn, fights right turn)"
            }
        ]
        
        lesson['safetyConsiderations'] = [
            "Maintain awareness of terrain and obstacles during climb",
            "Monitor engine temperatures - cooling reduced during climb",
            "Clear area before and during climbing turns",
            "Ensure adequate altitude for practice (2000 AGL minimum)",
            "Watch for traffic - especially when nose is high",
            "Be aware of stall speed increase in climbing turns",
            "Monitor for carburetor ice conditions if applicable",
            "Brief student on recovering to level flight"
        ]
        
        elevated += 1
        print(f"  ✨ EXCEPTIONAL: {lesson['id']}")
    
    elif lesson['id'] == 'LP-VIII-D':  # Descents and Descending Turns
        lesson['teachingScript'] = [
            {
                "phase": "Ground Briefing (15 minutes)",
                "duration": "15 minutes",
                "instructorActions": [
                    "Brief: 'Descents are how we lose altitude in a controlled manner'",
                    "Explain: 'Three types: VY descent, cruise descent, approach descent'",
                    "Draw: Power + Pitch = Descent rate + Airspeed",
                    "Demonstrate with model: Descending turn technique",
                    "Discuss: 'Pitch primarily controls airspeed, power controls rate'",
                    "Brief carburetor ice: 'Carburetor heat on during power-off descents'",
                    "Review standards: 'Descent airspeed ±5 knots, heading ±10 degrees'"
                ],
                "studentActions": [
                    "Understand descent types and their uses",
                    "Study power-pitch relationship in descents",
                    "Review carburetor heat procedures",
                    "Understand descent performance standards"
                ],
                "keyPoints": [
                    "Power controls descent rate",
                    "Pitch controls descent airspeed",
                    "Carburetor heat critical in power-off descents",
                    "Descending turns need less back pressure than level"
                ]
            },
            {
                "phase": "Demonstration - Straight Descents (10 minutes)",
                "duration": "10 minutes",
                "instructorActions": [
                    "Set up: 'Level at 4500, we'll descend to 3500'",
                    "Execute: 'Carburetor heat ON... reducing power to 1800 RPM'",
                    "Pitch: 'Lower nose to descent attitude... establishing 90 knots'",
                    "Narrate: 'Descending 500 feet per minute... 90 knots... heading 360'",
                    "Trim: 'Trimming for hands-off descent... there'",
                    "Level off: 'Approaching 3500... adding power to cruise... raising nose'",
                    "Explain: 'Notice how I led the level-off by about 50 feet?'"
                ],
                "studentActions": [
                    "Observe power reduction first",
                    "Note pitch change to control speed",
                    "Watch trim adjustment",
                    "Observe level-off technique and lead"
                ],
                "keyPoints": [
                    "Power reduction first, then pitch",
                    "Trim off control pressures",
                    "Lead level-off by 10% of descent rate (50-100 feet)",
                    "Carburetor heat prevents ice"
                ]
            },
            {
                "phase": "Demonstration - Descending Turns (10 minutes)",
                "duration": "10 minutes",
                "instructorActions": [
                    "Brief: 'Descending turn combines descent and turn - watch the back pressure'",
                    "Execute: 'Descending at 90 knots... rolling into 20 degree bank'",
                    "Narrate: 'Less back pressure needed than level turn... ball centered'",
                    "Explain: 'Gravity helps the turn - we actually need less back pressure'",
                    "Demonstrate: 'Maintaining 90 knots... 500 FPM down... turning to 270'",
                    "Roll out: 'Rolling wings level... continuing descent to 3000'"
                ],
                "studentActions": [
                    "Observe reduced back pressure compared to level turn",
                    "Note airspeed stability",
                    "Watch coordination",
                    "See descent rate management"
                ],
                "keyPoints": [
                    "Descending turns need LESS back pressure",
                    "Gravity component aids the turn",
                    "Monitor airspeed - tendency to increase",
                    "Coordination still critical"
                ]
            },
            {
                "phase": "Student Practice - Straight Descents (15 minutes)",
                "duration": "15 minutes",
                "instructorActions": [
                    "Coach: 'Okay, descend from 4000 to 3000 at 90 knots'",
                    "Prompt: 'Carburetor heat first... good... now reduce power'",
                    "If fast: 'Check your pitch... lower nose slightly for proper speed'",
                    "If slow: 'You're slow - need more nose-down pitch'",
                    "Level-off: 'Start your level-off... power first... now pitch'",
                    "Praise: 'Excellent level-off right on altitude!'"
                ],
                "studentActions": [
                    "Perform 3-4 descents from level flight",
                    "Maintain descent airspeed ±5 knots",
                    "Control descent rate with power",
                    "Level off within ±100 feet of target",
                    "Use proper carburetor heat"
                ],
                "keyPoints": [
                    "Anticipate level-off - don't wait until target altitude",
                    "Smooth transitions prevent passenger discomfort",
                    "Consistent technique builds precision"
                ]
            },
            {
                "phase": "Student Practice - Descending Turns (20 minutes)",
                "duration": "20 minutes",
                "instructorActions": [
                    "Set up: 'Descend from 3500 to 2500, turn to heading 180'",
                    "During turn: 'Remember - less back pressure than level turn'",
                    "If airspeed building: 'You're accelerating - reduce power or raise nose'",
                    "If coordination off: 'Check your ball... center it with rudder'",
                    "Combine both: 'Now descend AND turn to 090'",
                    "Build complexity: 'Excellent handling of that combined maneuver'"
                ],
                "studentActions": [
                    "Perform descending turns to assigned headings",
                    "Maintain descent speed ±5 knots",
                    "Keep descent rate consistent",
                    "Maintain coordinated flight",
                    "Level off on target altitude ±100 feet",
                    "Roll out on assigned heading ±10 degrees"
                ],
                "keyPoints": [
                    "Descending turns common in traffic patterns",
                    "Multi-tasking improves with practice",
                    "Smooth, coordinated technique is goal"
                ]
            },
            {
                "phase": "Debrief (10 minutes)",
                "duration": "10 minutes",
                "instructorActions": [
                    "Review: 'Your level-offs improved each time - good anticipation'",
                    "Discuss: 'What surprised you about descending turns?'",
                    "Highlight: 'Your airspeed control was within 3 knots - excellent'",
                    "Connect: 'These skills are used on every approach to landing'",
                    "Preview: 'Next lesson we'll combine these with pattern work'",
                    "Assign: 'Practice visualizing smooth descents and level-offs'"
                ],
                "studentActions": [
                    "Self-assess descent technique",
                    "Understand practical applications",
                    "Note areas for continued practice"
                ],
                "keyPoints": [
                    "Descents are used constantly in actual flight",
                    "Smooth technique = professional flying",
                    "Precision comes with practice"
                ]
            }
        ]
        
        lesson['keyTeachingPoints'] = [
            "Power primarily controls descent rate (less power = faster descent)",
            "Pitch primarily controls descent airspeed",
            "Carburetor heat ON for power-off or low-power descents",
            "Trim for hands-off flight even in descents",
            "Lead level-off by 10% of vertical speed (500 fpm = 50 ft lead)",
            "Descending turns require LESS back pressure than level turns",
            "Gravity component helps turn - reduces back pressure needed",
            "Monitor airspeed in descents - tendency to accelerate",
            "Maintain coordinated flight throughout (ball centered)",
            "Transition to level flight: add power first, then raise pitch"
        ]
        
        lesson['commonErrors'] = [
            "Forgetting carburetor heat before power reduction",
            "Lowering nose without power reduction - airspeed builds excessively",
            "Not trimming - fighting controls throughout descent",
            "In descending turns: using too much back pressure (level turn habit)",
            "Late level-off - descending through target altitude",
            "Early level-off - not reaching target altitude",
            "Abrupt level-off - uncomfortable for passengers",
            "Not clearing below before descending",
            "Fixating on instruments instead of outside references",
            "Not monitoring airspeed - letting it build in descent"
        ]
        
        lesson['diagrams'] = [
            {
                "title": "Descent Types",
                "description": "Three common descent configurations",
                "asciiArt": "VY DESCENT (Emergency):\n  Power: IDLE\n  Pitch: VY attitude\n  Rate: ~1000 fpm\n  Use: Emergency situations\n\nCRUISE DESCENT (Normal):\n  Power: 1800-2000 RPM\n  Pitch: 90-100 kts\n  Rate: 500 fpm\n  Use: En route descent\n\nAPPROACH DESCENT (Landing):\n  Power: Variable\n  Pitch: 65-75 kts\n  Rate: 300-500 fpm\n  Use: Pattern/approach"
            },
            {
                "title": "Level-Off Technique",
                "description": "Proper level-off sequence",
                "asciiArt": "Descending to 3000 feet at 500 fpm:\n\n  3,050 ft: Start level-off (10% lead)\n    ↓\n  [Add power to cruise]\n    ↓\n  [Gradually raise pitch]\n    ↓\n  3,000 ft: Level at target\n    ↓\n  [Trim for level flight]\n\nTiming: Lead by 50-100 feet"
            },
            {
                "title": "Descending Turn Back Pressure",
                "description": "Comparison of back pressure needs",
                "asciiArt": "LEVEL TURN (20° bank):\n  Back pressure: ████████ (significant)\n  Need more lift to maintain altitude\n\nDESCENDING TURN (20° bank):\n  Back pressure: ████░░░░ (less)\n  Gravity helps - don't fight it\n\nKey: Don't over-control descending turns!"
            }
        ]
        
        elevated += 1
        print(f"  ✨ EXCEPTIONAL: {lesson['id']}")

# Continue with more lessons...
print(f"\n📊 Batch 1 Progress: {elevated}/20 started")
print(f"\nNote: Script showing example of enhancement level.")
print(f"      Full batch will continue with remaining 18 lessons...")

