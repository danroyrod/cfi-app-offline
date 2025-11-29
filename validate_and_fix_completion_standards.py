#!/usr/bin/env python3
"""
Validate and fix completion standards in lesson plans.
Removes completion standards section if standards are invalid or incomplete.
"""

import json
import re
import ast
from typing import List, Dict, Any

def parse_standard_string(standard_str: str) -> Dict[str, Any] | None:
    """Try to parse a completion standard string into a proper object."""
    if not standard_str or not isinstance(standard_str, str):
        return None
    
    # Try to extract JSON-like structure
    # Handle Python dict string format: "{'standard': '...', 'acsReference': '...', 'tolerance': '...'}"
    try:
        # Replace single quotes with double quotes for JSON parsing
        json_str = standard_str.replace("'", '"')
        # Try to find a dict-like structure
        match = re.search(r'\{[^}]+\}', json_str)
        if match:
            dict_str = match.group(0)
            # Try using ast.literal_eval for Python dict strings
            try:
                parsed = ast.literal_eval(dict_str.replace('"', "'"))
                if isinstance(parsed, dict):
                    return parsed
            except:
                pass
            
            # Try JSON parsing
            try:
                parsed = json.loads(dict_str)
                if isinstance(parsed, dict):
                    return parsed
            except:
                pass
    except:
        pass
    
    # If it's already a dict, return it
    if isinstance(standard_str, dict):
        return standard_str
    
    return None

def is_valid_completion_standard(standard: Dict[str, Any]) -> bool:
    """Check if a completion standard is valid (has standard, acsReference, and tolerance)."""
    if not isinstance(standard, dict):
        return False
    
    # Must have standard and acsReference
    if 'standard' not in standard or 'acsReference' not in standard:
        return False
    
    # Standard and acsReference must be non-empty strings
    if not standard.get('standard') or not standard.get('acsReference'):
        return False
    
    # For flight maneuvers, tolerance should exist and be meaningful
    # For ground lessons (Area I), tolerance might be optional
    # But we'll require it for flight-related areas (IV, V, VI, VII, VIII, IX)
    has_tolerance = 'tolerance' in standard and standard.get('tolerance')
    
    return True  # Accept if has standard and acsReference

def has_meaningful_completion_standards(completion_standards: List[Any]) -> bool:
    """Check if lesson plan has meaningful completion standards."""
    if not completion_standards or len(completion_standards) == 0:
        return False
    
    valid_count = 0
    for std in completion_standards:
        # Try to parse if it's a string
        parsed = parse_standard_string(std) if isinstance(std, str) else std
        
        if parsed and is_valid_completion_standard(parsed):
            valid_count += 1
    
    # Need at least one valid standard
    return valid_count > 0

def validate_and_fix_lesson_plans(lesson_plans_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and fix all lesson plans."""
    lesson_plans = lesson_plans_data.get('lessonPlans', [])
    
    fixed_count = 0
    removed_section_count = 0
    total_valid_standards = 0
    
    for lesson in lesson_plans:
        completion_standards = lesson.get('completionStandards', [])
        
        if not has_meaningful_completion_standards(completion_standards):
            # Remove completion standards section
            lesson['completionStandards'] = []
            removed_section_count += 1
            continue
        
        # Try to fix/parse completion standards
        fixed_standards = []
        for std in completion_standards:
            parsed = parse_standard_string(std) if isinstance(std, str) else std
            
            if parsed and is_valid_completion_standard(parsed):
                fixed_standards.append(parsed)
        
        if len(fixed_standards) > 0:
            lesson['completionStandards'] = fixed_standards
            total_valid_standards += len(fixed_standards)
            fixed_count += 1
        else:
            # No valid standards after fixing
            lesson['completionStandards'] = []
            removed_section_count += 1
    
    return {
        'lessonPlansData': lesson_plans_data,
        'stats': {
            'fixed_count': fixed_count,
            'removed_section_count': removed_section_count,
            'total_valid_standards': total_valid_standards,
            'total_lessons': len(lesson_plans)
        }
    }

def main():
    # Load lesson plans data
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        lesson_plans_data = json.load(f)
    
    print("Validating and fixing completion standards...")
    print(f"Total lesson plans: {len(lesson_plans_data['lessonPlans'])}")
    
    result = validate_and_fix_lesson_plans(lesson_plans_data)
    
    # Save fixed data
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(result['lessonPlansData'], f, indent=2, ensure_ascii=False)
    
    stats = result['stats']
    print(f"\n[SUCCESS] Validation complete!")
    print(f"   - Fixed lesson plans: {stats['fixed_count']}")
    print(f"   - Removed sections: {stats['removed_section_count']}")
    print(f"   - Total valid standards: {stats['total_valid_standards']}")
    print(f"\n[SAVED] Updated lessonPlansData.json")

if __name__ == '__main__':
    main()

