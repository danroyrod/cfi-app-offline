"""
Build comprehensive deep-dive content from ALL Extra Detail files.
Uses more aggressive matching to catch all extra detail content.
"""

import json
import re
from pathlib import Path

EXTRACTED_DIR = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\scripts\extracted-content")
APP_SRC = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src")
OUTPUT_DIR = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\scripts\enrichment-output")

# Load lesson plans to get IDs
with open(APP_SRC / "lessonPlansData.json", "r", encoding="utf-8") as f:
    lesson_data = json.load(f)
all_plans = lesson_data["lessonPlans"]

# Build task letter to plan mapping
plan_map = {}
for plan in all_plans:
    area = plan.get("areaNumber", "")
    task = plan.get("taskLetter", "")
    plan_map[f"{area}-{task}"] = plan

AREA_FILES = {
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
    "XIV": "area_XIV.json",
}


def extract_task_letter_from_filename(filename):
    """Extract the task letter(s) from a filename like 'IX.A. Steep Turns.docx'"""
    # Pattern: ROMAN.LETTER. or ROMAN.LETTER-LETTER.
    match = re.match(r'[IVX]+\.([A-Z](?:-[A-Z])?)\b', filename)
    if match:
        return match.group(1)
    # Try alternative patterns
    match = re.match(r'[A-Z]+\.\s*([A-Z])', filename)
    if match:
        return match.group(1)
    return None


def build_deep_dive_entry(lesson_plan_id, source_file):
    """Build a rich deep-dive entry from extra detail content."""
    text = source_file.get("full_text", "")
    if not text or len(text) < 100:
        return None

    headings = source_file.get("headings", [])
    paragraphs = source_file.get("paragraphs", [])

    # Build sections from headings/content structure
    sections = []
    current_section = {"title": "Introduction", "content": [], "highlights": []}

    for para in paragraphs:
        para_text = para.get("text", "").strip()
        if not para_text:
            continue

        style = para.get("style", "Normal")
        is_bold = para.get("bold", False)

        # New section on heading styles
        if "Heading" in style or (is_bold and len(para_text) < 80 and para_text in headings):
            if current_section["content"]:
                current_section["content"] = "\n".join(current_section["content"])
                sections.append(current_section)
            current_section = {"title": para_text, "content": [], "highlights": []}
        else:
            current_section["content"].append(para_text)
            # Mark bold items as highlights
            if is_bold and len(para_text) < 150:
                current_section["highlights"].append(para_text)

    # Last section
    if current_section["content"]:
        current_section["content"] = "\n".join(current_section["content"])
        sections.append(current_section)

    # If no sections were found via headings, split by paragraph groups
    if len(sections) <= 1 and len(text) > 500:
        # Fall back to splitting by blank line groups or long paragraphs
        lines = text.split("\n")
        chunk_size = max(len(lines) // 5, 10)
        sections = []
        for i in range(0, len(lines), chunk_size):
            chunk = lines[i:i + chunk_size]
            title = chunk[0][:60] if chunk else f"Section {i // chunk_size + 1}"
            sections.append({
                "title": title,
                "content": "\n".join(chunk),
                "highlights": [],
            })

    # Extract key takeaways (bold text or text with key indicators)
    key_takeaways = []
    for para in paragraphs:
        if para.get("bold") and len(para.get("text", "")) > 20:
            key_takeaways.append(para["text"])

    deep_dive = {
        "lessonPlanId": lesson_plan_id,
        "source": source_file.get("filename", ""),
        "sections": sections,
        "keyTakeaways": key_takeaways[:15],
        "totalLength": len(text),
        "sectionCount": len(sections),
    }

    return deep_dive


def main():
    print("=" * 60)
    print("DEEP DIVE CONTENT BUILDER")
    print("=" * 60)

    all_deep_dives = []
    matched_count = 0
    unmatched_files = []

    for area_roman, filename in AREA_FILES.items():
        filepath = EXTRACTED_DIR / filename
        if not filepath.exists():
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            area_data = json.load(f)

        extra_detail = area_data.get("extra_detail_lessons", [])
        if not extra_detail:
            continue

        print(f"\nArea {area_roman}: {len(extra_detail)} extra detail files")

        for source in extra_detail:
            filename_str = source.get("filename", "")
            task_letter = extract_task_letter_from_filename(filename_str)

            if not task_letter:
                unmatched_files.append(f"{area_roman}: {filename_str}")
                continue

            # Handle combined lessons like "XI.A-D. BAI Flight.docx"
            if "-" in task_letter:
                # Create a deep dive for the first letter
                first_letter = task_letter.split("-")[0]
                plan_key = f"{area_roman}-{first_letter}"
            else:
                plan_key = f"{area_roman}-{task_letter}"

            plan = plan_map.get(plan_key)
            if not plan:
                # Try fuzzy matching
                for key, p in plan_map.items():
                    if key.startswith(f"{area_roman}-") and task_letter in key:
                        plan = p
                        break

            if plan:
                plan_id = plan.get("id", f"LP-{plan_key}")
                deep_dive = build_deep_dive_entry(plan_id, source)
                if deep_dive:
                    all_deep_dives.append(deep_dive)
                    matched_count += 1
                    print(f"  ✓ {filename_str} → {plan_id} ({deep_dive['totalLength']} chars, {deep_dive['sectionCount']} sections)")
            else:
                unmatched_files.append(f"{area_roman}: {filename_str} (task {task_letter})")
                print(f"  ✗ {filename_str} - no matching plan found")

    # Save results
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / "deepDiveLessonsData.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({"deepDiveLessons": all_deep_dives}, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"DEEP DIVE BUILD COMPLETE")
    print(f"{'='*60}")
    print(f"  Matched & built: {matched_count}")
    print(f"  Unmatched files: {len(unmatched_files)}")
    if unmatched_files:
        print(f"\n  Unmatched:")
        for f_name in unmatched_files:
            print(f"    - {f_name}")
    print(f"\n  Output: {output_file}")
    print(f"  Size: {output_file.stat().st_size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
