with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Check up to error position
error_pos = 860501
check_content = content[:error_pos]

# Count brackets
open_braces = check_content.count('{')
close_braces = check_content.count('}')
open_brackets = check_content.count('[')
close_brackets = check_content.count(']')

print(f"Up to position {error_pos}:")
print(f"  Braces: {open_braces} open, {close_braces} close (diff: {open_braces - close_braces})")
print(f"  Brackets: {open_brackets} open, {close_brackets} close (diff: {open_brackets - close_brackets})")

# Try to find where it becomes invalid
import json
for i in range(error_pos - 1000, error_pos + 100, 10):
    try:
        json.loads(content[:i])
        print(f"Valid up to position {i}")
        break
    except:
        pass








