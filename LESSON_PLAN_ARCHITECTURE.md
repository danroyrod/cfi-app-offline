# Lesson Plan System - Architecture Overview

## 🏗️ How It All Connects

```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                           │
└─────────────────────────────────────────────────────────────┘

Landing Page (/)
       ↓
Areas Index (/areas)
       ↓
Area Detail (/area/I)
       ↓
Task Detail (/area/I/task/A) ←──┐
       ↓                         │
   [📚 View Lesson Plan]         │
       ↓                         │
Lesson Plan Detail               │
(/lesson-plan/LP-I-A)            │
       ↓                         │
   [← Back to ACS Task]──────────┘
```

---

## 📁 File Structure

```
cfi-acs-app-v2/
├── src/
│   ├── types.ts                 # ACS types
│   ├── lessonPlanTypes.ts       # 🆕 Lesson plan types
│   ├── acs_data.json            # ACS content (85 tasks)
│   ├── lessonPlansData.json     # 🆕 Lesson plans (2 so far, 83 to go)
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx      # Home
│   │   ├── AreasIndex.tsx       # All areas
│   │   ├── AreaDetail.tsx       # Tasks in an area
│   │   ├── TaskDetail.tsx       # 🔗 ACS task (links to lesson plan)
│   │   ├── LessonPlanDetail.tsx # 🆕 Lesson plan viewer
│   │   └── LessonPlanDetail.css # 🆕 Lesson plan styles
│   │
│   ├── App.tsx                  # 🔗 Routes (added lesson plan route)
│   └── App.css                  # 🔗 Styles (added lesson plan link style)
│
└── LESSON_PLANS_STATUS.md       # 🆕 Progress tracker
```

---

## 🔄 Data Flow

### ACS Task → Lesson Plan Linking

```typescript
// In TaskDetail.tsx
const lessonPlanId = `LP-${areaNumber}-${taskLetter}`;
// Example: Area I, Task A = "LP-I-A"

const hasLessonPlan = lessonPlansData.lessonPlans.some(
  (lp) => lp.id === lessonPlanId
);

// If lesson plan exists, show link:
<Link to={`/lesson-plan/${lessonPlanId}`}>
  📚 View Lesson Plan for This Task →
</Link>
```

### Lesson Plan → ACS Task Linking

```typescript
// In LessonPlanDetail.tsx
const lessonPlan = {
  id: "LP-I-A",
  areaNumber: "I",
  taskLetter: "A",
  // ... lesson content
}

// Link back to ACS:
<Link to={`/area/${lessonPlan.areaNumber}/task/${lessonPlan.taskLetter}`}>
  View Related ACS Task
</Link>
```

---

## 🎨 Visual Design System

### Color Coding:
- **ACS Content**: Blue (#1e40af, #3b82f6)
- **Lesson Plans**: Green (#059669, #10b981)
- **Warnings/Safety**: Red (#dc2626, #ef4444)
- **Notes**: Yellow/Amber (#f59e0b, #fef3c7)

### Section Icons:
- 🎯 Objectives
- 📚 References
- 📋 Prerequisites
- 👨‍🏫 Teaching Script
- 💡 Key Points
- ⚠️ Common Errors
- 📐 Diagrams
- ✅ Completion Standards
- 🔴 Safety
- 📝 Notes

---

## 🔑 Key Features of Lesson Plan System

### 1. Teaching Script (The Breakthrough Feature)
Each lesson plan has a detailed, phase-by-phase script:
- **What the instructor does**
- **What the student does**
- **Key points to emphasize**
- **Timing for each phase**

Example:
```json
{
  "phase": "Demonstration - Normal Takeoff",
  "duration": "10 minutes",
  "instructorActions": [
    "Narrate every action: 'Clearing the area...'",
    "Smoothly advance throttle to full power",
    "Call out: 'Airspeed alive... right rudder'"
  ],
  "studentActions": [
    "Observe control inputs",
    "Note timing of each phase"
  ],
  "keyPoints": [
    "Smooth, continuous control inputs",
    "Eyes outside during takeoff"
  ]
}
```

### 2. Common Errors (Critical for CFIs)
Real mistakes students make:
- "Inadequate right rudder - airplane veers left"
- "Rotating too early (mushing) or too late (wheelbarrowing)"
- Each with clear identification and correction

### 3. ASCII Diagrams
Text-based diagrams that work everywhere:
```
Ground Roll -----> Rotation -----> Liftoff -----> VY Climb
[Rudder+Aileron]  [Ease back]   [Positive rate] [79 kts]
```

### 4. ACS Integration
Every completion standard links to specific ACS codes:
```json
{
  "standard": "Establish pitch for VY ±5 knots",
  "acsReference": "AI.VII.A.S12",
  "tolerance": "±5 knots"
}
```

---

## 🚀 How to Use (For CFIs)

### Pre-Flight:
1. Navigate to the task you're teaching
2. Click "📚 View Lesson Plan"
3. Review the teaching script
4. Print or save for reference
5. Gather required equipment

### During Lesson:
1. Follow the phase-by-phase script
2. Reference key teaching points
3. Watch for common errors
4. Use completion standards for grading

### Post-Flight:
1. Assign suggested homework
2. Note any safety considerations that arose
3. Update personal notes

---

## 💻 Development Workflow

### Adding a New Lesson Plan:

1. **Choose a task** from ACS (e.g., Area VII, Task B - Normal Approach and Landing)

2. **Create lesson plan ID**: `LP-VII-B`

3. **Add to** `src/lessonPlansData.json`:
```json
{
  "id": "LP-VII-B",
  "areaNumber": "VII",
  "taskLetter": "B",
  "title": "Normal Approach and Landing",
  "estimatedTime": "1.0 hours",
  // ... fill in all sections
}
```

4. **Hot reload** - Changes appear immediately at http://localhost:5174/

5. **Test**:
   - Visit `/area/VII/task/B`
   - See "📚 View Lesson Plan" button appear
   - Click to view lesson plan
   - Navigate back to ACS task

---

## 🎓 Why This Is Groundbreaking

### Before:
- CFIs used scattered resources
- No standardized lesson structure
- Hard to link ACS standards to teaching
- Inconsistent quality across instructors

### After (With This App):
- ✅ Every ACS task has a complete lesson plan
- ✅ Standardized teaching scripts anyone can follow
- ✅ Direct links between standards and instruction
- ✅ Built-in best practices from experienced CFIs
- ✅ Mobile-friendly for use in the field
- ✅ Printable lesson plans
- ✅ Progressive complexity (ground → flight)

---

## 📈 Future Enhancements

### Phase 3 (After Content Complete):
- [ ] Search across all lesson plans
- [ ] Filter by aircraft type (ASEL, AMEL, ASES, AMES)
- [ ] Print-friendly CSS
- [ ] Export lesson plans as PDF
- [ ] Lesson plan templates/wizard
- [ ] Community contributions
- [ ] Video integration (link to YouTube demonstrations)

### Phase 4 (iOS App):
- [ ] Offline access to all lesson plans
- [ ] Notes and annotations
- [ ] Progress tracking
- [ ] Integration with student records
- [ ] Weather integration for flight lessons
- [ ] Aircraft-specific adaptations

---

## 🎯 Success Metrics

When complete:
- **85/85 tasks** have complete lesson plans
- **100% ACS coverage**
- **Professional-quality** teaching scripts
- **Helpful diagrams** for every maneuver
- **Ready for iOS** conversion

**Current Progress: 2/85 (2.4%)**

---

*Built with ❤️ for flight instructors, by flight instructors*

