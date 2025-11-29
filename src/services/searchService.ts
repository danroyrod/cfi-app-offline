/**
 * Search Service
 * Performs searches using the search index
 * Supports filtering, sorting, and highlighting
 */

import {
  searchIndexService,
  type SearchableLessonPlan,
  type SearchableTask,
  type SearchableNote,
  type SearchableBookmark
} from './searchIndexService';

export type SearchResultType = 'lesson-plan' | 'acs-task' | 'note' | 'bookmark';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  snippet: string;
  matches: string[];
  score: number;
  metadata?: {
    areaNumber?: string;
    taskLetter?: string;
    resourceType?: 'lesson-plan' | 'acs-task';
    resourceId?: string;
    tags?: string[];
  };
}

export interface SearchFilters {
  types?: SearchResultType[];
  areas?: string[];
  tags?: string[];
  dateRange?: {
    start?: number;
    end?: number;
  };
}

export interface SearchOptions {
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'date' | 'title';
  limit?: number;
}

class SearchService {
  private readonly STORAGE_KEY = 'search-history';
  private readonly MAX_HISTORY = 20;

  /**
   * Perform a search
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const index = searchIndexService.getIndex();
    const queryLower = query.toLowerCase().trim();
    const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 0);

    const results: SearchResult[] = [];

    // Search lesson plans
    if (!options.filters?.types || options.filters.types.includes('lesson-plan')) {
      index.lessonPlans.forEach(lp => {
        if (this.matchesFilters(lp, options.filters)) {
          const score = this.calculateScore(lp.searchableText, queryTerms);
          if (score > 0) {
            const snippet = this.generateSnippet(lp.overview, queryTerms);
            const matches = this.findMatches(lp.searchableText, queryTerms);
            results.push({
              type: 'lesson-plan',
              id: lp.id,
              title: lp.title,
              snippet,
              matches,
              score,
              metadata: {
                areaNumber: lp.areaNumber,
                taskLetter: lp.taskLetter
              }
            });
          }
        }
      });
    }

    // Search ACS tasks
    if (!options.filters?.types || options.filters.types.includes('acs-task')) {
      index.acsTasks.forEach(task => {
        if (this.matchesFilters(task, options.filters)) {
          const score = this.calculateScore(task.searchableText, queryTerms);
          if (score > 0) {
            const snippet = this.generateSnippet(task.objective, queryTerms);
            const matches = this.findMatches(task.searchableText, queryTerms);
            results.push({
              type: 'acs-task',
              id: task.id,
              title: task.title,
              snippet,
              matches,
              score,
              metadata: {
                areaNumber: task.areaNumber,
                taskLetter: task.taskLetter
              }
            });
          }
        }
      });
    }

    // Search notes
    if (!options.filters?.types || options.filters.types.includes('note')) {
      index.notes.forEach(note => {
        if (this.matchesFilters(note, options.filters)) {
          const score = this.calculateScore(note.searchableText, queryTerms);
          if (score > 0) {
            const snippet = this.generateSnippet(note.content, queryTerms);
            const matches = this.findMatches(note.searchableText, queryTerms);
            results.push({
              type: 'note',
              id: note.id,
              title: note.title,
              snippet,
              matches,
              score,
              metadata: {
                resourceType: note.resourceType,
                resourceId: note.resourceId,
                tags: note.tags
              }
            });
          }
        }
      });
    }

    // Search bookmarks
    if (!options.filters?.types || options.filters.types.includes('bookmark')) {
      index.bookmarks.forEach(bookmark => {
        if (this.matchesFilters(bookmark, options.filters)) {
          const score = this.calculateScore(bookmark.searchableText, queryTerms);
          if (score > 0) {
            const snippet = bookmark.note ? this.generateSnippet(bookmark.note, queryTerms) : '';
            const matches = this.findMatches(bookmark.searchableText, queryTerms);
            results.push({
              type: 'bookmark',
              id: bookmark.id,
              title: bookmark.title,
              snippet,
              matches,
              score,
              metadata: {
                resourceType: bookmark.resourceType,
                resourceId: bookmark.resourceId,
                tags: bookmark.tags
              }
            });
          }
        }
      });
    }

    // Sort results
    const sorted = this.sortResults(results, options.sortBy || 'relevance');

    // Apply limit
    if (options.limit) {
      return sorted.slice(0, options.limit);
    }

    return sorted;
  }

  /**
   * Get autocomplete suggestions
   */
  getSuggestions(partialQuery: string, limit: number = 5): string[] {
    if (!partialQuery || partialQuery.trim().length < 2) {
      return [];
    }

    const index = searchIndexService.getIndex();
    const queryLower = partialQuery.toLowerCase();
    const suggestions = new Set<string>();

    // Extract titles and common terms
    const allTitles: string[] = [
      ...index.lessonPlans.map(lp => lp.title),
      ...index.acsTasks.map(t => t.title),
      ...index.notes.map(n => n.title),
      ...index.bookmarks.map(b => b.title)
    ];

    allTitles.forEach(title => {
      const words = title.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.startsWith(queryLower) && word.length > queryLower.length) {
          suggestions.add(word);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get recent searches
   */
  getRecentSearches(limit: number = 10): string[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const history = JSON.parse(stored) as string[];
      return history.slice(0, limit);
    } catch {
      return [];
    }
  }

  /**
   * Save a search to history
   */
  saveSearch(query: string): void {
    if (typeof window === 'undefined' || !query || query.trim().length === 0) return;
    
    const history = this.getRecentSearches(this.MAX_HISTORY * 2);
    const trimmed = query.trim();
    
    // Remove if already exists
    const filtered = history.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
    
    // Add to front
    filtered.unshift(trimmed);
    
    // Limit size
    const limited = filtered.slice(0, this.MAX_HISTORY);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
  }

  /**
   * Clear search history
   */
  clearHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Calculate relevance score
   */
  private calculateScore(text: string, queryTerms: string[]): number {
    let score = 0;
    const textLower = text.toLowerCase();

    queryTerms.forEach(term => {
      // Exact match
      if (textLower.includes(term)) {
        score += 10;
      }
      
      // Word boundary match (higher score)
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        score += matches.length * 5;
      }
    });

    return score;
  }

  /**
   * Generate snippet with highlighted terms
   */
  private generateSnippet(text: string, queryTerms: string[], maxLength: number = 150): string {
    if (!text) return '';
    let bestIndex = -1;
    let bestScore = 0;

    // Find the best position (where most terms appear)
    for (let i = 0; i < text.length; i++) {
      const snippet = text.substring(i, i + maxLength).toLowerCase();
      let score = 0;
      queryTerms.forEach(term => {
        if (snippet.includes(term)) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    if (bestIndex === -1) {
      return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
    }

    let snippet = text.substring(bestIndex, bestIndex + maxLength);
    if (bestIndex > 0) snippet = '...' + snippet;
    if (bestIndex + maxLength < text.length) snippet = snippet + '...';

    return snippet;
  }

  /**
   * Find matching terms
   */
  private findMatches(text: string, queryTerms: string[]): string[] {
    const matches: string[] = [];
    const textLower = text.toLowerCase();

    queryTerms.forEach(term => {
      if (textLower.includes(term)) {
        matches.push(term);
      }
    });

    return [...new Set(matches)];
  }

  /**
   * Check if item matches filters
   */
  private matchesFilters(
    item: SearchableLessonPlan | SearchableTask | SearchableNote | SearchableBookmark,
    filters?: SearchFilters
  ): boolean {
    if (!filters) return true;

    // Area filter
    if (filters.areas && filters.areas.length > 0) {
      const areaNumber = 'areaNumber' in item ? item.areaNumber : undefined;
      if (!areaNumber || !filters.areas.includes(areaNumber)) {
        return false;
      }
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      const itemTags = 'tags' in item ? item.tags : [];
      const hasTag = filters.tags.some(tag => itemTags.includes(tag));
      if (!hasTag) {
        return false;
      }
    }

    return true;
  }

  /**
   * Sort results
   */
  private sortResults(results: SearchResult[], sortBy: 'relevance' | 'date' | 'title'): SearchResult[] {
    const sorted = [...results];

    switch (sortBy) {
      case 'relevance':
        sorted.sort((a, b) => b.score - a.score);
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'date':
        // For date sorting, we'd need to add date metadata
        // For now, fall back to relevance
        sorted.sort((a, b) => b.score - a.score);
        break;
    }

    return sorted;
  }
}

export const searchService = new SearchService();

