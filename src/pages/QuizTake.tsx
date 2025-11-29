import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { quizService } from '../services/quizService';
import QuizCard from '../components/QuizCard';
import QuizTimer from '../components/QuizTimer';
import QuizResults from '../components/QuizResults';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import type { Quiz, QuizQuestion, QuizSession } from '../types/quizTypes';
import './QuizTake.css';

export default function QuizTake() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quizId = searchParams.get('id');
  const mode = searchParams.get('mode') as 'practice' | 'test' | 'quick' | null;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [answerMode, setAnswerMode] = useState<'individual' | 'end'>('individual');

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    }
  }, [quizId]);

  const loadQuiz = (id: string) => {
    const loadedQuiz = quizService.getQuiz(id);
    if (!loadedQuiz) {
      alert('Quiz not found');
      navigate('/quizzes');
      return;
    }

    setQuiz(loadedQuiz);

    // Load questions
    const quizQuestions = loadedQuiz.questionIds
      .map(qId => quizService.getQuestion(qId))
      .filter((q): q is QuizQuestion => q !== null);

    if (quizQuestions.length === 0) {
      alert('No questions available for this quiz');
      navigate('/quizzes');
      return;
    }

    setQuestions(quizQuestions);

    // Check for existing session
    const existingSession = quizService.getCurrentSession();
    if (existingSession && existingSession.quizId === id) {
      // Resume session
      if (confirm('Resume your previous session?')) {
        setSession(existingSession);
        setCurrentQuestionIndex(existingSession.currentQuestionIndex);
        return;
      }
    }

    // Start new session
    const newSession = quizService.startSession(loadedQuiz);
    setSession(newSession);
  };

  const handleAnswer = (selectedIndex: number, timeSpent: number) => {
    if (!session || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Submit answer
    quizService.submitAnswer(currentQuestion.id, selectedIndex, timeSpent);

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      
      // Update session from storage
      const updatedSession = quizService.getCurrentSession();
      if (updatedSession) {
        setSession(updatedSession);
      }
    } else {
      // Quiz complete
      const completedSession = quizService.completeSession();
      if (completedSession) {
        setSession(completedSession);
        setShowResults(true);
      }
    }
  };

  const handleTimeUp = () => {
    // Auto-submit current answer or mark as unanswered
    alert('Time is up! Your quiz will be submitted.');
    
    const completedSession = quizService.completeSession();
    if (completedSession) {
      setSession(completedSession);
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    if (quiz) {
      setShowResults(false);
      setCurrentQuestionIndex(0);
      const newSession = quizService.startSession(quiz);
      setSession(newSession);
    }
  };

  const handleReviewWrong = () => {
    if (session) {
      navigate(`/quizzes/review/${session.id}`);
    }
  };

  const handleContinue = () => {
    navigate('/quizzes');
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleQuit = () => {
    if (confirm('Quit quiz? Your progress will be saved and you can resume later.')) {
      navigate('/quizzes');
    }
  };

  if (!quiz || !session) {
    return (
      <div className="quiz-take-page">
        <div className="container">
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
          <div className="quiz-loading">
            <div className="loading-spinner">⏳</div>
            <p>Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-take-page">
        <div className="container">
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
          <div className="quiz-header">
            <Link to="/quizzes" className="back-link">← Back to Quizzes</Link>
            <h1>Quiz Results</h1>
          </div>

          <QuizResults
            session={session}
            onRetake={handleRetake}
            onReviewWrong={handleReviewWrong}
            onContinue={handleContinue}
          />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isPracticeMode = quiz.mode === 'practice' || mode === 'practice';

  return (
    <div className="quiz-take-page">
      <div className="container">
        <div className="quiz-header">
          <Link to="/quizzes" className="back-link">← Back to Quizzes</Link>
          <h1>{quiz.name}</h1>
          <p className="quiz-description">{quiz.description}</p>
        </div>

        <div className="quiz-controls">
          {quiz.timeLimit && (
            <QuizTimer
              timeLimit={quiz.timeLimit}
              startTime={session.startTime}
              onTimeUp={handleTimeUp}
              isPaused={isPaused}
            />
          )}

          <div className="quiz-progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-text">
              {currentQuestionIndex + 1} of {questions.length} questions
            </div>
          </div>

          <div className="quiz-action-buttons">
            <div className="answer-mode-controls">
              <label className="answer-mode-label">Answer Mode:</label>
              <div className="answer-mode-buttons">
                <button 
                  className={`answer-mode-btn ${answerMode === 'individual' ? 'active' : ''}`}
                  onClick={() => setAnswerMode('individual')}
                >
                  Check Each Answer
                </button>
                <button 
                  className={`answer-mode-btn ${answerMode === 'end' ? 'active' : ''}`}
                  onClick={() => setAnswerMode('end')}
                >
                  Check at End
                </button>
              </div>
            </div>
            {quiz.timeLimit && (
              <button className="quiz-pause-btn" onClick={handlePauseToggle}>
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
            )}
            <button className="quiz-quit-btn" onClick={handleQuit}>
              Save & Exit
            </button>
          </div>
        </div>

        {isPaused ? (
          <div className="quiz-paused">
            <div className="paused-icon">⏸️</div>
            <h2>Quiz Paused</h2>
            <p>Take a break! Your progress is saved.</p>
            <button className="btn-primary" onClick={handlePauseToggle}>
              Resume Quiz
            </button>
          </div>
        ) : (
          <>
            <QuizCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              showFeedback={isPracticeMode}
              answerMode={answerMode}
            />

            {isPracticeMode && (
              <div className="practice-mode-hint">
                <strong>💡 Practice Mode:</strong> 
                {answerMode === 'individual' 
                  ? " You'll see explanations after each question. Switch to Test Mode for a more realistic exam experience."
                  : " Answers will be checked at the end. Switch to 'Check Each Answer' mode to see explanations immediately."
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


