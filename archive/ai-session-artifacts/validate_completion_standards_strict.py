#!/usr/bin/env python3
"""
Strictly validate completion standards - must have tolerances for flight maneuvers.
Remove section if standards are invalid or incomplete.
"""

import json
import re
import ast
from typing import List, Dict, Any

# Flight-related areas that require tolerances
FLIGHT_AREAS = ['IV', 'V', 'VI', 'VII', 'VIII', 'IX']

def parse_standard_string(standard_str: str) -> Dict[str, Any] | None:
    """Try to parse a completion standard string into a proper object."""
    if not standard_str or not isinstance(standard_str, str):
        return None
    
    # If it's already a dict, return it
    if isinstance(standard_str, dict):
        return standard_str
    
    # Try to extract dict-like structure
    try:
        # Handle Python dict string format
        match = re.search(r'\{[^}]+\}', standard_str)
        if match:
            dict_str = match.group(0)
            # Try using ast.literal_eval
            try:
                parsed = ast.literal_eval(dict_str)
                if isinstance(parsed, dict):
                    return parsed
            except:
                pass
    except:
        pass
    
    return None

def has_tolerance_info(text: str) -> bool:
    """Check if text contains tolerance information."""
    if not text:
        return False
    
    # Look for tolerance patterns: ±, +/-, numbers with units
    tolerance_patterns = [
        r'[±+\-]?\d+\s*(?:knots?|kts|feet|ft|degrees?|°|mph|m/s)',
        r'±\d+',
        r'within\s+(?:specified\s+)?tolerances?',
        r'tolerance',
        r'±',
    ]
    
    text_lower = text.lower()
    for pattern in tolerance_patterns:
        if re.search(pattern, text_lower, re.IGNORECASE):
            return True
    
    return False

def is_valid_completion_standard(standard: Dict[str, Any], area_number: str) -> bool:
    """Check if a completion standard is valid."""
    if not isinstance(standard, dict):
        return False
    
    # Must have standard and acsReference
    if 'standard' not in standard or 'acsReference' not in standard:
        return False
    
    standard_text = standard.get('standard', '')
    acs_ref = standard.get('acsReference', '')
    tolerance_text = standard.get('tolerance', '')
    
    # Must have non-empty standard and acsReference
    if not standard_text or not acs_ref:
        return False
    
    # For flight areas, require tolerance
    if area_number in FLIGHT_AREAS:
        # Check if tolerance is provided or if it's in the standard text
        if not tolerance_text and not has_tolerance_info(standard_text):
            return False
    
    return True

def validate_lesson_plan(lesson: Dict[str, Any]) -> tuple[List[Dict[str, Any]], bool]:
    """Validate and fix completion standards for a lesson plan."""
    completion_standards = lesson.get('completionStandards', [])
    area_number = lesson.get('areaNumber', '')
    
    if not completion_standards or len(completion_standards) == 0:
        return ([], False)
    
    valid_standards = []
    for std in completion_standards:
        # Parse if needed
        parsed = parse_standard_string(std) if isinstance(std, str) else std
        
        if parsed and is_valid_completion_standard(parsed, area_number):
            valid_standards.append(parsed)
    
    # Need at least one valid standard to show the section
    return (valid_standards, len(valid_standards) > 0)

def main():
    # Load lesson plans data
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        lesson_plans_data = json.load(f)
    
    lesson_plans = lesson_plans_data.get('lessonPlans', [])
    
    print("Strictly validating completion standards...")
    print(f"Total lesson plans: {len(lesson_plans)}")
    
    fixed_count = 0
    removed_count = 0
    total_valid_standards = 0
    
    for lesson in lesson_plans:
        valid_standards, has_valid = validate_lesson_plan(lesson)
        
        if has_valid:
            lesson['completionStandards'] = valid_standards
            total_valid_standards += len(valid_standards)
            fixed_count += 1
        else:
            lesson['completionStandards'] = []
            removed_count += 1
    
    # Save fixed data
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(lesson_plans_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n[SUCCESS] Validation complete!")
    print(f"   - Lesson plans with valid standards: {fixed_count}")
    print(f"   - Lesson plans with section removed: {removed_count}")
    print(f"   - Total valid standards: {total_valid_standards}")
    print(f"\n[SAVED] Updated lessonPlansData.json")

if __name__ == '__main__':
    main()

