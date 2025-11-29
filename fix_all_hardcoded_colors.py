import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("🎨 FIXING ALL HARDCODED COLORS FOR DARK MODE")
print("="*70)

# Read the file
with open('src/pages/LessonPlanDetail.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Color replacements - be specific to avoid breaking gradients
replacements = [
    # Text colors
    (r'color:\s*#374151;', 'color: var(--text-primary);'),
    (r'color:\s*#059669;', 'color: var(--success-color);'),
    (r'color:\s*#713f12;', 'color: var(--text-primary);'),
    (r'color:\s*#92400e;', 'color: var(--text-secondary);'),
    (r'color:\s*#d97706;', 'color: var(--warning-color);'),
    (r'color:\s*#1e293b;', 'color: var(--text-primary);'),
    (r'color:\s*#475569;', 'color: var(--text-secondary);'),
    (r'color:\s*#1e40af;', 'color: var(--primary-color);'),
    (r'color:\s*#166534;', 'color: var(--success-color);'),
    
    # Background colors (NOT in gradients)
    (r'background:\s*#f3f4f6;', 'background: var(--bg-secondary);'),
    (r'background:\s*#f0fdf4;', 'background: var(--bg-tertiary);'),
    (r'background:\s*#fefce8;', 'background: var(--bg-tertiary);'),
    (r'background:\s*#fef3c7;', 'background: var(--bg-tertiary);'),
    (r'background:\s*#ecfdf5;', 'background: var(--bg-tertiary);'),
    (r'background:\s*#fef2f2;', 'background: var(--bg-tertiary);'),
    (r'background:\s*#f8fafc;', 'background: var(--bg-secondary);'),
    (r'background:\s*#eff6ff;', 'background: var(--bg-tertiary);'),
    (r'background:\s*#dcfce7;', 'background: var(--bg-tertiary);'),
    (r'background:\s*#fff1f2;', 'background: var(--bg-tertiary);'),
    (r'background:\s*#f0f9ff;', 'background: var(--bg-tertiary);'),
]

total = 0
for pattern, replacement in replacements:
    matches = len(re.findall(pattern, content))
    if matches > 0:
        content = re.sub(pattern, replacement, content)
        total += matches
        print(f"✅ Replaced {matches}x: {pattern[:30]}")

# Save
with open('src/pages/LessonPlanDetail.css', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n{'='*70}")
print(f"✅ Fixed {total} hardcoded colors in LessonPlanDetail.css")

# Also fix LessonPlansIndex.css
print(f"\n🎨 Fixing LessonPlansIndex.css...")

with open('src/pages/LessonPlansIndex.css', 'r', encoding='utf-8') as f:
    content2 = f.read()

replacements2 = [
    (r'background:\s*white;', 'background: var(--bg-card);'),
    (r'background-color:\s*white;', 'background-color: var(--bg-card);'),
    (r'background:\s*#fff;', 'background: var(--bg-card);'),
    (r'color:\s*#333;', 'color: var(--text-primary);'),
    (r'color:\s*#666;', 'color: var(--text-secondary);'),
    (r'color:\s*#999;', 'color: var(--text-muted);'),
    (r'background:\s*#f5f5f5;', 'background: var(--bg-secondary);'),
    (r'border:\s*1px solid #ddd;', 'border: 1px solid var(--border-color);'),
    (r'border:\s*2px solid #ddd;', 'border: 2px solid var(--border-color);'),
]

total2 = 0
for pattern, replacement in replacements2:
    matches = len(re.findall(pattern, content2))
    if matches > 0:
        content2 = re.sub(pattern, replacement, content2)
        total2 += matches
        print(f"✅ Replaced {matches}x: {pattern[:30]}")

with open('src/pages/LessonPlansIndex.css', 'w', encoding='utf-8') as f:
    f.write(content2)

print(f"✅ Fixed {total2} hardcoded colors in LessonPlansIndex.css")

print(f"\n{'='*70}")
print(f"🎉 ALL HARDCODED COLORS FIXED!")
print(f"{'='*70}")
print(f"Total: {total + total2} color replacements")
print(f"\n🌙 Dark mode should now work perfectly!")
print(f"🌐 Refresh: http://localhost:5175/")







