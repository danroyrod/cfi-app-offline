import re

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find lesson plan boundaries
pattern = r'\n    \},\n    \{'
matches = list(re.finditer(pattern, content))

# Check bracket balance at each boundary
for i, match in enumerate(matches[30:40], start=31):  # Check boundaries 31-40
    pos = match.start()
    check_content = content[:pos]
    open_braces = check_content.count('{')
    close_braces = check_content.count('}')
    diff = open_braces - close_braces
    line_num = check_content.count('\n') + 1
    
    # Find lesson plan ID before this boundary
    before_match = content[max(0, pos-1000):pos]
    id_matches = list(re.finditer(r'"id":\s*"([^"]+)"', before_match))
    if id_matches:
        lesson_id = id_matches[-1].group(1)
    else:
        lesson_id = "Unknown"
    
    print(f"Boundary {i} (line ~{line_num}): {lesson_id} - Braces diff: {diff}")
    if diff == 1:
        print(f"  *** FIRST OCCURRENCE OF MISSING BRACE! ***")
        # Show context
        start = max(0, pos - 200)
        end = min(len(content), pos + 100)
        print(f"  Context around boundary:")
        lines = content[start:end].split('\n')
        for j, line in enumerate(lines[:10]):
            print(f"    {line[:80]}")








