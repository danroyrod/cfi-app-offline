import { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion } from '../types/quizTypes';
import './QuizCard.css';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number, timeSpent: number) => void;
  showFeedback?: boolean;  // Practice mode: show immediate feedback
  isReview?: boolean;      // Review mode: show correct answer
  userAnswer?: number;     // For review mode
  answerMode?: 'individual' | 'end'; // How to show answers
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showFeedback = false,
  isReview = false,
  userAnswer,
  answerMode = 'individual'
}: QuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(userAnswer !== undefined ? userAnswer : null);
  const [startTime] = useState(Date.now());
  const [hasAnswered, setHasAnswered] = useState(isReview);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (isReview && userAnswer !== undefined) {
      setSelectedIndex(userAnswer);
      setHasAnswered(true);
      setShowExplanation(true);
    }
  }, [isReview, userAnswer]);

  // Keyboard shortcuts
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // Don't trigger if typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (hasAnswered && !isReview) return;

    // Number keys for options (1-4)
    if (e.key >= '1' && e.key <= '4') {
      const index = parseInt(e.key) - 1;
      if (index < question.options.length) {
        handleOptionSelect(index);
      }
    }

    // Enter to submit
    if (e.key === 'Enter' && selectedIndex !== null && !hasAnswered) {
      handleSubmit();
    }

    // Space to submit (if answer selected)
    if (e.key === ' ' && selectedIndex !== null && !hasAnswered) {
      e.preventDefault();
      handleSubmit();
    }
  }, [hasAnswered, selectedIndex, isReview, question.options.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleOptionSelect = (index: number) => {
    if (hasAnswered && !isReview) return;  // Can't change answer in test mode
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    if (hasAnswered && !isReview) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setHasAnswered(true);

    // Show feedback based on answer mode
    if (answerMode === 'individual' && showFeedback) {
      setShowExplanation(true);
    }

    if (!isReview) {
      onAnswer(selectedIndex, timeSpent);
    }
  };

  const handleNext = () => {
    if (!isReview) {
      onAnswer(selectedIndex!, Math.floor((Date.now() - startTime) / 1000));
    }
  };

  const isCorrect = selectedIndex === question.correctIndex;
  const getOptionClass = (index: number) => {
    if (!hasAnswered) {
      return selectedIndex === index ? 'selected' : '';
    }

    // Only show correct/incorrect indicators in individual mode or review mode
    if (answerMode === 'individual' || isReview) {
      if (index === question.correctIndex) {
        return 'correct';
      }

      if (selectedIndex === index && !isCorrect) {
        return 'incorrect';
      }
    }

    return 'disabled';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444'
    };
    return colors[difficulty as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <div className="quiz-card-meta">
          <span className="question-number">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span 
            className="question-difficulty"
            style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
          >
            {question.difficulty}
          </span>
          <span className="question-category">{question.category}</span>
        </div>
      </div>

      <div className="quiz-card-content">
        <div className="question-text">{question.question}</div>

        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${getOptionClass(index)}`}
              onClick={() => handleOptionSelect(index)}
              disabled={hasAnswered && !isReview}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="option-text">{option}</span>
              {hasAnswered && (answerMode === 'individual' || isReview) && index === question.correctIndex && (
                <span className="option-indicator">✓</span>
              )}
              {hasAnswered && (answerMode === 'individual' || isReview) && selectedIndex === index && !isCorrect && (
                <span className="option-indicator">✗</span>
              )}
            </button>
          ))}
        </div>

        {!hasAnswered && (
          <button
            className="quiz-submit-btn"
            onClick={handleSubmit}
            disabled={selectedIndex === null}
          >
            Submit Answer
          </button>
        )}

        {hasAnswered && showFeedback && answerMode === 'individual' && (
          <div className={`quiz-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
            <div className="feedback-header">
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            {showExplanation && (
              <div className="feedback-content">
                <div className="feedback-explanation">
                  <strong>📖 Explanation:</strong>
                  <p>{question.explanation}</p>
                </div>
                {question.acsReference && (
                  <div className="feedback-reference">
                    <strong>📋 ACS Reference:</strong> {question.acsReference}
                  </div>
                )}
                {question.teachingTip && (
                  <div className="feedback-tip">
                    <strong>💡 Teaching Tip:</strong> {question.teachingTip}
                  </div>
                )}
              </div>
            )}
            {!isReview && (
              <button className="quiz-next-btn" onClick={handleNext}>
                Next Question →
              </button>
            )}
          </div>
        )}

        {hasAnswered && !showFeedback && !isReview && (
          <button className="quiz-next-btn" onClick={handleNext}>
            Next Question →
          </button>
        )}
      </div>

      {!hasAnswered && (
        <div className="quiz-keyboard-hint">
          <span className="hint-text">
            ⌨️ Shortcuts: Press <kbd>1-4</kbd> to select • <kbd>Enter</kbd> to submit
          </span>
        </div>
      )}

      <div className="quiz-card-footer">
        <span className="lesson-title">{question.lessonTitle}</span>
      </div>
    </div>
  );
}

