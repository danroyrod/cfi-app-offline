import { Link } from 'react-router-dom';
import lessonPlansData from '../lessonPlansData.json';
import acsData from '../acs_data.json';
import type { LessonPlan } from '../lessonPlanTypes';
import type { ACSData } from '../types';
import './LessonPlansIndex.css';

const lessons = lessonPlansData as { lessonPlans: LessonPlan[] };
const acs = acsData as ACSData;

interface StudyProgress {
  [lessonPlanId: string]: {
    completed: boolean;
    lastViewed: string;
    notes: string;
  };
}

export default function LessonPlansIndex() {

  // Group lessons by area
  const lessonsByArea = lessons.lessonPlans.reduce((acc, lesson) => {
    if (!acc[lesson.areaNumber]) {
      acc[lesson.areaNumber] = [];
    }
    acc[lesson.areaNumber].push(lesson);
    return acc;
  }, {} as Record<string, LessonPlan[]>);


  // Load progress for calculating completion stats
  const getProgress = (): StudyProgress => {
    const savedProgress = localStorage.getItem('lessonProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  };

  const currentProgress = getProgress();

  // Get all areas that have lesson plans, sorted by area number
  const areasWithLessons = acs.areas
    .filter(area => lessonsByArea[area.number] && lessonsByArea[area.number].length > 0)
    .sort((a, b) => a.number.localeCompare(b.number));

  return (
    <>
      <div className="header">
        <div className="container header-content">
          <div className="header-title">Lesson Plans</div>
          <Link to="/" className="back-link">
            ← Home
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <h1 className="page-title">Lesson Plans by Area of Operation</h1>

          <div className="areas-grid">
            {areasWithLessons.map((area) => {
              const areaLessons = lessonsByArea[area.number];
              const completedCount = areaLessons.filter(l => currentProgress[l.id]?.completed).length;
              const progressPercent = areaLessons.length > 0 
                ? Math.round((completedCount / areaLessons.length) * 100) 
                : 0;

              return (
                <Link
                  key={area.number}
                  to={`/lesson-plans/area/${area.number}`}
                  className="area-card lp-area-card"
                >
                  <div className="area-number">{area.number}</div>
                  <div className="area-name">{area.name}</div>
                  <div className="area-task-count">
                    {areaLessons.length} {areaLessons.length === 1 ? 'Lesson' : 'Lessons'}
                  </div>
                  {areaLessons.length > 0 && (
                    <div className="lp-area-progress">
                      <div className="lp-progress-bar-container">
                        <div 
                          className="lp-progress-bar" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="lp-progress-text">
                        {completedCount} / {areaLessons.length} completed ({progressPercent}%)
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* View All Lesson Plans Link */}
          <div className="lp-view-all-section">
            <Link to="/lesson-plans/all" className="lp-view-all-link">
              <span className="lp-view-all-icon">📚</span>
              <span className="lp-view-all-content">
                <span className="lp-view-all-title">View All Lesson Plans</span>
                <span className="lp-view-all-description">Browse all lessons in one place with search and filters</span>
              </span>
              <span className="lp-view-all-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

