import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import lessonPlansData from '../lessonPlansData.json';
import type { LessonPlan } from '../lessonPlanTypes';
import './LessonPlansIndex.css';

const lessons = lessonPlansData as { lessonPlans: LessonPlan[] };

interface StudyProgress {
  [lessonPlanId: string]: {
    completed: boolean;
    lastViewed: string;
    notes: string;
  };
}

export default function LessonPlansAll() {
  const [progress, setProgress] = useState<StudyProgress>({});
  const [savedLessons, setSavedLessons] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load progress and saved lessons from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('lessonProgress');
    const savedLessonsList = localStorage.getItem('savedLessons');
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    if (savedLessonsList) {
      setSavedLessons(JSON.parse(savedLessonsList));
    }
  }, []);

  const toggleSaved = (lessonId: string) => {
    const newSaved = savedLessons.includes(lessonId)
      ? savedLessons.filter(id => id !== lessonId)
      : [...savedLessons, lessonId];
    
    setSavedLessons(newSaved);
    localStorage.setItem('savedLessons', JSON.stringify(newSaved));
  };

  const toggleCompleted = (lessonId: string) => {
    const newProgress = {
      ...progress,
      [lessonId]: {
        ...progress[lessonId],
        completed: !progress[lessonId]?.completed,
        lastViewed: new Date().toISOString(),
        notes: progress[lessonId]?.notes || ''
      }
    };
    
    setProgress(newProgress);
    localStorage.setItem('lessonProgress', JSON.stringify(newProgress));
  };

  // Filter lessons by search term
  const filteredLessons = lessons.lessonPlans.filter(lesson => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      lesson.title.toLowerCase().includes(searchLower) ||
      lesson.overview.toLowerCase().includes(searchLower) ||
      lesson.areaNumber.toLowerCase().includes(searchLower) ||
      lesson.taskLetter.toLowerCase().includes(searchLower) ||
      lesson.objectives.some(obj => obj.toLowerCase().includes(searchLower)) ||
      lesson.keyTeachingPoints.some(point => point.toLowerCase().includes(searchLower)) ||
      `area ${lesson.areaNumber}`.includes(searchLower) ||
      `task ${lesson.taskLetter}`.includes(searchLower)
    );
  });

  return (
    <>
      <div className="header">
        <div className="container header-content">
          <div className="header-title">Lesson Plans</div>
          <Link to="/lesson-plans" className="back-link">
            ← Back to Lesson Plans
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <h1 className="page-title">All Lesson Plans</h1>

          {/* Search Bar */}
          <div className="lp-search-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search lessons by title, overview, area, task, objectives, key points..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="search-clear"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {searchTerm && (
            <div className="lp-results-summary">
              Found {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'} matching "{searchTerm}"
            </div>
          )}

          {/* Lesson Plan List */}
          <div className="lp-list">
            {filteredLessons.length === 0 ? (
              <div className="lp-empty">
                <span className="lp-empty-icon">📭</span>
                <p>
                  {searchTerm 
                    ? 'No lesson plans found matching your search.' 
                    : 'No lesson plans available.'}
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="btn-reset"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              filteredLessons.map(lesson => {
                const isCompleted = progress[lesson.id]?.completed;
                const isSaved = savedLessons.includes(lesson.id);
                const lastViewed = progress[lesson.id]?.lastViewed;

                return (
                  <div key={lesson.id} className="lp-card">
                    <div className="lp-card-header">
                      <div className="lp-card-badge">
                        Area {lesson.areaNumber} • Task {lesson.taskLetter}
                      </div>
                      <div className="lp-card-actions">
                        <button
                          onClick={() => toggleSaved(lesson.id)}
                          className={`btn-icon-action ${isSaved ? 'active' : ''}`}
                          title={isSaved ? 'Remove from saved' : 'Save for later'}
                        >
                          {isSaved ? '⭐' : '☆'}
                        </button>
                        <button
                          onClick={() => toggleCompleted(lesson.id)}
                          className={`btn-icon-action ${isCompleted ? 'completed' : ''}`}
                          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {isCompleted ? '✅' : '☐'}
                        </button>
                      </div>
                    </div>

                    <Link to={`/lesson-plan/${lesson.id}`} className="lp-card-link">
                      <h3 className="lp-card-title">{lesson.title}</h3>
                      <p className="lp-card-overview">{lesson.overview}</p>
                      
                      <div className="lp-card-meta">
                        <span className="lp-card-time">⏱️ {lesson.estimatedTime}</span>
                        {lastViewed && (
                          <span className="lp-card-viewed">
                            Last viewed: {new Date(lastViewed).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

