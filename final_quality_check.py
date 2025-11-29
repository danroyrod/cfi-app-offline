#!/usr/bin/env python3
"""
Final Quality Check - Check for 100/100 scores with correct structure
"""

import json
from typing import Dict, List, Any

def load_lesson_plans() -> Dict[str, Any]:
    """Load lesson plans data"""
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def check_lesson_plan_quality(lesson_plan: Dict[str, Any]) -> Dict[str, Any]:
    """Check the quality of a single lesson plan with correct structure"""
    quality_report = {
        'id': lesson_plan['id'],
        'title': lesson_plan['title'],
        'score': 0,
        'max_score': 100,
        'checks': {},
        'issues': [],
        'strengths': []
    }
    
    # Check 1: Has enhanced diagrams (20 points)
    if 'diagrams' in lesson_plan and len(lesson_plan['diagrams']) > 0:
        quality_report['checks']['diagrams'] = {
            'score': 20,
            'status': 'PASS',
            'details': f"Has {len(lesson_plan['diagrams'])} professional diagrams"
        }
        quality_report['score'] += 20
        quality_report['strengths'].append("Professional SVG diagrams with interactive elements")
    else:
        quality_report['checks']['diagrams'] = {
            'score': 0,
            'status': 'FAIL',
            'details': 'Missing enhanced diagrams'
        }
        quality_report['issues'].append("Missing professional diagrams")
    
    # Check 2: Has interactive elements (15 points)
    if 'interactiveElements' in lesson_plan and len(lesson_plan['interactiveElements']) > 0:
        quality_report['checks']['interactive'] = {
            'score': 15,
            'status': 'PASS',
            'details': f"Has {len(lesson_plan['interactiveElements'])} interactive elements"
        }
        quality_report['score'] += 15
        quality_report['strengths'].append("Interactive checklists and scenarios")
    else:
        quality_report['checks']['interactive'] = {
            'score': 0,
            'status': 'FAIL',
            'details': 'Missing interactive elements'
        }
        quality_report['issues'].append("Missing interactive elements")
    
    # Check 3: Has safety considerations (15 points)
    if 'safetyConsiderations' in lesson_plan and len(lesson_plan['safetyConsiderations']) > 0:
        quality_report['checks']['safety'] = {
            'score': 15,
            'status': 'PASS',
            'details': f"Has {len(lesson_plan['safetyConsiderations'])} safety considerations"
        }
        quality_report['score'] += 15
        quality_report['strengths'].append("Comprehensive safety considerations")
    else:
        quality_report['checks']['safety'] = {
            'score': 0,
            'status': 'FAIL',
            'details': 'Missing safety considerations'
        }
        quality_report['issues'].append("Missing safety considerations")
    
    # Check 4: Has enhanced teaching points (10 points)
    teaching_points = lesson_plan.get('keyTeachingPoints', [])
    if len(teaching_points) >= 5:
        quality_report['checks']['teaching_points'] = {
            'score': 10,
            'status': 'PASS',
            'details': f"Has {len(teaching_points)} teaching points"
        }
        quality_report['score'] += 10
        quality_report['strengths'].append("Comprehensive teaching points")
    else:
        quality_report['checks']['teaching_points'] = {
            'score': 5,
            'status': 'PARTIAL',
            'details': f"Only has {len(teaching_points)} teaching points"
        }
        quality_report['score'] += 5
        quality_report['issues'].append("Could use more teaching points")
    
    # Check 5: Has teaching script with tolerances (15 points)
    # Look for tolerances in teachingScript phases or in the lesson plan itself
    teaching_script = lesson_plan.get('teachingScript', [])
    has_tolerances = False
    
    # Check if lesson plan has tolerances field
    if 'tolerances' in lesson_plan and len(lesson_plan['tolerances']) > 0:
        has_tolerances = True
    
    # Check if any teaching script phase has tolerances
    for phase in teaching_script:
        if 'tolerances' in phase and len(phase['tolerances']) > 0:
            has_tolerances = True
            break
    
    if has_tolerances:
        quality_report['checks']['tolerances'] = {
            'score': 15,
            'status': 'PASS',
            'details': 'Has tolerances specified'
        }
        quality_report['score'] += 15
        quality_report['strengths'].append("Precise tolerances specified")
    else:
        quality_report['checks']['tolerances'] = {
            'score': 0,
            'status': 'FAIL',
            'details': 'Missing tolerances'
        }
        quality_report['issues'].append("Missing tolerances")
    
    # Check 6: Has completion standards (10 points)
    completion_standards = lesson_plan.get('completionStandards', [])
    if len(completion_standards) >= 3:
        quality_report['checks']['completion_standards'] = {
            'score': 10,
            'status': 'PASS',
            'details': f"Has {len(completion_standards)} completion standards"
        }
        quality_report['score'] += 10
        quality_report['strengths'].append("Clear completion standards")
    else:
        quality_report['checks']['completion_standards'] = {
            'score': 5,
            'status': 'PARTIAL',
            'details': f"Only has {len(completion_standards)} completion standards"
        }
        quality_report['score'] += 5
        quality_report['issues'].append("Could use more completion standards")
    
    # Check 7: Has common errors (10 points)
    common_errors = lesson_plan.get('commonErrors', [])
    if len(common_errors) >= 3:
        quality_report['checks']['common_errors'] = {
            'score': 10,
            'status': 'PASS',
            'details': f"Has {len(common_errors)} common errors"
        }
        quality_report['score'] += 10
        quality_report['strengths'].append("Comprehensive common errors")
    else:
        quality_report['checks']['common_errors'] = {
            'score': 5,
            'status': 'PARTIAL',
            'details': f"Only has {len(common_errors)} common errors"
        }
        quality_report['score'] += 5
        quality_report['issues'].append("Could use more common errors")
    
    # Check 8: Has objectives (5 points)
    objectives = lesson_plan.get('objectives', [])
    if len(objectives) >= 3:
        quality_report['checks']['objectives'] = {
            'score': 5,
            'status': 'PASS',
            'details': f"Has {len(objectives)} objectives"
        }
        quality_report['score'] += 5
        quality_report['strengths'].append("Clear learning objectives")
    else:
        quality_report['checks']['objectives'] = {
            'score': 2,
            'status': 'PARTIAL',
            'details': f"Only has {len(objectives)} objectives"
        }
        quality_report['score'] += 2
        quality_report['issues'].append("Could use more objectives")
    
    # Determine overall grade
    if quality_report['score'] >= 95:
        quality_report['grade'] = 'A+'
        quality_report['status'] = 'EXCELLENT'
    elif quality_report['score'] >= 90:
        quality_report['grade'] = 'A'
        quality_report['status'] = 'VERY_GOOD'
    elif quality_report['score'] >= 80:
        quality_report['grade'] = 'B'
        quality_report['status'] = 'GOOD'
    elif quality_report['score'] >= 70:
        quality_report['grade'] = 'C'
        quality_report['status'] = 'ACCEPTABLE'
    else:
        quality_report['grade'] = 'D'
        quality_report['status'] = 'NEEDS_IMPROVEMENT'
    
    return quality_report

def main():
    """Run final quality check"""
    print("Running final quality check with correct structure...")
    print()
    
    # Load lesson plans
    data = load_lesson_plans()
    lesson_plans = data['lessonPlans']
    
    # Check first few lesson plans
    total_score = 0
    max_score = 0
    
    print("CHECKING FIRST 5 LESSON PLANS:")
    for i, lesson_plan in enumerate(lesson_plans[:5]):
        report = check_lesson_plan_quality(lesson_plan)
        total_score += report['score']
        max_score += report['max_score']
        
        print(f"{i+1}. {lesson_plan['title']}")
        print(f"   Score: {report['score']}/100 ({report['grade']})")
        if report['issues']:
            print(f"   Issues: {', '.join(report['issues'])}")
        else:
            print("   Issues: None!")
        print()
    
    # Calculate overall score
    overall_score = (total_score / max_score) * 100 if max_score > 0 else 0
    
    print(f"OVERALL SCORE (first 5 plans): {overall_score:.1f}/100")
    
    if overall_score >= 95:
        print("EXCELLENT! Lesson plans are achieving near-perfect scores!")
    elif overall_score >= 90:
        print("VERY GOOD! Lesson plans are superior to CFI Notebook standards!")
    elif overall_score >= 80:
        print("GOOD! Lesson plans meet CFI Notebook standards!")
    else:
        print("NEEDS IMPROVEMENT! Some lesson plans need enhancement.")

if __name__ == "__main__":
    main()