"""
Enrich existing lesson plans with George's content.
Cross-references extracted content against lessonPlansData.json and produces:
1. Enriched lessonPlansData.json (updated teaching points, errors, standards)
2. New deepDiveLessonsData.json (Extra Detail content as separate deep-dive mode)
3. diagramReferences.json (PowerPoint diagram descriptions)

Progress is saved after each area.
"""

import json
import re
import os
from pathlib import Path
from copy import deepcopy

# Paths
EXTRACTED_DIR = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\scripts\extracted-content")
APP_SRC = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src")
OUTPUT_DIR = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\scripts\enrichment-output")

# Area number mapping for matching
ROMAN_TO_FOLDER = {
    "I": "area_I.json",
    "II": "area_II.json",
    "III": "area_III.json",
    "IV": "area_IV.json",
    "V": "area_V.json",
    "VI": "area_VI.json",
    "VII": "area_VII.json",
    "VIII": "area_VIII.json",
    "IX": "area_IX.json",
    "X": "area_X.json",
    "XI": "area_XI.json",
    "XII": "area_XII.json",
    "XIII": None,  # No George source for multi-engine (separate MEI pack)
    "XIV": "area_XIV.json",
}


def load_lesson_plans():
    """Load existing lesson plans from the app."""
    with open(APP_SRC / "lessonPlansData.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def load_extracted_area(area_roman):
    """Load extracted content for an area."""
    filename = ROMAN_TO_FOLDER.get(area_roman)
    if not filename:
        return None
    filepath = EXTRACTED_DIR / filename
    if not filepath.exists():
        return None
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def match_lesson_to_source(lesson_id, lesson_title, extracted_lessons):
    """Match an app lesson plan to its corresponding extracted source file."""
    # Extract task letter from ID (e.g., LP-VII-A -> A)
    parts = lesson_id.split("-")
    if len(parts) >= 3:
        task_letter = parts[-1]
    else:
        return None

    # Try to match by filename pattern
    for source in extracted_lessons:
        filename = source.get("filename", "")
        # Pattern: "VII.A." or "I.A." at start of filename
        area_part = parts[1] if len(parts) >= 2 else ""
        pattern = f"{area_part}.{task_letter}."
        if pattern.lower() in filename.lower():
            return source

        # Also try matching by full area.task pattern
        alt_pattern = f"{area_part}.{task_letter}"
        if filename.lower().startswith(alt_pattern.lower()):
            return source

    # Fallback: try matching by title keywords
    title_words = set(lesson_title.lower().split())
    best_match = None
    best_score = 0
    for source in extracted_lessons:
        filename = source.get("filename", "").lower()
        # Remove extension and roman numeral prefix
        clean_name = re.sub(r'^[IVX]+\.\w+\.\s*', '', filename.replace('.docx', '').replace('.pptx', ''))
        name_words = set(clean_name.split())
        overlap = len(title_words & name_words)
        if overlap > best_score:
            best_score = overlap
            best_match = source

    if best_score >= 2:
        return best_match

    return None


def extract_teaching_points(full_text):
    """Extract key teaching points from George's content."""
    points = []
    lines = full_text.split("\n")

    # Look for bullet-point style content and key concepts
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue

        # Skip ACS codes and very short lines
        if re.match(r'^[A-Z]{2}\.[IVX]+\.[A-Z]\.[A-Z]\d', line):
            continue
        if len(line) < 15:
            continue

        # Look for substantive teaching content
        # Lines that start with action verbs or contain key aviation terms
        teaching_indicators = [
            r'^(Always|Never|Remember|Note|Key|Important|Critical)',
            r'(procedure|technique|method|standard|tolerance|error|correction)',
            r'(the pilot|the student|the instructor|should|must|shall)',
        ]
        for pattern in teaching_indicators:
            if re.search(pattern, line, re.IGNORECASE):
                if line not in points and len(line) < 300:
                    points.append(line)
                break

    return points[:20]  # Cap at 20 points


def extract_common_errors(full_text):
    """Extract common errors from George's content."""
    errors = []
    lines = full_text.split("\n")

    in_errors_section = False
    for line in lines:
        line = line.strip()

        # Detect error sections
        if re.search(r'(common error|common mistake|student error|typical error)', line, re.IGNORECASE):
            in_errors_section = True
            continue

        # Detect section end
        if in_errors_section and re.match(r'^[A-Z][a-z]', line) and len(line) > 30:
            if not re.search(r'(error|mistake|fail|incorrect)', line, re.IGNORECASE):
                in_errors_section = False

        if in_errors_section and line and len(line) > 10:
            # Clean up the error text
            clean = re.sub(r'^[\d\.\-\•\*]+\s*', '', line)
            if clean and clean not in errors and len(clean) < 200:
                errors.append(clean)

    # Also look for error patterns throughout the text
    for line in lines:
        line = line.strip()
        if re.search(r'^(Failure to|Failing to|Not|Incorrect|Improper|Inadequate|Poor)', line):
            clean = re.sub(r'^[\d\.\-\•\*]+\s*', '', line)
            if clean and clean not in errors and len(clean) < 200:
                errors.append(clean)

    return errors[:15]  # Cap at 15


def extract_completion_standards(full_text):
    """Extract completion standards/tolerances from George's content."""
    standards = []
    lines = full_text.split("\n")

    for line in lines:
        line = line.strip()
        # Look for tolerance patterns
        if re.search(r'[±]\s*\d+', line) or re.search(r'(within|maintain)\s+\d+', line, re.IGNORECASE):
            if line not in standards and len(line) < 200:
                standards.append(line)
        # Look for completion standard sections
        if re.search(r'(completion standard|ACS standard|performance standard)', line, re.IGNORECASE):
            standards.append(line)

    return standards[:10]


def extract_safety_points(full_text):
    """Extract safety considerations from George's content."""
    safety = []
    lines = full_text.split("\n")

    for line in lines:
        line = line.strip()
        if re.search(r'(safety|hazard|danger|caution|warning|risk|emergency|critical)', line, re.IGNORECASE):
            if len(line) > 20 and len(line) < 250 and line not in safety:
                safety.append(line)

    return safety[:10]


def extract_procedures(full_text):
    """Extract step-by-step procedures from George's content."""
    procedures = []
    lines = full_text.split("\n")

    in_procedure = False
    current_procedure = []

    for line in lines:
        line = line.strip()

        # Detect numbered steps
        if re.match(r'^\d+[\.\)]\s+', line):
            in_procedure = True
            current_procedure.append(line)
        elif in_procedure and line:
            if re.match(r'^[a-z][\.\)]\s+', line) or line.startswith("   "):
                current_procedure.append(line)
            else:
                if current_procedure:
                    procedures.extend(current_procedure)
                    current_procedure = []
                in_procedure = False

    if current_procedure:
        procedures.extend(current_procedure)

    return procedures[:30]


def enrich_lesson_plan(plan, standard_source, extra_source, ppt_source):
    """Enrich a single lesson plan with George's content."""
    enriched = deepcopy(plan)
    changes_made = []

    # Process standard lesson content
    if standard_source and standard_source.get("full_text"):
        text = standard_source["full_text"]

        # 1. Enrich teaching points
        george_points = extract_teaching_points(text)
        if george_points:
            existing_points = set(p.lower() for p in (enriched.get("keyTeachingPoints") or []))
            new_points = [p for p in george_points if p.lower() not in existing_points]
            if new_points:
                enriched.setdefault("keyTeachingPoints", [])
                enriched["keyTeachingPoints"].extend(new_points[:5])
                changes_made.append(f"Added {len(new_points[:5])} teaching points")

        # 2. Enrich common errors
        george_errors = extract_common_errors(text)
        if george_errors:
            existing_errors = set(e.lower() for e in (enriched.get("commonErrors") or []))
            new_errors = [e for e in george_errors if e.lower() not in existing_errors]
            if new_errors:
                enriched.setdefault("commonErrors", [])
                enriched["commonErrors"].extend(new_errors[:5])
                changes_made.append(f"Added {len(new_errors[:5])} common errors")

        # 3. Enrich completion standards
        george_standards = extract_completion_standards(text)
        if george_standards:
            existing_standards = enriched.get("completionStandards", [])
            # Handle various formats (string, list of strings, list of dicts)
            if isinstance(existing_standards, str):
                existing_text = [existing_standards] if existing_standards else []
            elif isinstance(existing_standards, list):
                existing_text = []
                for s in existing_standards:
                    if isinstance(s, str):
                        existing_text.append(s)
                    elif isinstance(s, dict):
                        existing_text.append(str(s.get("text", s.get("description", str(s)))))
            else:
                existing_text = []
            existing_lower = set(t.lower() for t in existing_text)
            new_standards = [s for s in george_standards if s.lower() not in existing_lower]
            if new_standards:
                # Append as strings to the existing list
                if isinstance(existing_standards, list):
                    enriched["completionStandards"] = existing_standards + new_standards[:3]
                else:
                    enriched["completionStandards"] = new_standards[:3]
                changes_made.append(f"Added {len(new_standards[:3])} completion standards")

        # 4. Enrich safety considerations
        george_safety = extract_safety_points(text)
        if george_safety:
            existing_safety = set(s.lower() for s in (enriched.get("safetyConsiderations") or []))
            new_safety = [s for s in george_safety if s.lower() not in existing_safety]
            if new_safety:
                enriched.setdefault("safetyConsiderations", [])
                enriched["safetyConsiderations"].extend(new_safety[:3])
                changes_made.append(f"Added {len(new_safety[:3])} safety points")

        # 5. Extract headings as structural info
        if standard_source.get("headings"):
            enriched["_george_headings"] = standard_source["headings"]

    # Process PowerPoint content for diagram references
    if ppt_source and ppt_source.get("diagram_descriptions"):
        diagrams = ppt_source["diagram_descriptions"]
        if diagrams:
            existing_diagrams = enriched.get("diagrams") or []
            existing_titles = set(d.get("title", "").lower() for d in existing_diagrams)

            for diag in diagrams:
                if diag.get("title") and diag["title"].lower() not in existing_titles:
                    new_diagram = {
                        "title": diag["title"],
                        "description": f"From George's PowerPoint slide {diag['slide_number']}: {diag.get('context', '')}",
                        "type": "reference",
                        "source": "george_ppt",
                    }
                    existing_diagrams.append(new_diagram)
                    existing_titles.add(diag["title"].lower())

            enriched["diagrams"] = existing_diagrams
            if len(existing_diagrams) > len(plan.get("diagrams") or []):
                changes_made.append(f"Added {len(existing_diagrams) - len(plan.get('diagrams') or [])} diagram references")

    enriched["_enrichment_log"] = changes_made
    return enriched


def build_deep_dive(lesson_id, extra_source):
    """Build a deep-dive entry from the Extra Detail content."""
    if not extra_source or not extra_source.get("full_text"):
        return None

    text = extra_source["full_text"]
    headings = extra_source.get("headings", [])

    # Parse the content into sections based on headings
    sections = []
    lines = text.split("\n")
    current_section = {"title": "Overview", "content": []}

    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue

        # Check if this is a heading
        if line_stripped in headings and len(line_stripped) > 3:
            if current_section["content"]:
                current_section["content"] = "\n".join(current_section["content"])
                sections.append(current_section)
            current_section = {"title": line_stripped, "content": []}
        else:
            current_section["content"].append(line_stripped)

    # Don't forget the last section
    if current_section["content"]:
        current_section["content"] = "\n".join(current_section["content"])
        sections.append(current_section)

    # Extract procedures for the deep dive
    procedures = extract_procedures(text)

    deep_dive = {
        "lessonPlanId": lesson_id,
        "source": extra_source.get("filename", ""),
        "sections": sections,
        "procedures": procedures,
        "fullText": text,
        "totalLength": len(text),
    }

    return deep_dive


def process_area(area_roman, lesson_plans, extracted_data):
    """Process all lesson plans for a single area."""
    print(f"\n{'='*50}")
    print(f"Enriching Area {area_roman}")
    print(f"{'='*50}")

    # Filter lesson plans for this area
    area_plans = [p for p in lesson_plans if p.get("areaNumber") == area_roman]
    print(f"  App has {len(area_plans)} plans for this area")

    if not extracted_data:
        print(f"  No extracted content available - skipping")
        return [], []

    standard_lessons = extracted_data.get("standard_lessons", [])
    extra_detail = extracted_data.get("extra_detail_lessons", [])
    ppt_content = extracted_data.get("powerpoint_content", [])

    print(f"  George has: {len(standard_lessons)} standard, {len(extra_detail)} extra detail, {len(ppt_content)} PPTs")

    enriched_plans = []
    deep_dives = []

    for plan in area_plans:
        plan_id = plan.get("id", "")
        plan_title = plan.get("title", "")
        print(f"  Processing: {plan_id} - {plan_title}")

        # Match to George's source files
        standard_match = match_lesson_to_source(plan_id, plan_title, standard_lessons)
        extra_match = match_lesson_to_source(plan_id, plan_title, extra_detail)
        ppt_match = match_lesson_to_source(plan_id, plan_title, ppt_content)

        if standard_match:
            print(f"    ✓ Matched standard: {standard_match.get('filename', 'N/A')}")
        else:
            print(f"    ✗ No standard match found")

        if extra_match:
            print(f"    ✓ Matched extra detail: {extra_match.get('filename', 'N/A')}")

        if ppt_match:
            print(f"    ✓ Matched PPT: {ppt_match.get('filename', 'N/A')}")

        # Enrich the plan
        enriched = enrich_lesson_plan(plan, standard_match, extra_match, ppt_match)
        enriched_plans.append(enriched)

        # Build deep dive
        if extra_match:
            deep_dive = build_deep_dive(plan_id, extra_match)
            if deep_dive:
                deep_dives.append(deep_dive)

        # Log changes
        changes = enriched.get("_enrichment_log", [])
        if changes:
            for c in changes:
                print(f"    → {c}")
        else:
            print(f"    → No new content to add")

    return enriched_plans, deep_dives


def main():
    print("=" * 60)
    print("LESSON PLAN ENRICHMENT ENGINE")
    print("=" * 60)

    # Load existing lesson plans
    print("\nLoading existing lesson plans...")
    lesson_data = load_lesson_plans()
    all_plans = lesson_data.get("lessonPlans", [])
    print(f"  Loaded {len(all_plans)} existing plans")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Track all enriched plans and deep dives
    all_enriched = []
    all_deep_dives = []
    all_diagram_refs = []

    # Process each area
    areas_processed = []
    for area_roman, filename in ROMAN_TO_FOLDER.items():
        extracted = load_extracted_area(area_roman)

        # Also try loading appendix content
        if area_roman == "APP":
            # Skip appendix for now - it's not in the lesson plans
            continue

        enriched_plans, deep_dives = process_area(area_roman, all_plans, extracted)

        all_enriched.extend(enriched_plans)
        all_deep_dives.extend(deep_dives)

        # Collect diagram references from PPT content
        if extracted:
            for ppt in extracted.get("powerpoint_content", []):
                for diag in ppt.get("diagram_descriptions", []):
                    all_diagram_refs.append({
                        "area": area_roman,
                        "source_file": ppt.get("filename", ""),
                        "slide_number": diag.get("slide_number"),
                        "title": diag.get("title", ""),
                        "context": diag.get("context", ""),
                    })

        areas_processed.append(area_roman)

        # Save progress checkpoint
        checkpoint = {
            "areas_completed": areas_processed,
            "enriched_count": len(all_enriched),
            "deep_dives_count": len(all_deep_dives),
            "diagram_refs_count": len(all_diagram_refs),
        }
        with open(OUTPUT_DIR / "_progress.json", "w", encoding="utf-8") as f:
            json.dump(checkpoint, f, indent=2)

    # Handle plans that weren't in any George area (keep them unchanged)
    enriched_ids = set(p.get("id") for p in all_enriched)
    for plan in all_plans:
        if plan.get("id") not in enriched_ids:
            all_enriched.append(plan)
            print(f"\n  Kept unchanged (no George source): {plan.get('id')}")

    # Sort enriched plans to maintain original order
    plan_order = {p.get("id"): i for i, p in enumerate(all_plans)}
    all_enriched.sort(key=lambda p: plan_order.get(p.get("id"), 999))

    # Clean up internal tracking fields
    for plan in all_enriched:
        plan.pop("_enrichment_log", None)
        plan.pop("_george_headings", None)

    # Save enriched lesson plans
    enriched_output = {"lessonPlans": all_enriched}
    enriched_file = OUTPUT_DIR / "lessonPlansData_enriched.json"
    with open(enriched_file, "w", encoding="utf-8") as f:
        json.dump(enriched_output, f, ensure_ascii=False, indent=2)
    print(f"\n✓ Saved enriched plans: {enriched_file}")
    print(f"  Total plans: {len(all_enriched)}")

    # Save deep dive data
    deep_dive_output = {"deepDiveLessons": all_deep_dives}
    deep_dive_file = OUTPUT_DIR / "deepDiveLessonsData.json"
    with open(deep_dive_file, "w", encoding="utf-8") as f:
        json.dump(deep_dive_output, f, ensure_ascii=False, indent=2)
    print(f"\n✓ Saved deep dives: {deep_dive_file}")
    print(f"  Total deep dives: {len(all_deep_dives)}")

    # Save diagram references
    diagram_file = OUTPUT_DIR / "diagramReferences.json"
    with open(diagram_file, "w", encoding="utf-8") as f:
        json.dump(all_diagram_refs, f, ensure_ascii=False, indent=2)
    print(f"\n✓ Saved diagram references: {diagram_file}")
    print(f"  Total diagram refs: {len(all_diagram_refs)}")

    # Summary
    print(f"\n{'='*60}")
    print("ENRICHMENT COMPLETE")
    print(f"{'='*60}")
    print(f"  Plans enriched: {len([p for p in all_enriched if p.get('id') in enriched_ids])}")
    print(f"  Plans unchanged: {len(all_enriched) - len(enriched_ids)}")
    print(f"  Deep dives created: {len(all_deep_dives)}")
    print(f"  Diagram references: {len(all_diagram_refs)}")
    print(f"\nOutput directory: {OUTPUT_DIR}")
    print(f"\nNext steps:")
    print(f"  1. Review enrichment-output/lessonPlansData_enriched.json")
    print(f"  2. Copy to src/lessonPlansData.json when approved")
    print(f"  3. Copy deepDiveLessonsData.json to src/")
    print(f"  4. Build deep-dive UI component")


if __name__ == "__main__":
    main()
