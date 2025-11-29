import { Link, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';
import lessonPlansData from '../lessonPlansData.json';
import acsData from '../acs_data.json';
import type { LessonPlan } from '../lessonPlanTypes';
import type { ACSData } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import LessonPlanCard from '../components/LessonPlanCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
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

export default function LessonPlansByArea() {
  const { areaNumber } = useParams<{ areaNumber: string }>();
  const location = useLocation();
  const [progress, setProgress] = useState<StudyProgress>({});
  const [savedLessons, setSavedLessons] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load progress and saved lessons from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('lessonProgress');
    const savedLessonsList = localStorage.getItem('savedLessons');
    
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
    if (savedLessonsList) {
      try {
        setSavedLessons(JSON.parse(savedLessonsList));
      } catch (error) {
        console.error('Error parsing saved lessons:', error);
      }
    }
  }, []);

  // Memoize toggle functions to prevent unnecessary re-renders
  const toggleSaved = useCallback((lessonId: string) => {
    setSavedLessons(prev => {
      const newSaved = prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      
      localStorage.setItem('savedLessons', JSON.stringify(newSaved));
      return newSaved;
    });
  }, []);

  const toggleCompleted = useCallback((lessonId: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          completed: !prev[lessonId]?.completed,
          lastViewed: new Date().toISOString(),
          notes: prev[lessonId]?.notes || ''
        }
      };
      
      localStorage.setItem('lessonProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  }, []);

  // Memoize area and lessons to avoid recalculation
  const area = useMemo(
    () => acs.areas.find(a => a.number === areaNumber),
    [areaNumber]
  );
  
  const areaLessons = useMemo(
    () => lessons.lessonPlans.filter(lesson => lesson.areaNumber === areaNumber),
    [areaNumber]
  );

  // Memoize filtered lessons to avoid recalculation on every render
  const filteredLessons = useMemo(() => {
    if (!debouncedSearchTerm) return areaLessons;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return areaLessons.filter(lesson => {
      return (
        lesson.title.toLowerCase().includes(searchLower) ||
        lesson.overview.toLowerCase().includes(searchLower) ||
        lesson.taskLetter.toLowerCase().includes(searchLower) ||
        lesson.objectives.some(obj => obj.toLowerCase().includes(searchLower)) ||
        lesson.keyTeachingPoints.some(point => point.toLowerCase().includes(searchLower)) ||
        `task ${lesson.taskLetter}`.includes(searchLower)
      );
    });
  }, [areaLessons, debouncedSearchTerm]);

  // Memoize progress calculations
  const completedCount = useMemo(
    () => areaLessons.filter(l => progress[l.id]?.completed).length,
    [areaLessons, progress]
  );
  
  const progressPercent = useMemo(
    () => areaLessons.length > 0 
      ? Math.round((completedCount / areaLessons.length) * 100) 
      : 0,
    [areaLessons.length, completedCount]
  );

  if (!area) {
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
            <h1 className="page-title">Area not found</h1>
          </div>
        </div>
      </>
    );
  }

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
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname, { areaNumber: areaNumber || '' })} />
          <div className="area-header">
            <h1 className="area-header-title">
              Area {area.number}: {area.name} - Lesson Plans
            </h1>
            <div className="area-task-count">
              {areaLessons.length} {areaLessons.length === 1 ? 'Lesson' : 'Lessons'}
            </div>
            {areaLessons.length > 0 && (
              <div className="lp-area-progress-summary">
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
          </div>

          {/* Search */}
          {areaLessons.length > 0 && (
            <div className="lp-search-bar">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search lessons in this area..."
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
          )}

          {/* Lesson Plan List */}
          <div className="lp-list">
            {filteredLessons.length === 0 ? (
              <div className="lp-empty">
                <span className="lp-empty-icon">📭</span>
                <p>
                  {searchTerm 
                    ? 'No lesson plans found matching your search.' 
                    : 'No lesson plans available for this area.'}
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
              filteredLessons.map(lesson => (
                <LessonPlanCard
                  key={lesson.id}
                  lesson={lesson}
                  isCompleted={progress[lesson.id]?.completed || false}
                  isSaved={savedLessons.includes(lesson.id)}
                  lastViewed={progress[lesson.id]?.lastViewed}
                  onToggleSaved={toggleSaved}
                  onToggleCompleted={toggleCompleted}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

