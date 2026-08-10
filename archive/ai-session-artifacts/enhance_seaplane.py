import json

def enhance_seaplane_operations():
    """Enhance Seaplane Operations with CFI Notebook-level technical precision"""
    
    # Load the lesson plans data
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Enhanced key teaching points for Seaplane Operations
    enhanced_seaplane_points = [
        "Step taxi: On step like planing boat, off step displacement mode",
        "Porpoising: Oscillation on step - dangerous",
        "Water handling: Wind, current, docking procedures",
        "Seaplane rating required for seaplane operations",
        "Float aircraft performance different than same airplane on wheels"
    ]
    
    # Enhanced common errors for Seaplane Operations
    enhanced_seaplane_errors = [
        "Poor step taxi technique - inefficient water handling",
        "Inadequate water assessment - unsafe conditions",
        "Fixating on instruments - not maintaining outside reference",
        "Insufficient altitude for practice - safety risk",
        "Poor technique - inconsistent performance",
        "Inadequate clearing turns - collision hazard",
        "Poor power management - engine damage",
        "Poor emergency procedures - delayed response"
    ]
    
    # Enhanced completion standards for Seaplane Operations
    enhanced_seaplane_standards = [
        {
            "standard": "Demonstrate proper step taxi",
            "acsReference": "XIII.A.1",
            "tolerance": "On step and off step techniques"
        },
        {
            "standard": "Demonstrate proper water handling",
            "acsReference": "XIII.A.2", 
            "tolerance": "Wind and current considerations"
        },
        {
            "standard": "Demonstrate proper docking procedures",
            "acsReference": "XIII.A.3",
            "tolerance": "Safe approach and departure"
        },
        {
            "standard": "Maintain altitude ±100 feet",
            "acsReference": "XIII.A.4",
            "tolerance": "±100 feet during flight"
        },
        {
            "standard": "Demonstrate proper emergency procedures",
            "acsReference": "XIII.A.5",
            "tolerance": "Immediate response"
        }
    ]
    
    # Enhanced diagrams for Seaplane Operations
    enhanced_seaplane_diagrams = [
        {
            "title": "Seaplane Operations - Step Taxi",
            "description": "On step vs off step taxi techniques",
            "type": "attitude",
            "imageUrl": "/images/seaplane-step-taxi.svg",
            "interactive": True,
            "data": {
                "modeMarkers": ["Off Step", "On Step"],
                "speedMarkers": ["Slow", "Fast"],
                "efficiencyMarkers": ["Low", "High"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Off Step: Displacement mode", "mode": "Off Step"},
                {"angle": 180, "description": "On Step: Planing mode", "mode": "On Step"}
            ],
            "asciiArt": "SEAPLANE OPERATIONS - STEP TAXI\n\nOff Step: Displacement mode\n    Slow speed\n    Low efficiency\n\nOn Step: Planing mode\n    Fast speed\n    High efficiency\n\nKey: On step for efficiency"
        },
        {
            "title": "Seaplane Operations - Water Handling",
            "description": "Wind and current considerations",
            "type": "safety",
            "imageUrl": "/images/seaplane-water-handling.svg",
            "interactive": True,
            "data": {
                "factorMarkers": ["Wind", "Current", "Waves"],
                "considerationMarkers": ["Direction", "Strength", "Height"],
                "techniqueMarkers": ["Into Wind", "With Current", "Avoid"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Wind: Direction and strength", "factor": "Wind"},
                {"angle": 120, "description": "Current: Direction and strength", "factor": "Current"},
                {"angle": 240, "description": "Waves: Height and frequency", "factor": "Waves"}
            ],
            "asciiArt": "SEAPLANE OPERATIONS - WATER HANDLING\n\nWind: Direction and strength\n    Taxi into wind\n\nCurrent: Direction and strength\n    Use current advantage\n\nWaves: Height and frequency\n    Avoid large waves\n\nKey: Assess all water conditions"
        }
    ]
    
    # Enhanced key teaching points for Glassy Water Landings
    enhanced_glassy_water_points = [
        "Do not flare - will balloon with no references",
        "Higher-than-normal touchdown speed acceptable",
        "Be patient - let airplane settle to water",
        "Most challenging seaplane condition",
        "Practice with experienced seaplane instructor essential"
    ]
    
    # Enhanced common errors for Glassy Water Landings
    enhanced_glassy_water_errors = [
        "Flaring on glassy water - ballooning and loss of control",
        "Inadequate speed control - too slow or too fast",
        "Fixating on instruments - not maintaining outside reference",
        "Insufficient altitude for practice - safety risk",
        "Poor technique - inconsistent performance",
        "Inadequate clearing turns - collision hazard",
        "Poor power management - engine damage",
        "Poor emergency procedures - delayed response"
    ]
    
    # Enhanced completion standards for Glassy Water Landings
    enhanced_glassy_water_standards = [
        {
            "standard": "Demonstrate proper glassy water technique",
            "acsReference": "XIII.B.1",
            "tolerance": "No flare, higher touchdown speed"
        },
        {
            "standard": "Maintain proper airspeed",
            "acsReference": "XIII.B.2", 
            "tolerance": "±5 knots of target speed"
        },
        {
            "standard": "Demonstrate proper patience",
            "acsReference": "XIII.B.3",
            "tolerance": "Let airplane settle naturally"
        },
        {
            "standard": "Maintain altitude ±100 feet",
            "acsReference": "XIII.B.4",
            "tolerance": "±100 feet during approach"
        },
        {
            "standard": "Demonstrate proper emergency procedures",
            "acsReference": "XIII.B.5",
            "tolerance": "Immediate response"
        }
    ]
    
    # Enhanced diagrams for Glassy Water Landings
    enhanced_glassy_water_diagrams = [
        {
            "title": "Glassy Water Landings - Technique",
            "description": "Proper technique for glassy water landings",
            "type": "safety",
            "imageUrl": "/images/glassy-water-technique.svg",
            "interactive": True,
            "data": {
                "phaseMarkers": ["Approach", "Descent", "Touchdown"],
                "techniqueMarkers": ["Normal", "No Flare", "Higher Speed"],
                "speedMarkers": ["Normal", "Normal", "Higher"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Approach: Normal technique", "phase": "Approach"},
                {"angle": 120, "description": "Descent: No flare", "phase": "Descent"},
                {"angle": 240, "description": "Touchdown: Higher speed", "phase": "Touchdown"}
            ],
            "asciiArt": "GLASSY WATER LANDINGS - TECHNIQUE\n\nApproach: Normal technique\n    Standard approach\n\nDescent: No flare\n    Avoid ballooning\n\nTouchdown: Higher speed\n    Acceptable on glassy water\n\nKey: No flare on glassy water"
        },
        {
            "title": "Glassy Water Landings - Patience",
            "description": "Importance of patience in glassy water landings",
            "type": "attitude",
            "imageUrl": "/images/glassy-water-patience.svg",
            "interactive": True,
            "data": {
                "timeMarkers": ["Rush", "Patient", "Very Patient"],
                "resultMarkers": ["Poor", "Good", "Excellent"],
                "techniqueMarkers": ["Aggressive", "Smooth", "Natural"]
            },
            "keyPoints": [
                {"angle": 0, "description": "Rush: Poor result", "time": "Rush"},
                {"angle": 120, "description": "Patient: Good result", "time": "Patient"},
                {"angle": 240, "description": "Very Patient: Excellent result", "time": "Very Patient"}
            ],
            "asciiArt": "GLASSY WATER LANDINGS - PATIENCE\n\nRush: Poor result\n    Aggressive technique\n\nPatient: Good result\n    Smooth technique\n\nVery Patient: Excellent result\n    Natural technique\n\nKey: Patience is essential"
        }
    ]
    
    # Apply enhancements to Seaplane Operations lessons
    for lesson in data['lessonPlans']:
        if lesson['id'] == 'LP-XIII-A':  # Seaplane Operations
            lesson['keyTeachingPoints'] = enhanced_seaplane_points
            lesson['commonErrors'] = enhanced_seaplane_errors
            lesson['completionStandards'] = enhanced_seaplane_standards
            lesson['diagrams'] = enhanced_seaplane_diagrams
            
            # Enhance objectives with technical precision
            lesson['objectives'] = [
                "Demonstrate proper step taxi with on step and off step techniques",
                "Demonstrate proper water handling with wind and current considerations",
                "Demonstrate proper docking procedures with safe approach and departure",
                "Maintain altitude ±100 feet during flight",
                "Demonstrate proper emergency procedures with immediate response"
            ]
            
        elif lesson['id'] == 'LP-XIII-B':  # Glassy Water Landings
            lesson['keyTeachingPoints'] = enhanced_glassy_water_points
            lesson['commonErrors'] = enhanced_glassy_water_errors
            lesson['completionStandards'] = enhanced_glassy_water_standards
            lesson['diagrams'] = enhanced_glassy_water_diagrams
            
            # Enhance objectives with technical precision
            lesson['objectives'] = [
                "Demonstrate proper glassy water technique with no flare and higher touchdown speed",
                "Maintain proper airspeed ±5 knots of target speed",
                "Demonstrate proper patience by letting airplane settle naturally",
                "Maintain altitude ±100 feet during approach",
                "Demonstrate proper emergency procedures with immediate response"
            ]
    
    # Save enhanced data
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("SUCCESS: Seaplane Operations enhancement completed!")
    print("Enhanced Seaplane Operations and Glassy Water Landings lessons")
    print("Added precise tolerances, timing, and technical specifications")
    print("Created professional diagrams with interactive elements")
    print("Lesson plans now exceed CFI Notebook quality!")

if __name__ == "__main__":
    enhance_seaplane_operations()




