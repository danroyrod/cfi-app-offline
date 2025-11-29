import { useState } from 'react';
import { flashcardService } from '../services/flashcardService';
import { undoService } from '../services/undoService';
import type { Flashcard } from '../types/flashcardTypes';
import './FlashcardEditor.css';

interface FlashcardEditorProps {
  card: Flashcard;
  onClose?: () => void;
  onSaved?: () => void;
}

export default function FlashcardEditor({ card, onClose, onSaved }: FlashcardEditorProps) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [category, setCategory] = useState(card.category);
  const [tags, setTags] = useState(card.tags.join(', '));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!front.trim() || !back.trim()) {
      alert('Front and back text are required');
      return;
    }

    setIsSaving(true);

    // Record undo action
    const originalCard = { ...card };
    
    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

    // Update card
    const success = flashcardService.updateCard(card.id, {
      front: front.trim(),
      back: back.trim(),
      category,
      tags: tagArray
    });

    if (success) {
      const updatedCard = flashcardService.getCard(card.id);
      if (updatedCard) {
        undoService.recordCardEdit(originalCard, updatedCard);
      }
      
      alert('Card updated successfully!');
      
      if (onSaved) {
        onSaved();
      }
      
      if (onClose) {
        onClose();
      }
    } else {
      alert('Failed to update card');
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    if (front !== card.front || back !== card.back || category !== card.category) {
      if (!confirm('Discard changes?')) {
        return;
      }
    }
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flashcard-editor-overlay" onClick={handleCancel}>
      <div className="flashcard-editor" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <h3>Edit Flashcard</h3>
          <button className="editor-close" onClick={handleCancel}>✕</button>
        </div>

        <div className="editor-form">
          <div className="form-group">
            <label>Question (Front) *</label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Enter question..."
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Answer (Back) *</label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Enter answer..."
              className="form-textarea"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="form-select"
              >
                <option value="custom">Custom</option>
                <option value="objective">Objective</option>
                <option value="teaching-point">Teaching Point</option>
                <option value="error">Common Error</option>
                <option value="standard">Completion Standard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="form-input"
              />
            </div>
          </div>

          <div className="editor-meta">
            <div className="meta-item">
              <span className="meta-label">Lesson:</span>
              <span className="meta-value">{card.lessonTitle}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Times Reviewed:</span>
              <span className="meta-value">{card.timesReviewed}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Accuracy:</span>
              <span className="meta-value">
                {card.timesReviewed > 0 ? `${Math.round((card.timesCorrect / card.timesReviewed) * 100)}%` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="editor-actions">
            <button className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={isSaving || !front.trim() || !back.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

