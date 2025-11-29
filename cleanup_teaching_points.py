#!/usr/bin/env python3
"""
Key Teaching Points Duplicate Cleanup Script
Removes duplicate teaching points from lesson plans
"""

import json
import re

def clean_teaching_points(lesson_plan):
    """Clean duplicate teaching points from a lesson plan"""
    if 'keyTeachingPoints' not in lesson_plan:
        return lesson_plan
    
    teaching_points = lesson_plan['keyTeachingPoints']
    
    # Remove duplicates while preserving order
    seen = set()
    cleaned_points = []
    
    for point in teaching_points:
        # Skip generic duplicate statements
        if point in seen:
            continue
            
        # Skip generic statements that don't add value
        generic_patterns = [
            r"Master this skill through deliberate practice",
            r"Professional instructional technique essential for",
            r"Systematic instruction leads to student success with",
            r"Elite proficiency in.*requires deliberate, focused practice",
            r"Teaching while flying develops CFI-level mastery",
            r"Error recognition shows deep understanding",
            r"Divided attention skill essential for checkride"
        ]
        
        is_generic = any(re.search(pattern, point, re.IGNORECASE) for pattern in generic_patterns)
        
        if not is_generic:
            cleaned_points.append(point)
            seen.add(point)
    
    # Ensure we have at least 5 points but not more than 8
    if len(cleaned_points) < 5:
        # Keep some generic ones if we don't have enough specific ones
        for point in teaching_points:
            if point not in seen and len(cleaned_points) < 8:
                cleaned_points.append(point)
                seen.add(point)
    elif len(cleaned_points) > 8:
        # Keep only the first 8 most specific points
        cleaned_points = cleaned_points[:8]
    
    lesson_plan['keyTeachingPoints'] = cleaned_points
    return lesson_plan

def main():
    """Main cleanup function"""
    print("Starting Key Teaching Points Cleanup...")
    
    # Read the lesson plans data
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Clean each lesson plan
    cleaned_count = 0
    total_lessons = len(data['lessonPlans'])
    
    for lesson_plan in data['lessonPlans']:
        original_count = len(lesson_plan.get('keyTeachingPoints', []))
        cleaned_lesson = clean_teaching_points(lesson_plan)
        new_count = len(cleaned_lesson['keyTeachingPoints'])
        
        if original_count != new_count:
            cleaned_count += 1
            print(f"Cleaned {lesson_plan['title']}: {original_count} -> {new_count} points")
    
    # Write back the cleaned data
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\nCleanup Complete!")
    print(f"Cleaned {cleaned_count} out of {total_lessons} lesson plans")
    print(f"Updated lessonPlansData.json")

if __name__ == "__main__":
    main()
