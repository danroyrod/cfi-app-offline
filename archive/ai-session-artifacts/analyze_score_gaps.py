#!/usr/bin/env python3
"""
Analyze what's preventing 100/100 score
"""

import json
from typing import Dict, List, Any

def load_lesson_plans() -> Dict[str, Any]:
    """Load lesson plans data"""
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def analyze_score_gaps(lesson_plan: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze what's preventing perfect score"""
    analysis = {
        'id': lesson_plan['id'],
        'title': lesson_plan['title'],
        'missing_points': [],
        'current_score': 0,
        'max_score': 100
    }
    
    # Check each scoring category
    score = 0
    
    # Diagrams (20 points)
    if 'diagrams' in lesson_plan and len(lesson_plan['diagrams']) > 0:
        score += 20
    else:
        analysis['missing_points'].append("Missing diagrams (-20 points)")
    
    # Interactive elements (15 points)
    if 'interactiveElements' in lesson_plan and len(lesson_plan['interactiveElements']) > 0:
        score += 15
    else:
        analysis['missing_points'].append("Missing interactive elements (-15 points)")
    
    # Safety considerations (15 points)
    if 'safetyConsiderations' in lesson_plan and len(lesson_plan['safetyConsiderations']) > 0:
        score += 15
    else:
        analysis['missing_points'].append("Missing safety considerations (-15 points)")
    
    # Teaching points (10 points)
    teaching_points = lesson_plan.get('keyTeachingPoints', [])
    if len(teaching_points) >= 5:
        score += 10
    else:
        missing = 10 - (len(teaching_points) * 2)
        analysis['missing_points'].append(f"Only {len(teaching_points)} teaching points (-{missing} points)")
    
    # Tasks with tolerances (15 points)
    tasks = lesson_plan.get('tasks', [])
    tasks_with_tolerances = 0
    for task in tasks:
        if 'tolerances' in task and len(task['tolerances']) > 0:
            tasks_with_tolerances += 1
    
    if tasks_with_tolerances == len(tasks) and len(tasks) > 0:
        score += 15
    else:
        missing = 15 - (tasks_with_tolerances * 15 // max(len(tasks), 1))
        analysis['missing_points'].append(f"Only {tasks_with_tolerances}/{len(tasks)} tasks have tolerances (-{missing} points)")
    
    # Completion standards (10 points)
    completion_standards = lesson_plan.get('completionStandards', [])
    if len(completion_standards) >= 3:
        score += 10
    else:
        missing = 10 - (len(completion_standards) * 3)
        analysis['missing_points'].append(f"Only {len(completion_standards)} completion standards (-{missing} points)")
    
    # Common errors (10 points)
    common_errors = lesson_plan.get('commonErrors', [])
    if len(common_errors) >= 3:
        score += 10
    else:
        missing = 10 - (len(common_errors) * 3)
        analysis['missing_points'].append(f"Only {len(common_errors)} common errors (-{missing} points)")
    
    # Objectives (5 points)
    objectives = lesson_plan.get('objectives', [])
    if len(objectives) >= 3:
        score += 5
    else:
        missing = 5 - (len(objectives) * 2)
        analysis['missing_points'].append(f"Only {len(objectives)} objectives (-{missing} points)")
    
    analysis['current_score'] = score
    analysis['missing_score'] = 100 - score
    
    return analysis

def main():
    """Analyze score gaps"""
    print("Analyzing what's preventing 100/100 scores...")
    print()
    
    # Load lesson plans
    data = load_lesson_plans()
    lesson_plans = data['lessonPlans']
    
    # Analyze each lesson plan
    analyses = []
    for lesson_plan in lesson_plans:
        analysis = analyze_score_gaps(lesson_plan)
        analyses.append(analysis)
    
    # Find the most common issues
    issue_counts = {}
    for analysis in analyses:
        for issue in analysis['missing_points']:
            issue_counts[issue] = issue_counts.get(issue, 0) + 1
    
    print("MOST COMMON ISSUES PREVENTING 100/100:")
    for issue, count in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / len(lesson_plans)) * 100
        print(f"  {issue}: {count} plans ({percentage:.1f}%)")
    print()
    
    # Show examples of plans with issues
    plans_with_issues = [a for a in analyses if a['missing_score'] > 0]
    plans_with_issues.sort(key=lambda x: x['missing_score'], reverse=True)
    
    print("TOP 5 PLANS WITH MISSING POINTS:")
    for i, plan in enumerate(plans_with_issues[:5], 1):
        print(f"  {i}. {plan['title']}")
        print(f"     Score: {plan['current_score']}/100 (Missing: {plan['missing_score']} points)")
        print(f"     Issues: {', '.join(plan['missing_points'][:3])}")
        print()
    
    # Calculate what needs to be added for 100/100
    total_missing_points = sum(a['missing_score'] for a in analyses)
    avg_missing = total_missing_points / len(lesson_plans)
    
    print(f"AVERAGE MISSING POINTS PER PLAN: {avg_missing:.1f}")
    print(f"TOTAL MISSING POINTS ACROSS ALL PLANS: {total_missing_points}")
    print()
    
    print("TO ACHIEVE 100/100, WE NEED TO ADD:")
    print("1. More teaching points (aim for 5+ per plan)")
    print("2. Tolerances for all tasks")
    print("3. More completion standards (aim for 3+ per plan)")
    print("4. More common errors (aim for 3+ per plan)")
    print("5. More objectives (aim for 3+ per plan)")

if __name__ == "__main__":
    main()




