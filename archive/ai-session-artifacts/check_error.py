import json

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    content = f.read()

error_pos = 977342
before = content[:error_pos].rstrip()

# Check bracket balance
open_braces = before.count('{')
close_braces = before.count('}')
open_brackets = before.count('[')
close_brackets = before.count(']')

print(f"Brackets up to position {error_pos}:")
print(f"  Braces: {open_braces} open, {close_braces} close (diff: {open_braces - close_braces})")
print(f"  Brackets: {open_brackets} open, {close_brackets} close (diff: {open_brackets - close_brackets})")

# Try to parse
try:
    data = json.loads(before)
    print("\nSUCCESS: Valid JSON up to error position!")
except json.JSONDecodeError as e:
    print(f"\nERROR: {e.msg} at position {e.pos}")
    print(f"Line: {before.count(chr(10)) + 1}")
    print(f"Context: {repr(content[max(0, e.pos-50):e.pos+50])}")








