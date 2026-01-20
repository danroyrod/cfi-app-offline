import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Check bracket balance at each lesson plan boundary
error_pos = 860500
before = content[:error_pos]

# Find all lesson plan boundaries (where one lesson plan ends and another begins)
import re
# Pattern: closing brace, comma, newline, opening brace for next lesson plan
pattern = r'\n    \},\n    \{'
matches = list(re.finditer(pattern, before))

print(f"Found {len(matches)} lesson plan boundaries before error position")
print(f"Error is at line {before.count(chr(10)) + 1}")

# Check bracket balance after each lesson plan
for i, match in enumerate(matches[-5:], start=len(matches)-4):  # Check last 5
    pos = match.end() - 1  # Position after the opening brace of next lesson plan
    check_content = content[:pos]
    open_braces = check_content.count('{')
    close_braces = check_content.count('}')
    diff = open_braces - close_braces
    line_num = check_content.count('\n') + 1
    
    # Try to find which lesson plan this is
    lesson_start = match.start()
    # Find the lesson plan ID before this boundary
    id_match = re.search(r'"id":\s*"([^"]+)"', content[max(0, lesson_start-500):lesson_start])
    lesson_id = id_match.group(1) if id_match else "Unknown"
    
    print(f"\nAfter lesson plan boundary {i+1} (around line {line_num}):")
    print(f"  Lesson ID: {lesson_id}")
    print(f"  Braces: {open_braces} open, {close_braces} close (diff: {diff})")
    
    if diff == 1:
        print(f"  *** THIS IS WHERE THE MISSING BRACE SHOULD BE! ***")








