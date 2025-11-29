import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("🎨 UPDATING CSS FILES FOR DARK MODE")
print("="*70)

# Color mappings - hard-coded colors to CSS variables
color_mappings = {
    # Backgrounds
    r'background:\s*#ffffff': 'background: var(--bg-primary)',
    r'background:\s*white': 'background: var(--bg-primary)',
    r'background-color:\s*#ffffff': 'background-color: var(--bg-primary)',
    r'background-color:\s*white': 'background-color: var(--bg-primary)',
    r'background:\s*#f8f9fa': 'background: var(--bg-secondary)',
    r'background-color:\s*#f8f9fa': 'background-color: var(--bg-secondary)',
    r'background:\s*#f1f3f5': 'background: var(--bg-tertiary)',
    
    # Text colors
    r'color:\s*#333': 'color: var(--text-primary)',
    r'color:\s*#2c3e50': 'color: var(--text-primary)',
    r'color:\s*#1a1a1a': 'color: var(--text-primary)',
    r'color:\s*#555': 'color: var(--text-secondary)',
    r'color:\s*#666': 'color: var(--text-secondary)',
    r'color:\s*#777': 'color: var(--text-muted)',
    r'color:\s*#999': 'color: var(--text-muted)',
    
    # Borders
    r'border:\s*1px solid #ddd': 'border: 1px solid var(--border-color)',
    r'border:\s*1px solid #e0e0e0': 'border: 1px solid var(--border-color)',
    r'border:\s*2px solid #e0e0e0': 'border: 2px solid var(--border-color)',
    r'border-bottom:\s*1px solid #ddd': 'border-bottom: 1px solid var(--border-color)',
    r'border-top:\s*1px solid #ddd': 'border-top: 1px solid var(--border-color)',
}

# Files to update
css_files = [
    'src/App.css',
    'src/pages/LessonPlanDetail.css',
    'src/pages/LessonPlansIndex.css'
]

total_replacements = 0

for filepath in css_files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        file_replacements = 0
        
        for pattern, replacement in color_mappings.items():
            matches = len(re.findall(pattern, content))
            if matches > 0:
                content = re.sub(pattern, replacement, content)
                file_replacements += matches
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {filepath}: {file_replacements} replacements")
            total_replacements += file_replacements
        else:
            print(f"⏭️  {filepath}: No changes needed")
    
    except FileNotFoundError:
        print(f"⚠️  {filepath}: File not found")

print(f"\n{'='*70}")
print(f"🎨 CSS UPDATE COMPLETE!")
print(f"{'='*70}")
print(f"Total replacements: {total_replacements}")
print(f"\n✅ Dark mode CSS variables implemented!")
print(f"🌐 Refresh browser: http://localhost:5175/")
print(f"🌙 Click theme toggle button (top-right) to test!")







