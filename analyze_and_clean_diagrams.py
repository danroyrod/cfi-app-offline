#!/usr/bin/env python3
"""
Analyze and clean up diagrams in lesson plans.
- Delete generic/non-custom diagrams (like generic "overview" types)
- Keep custom, high-quality, lesson-specific diagrams
- Improve step-by-step diagrams where needed
"""

import json
import re
from typing import Dict, List, Any

def is_generic_diagram(diagram: Dict[str, Any], lesson_title: str) -> bool:
    """
    Determine if a diagram is generic/non-custom.
    Generic diagrams include:
    - "overview" type with generic SVG (just circles/nodes)
    - Generic "Lesson Overview" titles
    - Diagrams that don't relate to the specific lesson content
    """
    title = diagram.get('title', '').lower()
    diagram_type = diagram.get('type', '').lower()
    svg = diagram.get('svg', '')
    description = diagram.get('description', '').lower()
    
    # If it has an imageUrl, it's likely a custom professional diagram - keep it
    if diagram.get('imageUrl'):
        return False
    
    # Generic "overview" type diagrams are usually generic
    if diagram_type == 'overview':
        # Check if SVG is just generic circles/nodes
        if svg:
            # Count meaningful elements - generic ones have just circles and text
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
    if 'lesson overview' in title or 'overview' in title:
        if not any(keyword in description for keyword in ['takeoff', 'landing', 'stall', 'turn', 
                                                          'spiral', 'chandelle', 'maneuver', 'flight']):
            return True
    
    return False

def analyze_lesson_diagrams(lesson: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze diagrams for a single lesson."""
    lesson_id = lesson.get('id', '')
    title = lesson.get('title', '')
    diagrams = lesson.get('diagrams', [])
    
    result = {
        'lesson_id': lesson_id,
        'title': title,
        'total_diagrams': len(diagrams),
        'generic_diagrams': [],
        'custom_diagrams': [],
        'needs_improvement': []
    }
    
    for i, diagram in enumerate(diagrams):
        diagram_info = {
            'index': i,
            'title': diagram.get('title', ''),
            'type': diagram.get('type', ''),
            'has_imageUrl': bool(diagram.get('imageUrl')),
            'has_svg': bool(diagram.get('svg'))
        }
        
        if is_generic_diagram(diagram, title):
            result['generic_diagrams'].append(diagram_info)
        else:
            result['custom_diagrams'].append(diagram_info)
            
            # Check if step-by-step diagrams need improvement
            if 'step' in diagram.get('title', '').lower() and diagram.get('svg'):
                # Check if SVG looks basic/generic
                svg = diagram.get('svg', '')
                if svg and len(svg) < 2000:  # Very short SVGs might need improvement
                    result['needs_improvement'].append(diagram_info)
    
    return result

def main():
    """Main analysis function."""
    print("=" * 80)
    print("DIAGRAM ANALYSIS AND CLEANUP")
    print("=" * 80)
    
    # Load lesson plans
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    lessons = data.get('lessonPlans', [])
    print(f"\nTotal lessons: {len(lessons)}\n")
    
    # Analyze by area
    area_analysis = {}
    all_generic = []
    all_custom = []
    all_improvements = []
    
    for lesson in lessons:
        area = lesson.get('areaNumber', 'Unknown')
        analysis = analyze_lesson_diagrams(lesson)
        
        if area not in area_analysis:
            area_analysis[area] = {
                'lessons': [],
                'total_generic': 0,
                'total_custom': 0,
                'total_improvements': 0
            }
        
        area_analysis[area]['lessons'].append(analysis)
        area_analysis[area]['total_generic'] += len(analysis['generic_diagrams'])
        area_analysis[area]['total_custom'] += len(analysis['custom_diagrams'])
        area_analysis[area]['total_improvements'] += len(analysis['needs_improvement'])
        
        all_generic.extend([(analysis['lesson_id'], d) for d in analysis['generic_diagrams']])
        all_custom.extend([(analysis['lesson_id'], d) for d in analysis['custom_diagrams']])
        all_improvements.extend([(analysis['lesson_id'], d) for d in analysis['needs_improvement']])
    
    # Print summary by area
    print("\n" + "=" * 80)
    print("SUMMARY BY AREA")
    print("=" * 80)
    print(f"{'Area':<6} {'Lessons':<10} {'Generic':<10} {'Custom':<10} {'Improve':<10}")
    print("-" * 80)
    
    for area in sorted(area_analysis.keys()):
        info = area_analysis[area]
        lesson_count = len(info['lessons'])
        print(f"Area {area:<4} {lesson_count:<10} {info['total_generic']:<10} "
              f"{info['total_custom']:<10} {info['total_improvements']:<10}")
    
    print("\n" + "=" * 80)
    print(f"TOTALS: Generic: {len(all_generic)}, Custom: {len(all_custom)}, "
          f"Needs Improvement: {len(all_improvements)}")
    print("=" * 80)
    
    # Print detailed generic diagrams
    print("\n" + "=" * 80)
    print("GENERIC DIAGRAMS TO DELETE")
    print("=" * 80)
    for lesson_id, diagram in all_generic:
        print(f"{lesson_id}: {diagram['title']} (type: {diagram['type']})")
    
    # Print lessons needing improvement
    print("\n" + "=" * 80)
    print("DIAGRAMS NEEDING IMPROVEMENT")
    print("=" * 80)
    for lesson_id, diagram in all_improvements:
        print(f"{lesson_id}: {diagram['title']} (type: {diagram['type']})")
    
    # Special case: LP-IX-B
    print("\n" + "=" * 80)
    print("SPECIAL CASE: LP-IX-B (Steep Spiral)")
    print("=" * 80)
    for lesson in lessons:
        if lesson.get('id') == 'LP-IX-B':
            diagrams = lesson.get('diagrams', [])
            print(f"\nFound {len(diagrams)} diagrams:")
            for i, diagram in enumerate(diagrams, 1):
                print(f"  {i}. {diagram.get('title', 'Untitled')}")
                print(f"     Type: {diagram.get('type', 'N/A')}")
                print(f"     Has imageUrl: {bool(diagram.get('imageUrl'))}")
                print(f"     Has SVG: {bool(diagram.get('svg'))}")
                if diagram.get('imageUrl'):
                    print(f"     Image: {diagram.get('imageUrl')}")
            break
    
    # Save analysis to file
    with open('diagram_analysis_report.json', 'w', encoding='utf-8') as f:
        json.dump({
            'summary': {
                'total_lessons': len(lessons),
                'total_generic': len(all_generic),
                'total_custom': len(all_custom),
                'total_improvements': len(all_improvements)
            },
            'by_area': area_analysis,
            'generic_diagrams': [{'lesson_id': lid, **d} for lid, d in all_generic],
            'improvements_needed': [{'lesson_id': lid, **d} for lid, d in all_improvements]
        }, f, indent=2)
    
    print("\n" + "=" * 80)
    print("Analysis complete! Report saved to: diagram_analysis_report.json")
    print("=" * 80)

if __name__ == '__main__':
    main()

