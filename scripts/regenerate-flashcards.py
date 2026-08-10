"""
Regenerate the enhancedFlashcards.json from the enriched lesson plans data.
This produces the static flashcard file that's served from public/.
"""
import json
import re
import hashlib
from pathlib import Path

SRC_FILE = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src\lessonPlansData.json")
OUTPUT_FILE = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\public\enhancedFlashcards.json")


def make_id(lesson_id, category, index):
    """Generate a deterministic card ID."""
    raw = f"{lesson_id}-{category}-{index}"
    return raw


def truncate(text, max_len=200):
    if len(text) <= max_len:
        return text
    return text[:max_len - 3] + "..."


def extract_area_tag(lesson_id):
    match = re.match(r"LP-([IVX]+)", lesson_id)
    return f"area-{match.group(1)}" if match else "unknown"


def convert_to_question(statement, lesson_title):
    """Convert a statement into a question for the front of a flashcard."""
    lower = statement.lower()
    if "should" in lower or "must" in lower:
        return f"What should be done regarding: {truncate(statement, 60)}?"
    elif "failure to" in lower or "not " in lower:
        return f"Why is this a problem: {truncate(statement, 60)}?"
    elif any(word in lower for word in ["maintain", "keep", "ensure"]):
        return f"What must be maintained for {lesson_title}?"
    else:
        return f"What is a key point for {lesson_title}?"


def generate_flashcards(plans):
    """Generate flashcards from all lesson plans."""
    all_cards = []

    for plan in plans:
        lesson_id = plan.get("id", "")
        lesson_title = plan.get("title", "")
        area_tag = extract_area_tag(lesson_id)

        # 1. Objectives
        for i, obj in enumerate(plan.get("objectives", [])):
            all_cards.append({
                "id": make_id(lesson_id, "obj", i + 1),
                "front": f"What is objective {i + 1} for {lesson_title}?",
                "back": obj,
                "lessonId": lesson_id,
                "lessonTitle": lesson_title,
                "category": "objective",
                "tags": ["objective", area_tag],
            })

        # 2. Key Teaching Points (enriched with George's content)
        for i, point in enumerate(plan.get("keyTeachingPoints", [])):
            question = convert_to_question(point, lesson_title)
            all_cards.append({
                "id": make_id(lesson_id, "ktp", i + 1),
                "front": question,
                "back": point,
                "lessonId": lesson_id,
                "lessonTitle": lesson_title,
                "category": "teaching-point",
                "tags": ["teaching-point", "key-point", area_tag],
            })

        # 3. Teaching Script Key Points (phase-specific)
        for script in plan.get("teachingScript", []):
            phase = script.get("phase", "")
            for i, point in enumerate(script.get("keyPoints", [])):
                question = f"During {phase}, what is important for {lesson_title}?"
                all_cards.append({
                    "id": make_id(lesson_id, f"ts-{phase[:10]}", i + 1),
                    "front": question,
                    "back": point,
                    "lessonId": lesson_id,
                    "lessonTitle": lesson_title,
                    "category": "teaching-point",
                    "tags": ["teaching-point", phase.lower()[:20], area_tag],
                })

        # 4. Common Errors (enriched)
        for i, error in enumerate(plan.get("commonErrors", [])):
            all_cards.append({
                "id": make_id(lesson_id, "err", i + 1),
                "front": f"What is a common error in {lesson_title}?",
                "back": error,
                "lessonId": lesson_id,
                "lessonTitle": lesson_title,
                "category": "error",
                "tags": ["error", "common-mistake", area_tag],
            })

        # 5. Completion Standards
        for i, standard in enumerate(plan.get("completionStandards", [])):
            if isinstance(standard, dict):
                std_text = standard.get("standard", standard.get("text", str(standard)))
            else:
                std_text = str(standard)

            # Look for tolerance values
            has_tolerance = bool(re.search(r"[±]\d+|within\s+\d+", std_text, re.IGNORECASE))
            category = "tolerance" if has_tolerance else "standard"

            all_cards.append({
                "id": make_id(lesson_id, "std", i + 1),
                "front": f"What is the {'tolerance/standard' if has_tolerance else 'completion standard'} for {lesson_title}?",
                "back": std_text,
                "lessonId": lesson_id,
                "lessonTitle": lesson_title,
                "category": category,
                "tags": [category, "completion", "acs", area_tag],
            })

        # 6. Safety Considerations (enriched)
        for i, safety in enumerate(plan.get("safetyConsiderations", [])):
            all_cards.append({
                "id": make_id(lesson_id, "safety", i + 1),
                "front": f"What is an important safety consideration for {lesson_title}?",
                "back": safety,
                "lessonId": lesson_id,
                "lessonTitle": lesson_title,
                "category": "safety",
                "tags": ["safety", "risk", area_tag],
            })

    return all_cards


def generate_decks(cards, plans):
    """Generate study decks organized by area."""
    decks = []
    
    # Group plans by area
    areas = {}
    for plan in plans:
        area = plan.get("areaNumber", "")
        if area not in areas:
            areas[area] = []
        areas[area].append(plan)

    area_names = {
        "I": "Fundamentals of Instructing",
        "II": "Technical Subject Areas",
        "III": "Preflight Preparation",
        "IV": "Preflight Lesson on a Maneuver",
        "V": "Preflight Procedures",
        "VI": "Airport Operations",
        "VII": "Takeoffs, Landings, & Go-Arounds",
        "VIII": "Fundamentals of Flight",
        "IX": "Performance & Ground Reference Maneuvers",
        "X": "Slow Flight, Stalls, & Spins",
        "XI": "Basic Instrument Maneuvers",
        "XII": "Emergency Operations",
        "XIII": "Multiengine Operations",
        "XIV": "Postflight Procedures",
    }

    for area_num, area_plans in areas.items():
        area_card_ids = [c["id"] for c in cards if c.get("lessonId", "").startswith(f"LP-{area_num}-")]
        if area_card_ids:
            decks.append({
                "id": f"deck-area-{area_num}",
                "name": f"Area {area_num}: {area_names.get(area_num, 'Unknown')}",
                "description": f"All flashcards for Area {area_num} ({len(area_card_ids)} cards)",
                "cardIds": area_card_ids,
                "category": "area",
                "tags": [f"area-{area_num}"],
            })

    # Category decks
    categories = {"objective", "teaching-point", "error", "tolerance", "standard", "safety"}
    category_names = {
        "objective": "Learning Objectives",
        "teaching-point": "Teaching Points",
        "error": "Common Errors",
        "tolerance": "ACS Tolerances",
        "standard": "Completion Standards",
        "safety": "Safety Considerations",
    }
    for cat in categories:
        cat_cards = [c["id"] for c in cards if c["category"] == cat]
        if cat_cards:
            decks.append({
                "id": f"deck-{cat}",
                "name": category_names.get(cat, cat.title()),
                "description": f"All {cat} flashcards ({len(cat_cards)} cards)",
                "cardIds": cat_cards,
                "category": "topic",
                "tags": [cat],
            })

    return decks


def main():
    print("=" * 60)
    print("FLASHCARD REGENERATION")
    print("=" * 60)

    with open(SRC_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    plans = data["lessonPlans"]
    print(f"Loaded {len(plans)} lesson plans")

    # Generate cards
    cards = generate_flashcards(plans)
    print(f"Generated {len(cards)} flashcards")

    # Count by category
    from collections import Counter
    cats = Counter(c["category"] for c in cards)
    print("\nBy category:")
    for cat, count in cats.most_common():
        print(f"  {cat}: {count}")

    # Generate decks
    decks = generate_decks(cards, plans)
    print(f"\nGenerated {len(decks)} study decks")

    # Save
    output = {"flashcards": cards, "decks": decks}
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    size_mb = OUTPUT_FILE.stat().st_size / 1024 / 1024
    print(f"\nSaved: {OUTPUT_FILE}")
    print(f"Size: {size_mb:.2f} MB")
    print(f"\nPrevious: 4,448 cards")
    print(f"New: {len(cards)} cards (from enriched content)")


if __name__ == "__main__":
    main()
