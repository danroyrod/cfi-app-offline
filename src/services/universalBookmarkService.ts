/**
 * Universal Bookmark Service
 * Supports bookmarking lesson plans and ACS tasks
 * iOS-ready: Uses abstracted storage (localStorage now, AsyncStorage later)
 */

export interface UniversalBookmark {
  id: string;
  type: 'lesson-plan' | 'acs-task';
  resourceId: string; // LP-I-A or Area.Task format (e.g., "I.A")
  title: string;
  areaNumber: string;
  tags: string[];
  category?: string;
  note?: string;
  createdAt: number;
  lastAccessed: number;
}

class UniversalBookmarkService {
  private readonly STORAGE_KEY = 'universal-bookmarks';

  /**
   * Get all bookmarks
   */
  getAllBookmarks(): UniversalBookmark[] {
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
   * Check if a resource is bookmarked
   */
  isBookmarked(resourceId: string, type: 'lesson-plan' | 'acs-task'): boolean {
    const bookmarks = this.getAllBookmarks();
    return bookmarks.some(
      b => b.resourceId === resourceId && b.type === type
    );
  }

  /**
   * Get bookmark for a specific resource
   */
  getBookmark(resourceId: string, type: 'lesson-plan' | 'acs-task'): UniversalBookmark | null {
    const bookmarks = this.getAllBookmarks();
    return bookmarks.find(
      b => b.resourceId === resourceId && b.type === type
    ) || null;
  }

  /**
   * Add a bookmark
   */
  addBookmark(
    type: 'lesson-plan' | 'acs-task',
    resourceId: string,
    title: string,
    areaNumber: string,
    tags: string[] = [],
    category?: string,
    note?: string
  ): UniversalBookmark {
    const bookmarks = this.getAllBookmarks();
    
    // Check if already bookmarked
    const existing = bookmarks.find(
      b => b.resourceId === resourceId && b.type === type
    );
    
    if (existing) {
      // Update last accessed
      existing.lastAccessed = Date.now();
      if (tags.length > 0) {
        existing.tags = [...new Set([...existing.tags, ...tags])];
      }
      if (category) existing.category = category;
      if (note !== undefined) existing.note = note;
      this.saveBookmarks(bookmarks);
      return existing;
    }
    
    const newBookmark: UniversalBookmark = {
      id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      resourceId,
      title,
      areaNumber,
      tags,
      category,
      note,
      createdAt: Date.now(),
      lastAccessed: Date.now()
    };

    bookmarks.push(newBookmark);
    this.saveBookmarks(bookmarks);
    
    return newBookmark;
  }

  /**
   * Remove a bookmark
   */
  removeBookmark(resourceId: string, type: 'lesson-plan' | 'acs-task'): boolean {
    const bookmarks = this.getAllBookmarks();
    const filtered = bookmarks.filter(
      b => !(b.resourceId === resourceId && b.type === type)
    );
    
    if (filtered.length === bookmarks.length) return false;
    
    this.saveBookmarks(filtered);
    return true;
  }

  /**
   * Toggle bookmark (add if not exists, remove if exists)
   */
  toggleBookmark(
    type: 'lesson-plan' | 'acs-task',
    resourceId: string,
    title: string,
    areaNumber: string
  ): boolean {
    if (this.isBookmarked(resourceId, type)) {
      return this.removeBookmark(resourceId, type);
    } else {
      this.addBookmark(type, resourceId, title, areaNumber);
      return true;
    }
  }

  /**
   * Get bookmarks by type
   */
  getBookmarksByType(type: 'lesson-plan' | 'acs-task'): UniversalBookmark[] {
    return this.getAllBookmarks().filter(b => b.type === type);
  }

  /**
   * Get bookmarks by area
   */
  getBookmarksByArea(areaNumber: string): UniversalBookmark[] {
    return this.getAllBookmarks().filter(b => b.areaNumber === areaNumber);
  }

  /**
   * Get recent bookmarks (last accessed)
   */
  getRecentBookmarks(limit: number = 10): UniversalBookmark[] {
    const bookmarks = this.getAllBookmarks();
    return bookmarks
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, limit);
  }

  /**
   * Add tag to bookmark
   */
  addTag(resourceId: string, type: 'lesson-plan' | 'acs-task', tag: string): boolean {
    const bookmarks = this.getAllBookmarks();
    const bookmark = bookmarks.find(
      b => b.resourceId === resourceId && b.type === type
    );
    
    if (!bookmark) return false;
    
    if (!bookmark.tags.includes(tag)) {
      bookmark.tags.push(tag);
      this.saveBookmarks(bookmarks);
    }
    
    return true;
  }

  /**
   * Remove tag from bookmark
   */
  removeTag(resourceId: string, type: 'lesson-plan' | 'acs-task', tag: string): boolean {
    const bookmarks = this.getAllBookmarks();
    const bookmark = bookmarks.find(
      b => b.resourceId === resourceId && b.type === type
    );
    
    if (!bookmark) return false;
    
    bookmark.tags = bookmark.tags.filter(t => t !== tag);
    this.saveBookmarks(bookmarks);
    
    return true;
  }

  /**
   * Get bookmarks by tag
   */
  getBookmarksByTag(tag: string): UniversalBookmark[] {
    return this.getAllBookmarks().filter(b => b.tags.includes(tag));
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const bookmarks = this.getAllBookmarks();
    const tagSet = new Set<string>();
    bookmarks.forEach(b => b.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }

  /**
   * Update bookmark category
   */
  updateCategory(
    resourceId: string,
    type: 'lesson-plan' | 'acs-task',
    category: string | undefined
  ): boolean {
    const bookmarks = this.getAllBookmarks();
    const bookmark = bookmarks.find(
      b => b.resourceId === resourceId && b.type === type
    );
    
    if (!bookmark) return false;
    
    bookmark.category = category;
    this.saveBookmarks(bookmarks);
    
    return true;
  }

  /**
   * Update bookmark note
   */
  updateNote(
    resourceId: string,
    type: 'lesson-plan' | 'acs-task',
    note: string
  ): boolean {
    const bookmarks = this.getAllBookmarks();
    const bookmark = bookmarks.find(
      b => b.resourceId === resourceId && b.type === type
    );
    
    if (!bookmark) return false;
    
    bookmark.note = note;
    this.saveBookmarks(bookmarks);
    
    return true;
  }

  /**
   * Update last accessed time
   */
  updateLastAccessed(resourceId: string, type: 'lesson-plan' | 'acs-task'): void {
    const bookmarks = this.getAllBookmarks();
    const bookmark = bookmarks.find(
      b => b.resourceId === resourceId && b.type === type
    );
    
    if (bookmark) {
      bookmark.lastAccessed = Date.now();
      this.saveBookmarks(bookmarks);
    }
  }

  /**
   * Export bookmarks to JSON
   */
  exportBookmarks(): string {
    return JSON.stringify(this.getAllBookmarks(), null, 2);
  }

  /**
   * Import bookmarks from JSON
   */
  importBookmarks(json: string): boolean {
    try {
      const bookmarks = JSON.parse(json) as UniversalBookmark[];
      // Validate structure
      if (Array.isArray(bookmarks) && bookmarks.every(b => 
        b.id && b.type && b.resourceId && b.title && b.areaNumber
      )) {
        this.saveBookmarks(bookmarks);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Clear all bookmarks
   */
  clearAllBookmarks(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Private helper to save bookmarks
   */
  private saveBookmarks(bookmarks: UniversalBookmark[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
    }
  }
}

export const universalBookmarkService = new UniversalBookmarkService();

