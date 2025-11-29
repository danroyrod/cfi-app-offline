import { useState, useEffect } from 'react';
import { undoService } from '../services/undoService';
import { flashcardService } from '../services/flashcardService';
import type { UndoAction, UndoActionType } from '../services/undoService';
import './UndoPanel.css';

interface UndoPanelProps {
  onUndo?: () => void;
  onClose?: () => void;
}

export default function UndoPanel({ onUndo, onClose }: UndoPanelProps) {
  const [actions, setActions] = useState<UndoAction[]>([]);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = () => {
    setActions(undoService.getRecentActions(10));
  };

  const handleUndo = (action: UndoAction) => {
    switch (action.type) {
      case 'card-delete':
        // Restore deleted card
        if (action.data.card) {
          flashcardService.createCard(
            action.data.card.lessonId,
            action.data.card.lessonTitle,
            action.data.card.front,
            action.data.card.back,
            action.data.card.category,
            action.data.card.tags
          );
        }
        break;

      case 'card-edit':
        // Restore original card state
        if (action.data.originalCard) {
          flashcardService.updateCard(action.data.originalCard.id, action.data.originalCard);
        }
        break;

      case 'card-rating':
        // Restore card state before rating
        if (action.data.cardBefore) {
          flashcardService.updateCard(action.data.cardBefore.id, action.data.cardBefore);
        }
        break;

      case 'bulk-delete':
        // Restore all deleted cards
        if (action.data.cards) {
          action.data.cards.forEach((card: any) => {
            flashcardService.createCard(
              card.lessonId,
              card.lessonTitle,
              card.front,
              card.back,
              card.category,
              card.tags
            );
          });
        }
        break;

      case 'bulk-reset':
        // Restore cards to previous state
        if (action.data.cardsBeforeReset) {
          action.data.cardsBeforeReset.forEach((card: any) => {
            flashcardService.updateCard(card.id, card);
          });
        }
        break;
    }

    // Remove action from history
    undoService.removeAction(action.id);
    loadActions();
    
    if (onUndo) {
      onUndo();
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all undo history? This cannot be undone.')) {
      undoService.clearHistory();
      loadActions();
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const getActionIcon = (type: UndoActionType): string => {
    const icons: Record<UndoActionType, string> = {
      'card-delete': '🗑️',
      'card-edit': '✏️',
      'card-rating': '⭐',
      'bulk-delete': '🗑️📦',
      'bulk-reset': '🔄'
    };
    return icons[type] || '↩️';
  };

  return (
    <div className="undo-panel">
      <div className="undo-header">
        <h3>↩️ Undo History</h3>
        {onClose && (
          <button className="undo-close" onClick={onClose}>✕</button>
        )}
      </div>

      {actions.length === 0 ? (
        <div className="undo-empty">
          <p>No recent actions to undo</p>
        </div>
      ) : (
        <>
          <div className="undo-list">
            {actions.map(action => (
              <div key={action.id} className="undo-item">
                <div className="undo-item-icon">
                  {getActionIcon(action.type)}
                </div>
                <div className="undo-item-content">
                  <div className="undo-item-description">{action.description}</div>
                  <div className="undo-item-time">{formatTimestamp(action.timestamp)}</div>
                </div>
                <button
                  className="undo-item-btn"
                  onClick={() => handleUndo(action)}
                  title="Undo this action"
                >
                  ↩️ Undo
                </button>
              </div>
            ))}
          </div>

          <div className="undo-footer">
            <button className="undo-clear-btn" onClick={handleClearHistory}>
              Clear History
            </button>
            <span className="undo-count">
              {actions.length} action{actions.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </>
      )}
    </div>
  );
}

