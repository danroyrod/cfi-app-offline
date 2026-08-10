#!/usr/bin/env python3
"""Fix duplicate diagram in LP-IX-E."""

import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find LP-IX-E
for lesson in data['lessonPlans']:
    if lesson.get('id') == 'LP-IX-E':
        diagrams = lesson.get('diagrams', [])
        print(f"Before: {len(diagrams)} diagrams")
        
        # Remove duplicates - keep only unique imageUrl
        seen_urls = set()
        unique_diagrams = []
        for diagram in diagrams:
            image_url = diagram.get('imageUrl', '')
            # Normalize path
            normalized_url = image_url.replace('\\', '/').replace('public/', '/')
            if normalized_url not in seen_urls:
                seen_urls.add(normalized_url)
                # Normalize the imageUrl in the diagram
                diagram['imageUrl'] = normalized_url
                unique_diagrams.append(diagram)
            else:
                print(f"  Removing duplicate: {diagram.get('title')} -> {image_url}")
        
        lesson['diagrams'] = unique_diagrams
        print(f"After: {len(unique_diagrams)} diagrams")
        break

# Save
with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("SUCCESS: Fixed duplicate and saved!")

