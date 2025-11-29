import { Link } from 'react-router-dom';
import type { QuizSession } from '../types/quizTypes';
import { quizScoring } from '../services/quizScoring';
import './QuizResults.css';

interface QuizResultsProps {
  session: QuizSession;
  onRetake?: () => void;
  onReviewWrong?: () => void;
  onContinue?: () => void;
}

export default function QuizResults({ session, onRetake, onReviewWrong, onContinue }: QuizResultsProps) {
  const gradeResult = quizScoring.gradeSession(session);
  const hasWrongAnswers = session.correctAnswers < session.totalQuestions;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getPerformanceEmoji = () => {
    if (gradeResult.score === 100) return '🏆';
    if (gradeResult.score >= 90) return '🌟';
    if (gradeResult.score >= 80) return '✅';
    if (gradeResult.score >= 70) return '📖';
    return '📝';
  };

  const getPerformanceClass = () => {
    if (gradeResult.score >= 90) return 'performance-excellent';
    if (gradeResult.score >= 80) return 'performance-good';
    if (gradeResult.score >= 70) return 'performance-satisfactory';
    return 'performance-needs-improvement';
  };

  return (
    <div className={`quiz-results ${getPerformanceClass()}`}>
      <div className="results-header">
        <div className="results-icon">
          {getPerformanceEmoji()}
        </div>
        <h2 className="results-title">
          {session.passed ? 'Quiz Passed!' : 'Quiz Complete'}
        </h2>
        <div className="results-grade">{gradeResult.grade}</div>
      </div>

      <div className="results-score-display">
        <div className="score-circle">
          <svg viewBox="0 0 100 100" className="score-circle-svg">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--bg-tertiary)"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - gradeResult.score / 100)}`}
              transform="rotate(-90 50 50)"
              className="score-circle-progress"
            />
          </svg>
          <div className="score-text">
            <div className="score-number">{gradeResult.score}%</div>
            <div className="score-label">Score</div>
          </div>
        </div>
      </div>

      <div className="results-feedback">
        <p>{gradeResult.feedback}</p>
      </div>

      <div className="results-stats-grid">
        <div className="result-stat">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{session.correctAnswers}</div>
            <div className="stat-label">Correct</div>
          </div>
        </div>

        <div className="result-stat">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{session.totalQuestions - session.correctAnswers}</div>
            <div className="stat-label">Incorrect</div>
          </div>
        </div>

        <div className="result-stat">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{session.totalQuestions}</div>
            <div className="stat-label">Total Questions</div>
          </div>
        </div>

        <div className="result-stat">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{formatTime(session.totalTimeSpent)}</div>
            <div className="stat-label">Time Spent</div>
          </div>
        </div>
      </div>

      {session.weakAreas && session.weakAreas.length > 0 && (
        <div className="results-weak-areas">
          <h3>📊 Areas for Improvement</h3>
          <div className="weak-areas-list">
            {session.weakAreas.map((area, index) => (
              <div key={index} className="weak-area-item">
                <div className="weak-area-info">
                  <div className="weak-area-title">{area.lessonTitle || area.category}</div>
                  <div className="weak-area-meta">
                    {area.questionCount} question{area.questionCount !== 1 ? 's' : ''} • {Math.round(area.accuracy)}% accuracy
                  </div>
                </div>
                <div className="weak-area-bar">
                  <div 
                    className="weak-area-fill"
                    style={{ width: `${area.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="study-recommendations">
            <p><strong>💡 Recommended Study:</strong></p>
            <ul>
              <li>Review lesson plans for these topics</li>
              <li>Listen to audio lessons</li>
              <li>Study flashcards for weak areas</li>
              <li>Retake quiz to verify improvement</li>
            </ul>
          </div>
        </div>
      )}

      <div className="results-actions">
        {hasWrongAnswers && onReviewWrong && (
          <button className="btn-secondary btn-review" onClick={onReviewWrong}>
            <span className="btn-icon">🔍</span>
            Review Wrong Answers
          </button>
        )}
        
        {onRetake && (
          <button className="btn-primary btn-retake" onClick={onRetake}>
            <span className="btn-icon">🔄</span>
            Retake Quiz
          </button>
        )}

        {onContinue && (
          <button className="btn-primary btn-continue" onClick={onContinue}>
            <span className="btn-icon">→</span>
            Continue
          </button>
        )}

        <Link to="/quizzes" className="btn-secondary">
          <span className="btn-icon">📚</span>
          All Quizzes
        </Link>
      </div>
    </div>
  );
}






