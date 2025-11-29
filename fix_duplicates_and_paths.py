#!/usr/bin/env python3
"""Fix duplicate diagrams and normalize imageUrl paths."""

import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

duplicates_found = 0
paths_normalized = 0

for lesson in data['lessonPlans']:
    diagrams = lesson.get('diagrams', [])
    if not diagrams:
        continue
    
    # Remove duplicates and normalize paths
    seen_urls = set()
    unique_diagrams = []
    
    for diagram in diagrams:
        image_url = diagram.get('imageUrl', '')
        if not image_url:
            continue
        
        # Normalize path: remove 'public/', convert backslashes to forward slashes
        normalized_url = image_url.replace('\\', '/').replace('public/', '/')
        
        # Ensure it starts with /
        if not normalized_url.startswith('/'):
            normalized_url = '/' + normalized_url
        
        if normalized_url not in seen_urls:
            seen_urls.add(normalized_url)
            # Update the diagram with normalized path
            diagram['imageUrl'] = normalized_url
            unique_diagrams.append(diagram)
        else:
            duplicates_found += 1
            print(f"Removed duplicate from {lesson.get('id')}: {diagram.get('title')} -> {image_url}")
    
    # Update lesson
    lesson['diagrams'] = unique_diagrams
    
    # Count normalized paths
    for diagram in unique_diagrams:
        original = diagram.get('imageUrl', '')
        if '\\' in original or 'public/' in original:
            paths_normalized += 1

# Save
with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\nSUCCESS: Fixed {duplicates_found} duplicate(s)")
print(f"SUCCESS: Normalized {paths_normalized} path(s)")
print("SUCCESS: Updated lessonPlansData.json saved!")

