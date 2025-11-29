// Undo Service for Flashcard Operations

import type { Flashcard } from '../types/flashcardTypes';

export type UndoActionType = 
  | 'card-delete'
  | 'card-edit'
  | 'card-rating'
  | 'bulk-delete'
  | 'bulk-reset';

export interface UndoAction {
  id: string;
  type: UndoActionType;
  timestamp: number;
  description: string;
  data: any; // Original data to restore
}

class UndoService {
  private readonly STORAGE_KEY = 'flashcard-undo-history';
  private readonly MAX_UNDO_ACTIONS = 20; // Keep last 20 actions

  /**
   * Get all undo actions
   */
  getAllActions(): UndoAction[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Add an undo action
   */
  addAction(type: UndoActionType, description: string, data: any): void {
    const actions = this.getAllActions();
    
    const newAction: UndoAction = {
      id: `undo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      description,
      data
    };

    // Add to beginning of array
    actions.unshift(newAction);

    // Keep only MAX_UNDO_ACTIONS
    const trimmed = actions.slice(0, this.MAX_UNDO_ACTIONS);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
  }

  /**
   * Remove an action from history (after undo is performed)
   */
  removeAction(id: string): void {
    const actions = this.getAllActions();
    const filtered = actions.filter(a => a.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Clear all undo history
   */
  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get recent actions (default 10)
   */
  getRecentActions(limit: number = 10): UndoAction[] {
    return this.getAllActions().slice(0, limit);
  }

  /**
   * Check if any undoable actions exist
   */
  hasUndoableActions(): boolean {
    return this.getAllActions().length > 0;
  }

  // ==================== SPECIFIC UNDO OPERATIONS ====================

  /**
   * Record card deletion
   */
  recordCardDeletion(card: Flashcard): void {
    this.addAction(
      'card-delete',
      `Deleted card: "${card.front.substring(0, 50)}${card.front.length > 50 ? '...' : ''}"`,
      { card }
    );
  }

  /**
   * Record card edit
   */
  recordCardEdit(originalCard: Flashcard, updatedCard: Flashcard): void {
    this.addAction(
      'card-edit',
      `Edited card: "${originalCard.front.substring(0, 50)}${originalCard.front.length > 50 ? '...' : ''}"`,
      { originalCard, updatedCard }
    );
  }

  /**
   * Record card rating change
   */
  recordCardRating(cardBefore: Flashcard, cardAfter: Flashcard, difficulty: string): void {
    this.addAction(
      'card-rating',
      `Rated card as "${difficulty}": "${cardBefore.front.substring(0, 40)}${cardBefore.front.length > 40 ? '...' : ''}"`,
      { cardBefore, cardAfter, difficulty }
    );
  }

  /**
   * Record bulk deletion
   */
  recordBulkDeletion(cards: Flashcard[]): void {
    this.addAction(
      'bulk-delete',
      `Deleted ${cards.length} cards`,
      { cards }
    );
  }

  /**
   * Record bulk reset
   */
  recordBulkReset(cardsBeforeReset: Flashcard[], cardIds: string[]): void {
    this.addAction(
      'bulk-reset',
      `Reset progress for ${cardIds.length} cards`,
      { cardsBeforeReset, cardIds }
    );
  }
}

export const undoService = new UndoService();






