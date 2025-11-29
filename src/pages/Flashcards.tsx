import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { flashcardService } from '../services/flashcardService';
import { enhancedFlashcardService } from '../services/enhancedFlashcardService';
import { flashcardGenerator } from '../services/flashcardGenerator';
import { undoService } from '../services/undoService';
import FlashcardCreator from '../components/FlashcardCreator';
import FlashcardEditor from '../components/FlashcardEditor';
import UndoPanel from '../components/UndoPanel';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import lessonPlansDataRaw from '../lessonPlansData.json';
import type { LessonPlan } from '../lessonPlanTypes';
import type { Flashcard, FlashcardStats } from '../types/flashcardTypes';
import './Flashcards.css';

const lessonPlansData = lessonPlansDataRaw as { lessonPlans: LessonPlan[] };

export default function Flashcards() {
  const location = useLocation();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [enhancedCards, setEnhancedCards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState<FlashcardStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'reviewing' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<LessonPlan | null>(null);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [useEnhancedCards, setUseEnhancedCards] = useState(true);

  useEffect(() => {
    loadCards();
    loadEnhancedCards();
  }, []);

  const loadCards = () => {
    const allCards = flashcardService.getAllCards();
    setCards(allCards);
    setStats(flashcardService.getStats());
  };

  const loadEnhancedCards = async () => {
    await enhancedFlashcardService.loadEnhancedFlashcards();
    const enhanced = enhancedFlashcardService.getEnhancedFlashcards();
    setEnhancedCards(enhanced);
  };

  const filteredCards = useMemo(() => {
    const sourceCards = useEnhancedCards ? enhancedCards : cards;
    let filtered = sourceCards;

    // Filter by status (only applies to regular cards with spaced repetition data)
    if (filter !== 'all' && !useEnhancedCards) {
      filtered = filtered.filter(c => c.status === filter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.front.toLowerCase().includes(query) ||
        c.back.toLowerCase().includes(query) ||
        c.lessonTitle.toLowerCase().includes(query) ||
        c.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [cards, enhancedCards, filter, searchQuery, useEnhancedCards]);

  const handleGenerateForLesson = (lesson: LessonPlan) => {
    // Show preview first
    setPreviewLesson(lesson);
  };

  const confirmGeneration = (lesson: LessonPlan) => {
    if (flashcardGenerator.hasGeneratedCards(lesson.id)) {
      if (!confirm(`This lesson already has ${flashcardService.getLessonCards(lesson.id).length} flashcards. Generate more?`)) {
        setPreviewLesson(null);
        return;
      }
    }

    flashcardGenerator.generateFromLesson(lesson);
    loadCards();
    setPreviewLesson(null);
    alert(`Generated ${flashcardGenerator.estimateCardCount(lesson)} flashcards for ${lesson.title}!`);
  };

  const handleGenerateAll = () => {
    if (!confirm('Generate flashcards for ALL 85 lessons? This will create hundreds of cards.')) {
      return;
    }

    const allLessons = lessonPlansData.lessonPlans;
    flashcardGenerator.generateForAllLessons(allLessons);
    loadCards();
    alert('Generated flashcards for all lessons! Ready to study!');
  };

  const handleDeleteCard = (id: string) => {
    const card = flashcardService.getCard(id);
    if (!card) return;

    if (confirm('Delete this flashcard?')) {
      // Record undo action
      undoService.recordCardDeletion(card);
      
      flashcardService.deleteCard(id);
      loadCards();
    }
  };

  const toggleCardSelection = (id: string) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allIds = new Set(filteredCards.map(c => c.id));
    setSelectedCards(allIds);
  };

  const deselectAll = () => {
    setSelectedCards(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedCards.size === 0) return;

    if (confirm(`Delete ${selectedCards.size} selected cards?`)) {
      const cardsToDelete = Array.from(selectedCards)
        .map(id => flashcardService.getCard(id))
        .filter((c): c is Flashcard => c !== null);

      // Record undo action
      undoService.recordBulkDeletion(cardsToDelete);

      // Delete all selected cards
      selectedCards.forEach(id => flashcardService.deleteCard(id));

      setSelectedCards(new Set());
      setSelectionMode(false);
      loadCards();
    }
  };

  const handleBulkResetProgress = () => {
    if (selectedCards.size === 0) return;

    if (confirm(`Reset progress for ${selectedCards.size} selected cards? They will become "new" cards again.`)) {
      const cardsBeforeReset = Array.from(selectedCards)
        .map(id => flashcardService.getCard(id))
        .filter((c): c is Flashcard => c !== null);

      // Record undo action
      undoService.recordBulkReset(cardsBeforeReset, Array.from(selectedCards));

      // Reset progress for all selected cards
      selectedCards.forEach(id => {
        flashcardService.updateCard(id, {
          status: 'new',
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewDate: Date.now(),
          timesReviewed: 0,
          timesCorrect: 0,
          timesWrong: 0
        });
      });

      setSelectedCards(new Set());
      setSelectionMode(false);
      loadCards();
    }
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedCards(new Set());
  };

  const formatInterval = (days: number): string => {
    if (days === 0) return 'New';
    if (days === 1) return '1 day';
    if (days < 30) return `${days} days`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
  };

  return (
    <div className="flashcards-page">
      <div className="container">
        <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
        {/* Header */}
        <div className="flashcards-header">
          <Link to="/" className="back-link">← Home</Link>
          <h1 className="flashcards-title">
            <span className="title-icon">🎴</span>
            Flashcards
          </h1>
          <p className="flashcards-subtitle">
            Spaced repetition learning for long-term retention
          </p>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="flashcards-stats-dashboard">
            <div className="stat-card stat-primary">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalCards}</div>
                <div className="stat-label">Total Cards</div>
              </div>
            </div>

            <div className="stat-card stat-new">
              <div className="stat-icon">✨</div>
              <div className="stat-content">
                <div className="stat-number">{stats.newCards}</div>
                <div className="stat-label">New</div>
              </div>
            </div>

            <div className="stat-card stat-learning">
              <div className="stat-icon">📖</div>
              <div className="stat-content">
                <div className="stat-number">{stats.learningCards}</div>
                <div className="stat-label">Learning</div>
              </div>
            </div>

            <div className="stat-card stat-reviewing">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-number">{stats.reviewingCards}</div>
                <div className="stat-label">Reviewing</div>
              </div>
            </div>

            <div className="stat-card stat-mastered">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">{stats.masteredCards}</div>
                <div className="stat-label">Mastered</div>
              </div>
            </div>

            <div className="stat-card stat-due">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <div className="stat-number">{stats.dueToday}</div>
                <div className="stat-label">Due Today</div>
              </div>
            </div>

            <div className="stat-card stat-streak">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <div className="stat-number">{stats.currentStreak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flashcards-actions">
          <Link to="/flashcards/study" className="btn-primary btn-study">
            <span className="btn-icon">📖</span>
            <span className="btn-text">
              {stats && stats.dueToday > 0 ? `Study Now (${stats.dueToday} due)` : 'Start Studying'}
            </span>
          </Link>

          <button
            className="btn-secondary btn-generate"
            onClick={() => setShowGenerator(!showGenerator)}
          >
            <span className="btn-icon">✨</span>
            <span className="btn-text">Generate Flashcards</span>
          </button>

          <button
            className="btn-secondary btn-create"
            onClick={() => setShowCreator(!showCreator)}
          >
            <span className="btn-icon">➕</span>
            <span className="btn-text">Create Custom Card</span>
          </button>
        </div>

        {/* Enhanced Cards Toggle */}
        <div className="flashcards-toggle">
          <div className="toggle-group">
            <label className="toggle-label">Card Source:</label>
            <div className="toggle-buttons">
              <button
                className={`toggle-btn ${useEnhancedCards ? 'active' : ''}`}
                onClick={() => setUseEnhancedCards(true)}
              >
                <span className="toggle-icon">✨</span>
                Enhanced Cards ({enhancedCards.length})
              </button>
              <button
                className={`toggle-btn ${!useEnhancedCards ? 'active' : ''}`}
                onClick={() => setUseEnhancedCards(false)}
              >
                <span className="toggle-icon">📚</span>
                My Cards ({cards.length})
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Operations & Undo */}
        <div className="flashcards-secondary-actions">
          <button
            className={`btn-selection ${selectionMode ? 'active' : ''}`}
            onClick={() => {
              if (selectionMode) {
                cancelSelection();
              } else {
                setSelectionMode(true);
              }
            }}
          >
            <span className="btn-icon">☑️</span>
            <span className="btn-text">
              {selectionMode ? 'Cancel Selection' : 'Select Multiple'}
            </span>
          </button>

          {undoService.hasUndoableActions() && (
            <button
              className="btn-undo"
              onClick={() => setShowUndo(!showUndo)}
            >
              <span className="btn-icon">↩️</span>
              <span className="btn-text">Undo ({undoService.getRecentActions(10).length})</span>
            </button>
          )}
        </div>

        {/* Selection Mode Controls */}
        {selectionMode && (
          <div className="selection-toolbar">
            <div className="selection-info">
              <span className="selection-count">{selectedCards.size} selected</span>
              <button className="selection-action-link" onClick={selectAll}>
                Select All ({filteredCards.length})
              </button>
              <button className="selection-action-link" onClick={deselectAll}>
                Deselect All
              </button>
            </div>

            <div className="selection-actions">
              <button
                className="selection-btn selection-btn-reset"
                onClick={handleBulkResetProgress}
                disabled={selectedCards.size === 0}
              >
                🔄 Reset Progress
              </button>
              <button
                className="selection-btn selection-btn-delete"
                onClick={handleBulkDelete}
                disabled={selectedCards.size === 0}
              >
                🗑️ Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Undo Panel */}
        {showUndo && (
          <UndoPanel
            onClose={() => setShowUndo(false)}
            onUndo={() => {
              loadCards();
              setShowUndo(false);
            }}
          />
        )}

        {/* Card Editor */}
        {editingCard && (
          <FlashcardEditor
            card={editingCard}
            onClose={() => setEditingCard(null)}
            onSaved={() => {
              loadCards();
              setEditingCard(null);
            }}
          />
        )}

        {/* Custom Card Creator */}
        {showCreator && (
          <FlashcardCreator
            onClose={() => setShowCreator(false)}
            onCreated={() => {
              loadCards();
              setShowCreator(false);
            }}
          />
        )}

        {/* Card Preview Modal */}
        {previewLesson && (
          <div className="preview-modal-overlay" onClick={() => setPreviewLesson(null)}>
            <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
              <div className="preview-header">
                <h3>Preview Flashcards for {previewLesson.title}</h3>
                <button className="preview-close" onClick={() => setPreviewLesson(null)}>✕</button>
              </div>

              <div className="preview-info">
                <p>
                  <strong>{flashcardGenerator.estimateCardCount(previewLesson)} cards</strong> will be generated from:
                </p>
                <ul className="preview-sources">
                  {previewLesson.objectives && previewLesson.objectives.length > 0 && (
                    <li>🎯 {previewLesson.objectives.length} Objectives</li>
                  )}
                  {previewLesson.teachingScript && (
                    <li>📝 {previewLesson.teachingScript.reduce((sum, s) => sum + (s.keyPoints?.length || 0), 0)} Teaching Points</li>
                  )}
                  {previewLesson.commonErrors && previewLesson.commonErrors.length > 0 && (
                    <li>⚠️ {previewLesson.commonErrors.length} Common Errors</li>
                  )}
                  {previewLesson.completionStandards && previewLesson.completionStandards.length > 0 && (
                    <li>✅ {previewLesson.completionStandards.length} Completion Standards</li>
                  )}
                </ul>
              </div>

              <div className="preview-samples">
                <h4>Sample Cards:</h4>
                {flashcardGenerator.generateSampleCards(previewLesson, 3).map((sample, idx) => (
                  <div key={idx} className="preview-card">
                    <div className="preview-card-front">
                      <strong>Q:</strong> {sample.front}
                    </div>
                    <div className="preview-card-back">
                      <strong>A:</strong> {sample.back}
                    </div>
                    <div className="preview-card-category">{sample.category}</div>
                  </div>
                ))}
              </div>

              <div className="preview-actions">
                <button className="btn-secondary" onClick={() => setPreviewLesson(null)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={() => confirmGeneration(previewLesson)}>
                  Generate {flashcardGenerator.estimateCardCount(previewLesson)} Cards
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generator Panel */}
        {showGenerator && (
          <div className="generator-panel">
            <div className="generator-header">
              <h3>Generate Flashcards</h3>
              <button className="generator-close" onClick={() => setShowGenerator(false)}>✕</button>
            </div>
            
            <div className="generator-content">
              <div className="generator-option">
                <div className="option-info">
                  <h4>Generate for All Lessons</h4>
                  <p>Create flashcards from all 85 lesson plans (~500+ cards)</p>
                </div>
                <button className="btn-primary" onClick={handleGenerateAll}>
                  Generate All
                </button>
              </div>

              <div className="generator-lessons">
                <h4>Or select individual lessons:</h4>
                <div className="lessons-grid">
                  {lessonPlansData.lessonPlans.slice(0, 12).map(lesson => (
                    <div key={lesson.id} className="lesson-card-mini">
                      <div className="lesson-card-title">{lesson.title}</div>
                      <div className="lesson-card-info">
                        {flashcardGenerator.estimateCardCount(lesson)} cards
                      </div>
                      <button
                        className="lesson-card-btn"
                        onClick={() => handleGenerateForLesson(lesson)}
                      >
                        Generate
                      </button>
                    </div>
                  ))}
                </div>
                <Link to="/lesson-plans" className="view-all-lessons">
                  View all 85 lessons →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flashcards-controls">
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flashcards-search"
          />

          <div className="flashcards-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({cards.length})
            </button>
            <button
              className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
              onClick={() => setFilter('new')}
            >
              New ({stats?.newCards || 0})
            </button>
            <button
              className={`filter-btn ${filter === 'learning' ? 'active' : ''}`}
              onClick={() => setFilter('learning')}
            >
              Learning ({stats?.learningCards || 0})
            </button>
            <button
              className={`filter-btn ${filter === 'reviewing' ? 'active' : ''}`}
              onClick={() => setFilter('reviewing')}
            >
              Reviewing ({stats?.reviewingCards || 0})
            </button>
            <button
              className={`filter-btn ${filter === 'mastered' ? 'active' : ''}`}
              onClick={() => setFilter('mastered')}
            >
              Mastered ({stats?.masteredCards || 0})
            </button>
          </div>
        </div>

        {/* Cards List */}
        <div className="flashcards-list">
          {filteredCards.length === 0 ? (
            <div className="flashcards-empty">
              <div className="empty-icon">🎴</div>
              <h3>No flashcards yet</h3>
              <p>Generate flashcards from your lesson plans to get started!</p>
              <button className="btn-primary" onClick={() => setShowGenerator(true)}>
                Generate Flashcards
              </button>
            </div>
          ) : (
            filteredCards.map(card => (
              <div 
                key={card.id} 
                className={`flashcard-item ${selectionMode ? 'selectable' : ''} ${selectedCards.has(card.id) ? 'selected' : ''}`}
                onClick={() => selectionMode && toggleCardSelection(card.id)}
              >
                {selectionMode && (
                  <div className="flashcard-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCards.has(card.id)}
                      onChange={() => toggleCardSelection(card.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

                <div className="flashcard-item-header">
                  <span className="flashcard-item-category">{card.category}</span>
                  <span className={`flashcard-item-status status-${card.status}`}>
                    {card.status}
                  </span>
                </div>

                <div className="flashcard-item-content">
                  <div className="flashcard-item-front">
                    <strong>Q:</strong> {card.front}
                  </div>
                  <div className="flashcard-item-back">
                    <strong>A:</strong> {card.back}
                  </div>
                </div>

                <div className="flashcard-item-footer">
                  <div className="flashcard-item-meta">
                    <span>{card.lessonTitle}</span>
                    <span>•</span>
                    <span>Next: {formatInterval(card.interval)}</span>
                    <span>•</span>
                    <span>
                      {card.timesReviewed > 0 && (
                        `${Math.round((card.timesCorrect / card.timesReviewed) * 100)}% accuracy`
                      )}
                      {card.timesReviewed === 0 && 'Not reviewed yet'}
                    </span>
                  </div>

                  {!selectionMode && (
                    <div className="flashcard-item-actions">
                      <button
                        className="flashcard-item-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCard(card);
                        }}
                        title="Edit card"
                      >
                        ✏️
                      </button>
                      <button
                        className="flashcard-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card.id);
                        }}
                        title="Delete card"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

