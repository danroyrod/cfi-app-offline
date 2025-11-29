#!/usr/bin/env python3
"""
1. Remove incorrect image from LP-X-C
2. Find all lessons that need Mark Berry images
3. Verify image integration
"""

import json
from pathlib import Path

# Load lesson plans
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 70)
print("Task 1: Remove incorrect image from LP-X-C")
print("=" * 70)

# Find LP-X-C and remove Turns_around_Point image
for lesson in data['lessonPlans']:
    if lesson['id'] == 'LP-X-C':
        diagrams = lesson.get('diagrams', [])
        original_count = len(diagrams)
        
        # Remove diagrams with Turns_around_Point image
        diagrams = [d for d in diagrams if 'Turns_around_Point' not in d.get('imageUrl', '')]
        
        removed = original_count - len(diagrams)
        if removed > 0:
            lesson['diagrams'] = diagrams
            print(f"[+] Removed {removed} incorrect diagram(s) from LP-X-C: Power-Off Stalls")
        else:
            print("[OK] LP-X-C: No incorrect diagrams found")

print("\n" + "=" * 70)
print("Task 2: Find lessons needing Mark Berry images")
print("=" * 70)

# Mark Berry lesson mapping - Area and Task combinations
mark_berry_lessons = {
    ("IX", "A"): ["HCL.png", "LOAD_FACTOR.png", "Skidding_Turn.png", "Slipping_Turn.png", "Path_of_Wing.png"],
    ("IX", "C"): ["Chandelle.png"],
    ("IX", "E"): ["Turns_around_Point.png"],
}

lessons_needing_images = []
for lesson in data['lessonPlans']:
    area = lesson.get('areaNumber', '')
    task = lesson.get('taskLetter', '').upper()
    lesson_id = lesson.get('id', '')
    title = lesson.get('title', '')
    
    key = (area, task)
    if key in mark_berry_lessons:
        expected_images = mark_berry_lessons[key]
        diagrams = lesson.get('diagrams', [])
        
        # Check which images are already present
        existing_images = [d.get('imageUrl', '') for d in diagrams if d.get('imageUrl')]
        existing_filenames = [img.split('/')[-1] for img in existing_images if '/' in img]
        
        missing = [img for img in expected_images if img not in existing_filenames]
        
        if missing:
            lessons_needing_images.append({
                'id': lesson_id,
                'title': title,
                'area': area,
                'task': task,
                'missing': missing,
                'has': existing_filenames
            })

if lessons_needing_images:
    print("\nLessons that need Mark Berry images:")
    for lesson_info in lessons_needing_images:
        print(f"\n[{lesson_info['id']}] {lesson_info['title']}")
        print(f"  Area {lesson_info['area']}, Task {lesson_info['task']}")
        print(f"  Already has: {lesson_info['has']}")
        print(f"  Missing: {lesson_info['missing']}")
else:
    print("\n[OK] All lessons that should have Mark Berry images already have them!")

print("\n" + "=" * 70)
print("Task 3: Verify image files exist and paths are correct")
print("=" * 70)

images_dir = Path("public/images/mark-berry")
if not images_dir.exists():
    print(f"[ERROR] Images directory not found: {images_dir}")
else:
    print(f"[OK] Images directory exists: {images_dir}")
    
    # Check all referenced images
    all_image_urls = set()
    for lesson in data['lessonPlans']:
        for diagram in lesson.get('diagrams', []):
            img_url = diagram.get('imageUrl', '')
            if img_url and 'mark-berry' in img_url:
                all_image_urls.add(img_url)
    
    print(f"\nFound {len(all_image_urls)} Mark Berry image references in lesson plans")
    
    missing_files = []
    for img_url in all_image_urls:
        # Extract filename from URL like "/images/mark-berry/HCL.png"
        filename = img_url.split('/')[-1]
        file_path = images_dir / filename
        
        if file_path.exists():
            size = file_path.stat().st_size
            print(f"  [OK] {filename} ({size:,} bytes)")
        else:
            missing_files.append(filename)
            print(f"  [MISSING] {filename}")
    
    if missing_files:
        print(f"\n[WARNING] {len(missing_files)} image file(s) are missing:")
        for f in missing_files:
            print(f"  - {f}")
    else:
        print(f"\n[SUCCESS] All {len(all_image_urls)} image files exist!")

# Save updated data
print("\n" + "=" * 70)
print("Saving updated lesson plans...")
with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("[SAVED] Updated lessonPlansData.json")

print("\n" + "=" * 70)
print("Summary:")
print(f"  - Removed incorrect image from LP-X-C")
print(f"  - Checked {len(data['lessonPlans'])} lesson plans")
print(f"  - Verified image files")
print("=" * 70)

