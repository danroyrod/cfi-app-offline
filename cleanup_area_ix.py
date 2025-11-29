#!/usr/bin/env python3
"""
Remove custom SVG diagrams from Area IX lessons, keeping only imageUrl diagrams.
"""

import json
from typing import Dict, List, Any

def cleanup_area_ix():
    """Remove custom SVG diagrams from Area IX, keep only imageUrl diagrams."""
    print("=" * 80)
    print("CLEANING UP AREA IX DIAGRAMS")
    print("=" * 80)
    
    # Load lesson plans
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    lessons = data.get('lessonPlans', [])
    area_ix_lessons = [l for l in lessons if l.get('areaNumber') == 'IX']
    
    print(f"\nFound {len(area_ix_lessons)} Area IX lessons\n")
    
    total_removed = 0
    total_kept = 0
    
    for lesson in area_ix_lessons:
        lesson_id = lesson.get('id', '')
        title = lesson.get('title', '')
        diagrams = lesson.get('diagrams', [])
        
        original_count = len(diagrams)
        
        # Keep only diagrams with imageUrl (Mark Berry images)
        # Remove diagrams with SVG (custom created ones)
        filtered_diagrams = []
        removed_from_lesson = []
        
        for diagram in diagrams:
            if diagram.get('imageUrl'):
                # Keep imageUrl diagrams
                filtered_diagrams.append(diagram)
                total_kept += 1
            elif diagram.get('svg'):
                # Remove custom SVG diagrams
                removed_from_lesson.append(diagram.get('title', 'Untitled'))
                total_removed += 1
        
        # Update lesson with filtered diagrams
        lesson['diagrams'] = filtered_diagrams
        
        if removed_from_lesson:
            print(f"{lesson_id}: {title}")
            print(f"  Removed {len(removed_from_lesson)} custom SVG diagram(s):")
            for d_title in removed_from_lesson:
                print(f"    - {d_title}")
            print(f"  Kept {len(filtered_diagrams)} imageUrl diagram(s)")
            print()
    
    # Save updated data
    print("=" * 80)
    print(f"Summary: Removed {total_removed} custom SVG diagrams")
    print(f"         Kept {total_kept} imageUrl diagrams")
    print("=" * 80)
    
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("\nSUCCESS: Updated lessonPlansData.json saved successfully!")
    
    # Show final state
    print("\n" + "=" * 80)
    print("FINAL AREA IX STATE")
    print("=" * 80)
    for lesson in area_ix_lessons:
        diagrams = lesson.get('diagrams', [])
        print(f"{lesson.get('id')}: {lesson.get('title')}")
        print(f"  Diagrams: {len(diagrams)}")
        for i, d in enumerate(diagrams, 1):
            print(f"    {i}. {d.get('title')} -> {d.get('imageUrl', 'N/A')}")

if __name__ == '__main__':
    cleanup_area_ix()

