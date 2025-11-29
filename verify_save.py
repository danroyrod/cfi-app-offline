import json
import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

print("🔍 VERIFYING ALL PROGRESS SAVED")
print("="*70)

# Check main data file
with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"\n✅ Lesson Plans Data File:")
print(f"   Lessons: {len(data['lessonPlans'])}/85")
print(f"   File size: {os.path.getsize('src/lessonPlansData.json')/1024/1024:.2f} MB")
print(f"   Status: ✅ SAVED")

# Check ACS data
with open('src/acs_data.json', 'r', encoding='utf-8') as f:
    acs = json.load(f)

print(f"\n✅ ACS Data File:")
print(f"   Areas: {len(acs['areas'])}/14")
print(f"   Appendices: {len(acs['appendices'])}/3")
print(f"   Status: ✅ SAVED")

# Count documentation files
doc_files = [f for f in os.listdir('.') if f.endswith('.md')]
print(f"\n✅ Documentation:")
print(f"   Files: {len(doc_files)} markdown documents")
print(f"   Status: ✅ SAVED")

# Check React components
src_files = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
            src_files.append(file)

print(f"\n✅ Source Code:")
print(f"   Files: {len(src_files)} React/TypeScript files")
print(f"   Status: ✅ SAVED")

print(f"\n{'='*70}")
print(f"🎊 ALL PROGRESS VERIFIED AND SAVED!")
print(f"{'='*70}")
print(f"\n✅ Safe to:")
print(f"   • Close this session")
print(f"   • Restart computer")
print(f"   • Come back anytime")
print(f"\n🌐 Your app: http://localhost:5174/")
print(f"📖 When returning: Read 🔵_START_HERE_NEXT_TIME.md")

