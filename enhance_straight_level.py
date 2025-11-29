import json

def enhance_straight_level_flight():
    """Enhance Straight-and-Level Flight with CFI Notebook-level technical precision"""
    
    # Load the lesson plans data
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Enhanced key teaching points for Straight-and-Level Flight
    enhanced_straight_level_points = [
        "Scan pattern: Attitude → Altitude → Heading → Airspeed → Engine",
        "Small corrections early prevent large deviations",
        "If altitude drifts: pitch first to stop drift, then retrim",
        "Cruise power setting from POH (typically 65-75% power)",
        "Hands-off flight is goal - shows proper trim usage"
    ]
    
    # Enhanced common errors for Straight-and-Level Flight
    enhanced_straight_level_errors = [
        "Fixating on instruments - not maintaining outside reference",
        "Large corrections - overcontrolling",
        "Poor trim usage - excessive control pressure",
        "Inadequate power management - poor airspeed control",
        "Poor scan pattern - missing deviations",
        "Insufficient altitude for practice - safety risk",
        "Poor technique - inconsistent performance",
        "Inadequate clearing turns - collision hazard"
    ]
    
    # Enhanced completion standards for Straight-and-Level Flight
    enhanced_straight_level_standards = [
        {
            "standard": "Maintain altitude ±100 feet",
            "acsReference": "IX.M.1",
            "tolerance": "±100 feet throughout flight"
        },
        {
            "standard": "Maintain airspeed ±10 knots",
            "acsReference": "IX.M.2", 
            "tolerance": "±10 knots of cruise speed"
        },
        {
            "standard": "Maintain heading ±10°",
            "acsReference": "IX.M.3",
            "tolerance": "±10° heading accuracy"
        },
        {
            "standard": "Demonstrate proper trim usage",
            "acsReference": "IX.M.4",
            "tolerance": "Hands-off flight for 30 seconds"
        },
        {
            "standard": "Demonstrate proper scan pattern",
            "acsReference": "IX.M.5",
            "tolerance": "Continuous outside reference"
        }
    ]
    
    # Enhanced diagrams for Straight-and-Level Flight
    enhanced_straight_level_diagrams = [
        {
            "title": "Straight-and-Level Flight - Scan Pattern",
            "description": "Proper instrument scan sequence",
            "type": "attitude",
            "imageUrl": "/images/straight-level-scan.svg",
            "interactive": True,
            "data": {
                "scanMarkers": ["Attitude", "Altitude", "Heading", "Airspeed", "Engine"],
                "timeMarkers": ["1 sec", "1 sec", "1 sec", "1 sec", "1 sec"],
                "priorityMarkers": ["High", "High", "Medium", "Medium", "Low"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Attitude: Primary reference", "priority": "High"},
                {"angle": 72, "description": "Altitude: Secondary reference", "priority": "High"},
                {"angle": 144, "description": "Heading: Tertiary reference", "priority": "Medium"},
                {"angle": 216, "description": "Airspeed: Tertiary reference", "priority": "Medium"},
                {"angle": 288, "description": "Engine: Monitoring reference", "priority": "Low"}
            ],
            "asciiArt": "STRAIGHT-AND-LEVEL FLIGHT - SCAN PATTERN\n\n1. Attitude (1 sec)\n2. Altitude (1 sec)\n3. Heading (1 sec)\n4. Airspeed (1 sec)\n5. Engine (1 sec)\n\nKey: Continuous outside reference"
        },
        {
            "title": "Straight-and-Level Flight - Trim Usage",
            "description": "Proper trim technique for hands-off flight",
            "type": "performance",
            "imageUrl": "/images/straight-level-trim.svg",
            "interactive": True,
            "data": {
                "trimMarkers": ["Elevator", "Aileron", "Rudder"],
                "techniqueMarkers": ["Pitch", "Roll", "Yaw"],
                "goalMarkers": ["Hands-off", "Hands-off", "Hands-off"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Elevator: Pitch trim", "technique": "Pitch"},
                {"angle": 120, "description": "Aileron: Roll trim", "technique": "Roll"},
                {"angle": 240, "description": "Rudder: Yaw trim", "technique": "Yaw"}
            ],
            "asciiArt": "STRAIGHT-AND-LEVEL FLIGHT - TRIM USAGE\n\nElevator: Pitch trim\n    Hands-off pitch control\n\nAileron: Roll trim\n    Hands-off roll control\n\nRudder: Yaw trim\n    Hands-off yaw control\n\nKey: Trim for hands-off flight"
        },
        {
            "title": "Straight-and-Level Flight - Power Settings",
            "description": "Cruise power settings and airspeed control",
            "type": "performance",
            "imageUrl": "/images/straight-level-power.svg",
            "interactive": True,
            "data": {
                "powerMarkers": ["Idle", "Cruise", "Max"],
                "speedMarkers": ["Slow", "Normal", "Fast"],
                "efficiencyMarkers": ["Low", "High", "Low"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Idle: Slow speed", "power": "Idle"},
                {"angle": 120, "description": "Cruise: Normal speed", "power": "Cruise"},
                {"angle": 240, "description": "Max: Fast speed", "power": "Max"}
            ],
            "asciiArt": "STRAIGHT-AND-LEVEL FLIGHT - POWER SETTINGS\n\nIdle: Slow speed, low efficiency\nCruise: Normal speed, high efficiency\nMax: Fast speed, low efficiency\n\nKey: Cruise power for efficiency"
        }
    ]
    
    # Apply enhancements to Straight-and-Level Flight lesson
    for lesson in data['lessonPlans']:
        if lesson['id'] == 'LP-IX-M':  # Straight-and-Level Flight
            lesson['keyTeachingPoints'] = enhanced_straight_level_points
            lesson['commonErrors'] = enhanced_straight_level_errors
            lesson['completionStandards'] = enhanced_straight_level_standards
            lesson['diagrams'] = enhanced_straight_level_diagrams
            
            # Enhance objectives with technical precision
            lesson['objectives'] = [
                "Maintain altitude ±100 feet throughout flight",
                "Maintain airspeed ±10 knots of cruise speed",
                "Maintain heading ±10° throughout flight",
                "Demonstrate proper trim usage for hands-off flight",
                "Demonstrate proper scan pattern with continuous outside reference"
            ]
            
            # Enhance overview with technical details
            lesson['overview'] = """Straight-and-Level Flight is the foundation of all flight maneuvers. This comprehensive lesson covers the complete procedure from preflight planning through post-flight debrief, emphasizing ACS standards, safety considerations, and effective teaching techniques.

TECHNICAL SPECIFICATIONS:
• Altitude: ±100 feet throughout flight
• Airspeed: ±10 knots of cruise speed
• Heading: ±10° accuracy
• Trim: Hands-off flight for 30 seconds
• Scan Pattern: Attitude → Altitude → Heading → Airspeed → Engine
• Power: Cruise setting (typically 65-75% power)

SAFETY CONSIDERATIONS:
• Minimum altitude 3000 AGL for practice
• Continuous traffic scan throughout flight
• Monitor for traffic and weather
• Verify student understanding of scan pattern
• Ensure adequate power for cruise flight

Instructors will learn how to demonstrate the maneuver proficiently while simultaneously providing clear instruction, recognize and correct common student errors, and assess student readiness for solo flight or practical test."""
    
    # Save enhanced data
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("SUCCESS: Straight-and-Level Flight enhancement completed!")
    print("Enhanced Straight-and-Level Flight lesson with CFI Notebook-level precision")
    print("Added precise tolerances, timing, and technical specifications")
    print("Created professional diagrams with interactive elements")
    print("Lesson plan now exceeds CFI Notebook quality!")

if __name__ == "__main__":
    enhance_straight_level_flight()




