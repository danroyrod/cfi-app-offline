import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { flashcardService } from '../services/flashcardService';
import FlashcardFlip from '../components/FlashcardFlip';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import type { Flashcard, FlashcardDifficulty, StudySession } from '../types/flashcardTypes';
import './FlashcardsStudy.css';

export default function FlashcardsStudy() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const deckId = searchParams.get('deck');
  
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [session, setSession] = useState<StudySession | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({
    studied: 0,
    correct: 0,
    wrong: 0
  });

  useEffect(() => {
    loadCards();
    
    // Load saved session progress
    const savedSession = localStorage.getItem('flashcard-session-progress');
    if (savedSession) {
      try {
        const progress = JSON.parse(savedSession);
        if (progress.deckId === (deckId || 'daily-review') && progress.timestamp > Date.now() - 3600000) {
          // Resume session if less than 1 hour old
          setCurrentIndex(progress.currentIndex || 0);
          setStats(progress.stats || { studied: 0, correct: 0, wrong: 0 });
        }
      } catch (e) {
        console.error('Failed to load session progress:', e);
      }
    }
  }, [deckId]);

  // Save session progress periodically
  useEffect(() => {
    if (cards.length > 0 && !isComplete) {
      const saveProgress = () => {
        localStorage.setItem('flashcard-session-progress', JSON.stringify({
          deckId: deckId || 'daily-review',
          currentIndex,
          stats,
          timestamp: Date.now()
        }));
      };

      const interval = setInterval(saveProgress, 5000); // Save every 5 seconds
      return () => clearInterval(interval);
    }
  }, [deckId, currentIndex, stats, cards.length, isComplete]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isComplete || cards.length === 0) return;

      switch (e.key) {
        case '1':
          handleRate('again');
          break;
        case '2':
          handleRate('hard');
          break;
        case '3':
          handleRate('medium');
          break;
        case '4':
          handleRate('easy');
          break;
        case ' ': // Spacebar - flip card (handled by FlashcardFlip component)
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isComplete, cards.length, currentIndex]);

  const loadCards = () => {
    let studyCards: Flashcard[];

    if (deckId) {
      // Load cards from specific deck
      const deck = flashcardService.getAllDecks().find(d => d.id === deckId);
      if (deck) {
        studyCards = deck.cardIds
          .map(id => flashcardService.getCard(id))
          .filter((c): c is Flashcard => c !== null);
      } else {
        studyCards = [];
      }
    } else {
      // Load due cards
      studyCards = flashcardService.getDueCards(20);
      
      // If no due cards, get new cards
      if (studyCards.length === 0) {
        studyCards = flashcardService.getNewCards(10);
      }
    }

    setCards(studyCards);
    
    if (studyCards.length > 0) {
      const newSession = flashcardService.startSession(deckId || 'daily-review');
      setSession(newSession);
    }
  };

  const handleRate = (difficulty: FlashcardDifficulty) => {
    if (cards.length === 0) return;

    const currentCard = cards[currentIndex];
    const startTime = Date.now();
    
    // Update card with spaced repetition
    const responseTime = startTime - (session?.startTime || startTime);
    flashcardService.reviewCard(currentCard.id, difficulty, responseTime);

    // Update session stats
    if (session) {
      const isCorrect = difficulty !== 'again';
      flashcardService.updateSessionStats(session.id, isCorrect, responseTime);
      
      setStats(prev => ({
        studied: prev.studied + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        wrong: prev.wrong + (isCorrect ? 0 : 1)
      }));
    }

    // Move to next card
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Study session complete
      if (session) {
        flashcardService.endSession(session.id);
      }
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsComplete(false);
    setStats({
      studied: 0,
      correct: 0,
      wrong: 0
    });
    // Clear saved progress
    localStorage.removeItem('flashcard-session-progress');
    loadCards();
  };

  if (cards.length === 0) {
    return (
      <div className="flashcards-study-page">
        <div className="container">
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
          <div className="study-header">
            <Link to="/flashcards" className="back-link">← Back to Flashcards</Link>
            <h1>Study Session</h1>
          </div>

          <div className="study-empty">
            <div className="empty-icon">🎉</div>
            <h2>All caught up!</h2>
            <p>No cards are due for review right now.</p>
            <div className="empty-actions">
              <Link to="/flashcards" className="btn-primary">
                Browse All Flashcards
              </Link>
              <Link to="/flashcards/generate" className="btn-secondary">
                Generate New Cards
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = stats.studied > 0 ? Math.round((stats.correct / stats.studied) * 100) : 0;
    
    return (
      <div className="flashcards-study-page">
        <div className="container">
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
          <div className="study-header">
            <Link to="/flashcards" className="back-link">← Back to Flashcards</Link>
            <h1>Study Session Complete!</h1>
          </div>

          <div className="study-complete">
            <div className="complete-icon">🎉</div>
            <h2>Great work!</h2>
            <p>You've completed this study session</p>

            <div className="study-complete-stats">
              <div className="stat-card">
                <div className="stat-number">{stats.studied}</div>
                <div className="stat-label">Cards Studied</div>
              </div>
              <div className="stat-card stat-success">
                <div className="stat-number">{stats.correct}</div>
                <div className="stat-label">Correct</div>
              </div>
              <div className="stat-card stat-error">
                <div className="stat-number">{stats.wrong}</div>
                <div className="stat-label">Again</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{accuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>

            <div className="complete-actions">
              <button className="btn-primary" onClick={handleRestart}>
                Study More Cards
              </button>
              <Link to="/flashcards" className="btn-secondary">
                View All Flashcards
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="flashcards-study-page">
      <div className="container">
        <div className="study-header">
          <Link to="/flashcards" className="back-link">← Back to Flashcards</Link>
          <h1>Study Session</h1>
        </div>

        <div className="study-progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="study-stats-bar">
          <div className="stat-item">
            <span className="stat-label">Progress:</span>
            <span className="stat-value">{currentIndex + 1} / {cards.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Correct:</span>
            <span className="stat-value stat-success">{stats.correct}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Again:</span>
            <span className="stat-value stat-error">{stats.wrong}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Accuracy:</span>
            <span className="stat-value">
              {stats.studied > 0 ? Math.round((stats.correct / stats.studied) * 100) : 0}%
            </span>
          </div>
        </div>

        <FlashcardFlip
          card={currentCard}
          onRate={handleRate}
          cardNumber={currentIndex + 1}
          totalCards={cards.length}
        />

        <div className="study-hints">
          <div className="hint-box hint-tip">
            <strong>💡 Tip:</strong> Be honest with yourself when rating cards. 
            It's better to see a card again than to mark it as "Easy" when you're not sure.
          </div>
          <div className="hint-box hint-keyboard">
            <strong>⌨️ Shortcuts:</strong> Press <kbd>1</kbd> Again • <kbd>2</kbd> Hard • <kbd>3</kbd> Good • <kbd>4</kbd> Easy • <kbd>Space</kbd> Flip
          </div>
        </div>
      </div>
    </div>
  );
}

