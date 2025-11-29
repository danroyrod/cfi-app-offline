import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { quizGenerator } from '../services/quizGenerator';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import lessonPlansDataRaw from '../lessonPlansData.json';
import type { LessonPlan } from '../lessonPlanTypes';
import type { Quiz, QuizStats, QuizSession } from '../types/quizTypes';
import './Quizzes.css';

const lessonPlansData = lessonPlansDataRaw as { lessonPlans: LessonPlan[] };

export default function Quizzes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<QuizSession[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuizzes(quizService.getAllQuizzes());
    setStats(quizService.getStats());
    setRecentSessions(quizService.getRecentSessions(5));
  };

  const handleGenerateAll = async () => {
    if (!confirm('Generate quiz questions for ALL 85 lessons? This will create 500+ questions and may take a moment.')) {
      return;
    }

    setIsGenerating(true);

    // Generate questions (simulate async for UX)
    setTimeout(() => {
      const allLessons = lessonPlansData.lessonPlans;
      quizGenerator.generateForAllLessons(allLessons);

      // Create default quizzes for each area
      const areas = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
      areas.forEach(areaCode => {
        const areaQuestions = quizService.getAreaQuestions(areaCode);
        if (areaQuestions.length >= 5) {
          quizService.createQuiz({
            name: `Area ${areaCode} Quiz`,
            description: `Complete quiz for Area ${areaCode}`,
            lessonIds: [],
            questionIds: areaQuestions.map(q => q.id),
            mode: 'test',
            difficulty: 'mixed',
            passingScore: 80,
            randomizeQuestions: true,
            randomizeOptions: true,
            showExplanations: false,
            isOfficial: true
          });
        }
      });

      setIsGenerating(false);
      loadData();
      alert(`Generated ${quizService.getAllQuestions().length} questions and ${areas.length} area quizzes!`);
    }, 100);
  };

  const handleGenerateForLesson = (lesson: LessonPlan) => {
    if (quizGenerator.hasGeneratedQuestions(lesson.id)) {
      if (!confirm(`This lesson already has ${quizService.getLessonQuestions(lesson.id).length} questions. Generate more?`)) {
        return;
      }
    }

    quizGenerator.generateFromLesson(lesson);
    
    // Create a quiz for this lesson
    const lessonQuestions = quizService.getLessonQuestions(lesson.id);
    if (lessonQuestions.length >= 3) {
      quizService.createQuiz({
        name: `${lesson.title} Quiz`,
        description: `Test your knowledge of ${lesson.title}`,
        lessonIds: [lesson.id],
        questionIds: lessonQuestions.map(q => q.id),
        mode: 'practice',
        difficulty: 'mixed',
        passingScore: 80,
        randomizeQuestions: true,
        randomizeOptions: true,
        showExplanations: true,
        isOfficial: true
      });
    }

    loadData();
    alert(`Generated ${quizGenerator.estimateQuestionCount(lesson)} questions for ${lesson.title}!`);
  };

  const handleQuickQuiz = () => {
    const quiz = quizGenerator.createQuickQuiz();
    if (quiz) {
      navigate(`/quizzes/take?id=${quiz.id}&mode=quick`);
    } else {
      alert('Not enough questions available. Generate questions first!');
    }
  };

  const handleMockCheckride = () => {
    const questionCount = quizService.getAllQuestions().length;
    if (questionCount < 20) {
      alert('Not enough questions for a mock checkride. Generate questions first!');
      return;
    }

    const quiz = quizGenerator.createMockCheckride(Math.min(questionCount, 50));
    if (quiz) {
      navigate(`/quizzes/take?id=${quiz.id}&mode=test`);
    }
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quizzes/take?id=${quizId}`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('Delete this quiz?')) {
      quizService.deleteQuiz(quizId);
      loadData();
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="quizzes-page">
      <div className="container">
        <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
        {/* Header */}
        <div className="quizzes-header">
          <Link to="/" className="back-link">← Home</Link>
          <h1 className="quizzes-title">
            <span className="title-icon">❓</span>
            Quizzes
          </h1>
          <p className="quizzes-subtitle">
            Test your knowledge and identify areas for improvement
          </p>
        </div>

        {/* Stats Dashboard */}
        {stats && stats.totalQuizzes > 0 && (
          <div className="quiz-stats-dashboard">
            <div className="stat-card stat-primary">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalQuizzes}</div>
                <div className="stat-label">Quizzes Taken</div>
              </div>
            </div>

            <div className="stat-card stat-score">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{stats.averageScore}%</div>
                <div className="stat-label">Average Score</div>
              </div>
            </div>

            <div className="stat-card stat-pass">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{Math.round(stats.passRate)}%</div>
                <div className="stat-label">Pass Rate</div>
              </div>
            </div>

            <div className="stat-card stat-questions">
              <div className="stat-icon">❓</div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalQuestionsAnswered}</div>
                <div className="stat-label">Questions</div>
              </div>
            </div>

            <div className="stat-card stat-perfect">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-number">{stats.perfectScores}</div>
                <div className="stat-label">Perfect Scores</div>
              </div>
            </div>

            <div className="stat-card stat-streak">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <div className="stat-number">{stats.currentStreak}</div>
                <div className="stat-label">Current Streak</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quiz-quick-actions">
          <button
            className="btn-primary btn-quick-quiz"
            onClick={handleQuickQuiz}
            disabled={quizService.getAllQuestions().length < 5}
          >
            <span className="btn-icon">⚡</span>
            <span className="btn-text">Quick Quiz (5 Questions)</span>
          </button>

          <button
            className="btn-secondary btn-mock"
            onClick={handleMockCheckride}
            disabled={quizService.getAllQuestions().length < 20}
          >
            <span className="btn-icon">🎓</span>
            <span className="btn-text">Mock Checkride</span>
          </button>

          <button
            className="btn-secondary btn-generate"
            onClick={() => setShowGenerator(!showGenerator)}
          >
            <span className="btn-icon">✨</span>
            <span className="btn-text">Generate Questions</span>
          </button>
        </div>

        {/* Generator Panel */}
        {showGenerator && (
          <div className="generator-panel">
            <div className="generator-header">
              <h3>Generate Quiz Questions</h3>
              <button className="generator-close" onClick={() => setShowGenerator(false)}>✕</button>
            </div>

            {isGenerating ? (
              <div className="generating-state">
                <div className="generating-spinner">⏳</div>
                <p>Generating questions from all lessons...</p>
                <p className="generating-note">This may take a moment...</p>
              </div>
            ) : (
              <div className="generator-content">
                <div className="generator-option">
                  <div className="option-info">
                    <h4>Generate for All Lessons</h4>
                    <p>Create questions from all 85 lesson plans (~500+ questions)</p>
                  </div>
                  <button className="btn-primary" onClick={handleGenerateAll}>
                    Generate All
                  </button>
                </div>

                <div className="generator-lessons">
                  <h4>Or select individual lessons:</h4>
                  <div className="lessons-grid">
                    {lessonPlansData.lessonPlans.slice(0, 12).map(lesson => (
                      <div key={lesson.id} className="lesson-card-mini">
                        <div className="lesson-card-title">{lesson.title}</div>
                        <div className="lesson-card-info">
                          ~{quizGenerator.estimateQuestionCount(lesson)} questions
                        </div>
                        <button
                          className="lesson-card-btn"
                          onClick={() => handleGenerateForLesson(lesson)}
                        >
                          Generate
                        </button>
                      </div>
                    ))}
                  </div>
                  <Link to="/lesson-plans" className="view-all-lessons">
                    View all 85 lessons →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Available Quizzes */}
        <div className="quizzes-section">
          <h2 className="section-title">Available Quizzes</h2>

          {quizzes.length === 0 ? (
            <div className="quizzes-empty">
              <div className="empty-icon">❓</div>
              <h3>No Quizzes Available</h3>
              <p>Generate quiz questions from your lesson plans to get started!</p>
              <button className="btn-primary" onClick={() => setShowGenerator(true)}>
                Generate Questions
              </button>
            </div>
          ) : (
            <div className="quizzes-grid">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="quiz-card">
                  <div className="quiz-card-header">
                    <h3>{quiz.name}</h3>
                    {!quiz.isOfficial && (
                      <button
                        className="quiz-delete-btn"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        title="Delete quiz"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <p className="quiz-card-description">{quiz.description}</p>

                  <div className="quiz-card-meta">
                    <span className="meta-item">
                      <span className="meta-icon">❓</span>
                      {quiz.questionIds.length} questions
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">📊</span>
                      {quiz.difficulty}
                    </span>
                    {quiz.timeLimit && (
                      <span className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        {quiz.timeLimit} min
                      </span>
                    )}
                    <span className="meta-item">
                      <span className="meta-icon">🎯</span>
                      {quiz.passingScore}% to pass
                    </span>
                  </div>

                  <button
                    className="quiz-start-btn"
                    onClick={() => handleStartQuiz(quiz.id)}
                  >
                    ▶️ Start Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <div className="recent-sessions-section">
            <h2 className="section-title">Recent Quiz Attempts</h2>
            <div className="sessions-list">
              {recentSessions.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <div className="session-name">{session.quizName}</div>
                    <div className="session-meta">
                      {new Date(session.startTime).toLocaleDateString()} • 
                      {' '}{session.totalQuestions} questions • 
                      {' '}{formatTime(session.totalTimeSpent)}
                    </div>
                  </div>

                  <div className="session-score">
                    <div className={`score-badge ${session.passed ? 'score-passed' : 'score-failed'}`}>
                      {session.score}%
                    </div>
                    {session.passed ? (
                      <span className="session-status status-passed">✅ Passed</span>
                    ) : (
                      <span className="session-status status-failed">❌ Failed</span>
                    )}
                  </div>

                  <button
                    className="session-review-btn"
                    onClick={() => navigate(`/quizzes/review/${session.id}`)}
                    title="Review this attempt"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






