import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { LessonPlan } from '../lessonPlanTypes';

interface LessonPlanCardProps {
  lesson: LessonPlan;
  isCompleted: boolean;
  isSaved: boolean;
  lastViewed?: string;
  onToggleSaved: (lessonId: string) => void;
  onToggleCompleted: (lessonId: string) => void;
}

/**
 * Memoized lesson plan card component
 * Optimized to prevent unnecessary re-renders
 * Ready for iOS conversion (can be converted to React Native View)
 */
const LessonPlanCard = memo(({
  lesson,
  isCompleted,
  isSaved,
  lastViewed,
  onToggleSaved,
  onToggleCompleted,
}: LessonPlanCardProps) => {
  return (
    <div className="lp-card">
      <div className="lp-card-header">
        <div className="lp-card-badge">
          Task {lesson.taskLetter}
        </div>
        <div className="lp-card-actions">
          <button
            onClick={() => onToggleSaved(lesson.id)}
            className={`btn-icon-action ${isSaved ? 'active' : ''}`}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
            aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            {isSaved ? '⭐' : '☆'}
          </button>
          <button
            onClick={() => onToggleCompleted(lesson.id)}
            className={`btn-icon-action ${isCompleted ? 'completed' : ''}`}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
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
});

LessonPlanCard.displayName = 'LessonPlanCard';

export default LessonPlanCard;

