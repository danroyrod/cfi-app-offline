// Flashcard Service with Spaced Repetition Algorithm (SM-2)

import type { Flashcard, FlashcardDifficulty, FlashcardStats, FlashcardDeck, StudySession } from '../types/flashcardTypes';

class FlashcardService {
  private readonly CARDS_KEY = 'flashcards';
  private readonly DECKS_KEY = 'flashcard-decks';
  private readonly SESSIONS_KEY = 'study-sessions';

  // ==================== CARD MANAGEMENT ====================

  /**
   * Get all flashcards
   */
  getAllCards(): Flashcard[] {
    const stored = localStorage.getItem(this.CARDS_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Get a specific card
   */
  getCard(id: string): Flashcard | null {
    const cards = this.getAllCards();
    return cards.find(c => c.id === id) || null;
  }

  /**
   * Get cards for a lesson
   */
  getLessonCards(lessonId: string): Flashcard[] {
    return this.getAllCards().filter(c => c.lessonId === lessonId);
  }

  /**
   * Create a new card
   */
  createCard(
    lessonId: string,
    lessonTitle: string,
    front: string,
    back: string,
    category: Flashcard['category'],
    tags: string[] = []
  ): Flashcard {
    const cards = this.getAllCards();
    
    const newCard: Flashcard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lessonId,
      lessonTitle,
      front,
      back,
      category,
      status: 'new',
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: Date.now(),
      lastReviewDate: 0,
      timesReviewed: 0,
      timesCorrect: 0,
      timesWrong: 0,
      averageResponseTime: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags
    };

    cards.push(newCard);
    this.saveCards(cards);
    return newCard;
  }

  /**
   * Update a card
   */
  updateCard(id: string, updates: Partial<Flashcard>): boolean {
    const cards = this.getAllCards();
    const index = cards.findIndex(c => c.id === id);
    
    if (index === -1) return false;
    
    cards[index] = {
      ...cards[index],
      ...updates,
      updatedAt: Date.now()
    };
    
    this.saveCards(cards);
    return true;
  }

  /**
   * Delete a card
   */
  deleteCard(id: string): boolean {
    const cards = this.getAllCards();
    const filtered = cards.filter(c => c.id !== id);
    
    if (filtered.length === cards.length) return false;
    
    this.saveCards(filtered);
    return true;
  }

  /**
   * Save cards to storage
   */
  private saveCards(cards: Flashcard[]): void {
    localStorage.setItem(this.CARDS_KEY, JSON.stringify(cards));
  }

  // ==================== SPACED REPETITION (SM-2 ALGORITHM) ====================

  /**
   * Process review response and update card using SM-2 algorithm
   * @param cardId - Card being reviewed
   * @param difficulty - User's rating of difficulty
   * @param responseTime - Time taken to answer (ms)
   */
  reviewCard(cardId: string, difficulty: FlashcardDifficulty, responseTime: number): Flashcard | null {
    const card = this.getCard(cardId);
    if (!card) return null;

    // Map difficulty to quality (0-5 scale for SM-2)
    const qualityMap: Record<FlashcardDifficulty, number> = {
      'again': 0,  // Complete blackout
      'hard': 3,   // Correct with difficulty
      'medium': 4, // Correct with hesitation
      'easy': 5    // Perfect recall
    };

    const quality = qualityMap[difficulty];

    // Update statistics
    const newTimesReviewed = card.timesReviewed + 1;
    const isCorrect = quality >= 3;
    const newTimesCorrect = card.timesCorrect + (isCorrect ? 1 : 0);
    const newTimesWrong = card.timesWrong + (isCorrect ? 0 : 1);
    const newAverageResponseTime = 
      (card.averageResponseTime * card.timesReviewed + responseTime) / newTimesReviewed;

    // SM-2 Algorithm
    let newEaseFactor = card.easeFactor;
    let newInterval = card.interval;
    let newRepetitions = card.repetitions;
    let newStatus = card.status;

    if (quality >= 3) {
      // Correct answer
      if (card.repetitions === 0) {
        newInterval = 1;
      } else if (card.repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval * card.easeFactor);
      }
      newRepetitions = card.repetitions + 1;

      // Update status based on performance
      if (newRepetitions >= 1 && card.status === 'new') {
        newStatus = 'learning';
      } else if (newRepetitions >= 3 && newInterval >= 21) {
        newStatus = 'reviewing';
      } else if (newRepetitions >= 5 && newInterval >= 60) {
        newStatus = 'mastered';
      }
    } else {
      // Incorrect answer - reset
      newInterval = 1;
      newRepetitions = 0;
      newStatus = card.status === 'new' ? 'new' : 'learning';
    }

    // Update ease factor
    newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(1.3, Math.min(2.5, newEaseFactor)); // Clamp between 1.3 and 2.5

    // Calculate next review date
    const nextReviewDate = Date.now() + (newInterval * 24 * 60 * 60 * 1000);

    // Update card
    const updatedCard: Flashcard = {
      ...card,
      easeFactor: newEaseFactor,
      interval: newInterval,
      repetitions: newRepetitions,
      status: newStatus,
      nextReviewDate,
      lastReviewDate: Date.now(),
      timesReviewed: newTimesReviewed,
      timesCorrect: newTimesCorrect,
      timesWrong: newTimesWrong,
      averageResponseTime: newAverageResponseTime,
      updatedAt: Date.now()
    };

    this.updateCard(cardId, updatedCard);
    return updatedCard;
  }

  /**
   * Get cards due for review
   */
  getDueCards(limit?: number): Flashcard[] {
    const now = Date.now();
    const cards = this.getAllCards()
      .filter(c => c && typeof c.nextReviewDate === 'number' && c.nextReviewDate <= now)
      .sort((a, b) => (a.nextReviewDate || 0) - (b.nextReviewDate || 0));
    
    return limit ? cards.slice(0, limit) : cards;
  }

  /**
   * Get new cards to learn
   */
  getNewCards(limit: number = 20): Flashcard[] {
    return this.getAllCards()
      .filter(c => c && c.status === 'new')
      .slice(0, limit);
  }

  // ==================== DECK MANAGEMENT ====================

  /**
   * Get all decks
   */
  getAllDecks(): FlashcardDeck[] {
    const stored = localStorage.getItem(this.DECKS_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Create a deck
   */
  createDeck(name: string, description: string, cardIds: string[], lessonIds: string[] = []): FlashcardDeck {
    const decks = this.getAllDecks();
    
    const newDeck: FlashcardDeck = {
      id: `deck-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      cardIds,
      lessonIds,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault: false
    };

    decks.push(newDeck);
    localStorage.setItem(this.DECKS_KEY, JSON.stringify(decks));
    return newDeck;
  }

  /**
   * Update a deck
   */
  updateDeck(id: string, updates: Partial<FlashcardDeck>): boolean {
    const decks = this.getAllDecks();
    const index = decks.findIndex(d => d.id === id);
    
    if (index === -1) return false;
    
    decks[index] = {
      ...decks[index],
      ...updates,
      updatedAt: Date.now()
    };
    
    localStorage.setItem(this.DECKS_KEY, JSON.stringify(decks));
    return true;
  }

  /**
   * Delete a deck
   */
  deleteDeck(id: string): boolean {
    const decks = this.getAllDecks();
    const filtered = decks.filter(d => d.id !== id);
    
    if (filtered.length === decks.length) return false;
    
    localStorage.setItem(this.DECKS_KEY, JSON.stringify(filtered));
    return true;
  }

  // ==================== STATISTICS ====================

  /**
   * Get overall statistics
   */
  getStats(): FlashcardStats {
    const cards = this.getAllCards();
    const now = Date.now();
    const today = new Date().setHours(0, 0, 0, 0);

    const stats: FlashcardStats = {
      totalCards: cards.length,
      newCards: cards.filter(c => c.status === 'new').length,
      learningCards: cards.filter(c => c.status === 'learning').length,
      reviewingCards: cards.filter(c => c.status === 'reviewing').length,
      masteredCards: cards.filter(c => c.status === 'mastered').length,
      dueToday: cards.filter(c => c.nextReviewDate <= now).length,
      studiedToday: cards.filter(c => c.lastReviewDate >= today).length,
      currentStreak: this.calculateStreak(),
      longestStreak: this.getLongestStreak()
    };

    return stats;
  }

  /**
   * Calculate current study streak (consecutive days)
   */
  private calculateStreak(): number {
    const sessions = this.getAllSessions();
    if (sessions.length === 0) return 0;

    // Get unique study dates
    const dates = sessions
      .map(s => new Date(s.startTime).setHours(0, 0, 0, 0))
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => b - a);

    let streak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const oneDayMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < dates.length; i++) {
      const expectedDate = today - (i * oneDayMs);
      if (dates[i] === expectedDate) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get longest study streak
   */
  private getLongestStreak(): number {
    const sessions = this.getAllSessions();
    if (sessions.length === 0) return 0;

    const dates = sessions
      .map(s => new Date(s.startTime).setHours(0, 0, 0, 0))
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => a - b);

    let longestStreak = 1;
    let currentStreak = 1;
    const oneDayMs = 24 * 60 * 60 * 1000;

    for (let i = 1; i < dates.length; i++) {
      if (dates[i] - dates[i - 1] === oneDayMs) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }

  // ==================== STUDY SESSIONS ====================

  /**
   * Start a study session
   */
  startSession(deckId: string): StudySession {
    const session: StudySession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deckId,
      startTime: Date.now(),
      cardsStudied: 0,
      cardsCorrect: 0,
      cardsWrong: 0,
      averageTime: 0
    };

    const sessions = this.getAllSessions();
    sessions.push(session);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    
    return session;
  }

  /**
   * End a study session
   */
  endSession(sessionId: string): boolean {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) return false;
    
    session.endTime = Date.now();
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return true;
  }

  /**
   * Update session stats
   */
  updateSessionStats(sessionId: string, correct: boolean, responseTime: number): boolean {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) return false;
    
    session.cardsStudied++;
    if (correct) session.cardsCorrect++;
    else session.cardsWrong++;
    
    session.averageTime = 
      (session.averageTime * (session.cardsStudied - 1) + responseTime) / session.cardsStudied;
    
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return true;
  }

  /**
   * Get all sessions
   */
  getAllSessions(): StudySession[] {
    const stored = localStorage.getItem(this.SESSIONS_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Get recent sessions
   */
  getRecentSessions(limit: number = 10): StudySession[] {
    return this.getAllSessions()
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit);
  }
}

export const flashcardService = new FlashcardService();

