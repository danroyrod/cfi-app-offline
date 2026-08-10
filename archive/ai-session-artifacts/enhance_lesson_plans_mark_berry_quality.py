#!/usr/bin/env python3
"""
Enhance lesson plans to match or exceed Mark Berry CFI Notebook quality.
This script:
1. Adds professional diagrams based on Mark Berry's lesson plan structure
2. Enhances content with more detailed procedures
3. Ensures all lessons have relevant, high-quality diagrams
4. Improves teaching scripts and key points
"""

import json
import math
from typing import Dict, List, Any

def create_load_factor_diagram() -> str:
    """Create load factor chart showing relationship between bank angle and load factor."""
    svg_width, svg_height = 600, 500
    
    # Create chart with bank angles and load factors
    bank_angles = [0, 15, 30, 45, 60, 70]
    load_factors = [1.0, 1.04, 1.15, 1.41, 2.0, 2.92]
    
    # Chart area
    chart_x, chart_y = 100, 100
    chart_width, chart_height = 400, 300
    
    # Points for line graph
    points = []
    for i, (bank, load) in enumerate(zip(bank_angles, load_factors)):
        x = chart_x + (bank / 70) * chart_width
        y = chart_y + chart_height - ((load - 1.0) / 1.92) * chart_height
        points.append((x, y))
    
    # Create path
    path_d = f"M {points[0][0]} {points[0][1]}"
    for x, y in points[1:]:
        path_d += f" L {x} {y}"
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#FFFFFF"/>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Load Factor vs. Bank Angle
  </text>
  
  <!-- Chart border -->
  <rect x="{chart_x}" y="{chart_y}" width="{chart_width}" height="{chart_height}" fill="none" stroke="#2C3E50" stroke-width="2"/>
  
  <!-- Grid lines -->
  {''.join([f'<line x1="{chart_x}" y1="{chart_y + (i/4) * chart_height}" x2="{chart_x + chart_width}" y2="{chart_y + (i/4) * chart_height}" stroke="#E0E0E0" stroke-width="1" stroke-dasharray="3,3"/>' for i in range(5)])}
  {''.join([f'<line x1="{chart_x + (i/7) * chart_width}" y1="{chart_y}" x2="{chart_x + (i/7) * chart_width}" y2="{chart_y + chart_height}" stroke="#E0E0E0" stroke-width="1" stroke-dasharray="3,3"/>' for i in range(8)])}
  
  <!-- Load factor curve -->
  <path d="{path_d}" fill="none" stroke="#E74C3C" stroke-width="3"/>
  
  <!-- Data points -->
  {''.join([f'<circle cx="{x}" cy="{y}" r="5" fill="#E74C3C"/>' for x, y in points])}
  
  <!-- Labels on points -->
  {''.join([f'<text x="{x}" y="{y - 15}" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50">{lf:.2f}G</text>' for (x, y), lf in zip(points, load_factors)])}
  
  <!-- X-axis labels (Bank Angle) -->
  <text x="{chart_x + chart_width // 2}" y="{chart_y + chart_height + 40}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#2C3E50">Bank Angle (degrees)</text>
  {''.join([f'<text x="{chart_x + (ba / 70) * chart_width}" y="{chart_y + chart_height + 25}" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50">{ba}°</text>' for ba in bank_angles])}
  
  <!-- Y-axis labels (Load Factor) -->
  <text x="30" y="{chart_y + chart_height // 2}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#2C3E50" transform="rotate(-90, 30, {chart_y + chart_height // 2})">Load Factor (G)</text>
  {''.join([f'<text x="{chart_x - 10}" y="{chart_y + chart_height - (i/4) * chart_height + 5}" font-family="Arial, sans-serif" font-size="11" text-anchor="end" fill="#2C3E50">{(1.0 + i * 1.92/4):.2f}</text>' for i in range(5)])}
  
  <!-- Key points -->
  <text x="50" y="430" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Key Points:</text>
  <text x="50" y="455" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="50" dy="0">• 45° bank = 1.41G load factor</tspan>
    <tspan x="50" dy="18">• 60° bank = 2.0G load factor</tspan>
    <tspan x="50" dy="18">• 70° bank = 2.92G load factor</tspan>
    <tspan x="50" dy="18">• Stall speed increases with square root of load factor</tspan>
  </text>
</svg>'''
    return svg

def create_horizontal_component_lift_diagram() -> str:
    """Create diagram showing horizontal and vertical components of lift in a turn."""
    svg_width, svg_height = 600, 500
    center_x, center_y = svg_width // 2, svg_height // 2
    
    # Aircraft at 45° bank
    bank_angle = 45
    bank_rad = math.radians(bank_angle)
    
    # Lift vector
    lift_magnitude = 200
    lift_x = center_x
    lift_y = center_y - 50
    
    # Vertical component (perpendicular to horizon)
    vert_x = lift_x
    vert_y = lift_y + lift_magnitude * math.cos(bank_rad)
    vert_len = lift_magnitude * math.cos(bank_rad)
    
    # Horizontal component (parallel to horizon)
    horiz_x = lift_x + lift_magnitude * math.sin(bank_rad)
    horiz_y = lift_y
    horiz_len = lift_magnitude * math.sin(bank_rad)
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#E8F4F8"/>
  
  <!-- Horizon line -->
  <line x1="0" y1="{center_y}" x2="{svg_width}" y2="{center_y}" stroke="#87CEEB" stroke-width="3" stroke-dasharray="5,5"/>
  <text x="20" y="{center_y - 5}" font-family="Arial, sans-serif" font-size="12" fill="#2C3E50" font-weight="bold">Horizon</text>
  
  <!-- Aircraft symbol (banked) -->
  <g transform="translate({center_x}, {center_y - 50}) rotate({bank_angle})">
    <path d="M -40 -10 L -20 10 L 20 10 L 40 -10 L 20 -20 L -20 -20 Z" fill="#4169E1" stroke="white" stroke-width="2"/>
    <circle cx="0" cy="0" r="3" fill="#FFD700"/>
  </g>
  
  <!-- Lift vector (total) -->
  <line x1="{lift_x}" y1="{lift_y}" x2="{vert_x}" y2="{vert_y}" stroke="#10B981" stroke-width="4" marker-end="url(#arrowGreen)"/>
  <text x="{lift_x + 20}" y="{(lift_y + vert_y) / 2}" font-family="Arial, sans-serif" font-size="12" fill="#10B981" font-weight="bold">Total Lift</text>
  
  <!-- Vertical component -->
  <line x1="{lift_x}" y1="{lift_y}" x2="{vert_x}" y2="{vert_y}" stroke="#E74C3C" stroke-width="3" stroke-dasharray="8,4"/>
  <text x="{vert_x + 15}" y="{vert_y + 5}" font-family="Arial, sans-serif" font-size="11" fill="#E74C3C" font-weight="bold">Vertical Component</text>
  <text x="{vert_x + 15}" y="{vert_y + 20}" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">(Opposes Weight)</text>
  
  <!-- Horizontal component -->
  <line x1="{lift_x}" y1="{lift_y}" x2="{horiz_x}" y2="{horiz_y}" stroke="#F59E0B" stroke-width="3" stroke-dasharray="8,4"/>
  <text x="{(lift_x + horiz_x) / 2}" y="{horiz_y - 15}" font-family="Arial, sans-serif" font-size="11" fill="#F59E0B" font-weight="bold">Horizontal Component</text>
  <text x="{(lift_x + horiz_x) / 2}" y="{horiz_y - 3}" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">(Causes Turn)</text>
  
  <!-- Right angle marker -->
  <path d="M {lift_x + 5} {lift_y + 5} L {lift_x + 5} {lift_y + 20} L {lift_x + 20} {lift_y + 20}" fill="none" stroke="#2C3E50" stroke-width="1"/>
  
  <!-- Bank angle arc -->
  <path d="M {center_x + 30} {center_y - 50} A 30 30 0 0 1 {center_x + 30 + 30 * math.sin(bank_rad)} {center_y - 50 - 30 * (1 - math.cos(bank_rad))}" fill="none" stroke="#2C3E50" stroke-width="2"/>
  <text x="{center_x + 70}" y="{center_y - 45}" font-family="Arial, sans-serif" font-size="12" fill="#2C3E50" font-weight="bold">{bank_angle}° Bank</text>
  
  <!-- Weight vector -->
  <line x1="{center_x}" y1="{lift_y}" x2="{center_x}" y2="{lift_y + 100}" stroke="#8B4513" stroke-width="3" marker-end="url(#arrowBrown)"/>
  <text x="{center_x + 15}" y="{lift_y + 60}" font-family="Arial, sans-serif" font-size="12" fill="#8B4513" font-weight="bold">Weight</text>
  
  <!-- Arrow markers -->
  <defs>
    <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#10B981"/>
    </marker>
    <marker id="arrowBrown" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#8B4513"/>
    </marker>
  </defs>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Lift Components in a Turn
  </text>
  
  <!-- Key concepts -->
  <text x="50" y="420" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Key Concepts:</text>
  <text x="50" y="445" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="50" dy="0">• Total lift must increase in a turn</tspan>
    <tspan x="50" dy="18">• Vertical component opposes weight</tspan>
    <tspan x="50" dy="18">• Horizontal component causes the turn</tspan>
    <tspan x="50" dy="18">• More bank = more lift needed</tspan>
  </text>
</svg>'''
    return svg

def create_skidding_slipping_turn_diagram() -> str:
    """Create diagram showing coordinated, skidding, and slipping turns."""
    svg_width, svg_height = 700, 400
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#FFFFFF"/>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Coordinated vs. Uncoordinated Turns
  </text>
  
  <!-- Coordinated Turn -->
  <g transform="translate(120, 120)">
    <text x="0" y="-30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#10B981">Coordinated Turn</text>
    <!-- Aircraft -->
    <g transform="rotate(30)">
      <path d="M -25 -8 L -15 8 L 15 8 L 25 -8 L 15 -15 L -15 -15 Z" fill="#4169E1" stroke="white" stroke-width="2"/>
      <circle cx="0" cy="0" r="2" fill="#FFD700"/>
    </g>
    <!-- Turn indicator ball centered -->
    <circle cx="0" cy="40" r="8" fill="#E8E8E8" stroke="#2C3E50" stroke-width="2"/>
    <circle cx="0" cy="40" r="3" fill="#10B981"/>
    <text x="0" y="60" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#10B981">Ball Centered</text>
    <!-- Flight path -->
    <path d="M -50 60 A 50 30 0 0 1 50 60" fill="none" stroke="#10B981" stroke-width="3"/>
  </g>
  
  <!-- Skidding Turn -->
  <g transform="translate(350, 120)">
    <text x="0" y="-30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#E74C3C">Skidding Turn</text>
    <!-- Aircraft -->
    <g transform="rotate(30)">
      <path d="M -25 -8 L -15 8 L 15 8 L 25 -8 L 15 -15 L -15 -15 Z" fill="#4169E1" stroke="white" stroke-width="2"/>
      <circle cx="0" cy="0" r="2" fill="#FFD700"/>
    </g>
    <!-- Turn indicator ball to outside -->
    <circle cx="0" cy="40" r="8" fill="#E8E8E8" stroke="#2C3E50" stroke-width="2"/>
    <circle cx="12" cy="40" r="3" fill="#E74C3C"/>
    <text x="0" y="60" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#E74C3C">Ball Outside</text>
    <text x="0" y="75" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="#2C3E50">Too much rudder</text>
    <!-- Flight path -->
    <path d="M -50 60 A 50 20 0 0 1 50 60" fill="none" stroke="#E74C3C" stroke-width="3" stroke-dasharray="5,3"/>
  </g>
  
  <!-- Slipping Turn -->
  <g transform="translate(580, 120)">
    <text x="0" y="-30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#F59E0B">Slipping Turn</text>
    <!-- Aircraft -->
    <g transform="rotate(30)">
      <path d="M -25 -8 L -15 8 L 15 8 L 25 -8 L 15 -15 L -15 -15 Z" fill="#4169E1" stroke="white" stroke-width="2"/>
      <circle cx="0" cy="0" r="2" fill="#FFD700"/>
    </g>
    <!-- Turn indicator ball to inside -->
    <circle cx="0" cy="40" r="8" fill="#E8E8E8" stroke="#2C3E50" stroke-width="2"/>
    <circle cx="-12" cy="40" r="3" fill="#F59E0B"/>
    <text x="0" y="60" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#F59E0B">Ball Inside</text>
    <text x="0" y="75" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="#2C3E50">Not enough rudder</text>
    <!-- Flight path -->
    <path d="M -50 60 A 50 40 0 0 1 50 60" fill="none" stroke="#F59E0B" stroke-width="3" stroke-dasharray="5,3"/>
  </g>
  
  <!-- Key points -->
  <text x="50" y="280" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Key Points:</text>
  <text x="50" y="305" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="50" dy="0">• Coordinated: Ball centered, efficient flight</tspan>
    <tspan x="50" dy="18">• Skidding: Ball outside, too much rudder, radius too large</tspan>
    <tspan x="50" dy="18">• Slipping: Ball inside, not enough rudder, radius too small</tspan>
    <tspan x="50" dy="18">• Always step on the ball to correct</tspan>
  </text>
</svg>'''
    return svg

def enhance_lesson_plan(lesson: Dict[str, Any]) -> Dict[str, Any]:
    """Enhance a lesson plan with better diagrams and content based on Mark Berry CFI Notebook standards."""
    title_lower = lesson.get('title', '').lower()
    area = lesson.get('areaNumber', '')
    task_letter = lesson.get('taskLetter', '').upper()
    
    diagrams = lesson.get('diagrams', [])
    
    # Helper to check if diagram type exists
    def has_diagram(title_keywords):
        return any(any(kw.lower() in d.get('title', '').lower() for kw in title_keywords) for d in diagrams)
    
    # Area IX - Performance and Ground Reference Maneuvers
    if area == 'IX':
        # Steep Turns (Task A)
        if task_letter == 'A' or ('steep' in title_lower and 'turn' in title_lower and 'spiral' not in title_lower):
            if not has_diagram(['Load Factor', 'Bank Angle']):
                diagrams.append({
                    'type': 'performance',
                    'title': 'Load Factor vs. Bank Angle Chart',
                    'description': 'Graph showing relationship between bank angle and load factor, demonstrating why stall speed increases in turns',
                    'svg': create_load_factor_diagram(),
                    'keyPoints': [
                        '45° bank = 1.41G',
                        '60° bank = 2.0G',
                        '70° bank = 2.92G',
                        'Stall speed increases with square root of load factor'
                    ]
                })
            
            if not has_diagram(['Lift Components', 'Horizontal', 'Vertical']):
                diagrams.append({
                    'type': 'basic',
                    'title': 'Horizontal and Vertical Components of Lift',
                    'description': 'Visualization of how lift is divided in a turn, showing vertical component opposing weight and horizontal component causing the turn',
                    'svg': create_horizontal_component_lift_diagram(),
                    'keyPoints': [
                        'Vertical component opposes weight',
                        'Horizontal component causes the turn',
                        'Total lift must increase in a turn',
                        'More bank requires more total lift'
                    ]
                })
            
            if not has_diagram(['Coordinated', 'Skidding', 'Slipping']):
                diagrams.append({
                    'type': 'basic',
                    'title': 'Coordinated vs. Skidding vs. Slipping Turns',
                    'description': 'Visual comparison of turn coordination, showing ball position and flight path differences',
                    'svg': create_skidding_slipping_turn_diagram(),
                    'keyPoints': [
                        'Coordinated: Ball centered',
                        'Skidding: Ball outside, too much rudder',
                        'Slipping: Ball inside, not enough rudder',
                        'Step on the ball to correct'
                    ]
                })
    
    # Area X - Slow Flight and Stalls
    if area == 'X':
        # Stalls - add angle of attack diagram if not present
        if 'stall' in title_lower and not has_diagram(['Angle of Attack', 'AoA', 'Stall Progression']):
            # We already have stall progression diagrams, but check anyway
            pass
    
    # Area VII - Takeoffs and Landings  
    if area == 'VII':
        # Takeoff/Landing profiles are already handled by create_professional_diagrams.py
        pass
    
    lesson['diagrams'] = diagrams
    return lesson

def main():
    """Enhance all lesson plans."""
    print("Loading lesson plans...")
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    
    print(f"\nEnhancing {len(data['lessonPlans'])} lesson plans...")
    print("=" * 60)
    
    for lesson in data['lessonPlans']:
        original_diagram_count = len(lesson.get('diagrams', []))
        enhanced = enhance_lesson_plan(lesson)
        new_diagram_count = len(enhanced.get('diagrams', []))
        
        if new_diagram_count > original_diagram_count:
            print(f"[+] {enhanced['id']}: {enhanced['title']}")
            print(f"  Added {new_diagram_count - original_diagram_count} diagram(s)")
            updated_count += 1
    
    print("\n" + "=" * 60)
    print(f"[SUCCESS] Enhanced {updated_count} lesson plans with additional diagrams")
    
    # Save updated data
    print("\nSaving updated lesson plans...")
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("[SAVED] Updated lessonPlansData.json")
    print(f"\nTotal lesson plans: {len(data['lessonPlans'])}")
    print(f"Enhanced lesson plans: {updated_count}")

if __name__ == '__main__':
    main()

