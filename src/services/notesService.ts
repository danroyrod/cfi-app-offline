/**
 * Notes Service
 * Supports adding rich text notes to lesson plans and ACS tasks
 * iOS-ready: Uses abstracted storage (localStorage now, AsyncStorage later)
 */

export interface PersonalNote {
  id: string;
  resourceType: 'lesson-plan' | 'acs-task';
  resourceId: string;
  title: string;
  content: string; // Markdown format
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
}

class NotesService {
  private readonly STORAGE_KEY = 'personal-notes';

  /**
   * Get all notes
   */
  getAllNotes(): PersonalNote[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Get notes for a specific resource
   */
  getNotesByResource(
    resourceId: string,
    resourceType: 'lesson-plan' | 'acs-task'
  ): PersonalNote[] {
    return this.getAllNotes().filter(
      n => n.resourceId === resourceId && n.resourceType === resourceType
    );
  }

  /**
   * Get a note by ID
   */
  getNote(id: string): PersonalNote | null {
    const notes = this.getAllNotes();
    return notes.find(n => n.id === id) || null;
  }

  /**
   * Create a new note
   */
  createNote(
    resourceType: 'lesson-plan' | 'acs-task',
    resourceId: string,
    title: string,
    content: string,
    tags: string[] = []
  ): PersonalNote {
    const notes = this.getAllNotes();
    
    const newNote: PersonalNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      resourceType,
      resourceId,
      title,
      content,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false
    };

    notes.push(newNote);
    this.saveNotes(notes);
    
    return newNote;
  }

  /**
   * Update a note
   */
  updateNote(
    id: string,
    updates: Partial<Pick<PersonalNote, 'title' | 'content' | 'tags'>>
  ): boolean {
    const notes = this.getAllNotes();
    const note = notes.find(n => n.id === id);
    
    if (!note) return false;
    
    if (updates.title !== undefined) note.title = updates.title;
    if (updates.content !== undefined) note.content = updates.content;
    if (updates.tags !== undefined) note.tags = updates.tags;
    note.updatedAt = Date.now();
    
    this.saveNotes(notes);
    return true;
  }

  /**
   * Delete a note
   */
  deleteNote(id: string): boolean {
    const notes = this.getAllNotes();
    const filtered = notes.filter(n => n.id !== id);
    
    if (filtered.length === notes.length) return false;
    
    this.saveNotes(filtered);
    return true;
  }

  /**
   * Pin/unpin a note
   */
  pinNote(id: string): boolean {
    const notes = this.getAllNotes();
    const note = notes.find(n => n.id === id);
    
    if (!note) return false;
    
    note.isPinned = true;
    note.updatedAt = Date.now();
    this.saveNotes(notes);
    
    return true;
  }

  /**
   * Unpin a note
   */
  unpinNote(id: string): boolean {
    const notes = this.getAllNotes();
    const note = notes.find(n => n.id === id);
    
    if (!note) return false;
    
    note.isPinned = false;
    note.updatedAt = Date.now();
    this.saveNotes(notes);
    
    return true;
  }

  /**
   * Toggle pin status
   */
  togglePin(id: string): boolean {
    const note = this.getNote(id);
    if (!note) return false;
    
    return note.isPinned ? this.unpinNote(id) : this.pinNote(id);
  }

  /**
   * Search notes by content
   */
  searchNotes(query: string): PersonalNote[] {
    const notes = this.getAllNotes();
    const queryLower = query.toLowerCase();
    
    return notes.filter(note =>
      note.title.toLowerCase().includes(queryLower) ||
      note.content.toLowerCase().includes(queryLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }

  /**
   * Get notes by tag
   */
  getNotesByTag(tag: string): PersonalNote[] {
    return this.getAllNotes().filter(n => n.tags.includes(tag));
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const notes = this.getAllNotes();
    const tagSet = new Set<string>();
    notes.forEach(n => n.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }

  /**
   * Get pinned notes
   */
  getPinnedNotes(): PersonalNote[] {
    return this.getAllNotes()
      .filter(n => n.isPinned)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Get recent notes
   */
  getRecentNotes(limit: number = 10): PersonalNote[] {
    const notes = this.getAllNotes();
    return notes
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  }

  /**
   * Export notes to JSON
   */
  exportNotes(): string {
    return JSON.stringify(this.getAllNotes(), null, 2);
  }

  /**
   * Import notes from JSON
   */
  importNotes(json: string): boolean {
    try {
      const notes = JSON.parse(json) as PersonalNote[];
      // Validate structure
      if (Array.isArray(notes) && notes.every(n => 
        n.id && n.resourceType && n.resourceId && n.title && n.content
      )) {
        this.saveNotes(notes);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Clear all notes
   */
  clearAllNotes(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Private helper to save notes
   */
  private saveNotes(notes: PersonalNote[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    }
  }
}

export const notesService = new NotesService();

