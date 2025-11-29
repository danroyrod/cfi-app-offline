// Enhanced Flashcard Service - Loads and manages enhanced flashcards

import type { Flashcard, FlashcardDeck } from '../types/flashcardTypes';

class EnhancedFlashcardService {
  private enhancedFlashcards: Flashcard[] = [];
  private enhancedDecks: FlashcardDeck[] = [];
  private isLoaded = false;

  /**
   * Load enhanced flashcards from JSON file
   * Handles offline scenarios by checking cache first
   */
  async loadEnhancedFlashcards(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Try to fetch from network first, fallback to cache if offline
      const response = await fetch('/enhancedFlashcards.json', {
        cache: 'default' // Allow service worker to handle caching
      });
      
      if (!response.ok) {
        // If network fails, try to get from cache via service worker
        if ('caches' in window) {
          try {
            const cache = await caches.open('data-cache');
            const cachedResponse = await cache.match('/enhancedFlashcards.json');
            if (cachedResponse) {
              const data = await cachedResponse.json();
              this.enhancedFlashcards = data.flashcards || [];
              this.enhancedDecks = data.decks || [];
              this.isLoaded = true;
              console.log(`Loaded ${this.enhancedFlashcards.length} enhanced flashcards from cache`);
              return;
            }
          } catch (cacheError) {
            console.warn('Cache lookup failed:', cacheError);
          }
        }
        console.warn('Enhanced flashcards not found, using default cards');
        return;
      }

      const data = await response.json();
      this.enhancedFlashcards = data.flashcards || [];
      this.enhancedDecks = data.decks || [];
      this.isLoaded = true;

      console.log(`Loaded ${this.enhancedFlashcards.length} enhanced flashcards`);
    } catch (error) {
      // Network error - try cache as fallback
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Likely offline - try cache
        if ('caches' in window) {
          try {
            const cache = await caches.open('data-cache');
            const cachedResponse = await cache.match('/enhancedFlashcards.json');
            if (cachedResponse) {
              const data = await cachedResponse.json();
              this.enhancedFlashcards = data.flashcards || [];
              this.enhancedDecks = data.decks || [];
              this.isLoaded = true;
              console.log(`Loaded ${this.enhancedFlashcards.length} enhanced flashcards from cache (offline)`);
              return;
            }
          } catch (cacheError) {
            console.warn('Cache lookup failed:', cacheError);
          }
        }
      }
      console.warn('Failed to load enhanced flashcards:', error);
    }
  }

  /**
   * Get all enhanced flashcards
   */
  getEnhancedFlashcards(): Flashcard[] {
    return this.enhancedFlashcards;
  }

  /**
   * Get enhanced flashcards by category
   */
  getEnhancedFlashcardsByCategory(category: string): Flashcard[] {
    return this.enhancedFlashcards.filter(card => card.category === category);
  }

  /**
   * Get enhanced flashcards by lesson
   */
  getEnhancedFlashcardsByLesson(lessonId: string): Flashcard[] {
    return this.enhancedFlashcards.filter(card => card.lessonId === lessonId);
  }

  /**
   * Get enhanced flashcards by difficulty
   */
  getEnhancedFlashcardsByDifficulty(difficulty: string): Flashcard[] {
    return this.enhancedFlashcards.filter(card => 
      card.tags?.includes(difficulty) || 
      (difficulty === 'medium' && !card.tags?.includes('easy') && !card.tags?.includes('hard'))
    );
  }

  /**
   * Get all enhanced decks
   */
  getEnhancedDecks(): FlashcardDeck[] {
    return this.enhancedDecks;
  }

  /**
   * Get enhanced deck by ID
   */
  getEnhancedDeck(deckId: string): FlashcardDeck | null {
    return this.enhancedDecks.find(deck => deck.id === deckId) || null;
  }

  /**
   * Search enhanced flashcards
   */
  searchEnhancedFlashcards(query: string): Flashcard[] {
    const lowercaseQuery = query.toLowerCase();
    return this.enhancedFlashcards.filter(card =>
      card.front.toLowerCase().includes(lowercaseQuery) ||
      card.back.toLowerCase().includes(lowercaseQuery) ||
      card.lessonTitle.toLowerCase().includes(lowercaseQuery) ||
      card.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get random enhanced flashcards
   */
  getRandomEnhancedFlashcards(count: number): Flashcard[] {
    const shuffled = [...this.enhancedFlashcards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Get enhanced flashcards by tags
   */
  getEnhancedFlashcardsByTags(tags: string[]): Flashcard[] {
    return this.enhancedFlashcards.filter(card =>
      tags.some(tag => card.tags?.includes(tag))
    );
  }

  /**
   * Get statistics for enhanced flashcards
   */
  getEnhancedFlashcardStats(): {
    total: number;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
    byLesson: Record<string, number>;
  } {
    const stats = {
      total: this.enhancedFlashcards.length,
      byCategory: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      byLesson: {} as Record<string, number>
    };

    this.enhancedFlashcards.forEach(card => {
      // Count by category
      stats.byCategory[card.category] = (stats.byCategory[card.category] || 0) + 1;

      // Count by difficulty (inferred from tags or default to medium)
      const difficulty = card.tags?.includes('easy') ? 'easy' :
                        card.tags?.includes('hard') ? 'hard' : 'medium';
      stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;

      // Count by lesson
      stats.byLesson[card.lessonTitle] = (stats.byLesson[card.lessonTitle] || 0) + 1;
    });

    return stats;
  }

  /**
   * Check if enhanced flashcards are loaded
   */
  isEnhancedFlashcardsLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Get enhanced flashcards for spaced repetition
   */
  getEnhancedFlashcardsForSpacedRepetition(): Flashcard[] {
    // Return cards that are suitable for spaced repetition learning
    return this.enhancedFlashcards.filter(card => 
      card.category === 'teaching-point' || 
      card.category === 'standard' ||
      card.category === 'objective'
    );
  }
}

export const enhancedFlashcardService = new EnhancedFlashcardService();
