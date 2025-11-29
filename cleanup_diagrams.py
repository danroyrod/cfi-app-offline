#!/usr/bin/env python3
"""
Clean up diagrams in lesson plans:
1. Delete generic "Lesson Overview" diagrams
2. Improve LP-IX-B step-by-step diagram
"""

import json
import re
from typing import Dict, List, Any

def is_generic_diagram(diagram: Dict[str, Any], lesson_title: str) -> bool:
    """Check if diagram is generic/non-custom."""
    title = diagram.get('title', '').lower()
    diagram_type = diagram.get('type', '').lower()
    svg = diagram.get('svg', '')
    
    # If it has an imageUrl, it's likely a custom professional diagram - keep it
    if diagram.get('imageUrl'):
        return False
    
    # Generic "overview" type diagrams are usually generic
    if diagram_type == 'overview':
        if svg:
            # Check if SVG is just generic circles/nodes
            circle_count = svg.count('<circle')
            text_count = svg.count('<text')
            # Generic overview diagrams typically have 3-5 circles and minimal text
            if circle_count >= 3 and circle_count <= 6 and text_count <= 10:
                # Check if it mentions lesson-specific content
                lesson_keywords = ['takeoff', 'landing', 'stall', 'turn', 'spiral', 'chandelle', 
                                 'lazy', 'eight', 'ground', 'reference', 'emergency', 'engine',
                                 'instrument', 'night', 'seaplane', 'multi', 'altitude']
                if not any(keyword in lesson_title.lower() for keyword in lesson_keywords):
                    return True
    
    # Generic "Lesson Overview" titles are usually generic
    if 'lesson overview' in title:
        return True
    
    return False

def create_improved_steep_spiral_diagram() -> str:
    """Create an improved step-by-step diagram for steep spiral."""
    return '''<svg viewBox="0 0 800 700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="700" fill="url(#skyGrad)"/>
  
  <!-- Ground reference point -->
  <circle cx="400" cy="600" r="12" fill="#8B4513" stroke="#654321" stroke-width="3" filter="url(#shadow)"/>
  <text x="400" y="635" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#2C3E50" font-weight="bold">Reference Point</text>
  
  <!-- Spiral path (descending) -->
  <path d="M 400 100 
           A 100 100 0 0 1 500 200
           A 120 120 0 0 1 400 320
           A 140 140 0 0 1 280 440
           A 160 160 0 0 1 400 560
           A 180 180 0 0 1 580 680" 
        fill="none" stroke="#1E90FF" stroke-width="4" stroke-dasharray="10,5" opacity="0.6"/>
  
  <!-- Aircraft positions with altitude labels -->
  <!-- Position 1: 0° (North), 3000 ft -->
  <g transform="translate(400, 100) rotate(0)">
    <path d="M 0 -20 L -25 20 L 0 8 L 25 20 Z" fill="#4169E1" stroke="white" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="4" fill="#E74C3C"/>
  </g>
  <text x="400" y="70" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">1</text>
  <text x="400" y="50" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50">3000 ft AGL</text>
  <text x="400" y="35" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50">Entry: 45° Bank</text>
  
  <!-- Position 2: 90° (East), 2500 ft -->
  <g transform="translate(500, 200) rotate(90)">
    <path d="M 0 -20 L -25 20 L 0 8 L 25 20 Z" fill="#4169E1" stroke="white" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="4" fill="#E74C3C"/>
  </g>
  <text x="530" y="200" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">2</text>
  <text x="530" y="180" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50">2500 ft</text>
  
  <!-- Position 3: 180° (South), 2000 ft -->
  <g transform="translate(400, 320) rotate(180)">
    <path d="M 0 -20 L -25 20 L 0 8 L 25 20 Z" fill="#4169E1" stroke="white" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="4" fill="#E74C3C"/>
  </g>
  <text x="400" y="360" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">3</text>
  <text x="400" y="380" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50">2000 ft</text>
  
  <!-- Position 4: 270° (West), 1500 ft -->
  <g transform="translate(280, 440) rotate(270)">
    <path d="M 0 -20 L -25 20 L 0 8 L 25 20 Z" fill="#4169E1" stroke="white" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="4" fill="#E74C3C"/>
  </g>
  <text x="250" y="440" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">4</text>
  <text x="250" y="420" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50">1500 ft</text>
  
  <!-- Position 5: 360° (North), 1000 ft -->
  <g transform="translate(400, 560) rotate(0)">
    <path d="M 0 -20 L -25 20 L 0 8 L 25 20 Z" fill="#4169E1" stroke="white" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="4" fill="#E74C3C"/>
  </g>
  <text x="400" y="600" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">5</text>
  <text x="400" y="620" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50">1000 ft</text>
  
  <!-- Position 6: 450° (East), 500 ft (minimum) -->
  <g transform="translate(580, 680) rotate(90)">
    <path d="M 0 -20 L -25 20 L 0 8 L 25 20 Z" fill="#FF6B6B" stroke="white" stroke-width="3" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="4" fill="#E74C3C"/>
  </g>
  <text x="610" y="680" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">6</text>
  <text x="610" y="660" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#E74C3C" font-weight="bold">500 ft MIN</text>
  
  <!-- Key information box -->
  <rect x="50" y="50" width="200" height="200" fill="white" fill-opacity="0.95" stroke="#2C3E50" stroke-width="2" rx="5" filter="url(#shadow)"/>
  <text x="150" y="75" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#2C3E50" font-weight="bold">Steep Spiral</text>
  <text x="150" y="95" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">Key Points</text>
  
  <text x="60" y="120" font-family="Arial, sans-serif" font-size="11" fill="#2C3E50">
    <tspan x="60" dy="0">• Entry: 3000 ft AGL</tspan>
    <tspan x="60" dy="18">• 45-55° bank constant</tspan>
    <tspan x="60" dy="18">• ~500 ft descent/turn</tspan>
    <tspan x="60" dy="18">• 3 complete 360° turns</tspan>
    <tspan x="60" dy="18">• Maintain constant radius</tspan>
    <tspan x="60" dy="18">• Level at 500 ft minimum</tspan>
    <tspan x="60" dy="18">• Roll out on entry heading</tspan>
  </text>
  
  <!-- Altitude scale -->
  <rect x="650" y="50" width="120" height="600" fill="white" fill-opacity="0.9" stroke="#2C3E50" stroke-width="2" rx="5" filter="url(#shadow)"/>
  <text x="710" y="75" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">Altitude</text>
  
  <!-- Altitude markers -->
  <line x1="660" y1="100" x2="690" y2="100" stroke="#2C3E50" stroke-width="2"/>
  <text x="695" y="105" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">3000</text>
  
  <line x1="660" y1="200" x2="690" y2="200" stroke="#2C3E50" stroke-width="2"/>
  <text x="695" y="205" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">2500</text>
  
  <line x1="660" y1="300" x2="690" y2="300" stroke="#2C3E50" stroke-width="2"/>
  <text x="695" y="305" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">2000</text>
  
  <line x1="660" y1="400" x2="690" y2="400" stroke="#2C3E50" stroke-width="2"/>
  <text x="695" y="405" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">1500</text>
  
  <line x1="660" y1="500" x2="690" y2="500" stroke="#2C3E50" stroke-width="2"/>
  <text x="695" y="505" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">1000</text>
  
  <line x1="660" y1="600" x2="690" y2="600" stroke="#E74C3C" stroke-width="3"/>
  <text x="695" y="605" font-family="Arial, sans-serif" font-size="10" fill="#E74C3C" font-weight="bold">500 MIN</text>
  
  <!-- Title -->
  <text x="400" y="30" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Steep Spiral - Step-by-Step Maneuver
  </text>
</svg>'''

def cleanup_diagrams():
    """Main cleanup function."""
    print("=" * 80)
    print("CLEANING UP DIAGRAMS")
    print("=" * 80)
    
    # Load lesson plans
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    lessons = data.get('lessonPlans', [])
    deleted_count = 0
    improved_count = 0
    
    for lesson in lessons:
        lesson_id = lesson.get('id', '')
        title = lesson.get('title', '')
        diagrams = lesson.get('diagrams', [])
        
        # Filter out generic diagrams
        original_count = len(diagrams)
        diagrams = [d for d in diagrams if not is_generic_diagram(d, title)]
        deleted = original_count - len(diagrams)
        deleted_count += deleted
        
        # Special handling for LP-IX-B: improve step-by-step diagram
        if lesson_id == 'LP-IX-B':
            for diagram in diagrams:
                if diagram.get('title') == 'Steep Spiral - Step-by-Step' and diagram.get('svg'):
                    print(f"\nImproving {lesson_id}: {diagram.get('title')}")
                    diagram['svg'] = create_improved_steep_spiral_diagram()
                    diagram['description'] = 'Enhanced step-by-step view of descending spiral with altitude markers, aircraft positions, and key teaching points'
                    improved_count += 1
        
        # Update lesson with cleaned diagrams
        lesson['diagrams'] = diagrams
        
        if deleted > 0:
            print(f"Deleted {deleted} generic diagram(s) from {lesson_id}")
    
    # Save updated data
    print(f"\n{'='*80}")
    print(f"Summary: Deleted {deleted_count} generic diagrams, Improved {improved_count} diagram(s)")
    print(f"{'='*80}\n")
    
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("SUCCESS: Updated lessonPlansData.json saved successfully!")
    print(f"SUCCESS: Total generic diagrams removed: {deleted_count}")
    print(f"SUCCESS: Diagrams improved: {improved_count}")

if __name__ == '__main__':
    cleanup_diagrams()

