#!/usr/bin/env python3
"""
Comprehensive check of all Mark Berry images and find lessons that need them.
This script will check multiple lesson plan pages to find all available images.
"""

import json
from pathlib import Path

# Known Mark Berry images based on what we've seen
KNOWN_IMAGES = {
    "HCL.png": ("IX", "A"),  # Horizontal Component of Lift - Steep Turns
    "LOAD_FACTOR.png": ("IX", "A"),  # Load Factor - Steep Turns
    "Skidding_Turn.png": ("IX", "A"),  # Skidding Turn - Steep Turns
    "Slipping_Turn.png": ("IX", "A"),  # Slipping Turn - Steep Turns
    "Path_of_Wing.png": ("IX", "A"),  # Path of Wing - Steep Turns
    "Chandelle.png": ("IX", "C"),  # Chandelles
    "Turns_around_Point.png": ("IX", "E"),  # Turns Around a Point - Ground Reference
}

def check_all_lessons():
    """Check all lessons to see which ones should have Mark Berry images."""
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("=" * 70)
    print("Comprehensive Mark Berry Image Check")
    print("=" * 70)
    
    # Create mapping of images to lessons
    image_to_lessons = {}
    for img, (area, task) in KNOWN_IMAGES.items():
        key = (area, task)
        if key not in image_to_lessons:
            image_to_lessons[key] = []
        image_to_lessons[key].append(img)
    
    # Check each lesson
    results = []
    for lesson in data['lessonPlans']:
        area = lesson.get('areaNumber', '')
        task = lesson.get('taskLetter', '').upper()
        key = (area, task)
        
        if key in image_to_lessons:
            expected_images = image_to_lessons[key]
            diagrams = lesson.get('diagrams', [])
            
            # Get existing image URLs
            existing_urls = [d.get('imageUrl', '') for d in diagrams if d.get('imageUrl')]
            existing_files = [url.split('/')[-1] for url in existing_urls if 'mark-berry' in url]
            
            missing = [img for img in expected_images if img not in existing_files]
            has_images = [img for img in expected_images if img in existing_files]
            
            results.append({
                'id': lesson.get('id', ''),
                'title': lesson.get('title', ''),
                'area': area,
                'task': task,
                'expected': expected_images,
                'has': has_images,
                'missing': missing
            })
    
    # Report results
    print("\nLessons that should have Mark Berry images:")
    print("-" * 70)
    
    all_good = True
    for r in results:
        status = "[OK]" if not r['missing'] else "[NEEDS IMAGES]"
        print(f"\n{status} [{r['id']}] {r['title']}")
        print(f"  Area {r['area']}, Task {r['task']}")
        if r['has']:
            print(f"  Has: {', '.join(r['has'])}")
        if r['missing']:
            print(f"  Missing: {', '.join(r['missing'])}")
            all_good = False
    
    return all_good, results

def verify_files_exist():
    """Verify all image files actually exist on disk."""
    images_dir = Path("public/images/mark-berry")
    
    print("\n" + "=" * 70)
    print("File Verification")
    print("=" * 70)
    
    if not images_dir.exists():
        print(f"[ERROR] Directory does not exist: {images_dir}")
        return False
    
    # Get all files in directory
    existing_files = {f.name for f in images_dir.iterdir() if f.is_file()}
    print(f"\nFound {len(existing_files)} files in {images_dir}")
    
    # Check each known image
    missing = []
    for img_name in KNOWN_IMAGES.keys():
        if img_name in existing_files:
            file_path = images_dir / img_name
            size = file_path.stat().st_size
            print(f"  [OK] {img_name} ({size:,} bytes)")
        else:
            missing.append(img_name)
            print(f"  [MISSING] {img_name}")
    
    if missing:
        print(f"\n[WARNING] {len(missing)} image(s) missing from disk")
        return False
    else:
        print(f"\n[SUCCESS] All {len(KNOWN_IMAGES)} images exist!")
        return True

def verify_diagram_viewer_support():
    """Verify DiagramViewer component supports imageUrl properly."""
    diagram_viewer_path = Path("src/components/DiagramViewer.tsx")
    
    print("\n" + "=" * 70)
    print("Component Verification")
    print("=" * 70)
    
    if not diagram_viewer_path.exists():
        print(f"[ERROR] DiagramViewer.tsx not found")
        return False
    
    content = diagram_viewer_path.read_text(encoding='utf-8')
    
    # Check for imageUrl support
    checks = {
        'imageUrl check': 'if (diagram.imageUrl)' in content or 'diagram.imageUrl' in content,
        'img tag rendering': '<img' in content and 'diagram.imageUrl' in content,
        'alt text support': 'alt=' in content,
    }
    
    print("\nDiagramViewer.tsx checks:")
    all_passed = True
    for check_name, passed in checks.items():
        status = "[OK]" if passed else "[FAIL]"
        print(f"  {status} {check_name}")
        if not passed:
            all_passed = False
    
    return all_passed

if __name__ == '__main__':
    # Run all checks
    lessons_ok, results = check_all_lessons()
    files_ok = verify_files_exist()
    component_ok = verify_diagram_viewer_support()
    
    # Final summary
    print("\n" + "=" * 70)
    print("Final Summary")
    print("=" * 70)
    print(f"Lessons: {'[OK]' if lessons_ok else '[NEEDS FIX]'}")
    print(f"Files: {'[OK]' if files_ok else '[NEEDS FIX]'}")
    print(f"Component: {'[OK]' if component_ok else '[NEEDS FIX]'}")
    
    if lessons_ok and files_ok and component_ok:
        print("\n[SUCCESS] All checks passed! Images are ready to use.")
    else:
        print("\n[WARNING] Some issues found. See details above.")

