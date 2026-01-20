import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    content = f.read()

error_pos = 860500
before = content[:error_pos]

# Check bracket balance
open_braces = before.count('{')
close_braces = before.count('}')
open_brackets = before.count('[')
close_brackets = before.count(']')

print(f"Brackets up to position {error_pos}:")
print(f"  Braces: {open_braces} open, {close_braces} close (diff: {open_braces - close_braces})")
print(f"  Brackets: {open_brackets} open, {close_brackets} close (diff: {open_brackets - close_brackets})")

# Check what's at the error position
print(f"\nCharacter at position {error_pos}: {repr(content[error_pos:error_pos+5])}")
print(f"Line number: {content[:error_pos].count(chr(10)) + 1}")

# Try to parse up to error position
try:
    # Try adding just a closing brace
    test_json = before.rstrip() + '}'
    data = json.loads(test_json)
    print("\nSUCCESS: If we add a closing brace, it parses as a complete JSON object")
    print(f"   Type: {type(data)}")
    if isinstance(data, dict):
        print(f"   Keys: {list(data.keys())[:5]}")
except Exception as e:
    print(f"\nERROR: Even with closing brace, error: {str(e)[:200]}")

# Check the structure around the error
line_num = content[:error_pos].count('\n') + 1
lines = content.split('\n')
if line_num <= len(lines):
    print(f"\nLine {line_num-1}: {repr(lines[line_num-2] if line_num > 1 else '')}")
    print(f"Line {line_num}: {repr(lines[line_num-1])}")
    if line_num < len(lines):
        print(f"Line {line_num+1}: {repr(lines[line_num])}")








