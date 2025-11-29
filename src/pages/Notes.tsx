import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { notesService, type PersonalNote } from '../services/notesService';
import NotesEditor from '../components/NotesEditor';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import './Notes.css';

export default function Notes() {
  const location = useLocation();
  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lesson-plan' | 'acs-task'>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [editingNote, setEditingNote] = useState<PersonalNote | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = useCallback(() => {
    const allNotes = notesService.getAllNotes();
    // Sort: pinned first, then by updated date
    const sorted = allNotes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
    setNotes(sorted);
  }, []);

  const filteredNotes = notes.filter(note => {
    // Type filter
    if (filterType !== 'all' && note.resourceType !== filterType) return false;
    
    // Tag filter
    if (filterTag !== 'all' && !note.tags.includes(filterTag)) return false;
    
    // Pinned filter
    if (showPinnedOnly && !note.isPinned) return false;
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const handleNewNote = () => {
    setEditingNote(undefined);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: PersonalNote) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = (note: PersonalNote) => {
    if (confirm(`Delete note "${note.title}"?`)) {
      notesService.deleteNote(note.id);
      loadNotes();
    }
  };

  const handleTogglePin = (note: PersonalNote) => {
    notesService.togglePin(note.id);
    loadNotes();
  };

  const handleSaveNote = (_note: PersonalNote) => {
    setIsEditorOpen(false);
    setEditingNote(undefined);
    loadNotes();
  };

  const handleCancelEdit = () => {
    setIsEditorOpen(false);
    setEditingNote(undefined);
  };

  const handleExport = () => {
    const json = notesService.exportNotes();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfi-notes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          if (notesService.importNotes(json)) {
            loadNotes();
            alert('Notes imported successfully!');
          } else {
            alert('Failed to import notes. Invalid format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getNoteUrl = (note: PersonalNote): string => {
    if (note.resourceType === 'lesson-plan') {
      return `/lesson-plan/${note.resourceId}`;
    } else {
      const [area, task] = note.resourceId.split('.');
      return `/area/${area}/task/${task}`;
    }
  };

  const allTags = notesService.getAllTags();
  const pinnedCount = notes.filter(n => n.isPinned).length;

  return (
    <>
      <div className="header">
        <div className="container header-content">
          <div className="header-title">Notes</div>
          <Link to="/lesson-plans" className="back-link">
            ← Back
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
          <div className="notes-page">
            <div className="notes-page-header">
              <h1 className="notes-page-title">My Notes</h1>
              <div className="notes-page-actions">
                <button onClick={handleNewNote} className="btn-new-note">
                  + New Note
                </button>
                <button onClick={handleExport} className="btn-export">
                  📥 Export
                </button>
                <button onClick={handleImport} className="btn-import">
                  📤 Import
                </button>
                {notes.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear all notes? This cannot be undone.')) {
                        notesService.clearAllNotes();
                        loadNotes();
                      }
                    }}
                    className="btn-clear"
                  >
                    🗑️ Clear All
                  </button>
                )}
              </div>
            </div>

            {isEditorOpen ? (
              <div className="notes-page-editor">
                <NotesEditor
                  resourceType={editingNote?.resourceType || 'lesson-plan'}
                  resourceId={editingNote?.resourceId || ''}
                  resourceTitle={editingNote?.title || 'New Note'}
                  existingNote={editingNote}
                  onSave={handleSaveNote}
                  onCancel={handleCancelEdit}
                />
              </div>
            ) : (
              <>
                {notes.length === 0 ? (
                  <div className="notes-page-empty">
                    <span className="empty-icon">📝</span>
                    <h2>No notes yet</h2>
                    <p>Create notes to remember important information about lessons and tasks</p>
                    <button onClick={handleNewNote} className="btn-primary-link">
                      Create First Note
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="notes-page-filters">
                      <div className="filter-group">
                        <label>Search</label>
                        <input
                          type="text"
                          placeholder="Search notes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="filter-input"
                        />
                      </div>

                      <div className="filter-group">
                        <label>Type</label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as any)}
                          className="filter-select"
                        >
                          <option value="all">All Types</option>
                          <option value="lesson-plan">Lesson Plans</option>
                          <option value="acs-task">ACS Tasks</option>
                        </select>
                      </div>

                      {allTags.length > 0 && (
                        <div className="filter-group">
                          <label>Tag</label>
                          <select
                            value={filterTag}
                            onChange={(e) => setFilterTag(e.target.value)}
                            className="filter-select"
                          >
                            <option value="all">All Tags</option>
                            {allTags.map(tag => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="filter-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={showPinnedOnly}
                            onChange={(e) => setShowPinnedOnly(e.target.checked)}
                            className="filter-checkbox"
                          />
                          Pinned Only ({pinnedCount})
                        </label>
                      </div>
                    </div>

                    <div className="notes-page-stats">
                      Showing {filteredNotes.length} of {notes.length} notes
                    </div>

                    <div className="notes-page-list">
                      {filteredNotes.length === 0 ? (
                        <div className="notes-page-empty-filtered">
                          <span className="empty-icon">🔍</span>
                          <p>No notes match your filters</p>
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setFilterType('all');
                              setFilterTag('all');
                              setShowPinnedOnly(false);
                            }}
                            className="btn-reset-filters"
                          >
                            Clear Filters
                          </button>
                        </div>
                      ) : (
                        filteredNotes.map(note => (
                          <div key={note.id} className={`note-card ${note.isPinned ? 'pinned' : ''}`}>
                            <div className="note-card-header">
                              <div className="note-card-title-row">
                                <Link
                                  to={getNoteUrl(note)}
                                  className="note-card-title"
                                >
                                  {note.isPinned && <span className="pin-icon">📌</span>}
                                  {note.title}
                                </Link>
                                <div className="note-card-meta">
                                  {note.resourceType === 'lesson-plan' ? '📚' : '📋'} {note.resourceId}
                                </div>
                              </div>
                              <div className="note-card-actions">
                                <button
                                  onClick={() => handleTogglePin(note)}
                                  className="note-card-action"
                                  title={note.isPinned ? 'Unpin' : 'Pin'}
                                >
                                  {note.isPinned ? '📌' : '📍'}
                                </button>
                                <button
                                  onClick={() => handleEditNote(note)}
                                  className="note-card-action"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note)}
                                  className="note-card-action"
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <div className="note-card-content">
                              {note.content.split('\n').slice(0, 5).map((line, idx) => (
                                <p key={idx}>{line || '\u00A0'}</p>
                              ))}
                              {note.content.split('\n').length > 5 && (
                                <p className="note-card-more">...</p>
                              )}
                            </div>
                            {note.tags.length > 0 && (
                              <div className="note-card-tags">
                                {note.tags.map(tag => (
                                  <span key={tag} className="note-tag">{tag}</span>
                                ))}
                              </div>
                            )}
                            <div className="note-card-dates">
                              <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                              <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

