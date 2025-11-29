import { useState, useEffect } from 'react';
import { notesService, type PersonalNote } from '../services/notesService';
import './NotesEditor.css';

interface NotesEditorProps {
  resourceType: 'lesson-plan' | 'acs-task';
  resourceId: string;
  resourceTitle: string;
  existingNote?: PersonalNote;
  onSave: (note: PersonalNote) => void;
  onCancel: () => void;
}

export default function NotesEditor({
  resourceType,
  resourceId,
  resourceTitle,
  existingNote,
  onSave,
  onCancel
}: NotesEditorProps) {
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [tags, setTags] = useState<string[]>(existingNote?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setAllTags(notesService.getAllTags());
  }, []);

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please provide both a title and content for your note.');
      return;
    }

    setIsSaving(true);
    
    try {
      let note: PersonalNote;
      
      if (existingNote) {
        notesService.updateNote(existingNote.id, { title, content, tags });
        note = notesService.getNote(existingNote.id)!;
      } else {
        note = notesService.createNote(
          resourceType,
          resourceId,
          title,
          content,
          tags
        );
      }
      
      onSave(note);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const availableTags = allTags.filter(t => !tags.includes(t));

  return (
    <div className="notes-editor">
      <div className="notes-editor-header">
        <h3>{existingNote ? 'Edit Note' : 'New Note'}</h3>
        <button
          className="notes-editor-close"
          onClick={onCancel}
          aria-label="Close editor"
        >
          ✕
        </button>
      </div>

      <div className="notes-editor-content">
        <div className="notes-editor-field">
          <label htmlFor="note-title">Title *</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            className="notes-editor-input"
            maxLength={100}
          />
          <span className="notes-editor-char-count">
            {title.length}/100
          </span>
        </div>

        <div className="notes-editor-field">
          <label htmlFor="note-content">Content * (Markdown supported)</label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note content... (Markdown supported)"
            className="notes-editor-textarea"
            rows={8}
          />
          <span className="notes-editor-char-count">
            {content.length} characters
          </span>
        </div>

        <div className="notes-editor-field">
          <label htmlFor="note-tags">Tags</label>
          <div className="notes-editor-tag-input">
            <input
              id="note-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type tag and press Enter..."
              className="notes-editor-input"
            />
            {availableTags.length > 0 && (
              <div className="notes-editor-tag-suggestions">
                {availableTags.slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    className="notes-editor-tag-suggestion"
                    onClick={() => {
                      setTags([...tags, tag]);
                      setTagInput('');
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          {tags.length > 0 && (
            <div className="notes-editor-tags">
              {tags.map(tag => (
                <span key={tag} className="notes-editor-tag">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="notes-editor-tag-remove"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="notes-editor-info">
          <span>Resource: {resourceTitle}</span>
        </div>
      </div>

      <div className="notes-editor-actions">
        <button
          onClick={onCancel}
          className="notes-editor-btn-cancel"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="notes-editor-btn-save"
          disabled={isSaving || !title.trim() || !content.trim()}
        >
          {isSaving ? 'Saving...' : existingNote ? 'Update' : 'Save'}
        </button>
      </div>
    </div>
  );
}

