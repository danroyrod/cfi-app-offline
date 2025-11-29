import { useState, useEffect, useCallback } from 'react';
import { notesService, type PersonalNote } from '../services/notesService';
import NotesEditor from './NotesEditor';
import './NotesPanel.css';

interface NotesPanelProps {
  resourceType: 'lesson-plan' | 'acs-task';
  resourceId: string;
  resourceTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotesPanel({
  resourceType,
  resourceId,
  resourceTitle,
  isOpen,
  onClose
}: NotesPanelProps) {
  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<PersonalNote | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen, resourceId, resourceType]);

  const loadNotes = useCallback(() => {
    const resourceNotes = notesService.getNotesByResource(resourceId, resourceType);
    // Sort: pinned first, then by updated date
    const sorted = resourceNotes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
    setNotes(sorted);
  }, [resourceId, resourceType]);

  const filteredNotes = notes.filter(note => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
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

  if (!isOpen) return null;

  return (
    <>
      <div className="notes-panel-overlay" onClick={onClose} />
      <div className="notes-panel">
        <div className="notes-panel-header">
          <h2>Notes</h2>
          <button
            className="notes-panel-close"
            onClick={onClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        <div className="notes-panel-actions">
          <button
            className="notes-panel-new-btn"
            onClick={handleNewNote}
          >
            + New Note
          </button>
        </div>

        <div className="notes-panel-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="notes-panel-search-input"
          />
        </div>

        <div className="notes-panel-content">
          {isEditorOpen ? (
            <NotesEditor
              resourceType={resourceType}
              resourceId={resourceId}
              resourceTitle={resourceTitle}
              existingNote={editingNote}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              {filteredNotes.length === 0 ? (
                <div className="notes-panel-empty">
                  <span className="empty-icon">📝</span>
                  <p>
                    {searchTerm
                      ? 'No notes match your search'
                      : 'No notes yet'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={handleNewNote}
                      className="notes-panel-empty-btn"
                    >
                      Create First Note
                    </button>
                  )}
                </div>
              ) : (
                <div className="notes-panel-list">
                  {filteredNotes.map(note => (
                    <div
                      key={note.id}
                      className={`notes-panel-item ${note.isPinned ? 'pinned' : ''}`}
                    >
                      <div className="notes-panel-item-header">
                        <div className="notes-panel-item-title-row">
                          <h3 className="notes-panel-item-title">
                            {note.isPinned && <span className="pin-icon">📌</span>}
                            {note.title}
                          </h3>
                        </div>
                        <div className="notes-panel-item-actions">
                          <button
                            onClick={() => handleTogglePin(note)}
                            className="notes-panel-item-action"
                            title={note.isPinned ? 'Unpin' : 'Pin'}
                            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
                          >
                            {note.isPinned ? '📌' : '📍'}
                          </button>
                          <button
                            onClick={() => handleEditNote(note)}
                            className="notes-panel-item-action"
                            title="Edit"
                            aria-label="Edit note"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note)}
                            className="notes-panel-item-action"
                            title="Delete"
                            aria-label="Delete note"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="notes-panel-item-content">
                        {note.content.split('\n').slice(0, 3).map((line, idx) => (
                          <p key={idx}>{line || '\u00A0'}</p>
                        ))}
                        {note.content.split('\n').length > 3 && (
                          <p className="notes-panel-item-more">...</p>
                        )}
                      </div>
                      {note.tags.length > 0 && (
                        <div className="notes-panel-item-tags">
                          {note.tags.map(tag => (
                            <span key={tag} className="notes-panel-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="notes-panel-item-meta">
                        <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

