import json
import sys

with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    content = f.read()

try:
    data = json.loads(content)
    print(f"SUCCESS: JSON is valid!")
    print(f"Total lesson plans: {len(data.get('lessonPlans', []))}")
    sys.exit(0)
except json.JSONDecodeError as e:
    print(f"ERROR at position {e.pos}: {e.msg}")
    print(f"Line: {content[:e.pos].count(chr(10)) + 1}")
    
    # Try to find the issue
    error_pos = e.pos
    before = content[:error_pos]
    after = content[error_pos:error_pos+100]
    
    print(f"\nContext before error (last 200 chars):")
    print(repr(before[-200:]))
    print(f"\nContext after error (first 100 chars):")
    print(repr(after))
    
    # Check bracket balance
    open_braces = before.count('{')
    close_braces = before.count('}')
    open_brackets = before.count('[')
    close_brackets = before.count(']')
    
    print(f"\nBracket balance up to error:")
    print(f"  Braces: {open_braces} open, {close_braces} close (diff: {open_braces - close_braces})")
    print(f"  Brackets: {open_brackets} open, {close_brackets} close (diff: {open_brackets - close_brackets})")
    
    sys.exit(1)








