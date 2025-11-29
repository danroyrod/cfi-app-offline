import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { searchService, type SearchResult, type SearchResultType } from '../services/searchService';
import AdvancedSearch from '../components/AdvancedSearch';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import './SearchResults.css';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [filterType, setFilterType] = useState<SearchResultType | 'all'>('all');

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, sortBy, filterType]);

  const performSearch = () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const filters: any = {};
      if (filterType !== 'all') {
        filters.types = [filterType];
      }

      const searchResults = searchService.search(query, {
        filters,
        sortBy,
        limit: 100
      });

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultUrl = (result: SearchResult): string => {
    switch (result.type) {
      case 'lesson-plan':
        return `/lesson-plan/${result.id}`;
      case 'acs-task':
        const [area, task] = result.id.split('.');
        return `/area/${area}/task/${task}`;
      case 'note':
        return `/notes`;
      case 'bookmark':
        return `/bookmarks`;
      default:
        return '/';
    }
  };

  const highlightText = (text: string, matches: string[]): React.ReactElement => {
    if (matches.length === 0) return <>{text}</>;

    let highlighted = text;
    matches.forEach(match => {
      const regex = new RegExp(`(${match})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });

    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  const groupedResults = {
    'lesson-plan': results.filter(r => r.type === 'lesson-plan'),
    'acs-task': results.filter(r => r.type === 'acs-task'),
    'note': results.filter(r => r.type === 'note'),
    'bookmark': results.filter(r => r.type === 'bookmark')
  };

  return (
    <>
      <div className="header">
        <div className="container header-content">
          <div className="header-title">Search</div>
          <Link to="/lesson-plans" className="back-link">
            ← Back
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
          <div className="search-results-page">
            <div className="search-results-header">
              <h1 className="search-results-title">Search</h1>
            </div>

            <div className="search-results-search">
              <AdvancedSearch initialQuery={query} />
            </div>

            {query && (
              <>
                <div className="search-results-controls">
                  <div className="results-count">
                    {isLoading ? 'Searching...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
                  </div>
                  <div className="results-filters">
                    <label>
                      Type:
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="filter-select"
                      >
                        <option value="all">All</option>
                        <option value="lesson-plan">Lesson Plans</option>
                        <option value="acs-task">ACS Tasks</option>
                        <option value="note">Notes</option>
                        <option value="bookmark">Bookmarks</option>
                      </select>
                    </label>
                    <label>
                      Sort:
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="filter-select"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="title">Title</option>
                        <option value="date">Date</option>
                      </select>
                    </label>
                  </div>
                </div>

                {isLoading ? (
                  <div className="search-results-loading">
                    <div className="loading-spinner">⏳</div>
                    <p>Searching...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="search-results-empty">
                    <span className="empty-icon">🔍</span>
                    <h2>No results found</h2>
                    <p>Try adjusting your search terms or filters</p>
                  </div>
                ) : (
                  <div className="search-results-list">
                    {groupedResults['lesson-plan'].length > 0 && (
                      <div className="results-group">
                        <h2 className="results-group-title">
                          📚 Lesson Plans ({groupedResults['lesson-plan'].length})
                        </h2>
                        {groupedResults['lesson-plan'].map(result => (
                          <Link
                            key={result.id}
                            to={getResultUrl(result)}
                            className="search-result-item"
                          >
                            <div className="result-item-header">
                              <h3 className="result-item-title">
                                {highlightText(result.title, result.matches)}
                              </h3>
                              <div className="result-item-meta">
                                Area {result.metadata?.areaNumber} • Task {result.metadata?.taskLetter}
                              </div>
                            </div>
                            <p className="result-item-snippet">
                              {highlightText(result.snippet, result.matches)}
                            </p>
                            <div className="result-item-score">
                              Relevance: {result.score.toFixed(1)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {groupedResults['acs-task'].length > 0 && (
                      <div className="results-group">
                        <h2 className="results-group-title">
                          📋 ACS Tasks ({groupedResults['acs-task'].length})
                        </h2>
                        {groupedResults['acs-task'].map(result => (
                          <Link
                            key={result.id}
                            to={getResultUrl(result)}
                            className="search-result-item"
                          >
                            <div className="result-item-header">
                              <h3 className="result-item-title">
                                {highlightText(result.title, result.matches)}
                              </h3>
                              <div className="result-item-meta">
                                Area {result.metadata?.areaNumber} • Task {result.metadata?.taskLetter}
                              </div>
                            </div>
                            <p className="result-item-snippet">
                              {highlightText(result.snippet, result.matches)}
                            </p>
                            <div className="result-item-score">
                              Relevance: {result.score.toFixed(1)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {groupedResults['note'].length > 0 && (
                      <div className="results-group">
                        <h2 className="results-group-title">
                          📝 Notes ({groupedResults['note'].length})
                        </h2>
                        {groupedResults['note'].map(result => (
                          <Link
                            key={result.id}
                            to={getResultUrl(result)}
                            className="search-result-item"
                          >
                            <div className="result-item-header">
                              <h3 className="result-item-title">
                                {highlightText(result.title, result.matches)}
                              </h3>
                              <div className="result-item-meta">
                                {result.metadata?.tags && result.metadata.tags.length > 0 && (
                                  <span className="result-item-tags">
                                    {result.metadata.tags.map(tag => (
                                      <span key={tag} className="result-tag">{tag}</span>
                                    ))}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="result-item-snippet">
                              {highlightText(result.snippet, result.matches)}
                            </p>
                            <div className="result-item-score">
                              Relevance: {result.score.toFixed(1)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {groupedResults['bookmark'].length > 0 && (
                      <div className="results-group">
                        <h2 className="results-group-title">
                          ⭐ Bookmarks ({groupedResults['bookmark'].length})
                        </h2>
                        {groupedResults['bookmark'].map(result => (
                          <Link
                            key={result.id}
                            to={getResultUrl(result)}
                            className="search-result-item"
                          >
                            <div className="result-item-header">
                              <h3 className="result-item-title">
                                {highlightText(result.title, result.matches)}
                              </h3>
                              <div className="result-item-meta">
                                {result.metadata?.tags && result.metadata.tags.length > 0 && (
                                  <span className="result-item-tags">
                                    {result.metadata.tags.map(tag => (
                                      <span key={tag} className="result-tag">{tag}</span>
                                    ))}
                                  </span>
                                )}
                              </div>
                            </div>
                            {result.snippet && (
                              <p className="result-item-snippet">
                                {highlightText(result.snippet, result.matches)}
                              </p>
                            )}
                            <div className="result-item-score">
                              Relevance: {result.score.toFixed(1)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {!query && (
              <div className="search-results-empty">
                <span className="empty-icon">🔍</span>
                <h2>Start searching</h2>
                <p>Enter a search term above to find lesson plans, tasks, notes, and bookmarks</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

