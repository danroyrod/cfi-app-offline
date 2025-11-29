import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService, type SearchFilters, type SearchResultType } from '../services/searchService';
import { universalBookmarkService } from '../services/universalBookmarkService';
import { notesService } from '../services/notesService';
import './AdvancedSearch.css';

interface AdvancedSearchProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
}

export default function AdvancedSearch({ initialQuery = '', onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRecentSearches(searchService.getRecentSearches(5));
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const suggs = searchService.getSuggestions(query, 5);
      setSuggestions(suggs);
      setShowSuggestions(suggs.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    searchService.saveSearch(searchQuery);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Navigate to search results
      const params = new URLSearchParams({ q: searchQuery });
      if (filters.types && filters.types.length > 0) {
        params.append('types', filters.types.join(','));
      }
      if (filters.areas && filters.areas.length > 0) {
        params.append('areas', filters.areas.join(','));
      }
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleRecentClick = (recent: string) => {
    setQuery(recent);
    handleSearch(recent);
  };

  const allAreas = Array.from({ length: 9 }, (_, i) => String.fromCharCode(73 + i)); // I through IX
  const allTags = [
    ...universalBookmarkService.getAllTags(),
    ...notesService.getAllTags()
  ];
  const uniqueTags = Array.from(new Set(allTags));

  return (
    <div className="advanced-search">
      <div className="advanced-search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 || recentSearches.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Search lesson plans, tasks, notes, bookmarks..."
          className="advanced-search-input"
        />
        <button
          onClick={() => handleSearch()}
          className="advanced-search-button"
          disabled={!query.trim()}
        >
          Search
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="advanced-search-filter-toggle"
          title="Toggle filters"
        >
          {showFilters ? '▲' : '▼'} Filters
        </button>
      </div>

      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="advanced-search-suggestions">
          {suggestions.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-header">Suggestions</div>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          {recentSearches.length > 0 && (
            <div className="suggestions-section">
              <div className="suggestions-header">Recent Searches</div>
              {recentSearches.map((recent, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecentClick(recent)}
                  className="suggestion-item"
                >
                  {recent}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showFilters && (
        <div className="advanced-search-filters">
          <div className="filter-section">
            <label>Content Types</label>
            <div className="filter-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={!filters.types || filters.types.includes('lesson-plan')}
                  onChange={(e) => {
                    const types = filters.types || [];
                    if (e.target.checked) {
                      setFilters({ ...filters, types: [...new Set([...types, 'lesson-plan' as SearchResultType])] });
                    } else {
                      setFilters({ ...filters, types: types.filter(t => t !== 'lesson-plan') as SearchResultType[] });
                    }
                  }}
                />
                Lesson Plans
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!filters.types || filters.types.includes('acs-task')}
                  onChange={(e) => {
                    const types = filters.types || [];
                    if (e.target.checked) {
                      setFilters({ ...filters, types: [...new Set([...types, 'acs-task' as SearchResultType])] });
                    } else {
                      setFilters({ ...filters, types: types.filter(t => t !== 'acs-task') as SearchResultType[] });
                    }
                  }}
                />
                ACS Tasks
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!filters.types || filters.types.includes('note')}
                  onChange={(e) => {
                    const types = filters.types || [];
                    if (e.target.checked) {
                      setFilters({ ...filters, types: [...new Set([...types, 'note' as SearchResultType])] });
                    } else {
                      setFilters({ ...filters, types: types.filter(t => t !== 'note') as SearchResultType[] });
                    }
                  }}
                />
                Notes
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!filters.types || filters.types.includes('bookmark')}
                  onChange={(e) => {
                    const types = filters.types || [];
                    if (e.target.checked) {
                      setFilters({ ...filters, types: [...new Set([...types, 'bookmark' as SearchResultType])] });
                    } else {
                      setFilters({ ...filters, types: types.filter(t => t !== 'bookmark') as SearchResultType[] });
                    }
                  }}
                />
                Bookmarks
              </label>
            </div>
          </div>

          <div className="filter-section">
            <label>Areas</label>
            <select
              multiple
              value={filters.areas || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                setFilters({ ...filters, areas: selected.length > 0 ? selected : undefined });
              }}
              className="filter-multiselect"
            >
              {allAreas.map(area => (
                <option key={area} value={area}>Area {area}</option>
              ))}
            </select>
          </div>

          {uniqueTags.length > 0 && (
            <div className="filter-section">
              <label>Tags</label>
              <select
                multiple
                value={filters.tags || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                  setFilters({ ...filters, tags: selected.length > 0 ? selected : undefined });
                }}
                className="filter-multiselect"
              >
                {uniqueTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-actions">
            <button
              onClick={() => setFilters({})}
              className="filter-clear"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

