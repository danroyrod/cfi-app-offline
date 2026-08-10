#!/usr/bin/env python3
"""
Fix incorrectly assigned Mark Berry images.
This script will:
1. Remove short_field1.png from LP-VII-B (it belongs to LP-VII-E)
2. Remove power_curve.jpg, P_ON_STALL.png, P_OFF_STALL.png from LP-XI-A, LP-XI-B, LP-XI-C
3. Add them to the correct lessons (LP-X-A, LP-X-C, LP-X-D, LP-VII-E)
"""

import json
from pathlib import Path

def fix_image_assignments():
    """Fix incorrectly assigned images."""
    print("=" * 70)
    print("Fixing Mark Berry Image Assignments")
    print("=" * 70)
    
    # Load lesson plans
    print("\nLoading lesson plans...")
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = []
    
    # Process each lesson
    for lesson in data['lessonPlans']:
        lesson_id = lesson.get('id', '')
        diagrams = lesson.get('diagrams', [])
        
        # Track what to remove and add
        diagrams_to_remove = []
        diagrams_to_add = []
        
        # LP-VII-B: Remove short_field1.png if present
        if lesson_id == "LP-VII-B":
            for diagram in diagrams:
                if diagram.get('imageUrl', '').endswith('short_field1.png'):
                    diagrams_to_remove.append(diagram)
                    changes_made.append(f"Removed short_field1.png from {lesson_id}")
        
        # LP-VII-E: Add short_field1.png if not present
        elif lesson_id == "LP-VII-E":
            has_short_field = any('short_field1.png' in d.get('imageUrl', '') for d in diagrams)
            if not has_short_field:
                diagrams_to_add.append({
                    'type': 'flightPath',
                    'title': 'Short Field Takeoff',
                    'description': 'Short field takeoff profile and technique',
                    'imageUrl': '/images/mark-berry/short_field1.png',
                    'keyPoints': [
                        'From Mark Berry CFI Notebook',
                        'Professional aviation instruction diagram'
                    ]
                })
                changes_made.append(f"Added short_field1.png to {lesson_id}")
        
        # LP-XI-A, LP-XI-B, LP-XI-C: Remove stall/slow flight images
        elif lesson_id in ["LP-XI-A", "LP-XI-B", "LP-XI-C"]:
            for diagram in diagrams:
                img_url = diagram.get('imageUrl', '')
                if any(img in img_url for img in ['power_curve.jpg', 'P_ON_STALL.png', 'P_OFF_STALL.png']):
                    diagrams_to_remove.append(diagram)
                    changes_made.append(f"Removed {img_url.split('/')[-1]} from {lesson_id}")
        
        # LP-X-A: Add power_curve.jpg if not present
        elif lesson_id == "LP-X-A":
            has_power_curve = any('power_curve.jpg' in d.get('imageUrl', '') for d in diagrams)
            if not has_power_curve:
                diagrams_to_add.append({
                    'type': 'performance',
                    'title': 'Power Curve',
                    'description': 'Power curve showing thrust available vs. thrust required',
                    'imageUrl': '/images/mark-berry/power_curve.jpg',
                    'keyPoints': [
                        'From Mark Berry CFI Notebook',
                        'Professional aviation instruction diagram'
                    ]
                })
                changes_made.append(f"Added power_curve.jpg to {lesson_id}")
        
        # LP-X-C: Add P_OFF_STALL.png if not present
        elif lesson_id == "LP-X-C":
            has_power_off_stall = any('P_OFF_STALL.png' in d.get('imageUrl', '') for d in diagrams)
            if not has_power_off_stall:
                diagrams_to_add.append({
                    'type': 'basic',
                    'title': 'Power-Off Stall',
                    'description': 'Power-off stall recovery procedure',
                    'imageUrl': '/images/mark-berry/P_OFF_STALL.png',
                    'keyPoints': [
                        'From Mark Berry CFI Notebook',
                        'Professional aviation instruction diagram'
                    ]
                })
                changes_made.append(f"Added P_OFF_STALL.png to {lesson_id}")
        
        # LP-X-D: Add P_ON_STALL.png if not present
        elif lesson_id == "LP-X-D":
            has_power_on_stall = any('P_ON_STALL.png' in d.get('imageUrl', '') for d in diagrams)
            if not has_power_on_stall:
                diagrams_to_add.append({
                    'type': 'basic',
                    'title': 'Power-On Stall',
                    'description': 'Power-on stall recovery procedure',
                    'imageUrl': '/images/mark-berry/P_ON_STALL.png',
                    'keyPoints': [
                        'From Mark Berry CFI Notebook',
                        'Professional aviation instruction diagram'
                    ]
                })
                changes_made.append(f"Added P_ON_STALL.png to {lesson_id}")
        
        # Apply changes
        if diagrams_to_remove or diagrams_to_add:
            # Remove diagrams
            for diagram in diagrams_to_remove:
                if diagram in diagrams:
                    diagrams.remove(diagram)
            
            # Add diagrams
            diagrams.extend(diagrams_to_add)
            lesson['diagrams'] = diagrams
    
    # Save updated lesson plans
    if changes_made:
        print("\n" + "=" * 70)
        print(f"Found {len(changes_made)} changes to make")
        print("\nChanges:")
        for change in changes_made:
            print(f"  - {change}")
        
        print("\nSaving updated lesson plans...")
        with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"[SUCCESS] Fixed {len(changes_made)} image assignment(s)")
    else:
        print("\nNo changes needed - all images are correctly assigned!")

if __name__ == '__main__':
    fix_image_assignments()

