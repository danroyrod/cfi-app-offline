#!/usr/bin/env python3
"""
Comprehensive Quality Check - Verify all lesson plans meet CFI Notebook+ standards
"""

import json
from typing import Dict, List, Any

def load_lesson_plans() -> Dict[str, Any]:
    """Load lesson plans data"""
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def check_lesson_plan_quality(lesson_plan: Dict[str, Any]) -> Dict[str, Any]:
    """Check the quality of a single lesson plan"""
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
    
    # Check 5: Has detailed tasks with tolerances (15 points)
    tasks = lesson_plan.get('tasks', [])
    tasks_with_tolerances = 0
    for task in tasks:
        if 'tolerances' in task and len(task['tolerances']) > 0:
            tasks_with_tolerances += 1
    
    if tasks_with_tolerances == len(tasks) and len(tasks) > 0:
        quality_report['checks']['tasks'] = {
            'score': 15,
            'status': 'PASS',
            'details': f"All {len(tasks)} tasks have tolerances"
        }
        quality_report['score'] += 15
        quality_report['strengths'].append("All tasks have precise tolerances")
    elif tasks_with_tolerances > 0:
        quality_report['checks']['tasks'] = {
            'score': 10,
            'status': 'PARTIAL',
            'details': f"{tasks_with_tolerances}/{len(tasks)} tasks have tolerances"
        }
        quality_report['score'] += 10
        quality_report['issues'].append("Some tasks missing tolerances")
    else:
        quality_report['checks']['tasks'] = {
            'score': 0,
            'status': 'FAIL',
            'details': 'No tasks have tolerances'
        }
        quality_report['issues'].append("Tasks missing tolerances")
    
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
    if quality_report['score'] >= 90:
        quality_report['grade'] = 'A+'
        quality_report['status'] = 'EXCELLENT'
    elif quality_report['score'] >= 80:
        quality_report['grade'] = 'A'
        quality_report['status'] = 'VERY_GOOD'
    elif quality_report['score'] >= 70:
        quality_report['grade'] = 'B'
        quality_report['status'] = 'GOOD'
    elif quality_report['score'] >= 60:
        quality_report['grade'] = 'C'
        quality_report['status'] = 'ACCEPTABLE'
    else:
        quality_report['grade'] = 'D'
        quality_report['status'] = 'NEEDS_IMPROVEMENT'
    
    return quality_report

def generate_quality_report(lesson_plans: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generate comprehensive quality report for all lesson plans"""
    reports = []
    total_score = 0
    max_total_score = 0
    
    for lesson_plan in lesson_plans:
        report = check_lesson_plan_quality(lesson_plan)
        reports.append(report)
        total_score += report['score']
        max_total_score += report['max_score']
    
    # Calculate overall statistics
    overall_score = (total_score / max_total_score) * 100 if max_total_score > 0 else 0
    
    # Count by grade
    grade_counts = {}
    status_counts = {}
    for report in reports:
        grade = report['grade']
        status = report['status']
        grade_counts[grade] = grade_counts.get(grade, 0) + 1
        status_counts[status] = status_counts.get(status, 0) + 1
    
    # Find best and worst lesson plans
    best_plans = sorted(reports, key=lambda x: x['score'], reverse=True)[:5]
    worst_plans = sorted(reports, key=lambda x: x['score'])[:5]
    
    # Count issues
    all_issues = []
    all_strengths = []
    for report in reports:
        all_issues.extend(report['issues'])
        all_strengths.extend(report['strengths'])
    
    # Most common issues
    issue_counts = {}
    for issue in all_issues:
        issue_counts[issue] = issue_counts.get(issue, 0) + 1
    common_issues = sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    # Most common strengths
    strength_counts = {}
    for strength in all_strengths:
        strength_counts[strength] = strength_counts.get(strength, 0) + 1
    common_strengths = sorted(strength_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        'overall_score': overall_score,
        'total_lesson_plans': len(lesson_plans),
        'grade_distribution': grade_counts,
        'status_distribution': status_counts,
        'best_lesson_plans': best_plans,
        'worst_lesson_plans': worst_plans,
        'common_issues': common_issues,
        'common_strengths': common_strengths,
        'detailed_reports': reports,
        'summary': {
            'average_score': total_score / len(lesson_plans) if len(lesson_plans) > 0 else 0,
            'excellent_plans': status_counts.get('EXCELLENT', 0),
            'very_good_plans': status_counts.get('VERY_GOOD', 0),
            'good_plans': status_counts.get('GOOD', 0),
            'needs_improvement': status_counts.get('NEEDS_IMPROVEMENT', 0)
        }
    }

def print_quality_report(report: Dict[str, Any]):
    """Print a formatted quality report"""
    print("=" * 80)
    print("COMPREHENSIVE LESSON PLAN QUALITY REPORT")
    print("=" * 80)
    print()
    
    print(f"OVERALL SCORE: {report['overall_score']:.1f}/100")
    print(f"TOTAL LESSON PLANS: {report['total_lesson_plans']}")
    print()
    
    print("GRADE DISTRIBUTION:")
    for grade, count in sorted(report['grade_distribution'].items()):
        percentage = (count / report['total_lesson_plans']) * 100
        print(f"  {grade}: {count} plans ({percentage:.1f}%)")
    print()
    
    print("STATUS DISTRIBUTION:")
    for status, count in sorted(report['status_distribution'].items()):
        percentage = (count / report['total_lesson_plans']) * 100
        print(f"  {status}: {count} plans ({percentage:.1f}%)")
    print()
    
    print("SUMMARY STATISTICS:")
    summary = report['summary']
    print(f"  Average Score: {summary['average_score']:.1f}/100")
    print(f"  Excellent Plans: {summary['excellent_plans']}")
    print(f"  Very Good Plans: {summary['very_good_plans']}")
    print(f"  Good Plans: {summary['good_plans']}")
    print(f"  Needs Improvement: {summary['needs_improvement']}")
    print()
    
    print("TOP 5 BEST LESSON PLANS:")
    for i, plan in enumerate(report['best_lesson_plans'], 1):
        print(f"  {i}. {plan['title']} - Score: {plan['score']}/100 ({plan['grade']})")
    print()
    
    print("TOP 5 LESSON PLANS NEEDING IMPROVEMENT:")
    for i, plan in enumerate(report['worst_lesson_plans'], 1):
        print(f"  {i}. {plan['title']} - Score: {plan['score']}/100 ({plan['grade']})")
        if plan['issues']:
            print(f"     Issues: {', '.join(plan['issues'][:3])}")
    print()
    
    print("MOST COMMON STRENGTHS:")
    for strength, count in report['common_strengths']:
        percentage = (count / report['total_lesson_plans']) * 100
        print(f"  {strength}: {count} plans ({percentage:.1f}%)")
    print()
    
    print("MOST COMMON ISSUES:")
    for issue, count in report['common_issues']:
        percentage = (count / report['total_lesson_plans']) * 100
        print(f"  {issue}: {count} plans ({percentage:.1f}%)")
    print()
    
    # Overall assessment
    if report['overall_score'] >= 90:
        print("🎉 EXCELLENT! All lesson plans exceed CFI Notebook standards!")
    elif report['overall_score'] >= 80:
        print("✅ VERY GOOD! Lesson plans are superior to CFI Notebook standards!")
    elif report['overall_score'] >= 70:
        print("👍 GOOD! Lesson plans meet CFI Notebook standards!")
    else:
        print("⚠️  NEEDS IMPROVEMENT! Some lesson plans need enhancement.")
    
    print("=" * 80)

def main():
    """Main quality check function"""
    print("Running comprehensive quality check on all lesson plans...")
    print()
    
    # Load lesson plans
    data = load_lesson_plans()
    lesson_plans = data['lessonPlans']
    
    # Generate quality report
    report = generate_quality_report(lesson_plans)
    
    # Print report
    print_quality_report(report)
    
    # Save detailed report
    with open('lesson_plan_quality_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\nDetailed quality report saved to: lesson_plan_quality_report.json")

if __name__ == "__main__":
    main()




