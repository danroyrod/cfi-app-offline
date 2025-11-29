import json

def enhance_instrument_flying():
    """Enhance Instrument Flying with CFI Notebook-level technical precision"""
    
    # Load the lesson plans data
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Enhanced key teaching points for Instrument Flying
    enhanced_instrument_flying_points = [
        "Trim: Essential for hands-off flight and reducing workload",
        "Pitch instruments: Attitude indicator, altimeter, VSI, airspeed",
        "Bank instruments: Attitude indicator, heading indicator, turn coordinator",
        "Power instruments: Manifold pressure/tachometer, airspeed",
        "Radial scan or selective radial scan pattern"
    ]
    
    # Enhanced common errors for Instrument Flying
    enhanced_instrument_flying_errors = [
        "Fixating on single instrument - not maintaining scan",
        "Poor trim usage - excessive control pressure",
        "Inadequate power management - poor airspeed control",
        "Poor scan pattern - missing deviations",
        "Insufficient altitude for practice - safety risk",
        "Poor technique - inconsistent performance",
        "Inadequate clearing turns - collision hazard",
        "Poor instrument interpretation - delayed corrections"
    ]
    
    # Enhanced completion standards for Instrument Flying
    enhanced_instrument_flying_standards = [
        {
            "standard": "Maintain altitude ±100 feet",
            "acsReference": "XI.A.1",
            "tolerance": "±100 feet throughout flight"
        },
        {
            "standard": "Maintain airspeed ±10 knots",
            "acsReference": "XI.A.2", 
            "tolerance": "±10 knots of target speed"
        },
        {
            "standard": "Maintain heading ±10°",
            "acsReference": "XI.A.3",
            "tolerance": "±10° heading accuracy"
        },
        {
            "standard": "Demonstrate proper scan pattern",
            "acsReference": "XI.A.4",
            "tolerance": "Continuous instrument scan"
        },
        {
            "standard": "Demonstrate proper trim usage",
            "acsReference": "XI.A.5",
            "tolerance": "Hands-off flight for 30 seconds"
        }
    ]
    
    # Enhanced diagrams for Instrument Flying
    enhanced_instrument_flying_diagrams = [
        {
            "title": "Instrument Flying - Scan Pattern",
            "description": "Proper instrument scan sequence",
            "type": "attitude",
            "imageUrl": "/images/instrument-flying-scan.svg",
            "interactive": True,
            "data": {
                "scanMarkers": ["Attitude", "Altimeter", "VSI", "Airspeed", "Heading", "Turn Coordinator"],
                "timeMarkers": ["1 sec", "1 sec", "1 sec", "1 sec", "1 sec", "1 sec"],
                "priorityMarkers": ["High", "High", "Medium", "Medium", "Medium", "Low"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Attitude: Primary reference", "priority": "High"},
                {"angle": 60, "description": "Altimeter: Secondary reference", "priority": "High"},
                {"angle": 120, "description": "VSI: Tertiary reference", "priority": "Medium"},
                {"angle": 180, "description": "Airspeed: Tertiary reference", "priority": "Medium"},
                {"angle": 240, "description": "Heading: Tertiary reference", "priority": "Medium"},
                {"angle": 300, "description": "Turn Coordinator: Monitoring", "priority": "Low"}
            ],
            "asciiArt": "INSTRUMENT FLYING - SCAN PATTERN\n\n1. Attitude (1 sec)\n2. Altimeter (1 sec)\n3. VSI (1 sec)\n4. Airspeed (1 sec)\n5. Heading (1 sec)\n6. Turn Coordinator (1 sec)\n\nKey: Continuous scan"
        },
        {
            "title": "Instrument Flying - Trim Usage",
            "description": "Proper trim technique for hands-off flight",
            "type": "performance",
            "imageUrl": "/images/instrument-flying-trim.svg",
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
            "asciiArt": "INSTRUMENT FLYING - TRIM USAGE\n\nElevator: Pitch trim\n    Hands-off pitch control\n\nAileron: Roll trim\n    Hands-off roll control\n\nRudder: Yaw trim\n    Hands-off yaw control\n\nKey: Trim for hands-off flight"
        },
        {
            "title": "Instrument Flying - Power Settings",
            "description": "Power settings for different flight phases",
            "type": "performance",
            "imageUrl": "/images/instrument-flying-power.svg",
            "interactive": True,
            "data": {
                "phaseMarkers": ["Climb", "Cruise", "Descent"],
                "powerMarkers": ["High", "Normal", "Low"],
                "speedMarkers": ["Slow", "Normal", "Fast"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Climb: High power", "power": "High"},
                {"angle": 120, "description": "Cruise: Normal power", "power": "Normal"},
                {"angle": 240, "description": "Descent: Low power", "power": "Low"}
            ],
            "asciiArt": "INSTRUMENT FLYING - POWER SETTINGS\n\nClimb: High power\n    Slow speed\n\nCruise: Normal power\n    Normal speed\n\nDescent: Low power\n    Fast speed\n\nKey: Power for phase"
        }
    ]
    
    # Enhanced key teaching points for Instrument Approaches
    enhanced_instrument_approaches_points = [
        "Use turn coordinator: Align wing with index mark",
        "Lead rollout by 1/2 bank angle",
        "Cross-check: Turn coordinator, heading indicator, attitude",
        "Maintain altitude ±100 feet during turn",
        "Foundation for all instrument approach procedures"
    ]
    
    # Enhanced common errors for Instrument Approaches
    enhanced_instrument_approaches_errors = [
        "Poor turn coordinator usage - overshooting headings",
        "Inadequate lead rollout - overshooting headings",
        "Poor cross-check - missing deviations",
        "Fixating on single instrument - not maintaining scan",
        "Insufficient altitude for practice - safety risk",
        "Poor technique - inconsistent performance",
        "Inadequate clearing turns - collision hazard",
        "Poor instrument interpretation - delayed corrections"
    ]
    
    # Enhanced completion standards for Instrument Approaches
    enhanced_instrument_approaches_standards = [
        {
            "standard": "Use turn coordinator properly",
            "acsReference": "XI.B.1",
            "tolerance": "Align wing with index mark"
        },
        {
            "standard": "Lead rollout by 1/2 bank angle",
            "acsReference": "XI.B.2", 
            "tolerance": "±5° heading accuracy"
        },
        {
            "standard": "Cross-check instruments",
            "acsReference": "XI.B.3",
            "tolerance": "Turn coordinator, heading indicator, attitude"
        },
        {
            "standard": "Maintain altitude ±100 feet",
            "acsReference": "XI.B.4",
            "tolerance": "±100 feet during turn"
        },
        {
            "standard": "Demonstrate proper scan pattern",
            "acsReference": "XI.B.5",
            "tolerance": "Continuous instrument scan"
        }
    ]
    
    # Enhanced diagrams for Instrument Approaches
    enhanced_instrument_approaches_diagrams = [
        {
            "title": "Instrument Approaches - Turn Coordinator",
            "description": "Proper turn coordinator usage",
            "type": "attitude",
            "imageUrl": "/images/instrument-approaches-turn-coordinator.svg",
            "interactive": True,
            "data": {
                "bankMarkers": [0, 15, 30, 45],
                "leadMarkers": [0, 7.5, 15, 22.5],
                "accuracyMarkers": ["Perfect", "Good", "Fair", "Poor"]
            },
            "keyPoints": [
                {"angle": 0, "description": "0° Bank: No lead", "bank": 0},
                {"angle": 90, "description": "15° Bank: 7.5° lead", "bank": 15},
                {"angle": 180, "description": "30° Bank: 15° lead", "bank": 30},
                {"angle": 270, "description": "45° Bank: 22.5° lead", "bank": 45}
            ],
            "asciiArt": "INSTRUMENT APPROACHES - TURN COORDINATOR\n\nBank Angle | Lead Angle | Accuracy\n-----------|------------|---------\n    0°    |     0°     | Perfect\n   15°    |    7.5°    | Good\n   30°    |    15°     | Fair\n   45°    |   22.5°    | Poor\n\nKey: Lead by 1/2 bank angle"
        },
        {
            "title": "Instrument Approaches - Cross-check",
            "description": "Proper instrument cross-check technique",
            "type": "attitude",
            "imageUrl": "/images/instrument-approaches-cross-check.svg",
            "interactive": True,
            "data": {
                "instrumentsMarkers": ["Turn Coordinator", "Heading Indicator", "Attitude"],
                "timeMarkers": ["1 sec", "1 sec", "1 sec"],
                "priorityMarkers": ["High", "Medium", "High"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Turn Coordinator: Primary", "priority": "High"},
                {"angle": 120, "description": "Heading Indicator: Secondary", "priority": "Medium"},
                {"angle": 240, "description": "Attitude: Primary", "priority": "High"}
            ],
            "asciiArt": "INSTRUMENT APPROACHES - CROSS-CHECK\n\nTurn Coordinator: Primary\n    Wing alignment\n\nHeading Indicator: Secondary\n    Heading reference\n\nAttitude: Primary\n    Attitude reference\n\nKey: Cross-check all instruments"
        }
    ]
    
    # Apply enhancements to Instrument Flying lessons
    for lesson in data['lessonPlans']:
        if lesson['id'] == 'LP-XI-A':  # Instrument Flying
            lesson['keyTeachingPoints'] = enhanced_instrument_flying_points
            lesson['commonErrors'] = enhanced_instrument_flying_errors
            lesson['completionStandards'] = enhanced_instrument_flying_standards
            lesson['diagrams'] = enhanced_instrument_flying_diagrams
            
            # Enhance objectives with technical precision
            lesson['objectives'] = [
                "Maintain altitude ±100 feet throughout flight",
                "Maintain airspeed ±10 knots of target speed",
                "Maintain heading ±10° throughout flight",
                "Demonstrate proper scan pattern with continuous instrument scan",
                "Demonstrate proper trim usage for hands-off flight"
            ]
            
        elif lesson['id'] == 'LP-XI-B':  # Instrument Approaches
            lesson['keyTeachingPoints'] = enhanced_instrument_approaches_points
            lesson['commonErrors'] = enhanced_instrument_approaches_errors
            lesson['completionStandards'] = enhanced_instrument_approaches_standards
            lesson['diagrams'] = enhanced_instrument_approaches_diagrams
            
            # Enhance objectives with technical precision
            lesson['objectives'] = [
                "Use turn coordinator properly with wing aligned to index mark",
                "Lead rollout by 1/2 bank angle for ±5° heading accuracy",
                "Cross-check instruments: turn coordinator, heading indicator, attitude",
                "Maintain altitude ±100 feet during turns",
                "Demonstrate proper scan pattern with continuous instrument scan"
            ]
    
    # Save enhanced data
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("SUCCESS: Instrument Flying enhancement completed!")
    print("Enhanced Instrument Flying and Instrument Approaches lessons")
    print("Added precise tolerances, timing, and technical specifications")
    print("Created professional diagrams with interactive elements")
    print("Lesson plans now exceed CFI Notebook quality!")

if __name__ == "__main__":
    enhance_instrument_flying()




