import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studyAnalyticsService, type AreaMastery, type StudyInsight } from '../services/studyAnalyticsService';
import { flashcardService } from '../services/flashcardService';
import './StudyProgress.css';

/**
 * Study Progress Dashboard (#7)
 * Shows per-area mastery, weak spots, and study insights.
 * Only renders if the user has studied flashcards (has data).
 */
export default function StudyProgress() {
  const [areas, setAreas] = useState<AreaMastery[]>([]);
  const [insights, setInsights] = useState<StudyInsight[]>([]);
  const [readiness, setReadiness] = useState(0);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const stats = flashcardService.getStats();
    if (stats.totalCards === 0) {
      setHasData(false);
      return;
    }
    setHasData(true);
    setAreas(studyAnalyticsService.getAreaMastery());
    setInsights(studyAnalyticsService.getInsights());
    setReadiness(studyAnalyticsService.getReadinessScore());
  }, []);

  if (!hasData) return null;

  return (
    <div className="study-progress">
      <div className="study-progress-header">
        <h3 className="study-progress-title">📊 Study Progress</h3>
        <div className="study-readiness">
          <span className="readiness-label">Checkride Readiness</span>
          <span className="readiness-score">{readiness}%</span>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="study-insights">
          {insights.slice(0, 3).map((insight, i) => (
            <div key={i} className={`insight-item insight-${insight.priority}`}>
              <span className="insight-icon">
                {insight.type === 'weak-area' ? '⚠️' :
                 insight.type === 'due-review' ? '📅' :
                 insight.type === 'streak' ? '🔥' : '🏆'}
              </span>
              <span className="insight-message">{insight.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="area-mastery-grid">
        {areas.map(area => (
          <div key={area.areaNumber} className="area-mastery-item">
            <div className="area-mastery-header">
              <span className="area-mastery-number">{area.areaNumber}</span>
              <span className="area-mastery-percent">{area.masteryPercent}%</span>
            </div>
            <div className="area-mastery-bar">
              <div
                className="area-mastery-fill"
                style={{ width: `${area.masteryPercent}%` }}
                data-level={
                  area.masteryPercent >= 80 ? 'high' :
                  area.masteryPercent >= 50 ? 'medium' : 'low'
                }
              />
            </div>
            <div className="area-mastery-name">{area.areaName}</div>
          </div>
        ))}
      </div>

      <Link to="/flashcards" className="study-progress-cta">
        Study Now →
      </Link>
    </div>
  );
}
