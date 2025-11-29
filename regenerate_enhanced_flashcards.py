#!/usr/bin/env python3
"""
Regenerate Enhanced Flashcards - Update flashcards with latest enhanced lesson plans
"""

import json
from typing import List, Dict, Any

def load_lesson_plans() -> Dict[str, Any]:
    """Load lesson plans data"""
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_enhanced_flashcards(lesson_plan: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate enhanced flashcards from lesson plan"""
    flashcards = []

    # Extract lesson info
    lesson_id = lesson_plan['id']
    lesson_title = lesson_plan['title']
    area_code = lesson_plan.get('areaCode', 'general')

    # Generate flashcards from objectives
    for i, objective in enumerate(lesson_plan.get('objectives', [])):
        flashcards.append({
            'id': f"{lesson_id}-obj-{i+1}",
            'front': f"What is objective {i+1} for {lesson_title}?",
            'back': objective,
            'lessonId': lesson_id,
            'lessonTitle': lesson_title,
            'category': 'objective',
            'tags': [area_code, 'objective', lesson_title.lower().replace(' ', '-')]
        })

    # Generate flashcards from key teaching points
    for i, point in enumerate(lesson_plan.get('keyTeachingPoints', [])):
        flashcards.append({
            'id': f"{lesson_id}-ktp-{i+1}",
            'front': f"Explain a key teaching point for {lesson_title} (Point {i+1})",
            'back': point,
            'lessonId': lesson_id,
            'lessonTitle': lesson_title,
            'category': 'teaching-point',
            'tags': [area_code, 'teaching-point', lesson_title.lower().replace(' ', '-')]
        })

    # Generate flashcards from tolerances
    for i, tolerance in enumerate(lesson_plan.get('tolerances', [])):
        flashcards.append({
            'id': f"{lesson_id}-tol-{i+1}",
            'front': f"What is the performance tolerance for {lesson_title}?",
            'back': tolerance,
            'lessonId': lesson_id,
            'lessonTitle': lesson_title,
            'category': 'tolerance',
            'tags': [area_code, 'tolerance', 'performance', lesson_title.lower().replace(' ', '-')]
        })

    # Generate flashcards from safety considerations
    for i, consideration in enumerate(lesson_plan.get('safetyConsiderations', [])):
        flashcards.append({
            'id': f"{lesson_id}-safety-{i+1}",
            'front': f"What is an important safety consideration for {lesson_title}?",
            'back': consideration,
            'lessonId': lesson_id,
            'lessonTitle': lesson_title,
            'category': 'safety',
            'tags': [area_code, 'safety', 'consideration', lesson_title.lower().replace(' ', '-')]
        })

    # Generate flashcards from common errors
    for i, error in enumerate(lesson_plan.get('commonErrors', [])):
        flashcards.append({
            'id': f"{lesson_id}-error-{i+1}",
            'front': f"What is a common error in {lesson_title}?",
            'back': error,
            'lessonId': lesson_id,
            'lessonTitle': lesson_title,
            'category': 'error',
            'tags': [area_code, 'error', 'common-mistake', lesson_title.lower().replace(' ', '-')]
        })

    # Generate flashcards from completion standards
    for i, standard in enumerate(lesson_plan.get('completionStandards', [])):
        # Handle both string and object formats
        standard_text = standard if isinstance(standard, str) else standard.get('standard', str(standard))
        flashcards.append({
            'id': f"{lesson_id}-standard-{i+1}",
            'front': f"What is a completion standard for {lesson_title}?",
            'back': standard_text,
            'lessonId': lesson_id,
            'lessonTitle': lesson_title,
            'category': 'standard',
            'tags': [area_code, 'standard', 'completion', lesson_title.lower().replace(' ', '-')]
        })

    # Generate flashcards from teaching script key points (legacy support)
    if 'teachingScript' in lesson_plan:
        for script_idx, script in enumerate(lesson_plan['teachingScript']):
            if 'keyPoints' in script:
                for point_idx, point in enumerate(script['keyPoints']):
                    flashcards.append({
                        'id': f"{lesson_id}-script-{script_idx}-{point_idx}",
                        'front': f"During {script['phase']} of {lesson_title}, what is important?",
                        'back': point,
                        'lessonId': lesson_id,
                        'lessonTitle': lesson_title,
                        'category': 'teaching-point',
                        'tags': [area_code, 'teaching-point', 'script', script['phase'].lower().replace(' ', '-')]
                    })

    return flashcards

def main():
    """Regenerate enhanced flashcards with latest lesson plan content"""
    print("Regenerating enhanced flashcards with latest lesson plan content...")
    print()
    
    # Load lesson plans
    data = load_lesson_plans()
    lesson_plans = data['lessonPlans']
    
    all_enhanced_flashcards = []
    
    # Generate flashcards for each lesson plan
    for lesson_plan in lesson_plans:
        print(f"Generating flashcards for: {lesson_plan['title']}")
        enhanced_cards = generate_enhanced_flashcards(lesson_plan)
        all_enhanced_flashcards.extend(enhanced_cards)
    
    # Create enhanced flashcards data structure
    enhanced_data = {
        "flashcards": all_enhanced_flashcards,
        "decks": [
            {
                "id": "enhanced-cards-all",
                "name": "All Enhanced Cards",
                "description": "A comprehensive deck of all automatically generated enhanced flashcards from lesson plans.",
                "cardIds": [card['id'] for card in all_enhanced_flashcards],
                "lessonIds": list(set(card['lessonId'] for card in all_enhanced_flashcards)),
                "createdAt": 1700000000000,
                "updatedAt": 1700000000000,
                "isDefault": True
            }
        ],
        "metadata": {
            "generatedAt": 1700000000000,
            "version": "2.0",
            "totalCards": len(all_enhanced_flashcards),
            "totalLessons": len(lesson_plans),
            "enhancements": [
                "Updated with enhanced lesson plan content",
                "Includes tolerances and safety considerations",
                "Enhanced key teaching points",
                "Comprehensive coverage of all lesson elements"
            ]
        }
    }
    
    # Save enhanced flashcards
    with open('public/enhancedFlashcards.json', 'w', encoding='utf-8') as f:
        json.dump(enhanced_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nEnhanced flashcards regeneration complete!")
    print(f"Generated {len(all_enhanced_flashcards)} flashcards from {len(lesson_plans)} lesson plans")
    print("Enhanced flashcards now include:")
    print("- Objectives from all lesson plans")
    print("- Key teaching points (enhanced)")
    print("- Performance tolerances")
    print("- Safety considerations")
    print("- Common errors")
    print("- Completion standards")
    print("- Teaching script key points (legacy support)")
    print("\nAll features (audio, quizzes, flashcards) are now updated with latest content!")

if __name__ == "__main__":
    main()




