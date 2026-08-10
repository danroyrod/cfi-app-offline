#!/usr/bin/env python3
"""
Enhance Flashcards - Improve content, visual presentation, and overall quality
"""

import json
import re
from typing import Dict, List, Any

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
            'front': f"What is objective {i+1} for {lesson_title}?",
            'back': objective,
            'category': 'objective',
            'tags': [area_code.lower(), 'objectives', lesson_plan['title'].lower().replace(' ', '-')],
            'difficulty': 'medium',
            'lessonId': lesson_id,
            'lessonTitle': lesson_title
        })
    
    # Generate flashcards from key teaching points
    for i, point in enumerate(lesson_plan.get('keyTeachingPoints', [])):
        # Create question-answer pairs
        if ':' in point:
            parts = point.split(':', 1)
            question = parts[0].strip()
            answer = parts[1].strip()
        else:
            question = f"What is a key teaching point for {lesson_title}?"
            answer = point
        
        flashcards.append({
            'front': question,
            'back': answer,
            'category': 'teaching-point',
            'tags': [area_code.lower(), 'teaching-points', lesson_plan['title'].lower().replace(' ', '-')],
            'difficulty': 'medium',
            'lessonId': lesson_id,
            'lessonTitle': lesson_title
        })
    
    # Generate flashcards from completion standards
    for task in lesson_plan.get('tasks', []):
        if 'completionStandards' in task:
            for standard in task['completionStandards']:
                flashcards.append({
                    'front': f"What is the completion standard for {task['name']}?",
                    'back': standard,
                    'category': 'standard',
                    'tags': [area_code.lower(), 'standards', task['name'].lower().replace(' ', '-')],
                    'difficulty': 'hard',
                    'lessonId': lesson_id,
                    'lessonTitle': lesson_title
                })
    
    # Generate flashcards from common errors
    for task in lesson_plan.get('tasks', []):
        if 'commonErrors' in task:
            for error in task['commonErrors']:
                flashcards.append({
                    'front': f"What is a common error in {task['name']}?",
                    'back': error,
                    'category': 'error',
                    'tags': [area_code.lower(), 'errors', task['name'].lower().replace(' ', '-')],
                    'difficulty': 'hard',
                    'lessonId': lesson_id,
                    'lessonTitle': lesson_title
                })
    
    # Generate flashcards from tolerances
    for task in lesson_plan.get('tasks', []):
        if 'tolerances' in task:
            for tolerance in task['tolerances']:
                flashcards.append({
                    'front': f"What are the tolerances for {task['name']}?",
                    'back': tolerance,
                    'category': 'standard',
                    'tags': [area_code.lower(), 'tolerances', task['name'].lower().replace(' ', '-')],
                    'difficulty': 'hard',
                    'lessonId': lesson_id,
                    'lessonTitle': lesson_title
                })
    
    # Generate flashcards from procedures
    for task in lesson_plan.get('tasks', []):
        if 'procedures' in task:
            for i, procedure in enumerate(task['procedures'][:3]):  # Limit to first 3 procedures
                flashcards.append({
                    'front': f"What is step {i+1} in the {task['name']} procedure?",
                    'back': procedure,
                    'category': 'teaching-point',
                    'tags': [area_code.lower(), 'procedures', task['name'].lower().replace(' ', '-')],
                    'difficulty': 'medium',
                    'lessonId': lesson_id,
                    'lessonTitle': lesson_title
                })
    
    return flashcards

def enhance_flashcard_content(flashcards: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Enhance flashcard content with better formatting and additional context"""
    enhanced = []
    
    for card in flashcards:
        enhanced_card = card.copy()
        
        # Enhance front (question)
        front = card['front']
        if not front.endswith('?'):
            front += '?'
        
        # Add context to questions
        if card['category'] == 'objective':
            front = f"🎯 {front}"
        elif card['category'] == 'teaching-point':
            front = f"📝 {front}"
        elif card['category'] == 'error':
            front = f"⚠️ {front}"
        elif card['category'] == 'standard':
            front = f"✅ {front}"
        
        enhanced_card['front'] = front
        
        # Enhance back (answer) with better formatting
        back = card['back']
        
        # Add bullet points for lists
        if '\n' in back or '•' in back:
            lines = back.split('\n')
            formatted_lines = []
            for line in lines:
                line = line.strip()
                if line and not line.startswith('•'):
                    formatted_lines.append(f"• {line}")
                elif line:
                    formatted_lines.append(line)
            back = '\n'.join(formatted_lines)
        
        # Add emphasis to key terms
        key_terms = ['altitude', 'airspeed', 'bank', 'heading', 'power', 'attitude', 'tolerance', 'standard']
        for term in key_terms:
            if term in back.lower():
                back = re.sub(f'\\b{term}\\b', f'**{term}**', back, flags=re.IGNORECASE)
        
        enhanced_card['back'] = back
        
        # Add difficulty hints
        if card['category'] == 'standard' or card['category'] == 'error':
            enhanced_card['difficulty'] = 'hard'
        elif card['category'] == 'objective':
            enhanced_card['difficulty'] = 'easy'
        else:
            enhanced_card['difficulty'] = 'medium'
        
        enhanced.append(enhanced_card)
    
    return enhanced

def create_flashcard_decks(flashcards: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Create organized flashcard decks"""
    decks = []
    
    # Group by area
    areas = {}
    for card in flashcards:
        area = card['tags'][0] if card['tags'] else 'general'
        if area not in areas:
            areas[area] = []
        areas[area].append(card)
    
    # Create decks for each area
    for area, cards in areas.items():
        deck = {
            'id': f'deck-{area}',
            'name': f'{area.upper()} Flashcards',
            'description': f'Comprehensive flashcards for {area.upper()} area',
            'cardIds': [card['id'] for card in cards],
            'lessonIds': list(set(card['lessonId'] for card in cards)),
            'createdAt': 1700000000000,  # Timestamp
            'updatedAt': 1700000000000,
            'isDefault': True,
            'cardCount': len(cards),
            'difficulty': 'mixed'
        }
        decks.append(deck)
    
    # Create difficulty-based decks
    difficulty_decks = {
        'easy': [card for card in flashcards if card['difficulty'] == 'easy'],
        'medium': [card for card in flashcards if card['difficulty'] == 'medium'],
        'hard': [card for card in flashcards if card['difficulty'] == 'hard']
    }
    
    for difficulty, cards in difficulty_decks.items():
        if cards:
            deck = {
                'id': f'deck-difficulty-{difficulty}',
                'name': f'{difficulty.title()} Difficulty Cards',
                'description': f'Flashcards rated as {difficulty} difficulty',
                'cardIds': [card['id'] for card in cards],
                'lessonIds': list(set(card['lessonId'] for card in cards)),
                'createdAt': 1700000000000,
                'updatedAt': 1700000000000,
                'isDefault': True,
                'cardCount': len(cards),
                'difficulty': difficulty
            }
            decks.append(deck)
    
    return decks

def main():
    """Main enhancement function"""
    print("Enhancing flashcards...")
    
    # Load lesson plans
    data = load_lesson_plans()
    lesson_plans = data['lessonPlans']
    
    all_flashcards = []
    
    # Generate flashcards for each lesson
    for lesson_plan in lesson_plans:
        print(f"Generating flashcards for: {lesson_plan['title']}")
        flashcards = generate_enhanced_flashcards(lesson_plan)
        all_flashcards.extend(flashcards)
    
    print(f"Generated {len(all_flashcards)} flashcards")
    
    # Enhance content
    enhanced_flashcards = enhance_flashcard_content(all_flashcards)
    
    # Add unique IDs
    for i, card in enumerate(enhanced_flashcards):
        card['id'] = f'enhanced-card-{i+1:04d}'
    
    # Create decks
    decks = create_flashcard_decks(enhanced_flashcards)
    
    # Save enhanced flashcards
    output_data = {
        'flashcards': enhanced_flashcards,
        'decks': decks,
        'metadata': {
            'totalCards': len(enhanced_flashcards),
            'totalDecks': len(decks),
            'generatedAt': 1700000000000,
            'version': '2.0'
        }
    }
    
    with open('src/enhancedFlashcards.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Enhanced flashcards saved to src/enhancedFlashcards.json")
    print(f"Total cards: {len(enhanced_flashcards)}")
    print(f"Total decks: {len(decks)}")
    
    # Print summary by category
    categories = {}
    for card in enhanced_flashcards:
        cat = card['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nCards by category:")
    for cat, count in categories.items():
        print(f"  {cat}: {count}")

if __name__ == "__main__":
    main()
