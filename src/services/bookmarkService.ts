// Bookmark Service for Audio Lessons

export interface Bookmark {
  id: string;
  lessonId: string;
  lessonTitle: string;
  segment: number;
  time: number; // estimated time in seconds
  note: string;
  createdAt: number;
}

class BookmarkService {
  private readonly STORAGE_KEY = 'audio-bookmarks';

  /**
   * Get all bookmarks
   */
  getAllBookmarks(): Bookmark[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Get bookmarks for a specific lesson
   */
  getLessonBookmarks(lessonId: string): Bookmark[] {
    return this.getAllBookmarks().filter(b => b.lessonId === lessonId);
  }

  /**
   * Create a new bookmark
   */
  createBookmark(
    lessonId: string,
    lessonTitle: string,
    segment: number,
    time: number,
    note: string
  ): Bookmark {
    const bookmarks = this.getAllBookmarks();
    
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lessonId,
      lessonTitle,
      segment,
      time,
      note,
      createdAt: Date.now()
    };

    bookmarks.push(newBookmark);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
    
    return newBookmark;
  }

  /**
   * Delete a bookmark
   */
  deleteBookmark(id: string): boolean {
    const bookmarks = this.getAllBookmarks();
    const filtered = bookmarks.filter(b => b.id !== id);
    
    if (filtered.length === bookmarks.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Update a bookmark's note
   */
  updateBookmarkNote(id: string, note: string): boolean {
    const bookmarks = this.getAllBookmarks();
    const bookmark = bookmarks.find(b => b.id === id);
    
    if (!bookmark) return false;
    
    bookmark.note = note;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
    return true;
  }

  /**
   * Clear all bookmarks for a lesson
   */
  clearLessonBookmarks(lessonId: string): void {
    const bookmarks = this.getAllBookmarks();
    const filtered = bookmarks.filter(b => b.lessonId !== lessonId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Clear all bookmarks
   */
  clearAllBookmarks(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const bookmarkService = new BookmarkService();






