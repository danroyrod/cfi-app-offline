content = open('src/lessonPlansData.json', 'r', encoding='utf-8').read()

# Full file counts
total_open_braces = content.count('{')
total_close_braces = content.count('}')
total_open_brackets = content.count('[')
total_close_brackets = content.count(']')

print(f"Full file:")
print(f"  Braces: {total_open_braces} open, {total_close_braces} close (diff: {total_open_braces - total_close_braces})")
print(f"  Brackets: {total_open_brackets} open, {total_close_brackets} close (diff: {total_open_brackets - total_close_brackets})")

# Check at error position
error_pos = 860500
before = content[:error_pos]
after = content[error_pos:]

before_open_braces = before.count('{')
before_close_braces = before.count('}')
before_open_brackets = before.count('[')
before_close_brackets = before.count(']')

after_open_braces = after.count('{')
after_close_braces = after.count('}')
after_open_brackets = after.count('[')
after_close_brackets = after.count(']')

print(f"\nUp to error position {error_pos}:")
print(f"  Braces: {before_open_braces} open, {before_close_braces} close (diff: {before_open_braces - before_close_braces})")
print(f"  Brackets: {before_open_brackets} open, {before_close_brackets} close (diff: {before_open_brackets - before_close_brackets})")

print(f"\nAfter error position:")
print(f"  Braces: {after_open_braces} open, {after_close_braces} close (diff: {after_open_braces - after_close_braces})")
print(f"  Brackets: {after_open_brackets} open, {after_close_brackets} close (diff: {after_open_brackets - after_close_brackets})")

# The file should end with: ], }, }
# Root object: {
#   lessonPlans: [
#     ...lesson plans...
#   ],
#   metadata: { ... }
# }
# So we need: 1 root {, 1 lessonPlans [, then for each lesson plan we need { }, and finally ], }, }








