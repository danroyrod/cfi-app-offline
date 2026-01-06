// Flashcard Types for Spaced Repetition Learning

export type FlashcardDifficulty = 'easy' | 'medium' | 'hard' | 'again';

export type FlashcardStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface Flashcard {
  id: string;
  lessonId: string;
  lessonTitle: string;
  front: string;
  back: string;
  category: 'objective' | 'teaching-point' | 'key-teaching-point' | 'error' | 'standard' | 'custom';
  status: FlashcardStatus;
  
  // Spaced Repetition Data
  easeFactor: number; // 1.3 to 2.5 (default 2.5)
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  nextReviewDate: number; // Timestamp
  lastReviewDate: number; // Timestamp
  
  // Statistics
  timesReviewed: number;
  timesCorrect: number;
  timesWrong: number;
  averageResponseTime: number; // milliseconds
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  cardIds: string[];
  lessonIds: string[];
  createdAt: number;
  updatedAt: number;
  isDefault: boolean; // Auto-generated decks
}

export interface StudySession {
  id: string;
  deckId: string;
  startTime: number;
  endTime?: number;
  cardsStudied: number;
  cardsCorrect: number;
  cardsWrong: number;
  averageTime: number; // milliseconds per card
}

export interface FlashcardStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewingCards: number;
  masteredCards: number;
  dueToday: number;
  studiedToday: number;
  currentStreak: number;
  longestStreak: number;
}






