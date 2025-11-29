#!/usr/bin/env python3
"""
Remove all custom SVG diagrams from ALL lesson plans, keeping only imageUrl diagrams.
"""

import json
from typing import Dict, List, Any
from collections import defaultdict

def cleanup_all_diagrams():
    """Remove custom SVG diagrams from all lessons, keep only imageUrl diagrams."""
    print("=" * 80)
    print("CLEANING UP ALL DIAGRAMS - KEEPING ONLY IMAGEURL DIAGRAMS")
    print("=" * 80)
    
    # Load lesson plans
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    lessons = data.get('lessonPlans', [])
    
    print(f"\nProcessing {len(lessons)} lessons...\n")
    
    total_removed = 0
    total_kept = 0
    area_stats = defaultdict(lambda: {'removed': 0, 'kept': 0, 'lessons': 0})
    
    for lesson in lessons:
        lesson_id = lesson.get('id', '')
        area = lesson.get('areaNumber', 'Unknown')
        title = lesson.get('title', '')
        diagrams = lesson.get('diagrams', [])
        
        area_stats[area]['lessons'] += 1
        
        original_count = len(diagrams)
        
        # Keep only diagrams with imageUrl
        # Remove diagrams with SVG (custom created ones)
        filtered_diagrams = []
        removed_from_lesson = []
        
        for diagram in diagrams:
            if diagram.get('imageUrl'):
                # Keep imageUrl diagrams
                filtered_diagrams.append(diagram)
                total_kept += 1
                area_stats[area]['kept'] += 1
            elif diagram.get('svg'):
                # Remove custom SVG diagrams
                removed_from_lesson.append(diagram.get('title', 'Untitled'))
                total_removed += 1
                area_stats[area]['removed'] += 1
            elif diagram.get('asciiArt'):
                # Also remove ASCII art diagrams
                removed_from_lesson.append(diagram.get('title', 'Untitled'))
                total_removed += 1
                area_stats[area]['removed'] += 1
            else:
                # If it has neither imageUrl nor SVG, it's probably empty/generic - remove it
                removed_from_lesson.append(diagram.get('title', 'Untitled'))
                total_removed += 1
                area_stats[area]['removed'] += 1
        
        # Update lesson with filtered diagrams
        lesson['diagrams'] = filtered_diagrams
        
        if removed_from_lesson and original_count > 0:
            print(f"{lesson_id}: {title}")
            print(f"  Removed {len(removed_from_lesson)} custom diagram(s)")
            if len(removed_from_lesson) <= 3:
                for d_title in removed_from_lesson:
                    print(f"    - {d_title}")
            print(f"  Kept {len(filtered_diagrams)} imageUrl diagram(s)")
            print()
    
    # Save updated data
    print("=" * 80)
    print(f"SUMMARY")
    print("=" * 80)
    print(f"Total removed: {total_removed} custom diagrams")
    print(f"Total kept: {total_kept} imageUrl diagrams")
    print()
    
    # Print stats by area
    print("=" * 80)
    print("STATISTICS BY AREA")
    print("=" * 80)
    print(f"{'Area':<8} {'Lessons':<10} {'Removed':<10} {'Kept':<10}")
    print("-" * 80)
    for area in sorted(area_stats.keys()):
        stats = area_stats[area]
        print(f"Area {area:<4} {stats['lessons']:<10} {stats['removed']:<10} {stats['kept']:<10}")
    
    print("=" * 80)
    
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("\nSUCCESS: Updated lessonPlansData.json saved successfully!")
    print(f"SUCCESS: Removed {total_removed} custom diagrams")
    print(f"SUCCESS: Kept {total_kept} imageUrl diagrams")
    
    # Show final state
    print("\n" + "=" * 80)
    print("FINAL STATE - LESSONS WITH IMAGEURL DIAGRAMS")
    print("=" * 80)
    lessons_with_images = [l for l in lessons if len(l.get('diagrams', [])) > 0]
    print(f"\nLessons with imageUrl diagrams: {len(lessons_with_images)}")
    for lesson in lessons_with_images:
        diagrams = lesson.get('diagrams', [])
        print(f"\n{lesson.get('id')}: {lesson.get('title')}")
        print(f"  {len(diagrams)} diagram(s):")
        for i, d in enumerate(diagrams, 1):
            print(f"    {i}. {d.get('title')} -> {d.get('imageUrl', 'N/A')}")

if __name__ == '__main__':
    cleanup_all_diagrams()

