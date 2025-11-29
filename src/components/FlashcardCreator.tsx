import { useState } from 'react';
import { flashcardService } from '../services/flashcardService';
import lessonPlansDataRaw from '../lessonPlansData.json';
import type { LessonPlan } from '../lessonPlanTypes';
import './FlashcardCreator.css';

const lessonPlansData = lessonPlansDataRaw as { lessonPlans: LessonPlan[] };

interface FlashcardCreatorProps {
  onClose?: () => void;
  onCreated?: () => void;
}

export default function FlashcardCreator({ onClose, onCreated }: FlashcardCreatorProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [category, setCategory] = useState<'custom' | 'objective' | 'teaching-point' | 'error' | 'standard'>('custom');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim() || !selectedLessonId) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const lesson = lessonPlansData.lessonPlans.find(l => l.id === selectedLessonId);
    if (!lesson) {
      alert('Invalid lesson selected');
      setIsSubmitting(false);
      return;
    }

    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    flashcardService.createCard(
      lesson.id,
      lesson.title,
      front.trim(),
      back.trim(),
      category,
      tagArray
    );

    // Reset form
    setFront('');
    setBack('');
    setTags('');
    setIsSubmitting(false);

    alert('Flashcard created successfully!');
    
    if (onCreated) {
      onCreated();
    }
  };

  const handleQuickFill = () => {
    setFront('What are the altitude requirements for steep turns?');
    setBack('Maintain altitude ±100 feet, airspeed ±10 knots, and bank 45° (±5°) throughout the maneuver.');
    setCategory('teaching-point');
    setTags('steep-turns, maneuvers, standards');
  };

  return (
    <div className="flashcard-creator">
      <div className="creator-header">
        <h3>Create Custom Flashcard</h3>
        {onClose && (
          <button className="creator-close" onClick={onClose}>✕</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="creator-form">
        <div className="form-group">
          <label>Question (Front) *</label>
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="What question should this card ask?"
            className="form-textarea"
            rows={3}
            required
          />
          <div className="form-hint">
            Example: "What are the altitude requirements for steep turns?"
          </div>
        </div>

        <div className="form-group">
          <label>Answer (Back) *</label>
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="What is the answer to this question?"
            className="form-textarea"
            rows={4}
            required
          />
          <div className="form-hint">
            Example: "Maintain altitude ±100 feet, airspeed ±10 knots..."
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group-half">
            <label>Lesson *</label>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select a lesson...</option>
              {lessonPlansData.lessonPlans.map(lesson => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group form-group-half">
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
        </div>

        <div className="form-group">
          <label>Tags (Optional)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="steep-turns, maneuvers, standards (comma-separated)"
            className="form-input"
          />
          <div className="form-hint">
            Add tags to help organize and filter your cards
          </div>
        </div>

        <div className="creator-actions">
          <button
            type="button"
            className="btn-example"
            onClick={handleQuickFill}
          >
            💡 See Example
          </button>
          
          <div className="action-buttons">
            {onClose && (
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Flashcard'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}






