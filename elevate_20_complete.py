import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load data
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("🌟 ELEVATING 20 LESSONS TO EXCEPTIONAL DETAIL")
print("="*70)

# The 20 priority lessons for elevation
target_lessons = {
    'LP-VI-B', 'LP-VII-G', 'LP-VII-H', 'LP-VII-I', 'LP-VII-J',
    'LP-VII-K', 'LP-VII-L', 'LP-VII-O', 'LP-VIII-C', 'LP-VIII-D',
    'LP-IX-B', 'LP-IX-C', 'LP-IX-D', 'LP-IX-E', 'LP-IX-F',
    'LP-X-B', 'LP-X-E', 'LP-X-F', 'LP-X-G', 'LP-XI-D'
}

# Enhancements database - detailed content for each lesson
enhancements = {
    'LP-VIII-C': {
        "overview": "Climbs and climbing turns are fundamental maneuvers used on every flight. This lesson teaches straight climbs at VY for maximum rate, cruise climbs for forward progress, and climbing turns for traffic pattern and departure procedures. Students learn power-pitch-trim coordination and load factor management in climbing turns.",
        "keyTeachingPoints": [
            "Straight climb: Add power, raise pitch for VY, trim off pressures",
            "VY provides best rate of climb - fastest way to gain altitude",
            "Pitch controls airspeed during climb, power controls rate",
            "Trim essential for consistent climb performance",
            "Climbing turns increase load factor - need extra back pressure",
            "Bank angle in climbing turn typically 15-20° maximum",
            "Steeper bank requires significantly more back pressure",
            "Maintain VY ±5 knots throughout climb and turns",
            "Monitor engine temperatures during prolonged climbs",
            "Return to level: reduce power first, then lower nose"
        ],
        "commonErrors": [
            "Inadequate power application - poor climb performance",
            "Pitch too high - airspeed below VY",
            "Not trimming - fighting controls",
            "In climbing turns: insufficient back pressure - airspeed decays",
            "Rolling into turn without back pressure ready",
            "Uncoordinated climbing turns",
            "Chasing airspeed with excessive pitch changes",
            "Not monitoring engine temperatures",
            "Fixating on instruments vs attitude flying",
            "Forgetting to reduce power when leveling off"
        ]
    },
    'LP-VIII-D': {
        "overview": "Descents and descending turns are used to lose altitude in a controlled manner. This lesson covers power-off descents, cruise descents, and descending turns. Students learn that power primarily controls descent rate while pitch controls airspeed, and that descending turns require less back pressure than level turns due to gravity's help.",
        "keyTeachingPoints": [
            "Power primarily controls descent rate (less power = faster descent)",
            "Pitch primarily controls descent airspeed",
            "Carburetor heat ON before power reduction (if applicable)",
            "Trim for hands-off descent flight",
            "Lead level-off by 10% of descent rate (500 fpm = 50 ft)",
            "Descending turns need LESS back pressure than level turns",
            "Gravity helps the turn - reduce back pressure",
            "Monitor airspeed in descents - tendency to accelerate",
            "Maintain coordination (ball centered)",
            "Level-off: add power first, then raise pitch"
        ],
        "commonErrors": [
            "Forgetting carburetor heat before power reduction",
            "Lowering nose without power reduction - excessive speed",
            "Not trimming - constant control pressure",
            "Too much back pressure in descending turns",
            "Late level-off - descending through altitude",
            "Abrupt level-off - uncomfortable",
            "Not clearing area below before descent",
            "Airspeed building unchecked",
            "Fixation on instruments",
            "Rough power/pitch changes"
        ]
    },
    'LP-VI-B': {
        "keyTeachingPoints": [
            "Standard pattern: Rectangular, left turns (unless specified)",
            "Pattern altitude typically 1000 AGL",
            "Upwind: Climb on runway heading",
            "Crosswind: Turn at 500-700 AGL, continue climb",
            "Downwind: Level at pattern altitude, 1/2-1 mile from runway",
            "Base: Turn when 45° from threshold, begin descent",
            "Final: Align with centerline, descending approach",
            "Maintain altitude ±100 ft, airspeed ±10 kts",
            "Radio calls at each leg",
            "Continuous traffic scan required"
        ]
    },
    'LP-IX-B': {
        "keyTeachingPoints": [
            "Steep spiral: Maximum rate descent in constant radius turn",
            "Entry altitude minimum 3000 AGL",
            "Establish glide speed at or below VA",
            "45-55° bank angle typical",
            "Three complete 360° turns around reference point",
            "Divide attention: airspeed, altitude, ground reference, traffic",
            "Roll out on entry heading at 1500 AGL",
            "Useful for emergency descent to specific point",
            "Continuous clearing turns while looking at ground",
            "Airspeed control critical - below VA at all times"
        ],
        "commonErrors": [
            "Not maintaining constant radius around point",
            "Exceeding VA during spiral",
            "Not clearing area continuously",
            "Fixating on ground reference - missing traffic",
            "Too steep bank - excessive G-load or speed",
            "Not completing three full turns",
            "Rolling out on wrong heading",
            "Descending below minimum altitude",
            "Not maintaining coordinated flight"
        ]
    },
    'LP-IX-C': {
        "keyTeachingPoints": [
            "Chandelle: Maximum gain of altitude while changing heading 180°",
            "Entry at maneuvering speed (VA) or below",
            "Smooth coordinated climbing turn",
            "First 90°: Constant bank (30°), pitch increases smoothly",
            "Second 90°: Bank decreases to 0°, pitch held constant",
            "Completion: Wings level, at slowest airspeed, 180° turn complete",
            "Demonstrate maximum performance capabilities",
            "Coordination critical - ball centered throughout",
            "Commercial pilot skill - smooth, graceful execution",
            "Power remains constant throughout maneuver"
        ]
    },
    'LP-IX-D': {
        "keyTeachingPoints": [
            "Lazy Eight: Two 180° turns in opposite directions with smooth altitude/heading changes",
            "Entry at maneuvering speed (VA) or cruise",
            "Symmetrical figure-eight pattern across horizon",
            "Maximum pitch up at 45° point, maximum pitch down at 135° point",
            "Lowest altitude and airspeed at 90° and 270° points",
            "Highest altitude at 45° and 225° points",
            "Maximum bank (30°) at 90° and 270° points",
            "Smooth, coordinated, flowing maneuver",
            "Demonstrates advanced aircraft control",
            "Constant visual reference scanning required"
        ]
    },
    'LP-IX-E': {
        "keyTeachingPoints": [
            "Ground reference maneuvers teach wind drift correction",
            "Rectangular course: Square pattern around field",
            "S-turns: Alternating turns across road/line",
            "Turns around point: Constant radius around ground reference",
            "Vary bank angle to maintain ground track",
            "Upwind: Steeper bank. Downwind: Shallower bank",
            "Entry altitude: 600-1000 AGL",
            "Divide attention: ground track, altitude, traffic",
            "Practical application: Airport traffic pattern flying",
            "Foundation for maintaining precise ground tracks"
        ]
    },
    'LP-IX-F': {
        "keyTeachingPoints": [
            "Eights on pylons: Constant pivotal altitude around two points",
            "Pivotal altitude varies with groundspeed",
            "Formula: Pivotal altitude (MSL) = Groundspeed² ÷ 11.3",
            "Faster groundspeed = higher pivotal altitude needed",
            "30-40° bank typical, varies to maintain pivot",
            "Line of sight perpendicular to longitudinal axis stays on point",
            "Demonstrates understanding of groundspeed effects",
            "Requires precise altitude control with bank variations",
            "Commercial pilot skill - smooth, coordinated",
            "Useful for understanding how wind affects turning radius"
        ]
    },
    'LP-X-B': {
        "keyTeachingPoints": [
            "Demonstrates flight characteristics near stall in various configurations",
            "Shows how configuration affects stall behavior",
            "Clean: Highest stall speed, most predictable break",
            "Takeoff config: Intermediate stall speed, nose-high attitude",
            "Landing config: Lowest stall speed, early warning (horn/buffet)",
            "Power effects: Power reduces stall speed and changes attitude",
            "Purpose: Student recognizes stall characteristics in all phases",
            "Not graded on recovery - focus is recognition and characteristics",
            "Student learns how airplane handles approaching stall",
            "Builds confidence and stall awareness"
        ]
    },
    'LP-X-E': {
        "keyTeachingPoints": [
            "Accelerated stall: Occurs at higher airspeed due to increased load factor",
            "Caused by abrupt control inputs or high-G maneuvers",
            "Can occur at any airspeed if load factor exceeds limit",
            "Entry: Establish airspeed at or below VA (maneuvering speed)",
            "Smoothly roll to 45° bank, apply back pressure",
            "Stall break will be abrupt - immediate recovery essential",
            "Recovery at FIRST indication of stall (not full stall)",
            "Reduce back pressure, level wings, recover",
            "Never practice above VA - structural damage risk",
            "Demonstrates critical need for smooth control inputs"
        ],
        "commonErrors": [
            "Practicing above VA - dangerous!",
            "Too abrupt back pressure - excessive G-load",
            "Not recognizing first indication of stall",
            "Attempting full stall instead of first indication recovery",
            "Not maintaining coordination - spin risk",
            "Insufficient altitude for practice",
            "Not clearing area adequately",
            "Rough recovery - secondary stall"
        ]
    },
    'LP-X-F': {
        "keyTeachingPoints": [
            "Cross-controlled stall demonstrates skidding turn stall (base to final)",
            "Demonstration only - do not have student perform",
            "Scenario: Overshooting final, pilot uses rudder to turn without bank",
            "Setup: Slowing flight, power off, turning configuration",
            "Cross-control: Top rudder, opposite aileron (skidding turn)",
            "Result: Rapid, uncontrolled roll toward low wing",
            "Most dangerous during base-to-final turn",
            "Recovery may be difficult or impossible at low altitude",
            "Prevention: Coordinated flight, proper pattern planning",
            "CFI shows this once for awareness - emphasize avoidance"
        ],
        "commonErrors": [
            "Demonstrating at too low altitude",
            "Not briefing expected behavior beforehand",
            "Letting stall develop too far",
            "Student attempting maneuver - should be demo only",
            "Not maintaining adequate altitude buffer",
            "Not clearing area thoroughly",
            "Rough or delayed recovery",
            "Not emphasizing prevention over recovery"
        ]
    },
    'LP-X-G': {
        "keyTeachingPoints": [
            "Elevator trim stall: Stall from improper trim during go-around",
            "Scenario: Trimmed nose-up for landing, then add full power",
            "Setup: Landing configuration, approach speed, trim nose-up",
            "Add full power: Airplane pitches up rapidly if not controlled",
            "If pilot doesn't push forward: Stall results from excessive pitch",
            "Demonstration only - show once for awareness",
            "Purpose: Teach importance of controlling pitch during go-around",
            "Real scenario: Student doesn't push forward during go-around",
            "Prevention: Positive forward pressure during power application",
            "CFI demonstrates, emphasizes avoidance and proper go-around technique"
        ]
    },
    'LP-XI-D': {
        "keyTeachingPoints": [
            "Turns to headings: Fundamental instrument turn procedure",
            "Standard rate turn: 3° per second (360° in 2 minutes)",
            "Bank angle for standard rate varies with airspeed",
            "Rule of thumb: (Airspeed ÷ 10) + 7 = bank angle",
            "Example: 90 knots → 16° bank for standard rate",
            "Use turn coordinator: Align wing with index mark",
            "Lead rollout by 1/2 bank angle",
            "Cross-check: Turn coordinator, heading indicator, attitude",
            "Maintain altitude ±100 feet during turn",
            "Foundation for all instrument approach procedures"
        ]
    },
    'LP-XI-E': {
        "keyTeachingPoints": [
            "Unusual attitudes: Nose-high or nose-low, excessive bank",
            "Can result from spatial disorientation, distraction, or system malfunction",
            "Recognition first: Attitude indicator shows unusual pitch/bank",
            "Nose-high recovery: Reduce power, lower nose, level wings, recover",
            "Nose-low recovery: Power idle if needed, level wings, gentle pull",
            "Never pull hard - may overstress or aggravate situation",
            "Cross-check multiple instruments - don't trust just one",
            "Maintain aircraft control throughout recovery",
            "Practice both nose-high and nose-low recoveries",
            "Essential skill for inadvertent IMC or spatial disorientation"
        ]
    },
    'LP-VII-O': {
        "keyTeachingPoints": [
            "Power-off 180° accuracy: Simulates engine failure on downwind",
            "Must land within 200 feet beyond specified touchdown point",
            "No power available after abeam point - plan carefully",
            "Use slips, flaps, and turns to control descent",
            "Key judgment: When to turn base, when to turn final",
            "Too high: Delay turns, use slip, add flaps early",
            "Too low: Early turns, delay flaps, minimize slip",
            "Go-around not allowed if can't make touchdown point",
            "Demonstrates emergency landing planning skills",
            "Commercial pilot precision required"
        ]
    },
    'LP-VII-G': {
        "keyTeachingPoints": [
            "Confined area: Limited space requiring maximum performance",
            "Similar to short-field but with obstacles on multiple sides",
            "Survey area carefully before landing - check for obstacles",
            "Use all available surface - begin at absolute start",
            "Maximum performance climb at VX for obstacle clearance",
            "Clear all obstacles by safe margin",
            "Seaplane-specific: Consider wind, current, waves",
            "Touchdown zone evaluation critical",
            "Requires excellent judgment and planning",
            "Practice in safe environment before actual confined areas"
        ]
    },
    'LP-VII-H': {
        "keyTeachingPoints": [
            "Confined area landing: Limited space, obstacles on sides",
            "Approach planning critical - cannot go-around easily",
            "Steep approach to clear obstacles",
            "Touch down early in available space",
            "Immediate maximum braking",
            "Seaplane: Water conditions assessment crucial",
            "Consider: Wind, space, obstacles, surface conditions",
            "Abort decision must be made early - before committed",
            "Emergency escape plan if landing impossible",
            "Requires mature judgment - don't attempt beyond capability"
        ]
    },
    'LP-VII-I': {
        "keyTeachingPoints": [
            "Glassy water: Mirror-like surface with no visual references",
            "Depth perception extremely difficult",
            "Cannot judge height above water accurately",
            "Technique: Establish descent at constant rate, wait for touchdown",
            "Power controls descent rate precisely",
            "Do not flare - will balloon with no references",
            "Higher-than-normal touchdown speed acceptable",
            "Be patient - let airplane settle to water",
            "Most challenging seaplane condition",
            "Practice with experienced seaplane instructor essential"
        ]
    },
    'LP-VII-J': {
        "keyTeachingPoints": [
            "Glassy water landing: Approach with power at constant rate",
            "Establish stabilized approach - power and pitch constant",
            "Typical: 300-500 fpm descent rate, approach speed +5 knots",
            "Do not attempt to flare - no visual references",
            "Hold attitude constant, wait for water contact",
            "Touchdown will be firm - acceptable on glassy water",
            "Power on throughout - controlled descent to surface",
            "Patience essential - rushing causes errors",
            "If unsure of altitude: Add power, go around, try different area",
            "Most seaplane accidents on glassy water - requires discipline"
        ]
    },
    'LP-VII-K': {
        "keyTeachingPoints": [
            "Rough water: Waves, chop requiring different technique",
            "Higher-than-normal takeoff speed needed",
            "Use wave action to assist takeoff",
            "Takeoff into wind when possible",
            "Be patient - may skip and bounce before flying",
            "Protect tail and propeller from water spray",
            "Power application smooth but decisive",
            "Liftoff when airplane feels ready - don't force it",
            "Wind, waves, and current all affect technique",
            "Safety margins increased due to unpredictability"
        ]
    },
    'LP-VII-L': {
        "keyTeachingPoints": [
            "Rough water landing: Touch down on wave crest if possible",
            "Approach speed higher than calm water (+5-10 knots)",
            "Power on approach for control in rough conditions",
            "Touch down in controlled manner - not dropped in",
            "Accept firm touchdown - safer than ballooning",
            "Keep water rudders retracted until stopped",
            "Be prepared for unexpected bounce or skip",
            "Maintain directional control throughout",
            "Consider wind, waves, swells in approach planning",
            "Conservative approach better than aggressive"
        ]
    }
}

# Apply all enhancements
for lesson in data['lessonPlans']:
    if lesson['id'] in target_lessons and lesson['id'] in enhancements:
        enh = enhancements[lesson['id']]
        
        for key, value in enh.items():
            lesson[key] = value
        
        print(f"✨ {lesson['id']}: {lesson['title'][:55]}")

# Save
with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n{'='*70}")
print(f"✨ BATCH 1 ELEVATION COMPLETE!")
print(f"{'='*70}")
print(f"Enhanced: {len([l for l in target_lessons if l in enhancements])}/20")
print(f"\n🎯 All enhanced lessons now have exceptional teaching points!")
print(f"🌐 Refresh browser: http://localhost:5174/")

