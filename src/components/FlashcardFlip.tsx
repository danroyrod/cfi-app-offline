import { useState, useEffect } from 'react';
import type { Flashcard, FlashcardDifficulty } from '../types/flashcardTypes';
import './FlashcardFlip.css';

interface FlashcardFlipProps {
  card: Flashcard;
  onRate: (difficulty: FlashcardDifficulty) => void;
  showAnswer?: boolean;
  cardNumber?: number;
  totalCards?: number;
}

export default function FlashcardFlip({ 
  card, 
  onRate, 
  showAnswer = false,
  cardNumber,
  totalCards 
}: FlashcardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(showAnswer);
  }, [card.id, showAnswer]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (difficulty: FlashcardDifficulty) => {
    // Call the parent's onRate handler
    onRate(difficulty);
    // Note: The parent component will handle moving to the next card
    // and resetting the flip state via the useEffect above
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'objective': '🎯',
      'teaching-point': '📝',
      'error': '⚠️',
      'standard': '✅',
      'custom': '💡'
    };
    return icons[category] || '📚';
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'objective': '#3b82f6',
      'teaching-point': '#8b5cf6',
      'error': '#ef4444',
      'standard': '#10b981',
      'custom': '#f59e0b'
    };
    return colors[category] || '#6b7280';
  };

  const getDifficultyIcon = (difficulty: string): string => {
    const icons: Record<string, string> = {
      'easy': '🟢',
      'medium': '🟡',
      'hard': '🔴'
    };
    return icons[difficulty] || '⚪';
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'new': '#3b82f6',
      'learning': '#f59e0b',
      'reviewing': '#8b5cf6',
      'mastered': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="flashcard-container">
      {(cardNumber !== undefined && totalCards !== undefined) && (
        <div className="flashcard-progress">
          Card {cardNumber} of {totalCards}
        </div>
      )}

      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-inner">
          {/* Front Side */}
          <div className="flashcard-face flashcard-front">
            <div className="flashcard-header">
              <div className="flashcard-category-info">
                <span 
                  className="flashcard-category"
                  style={{ color: getCategoryColor(card.category) }}
                >
                  {getCategoryIcon(card.category)} {card.category.replace('-', ' ')}
                </span>
                <span className="flashcard-difficulty">
                  {getDifficultyIcon('medium')} Medium
                </span>
              </div>
              <span 
                className="flashcard-status"
                style={{ backgroundColor: getStatusColor(card.status) }}
              >
                {card.status}
              </span>
            </div>

            <div className="flashcard-content">
              <div className="flashcard-text">
                {card.front.split('\n').map((line, index) => (
                  <div key={index} className="flashcard-line">
                    {line.startsWith('•') ? (
                      <span className="bullet-point">{line}</span>
                    ) : line.startsWith('**') && line.endsWith('**') ? (
                      <strong className="highlight-text">{line.slice(2, -2)}</strong>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flashcard-footer">
              <span className="flashcard-hint">Click to reveal answer</span>
            </div>
          </div>

          {/* Back Side */}
          <div className="flashcard-face flashcard-back">
            <div className="flashcard-header">
              <span className="flashcard-lesson">{card.lessonTitle}</span>
            </div>

            <div className="flashcard-content">
              <div className="flashcard-text">
                {card.back.split('\n').map((line, index) => (
                  <div key={index} className="flashcard-line">
                    {line.startsWith('•') ? (
                      <span className="bullet-point">{line}</span>
                    ) : line.startsWith('**') && line.endsWith('**') ? (
                      <strong className="highlight-text">{line.slice(2, -2)}</strong>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isFlipped && (
              <div className="flashcard-actions">
                <button
                  className="flashcard-btn flashcard-btn-again"
                  onClick={(e) => { e.stopPropagation(); handleRate('again'); }}
                  title="Didn't remember - see again soon"
                >
                  <span className="btn-label">Again</span>
                  <span className="btn-time">&lt;1m</span>
                </button>
                <button
                  className="flashcard-btn flashcard-btn-hard"
                  onClick={(e) => { e.stopPropagation(); handleRate('hard'); }}
                  title="Difficult - see again soon"
                >
                  <span className="btn-label">Hard</span>
                  <span className="btn-time">~6m</span>
                </button>
                <button
                  className="flashcard-btn flashcard-btn-medium"
                  onClick={(e) => { e.stopPropagation(); handleRate('medium'); }}
                  title="Medium - see in a few days"
                >
                  <span className="btn-label">Good</span>
                  <span className="btn-time">1d</span>
                </button>
                <button
                  className="flashcard-btn flashcard-btn-easy"
                  onClick={(e) => { e.stopPropagation(); handleRate('easy'); }}
                  title="Easy - see in a week"
                >
                  <span className="btn-label">Easy</span>
                  <span className="btn-time">4d</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {card.tags && card.tags.length > 0 && (
        <div className="flashcard-tags">
          {card.tags.map(tag => (
            <span key={tag} className="flashcard-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {card.timesReviewed > 0 && (
        <div className="flashcard-stats-mini">
          <span>Reviewed: {card.timesReviewed}x</span>
          <span>•</span>
          <span>Accuracy: {Math.round((card.timesCorrect / card.timesReviewed) * 100)}%</span>
          <span>•</span>
          <span>Next: {card.interval}d</span>
        </div>
      )}
    </div>
  );
}

