import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { universalBookmarkService, type UniversalBookmark } from '../services/universalBookmarkService';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import './Bookmarks.css';

export default function Bookmarks() {
  const location = useLocation();
  const [bookmarks, setBookmarks] = useState<UniversalBookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lesson-plan' | 'acs-task'>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editCategory, setEditCategory] = useState<string>('');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = useCallback(() => {
    setBookmarks(universalBookmarkService.getAllBookmarks());
  }, []);

  const filteredBookmarks = bookmarks.filter(bookmark => {
    // Type filter
    if (filterType !== 'all' && bookmark.type !== filterType) return false;
    
    // Area filter
    if (filterArea !== 'all' && bookmark.areaNumber !== filterArea) return false;
    
    // Tag filter
    if (selectedTag !== 'all' && !bookmark.tags.includes(selectedTag)) return false;
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        bookmark.title.toLowerCase().includes(searchLower) ||
        bookmark.areaNumber.toLowerCase().includes(searchLower) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        bookmark.note?.toLowerCase().includes(searchLower) ||
        bookmark.category?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleRemoveBookmark = (bookmark: UniversalBookmark) => {
    if (confirm(`Remove bookmark for "${bookmark.title}"?`)) {
      universalBookmarkService.removeBookmark(bookmark.resourceId, bookmark.type);
      loadBookmarks();
    }
  };

  const handleEditStart = (bookmark: UniversalBookmark) => {
    setEditingBookmark(bookmark.id);
    setEditTags([...bookmark.tags]);
    setEditCategory(bookmark.category || '');
  };

  const handleEditCancel = () => {
    setEditingBookmark(null);
    setEditTags([]);
    setEditCategory('');
  };

  const handleEditSave = (bookmark: UniversalBookmark) => {
    // Update tags
    const currentTags = bookmark.tags;
    const tagsToAdd = editTags.filter(t => !currentTags.includes(t));
    const tagsToRemove = currentTags.filter(t => !editTags.includes(t));
    
    tagsToAdd.forEach(tag => {
      universalBookmarkService.addTag(bookmark.resourceId, bookmark.type, tag);
    });
    
    tagsToRemove.forEach(tag => {
      universalBookmarkService.removeTag(bookmark.resourceId, bookmark.type, tag);
    });
    
    // Update category
    if (editCategory !== bookmark.category) {
      universalBookmarkService.updateCategory(
        bookmark.resourceId,
        bookmark.type,
        editCategory || undefined
      );
    }
    
    loadBookmarks();
    handleEditCancel();
  };


  const handleExport = () => {
    const json = universalBookmarkService.exportBookmarks();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cfi-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
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
          if (universalBookmarkService.importBookmarks(json)) {
            loadBookmarks();
            alert('Bookmarks imported successfully!');
          } else {
            alert('Failed to import bookmarks. Invalid format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getBookmarkUrl = (bookmark: UniversalBookmark): string => {
    if (bookmark.type === 'lesson-plan') {
      return `/lesson-plan/${bookmark.resourceId}`;
    } else {
      const [area, task] = bookmark.resourceId.split('.');
      return `/area/${area}/task/${task}`;
    }
  };

  const allTags = universalBookmarkService.getAllTags();
  const allAreas = Array.from(new Set(bookmarks.map(b => b.areaNumber))).sort();

  return (
    <>
      <div className="header">
        <div className="container header-content">
          <div className="header-title">Bookmarks</div>
          <Link to="/lesson-plans" className="back-link">
            ← Back
          </Link>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
          <div className="bookmarks-page">
            <div className="bookmarks-header">
              <h1 className="bookmarks-title">My Bookmarks</h1>
              <div className="bookmarks-actions">
                <button onClick={handleExport} className="btn-export">
                  📥 Export
                </button>
                <button onClick={handleImport} className="btn-import">
                  📤 Import
                </button>
                {bookmarks.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear all bookmarks? This cannot be undone.')) {
                        universalBookmarkService.clearAllBookmarks();
                        loadBookmarks();
                      }
                    }}
                    className="btn-clear"
                  >
                    🗑️ Clear All
                  </button>
                )}
              </div>
            </div>

            {bookmarks.length === 0 ? (
              <div className="bookmarks-empty">
                <span className="empty-icon">⭐</span>
                <h2>No bookmarks yet</h2>
                <p>Bookmark lesson plans or ACS tasks to access them quickly</p>
                <Link to="/lesson-plans" className="btn-primary-link">
                  Browse Lesson Plans
                </Link>
              </div>
            ) : (
              <>
                <div className="bookmarks-filters">
                  <div className="filter-group">
                    <label>Search</label>
                    <input
                      type="text"
                      placeholder="Search bookmarks..."
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

                  <div className="filter-group">
                    <label>Area</label>
                    <select
                      value={filterArea}
                      onChange={(e) => setFilterArea(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Areas</option>
                      {allAreas.map(area => (
                        <option key={area} value={area}>Area {area}</option>
                      ))}
                    </select>
                  </div>

                  {allTags.length > 0 && (
                    <div className="filter-group">
                      <label>Tag</label>
                      <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">All Tags</option>
                        {allTags.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="bookmarks-stats">
                  Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
                </div>

                <div className="bookmarks-list">
                  {filteredBookmarks.length === 0 ? (
                    <div className="bookmarks-empty-filtered">
                      <span className="empty-icon">🔍</span>
                      <p>No bookmarks match your filters</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilterType('all');
                          setFilterArea('all');
                          setSelectedTag('all');
                        }}
                        className="btn-reset-filters"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    filteredBookmarks.map(bookmark => (
                      <div key={bookmark.id} className="bookmark-card">
                        <div className="bookmark-card-header">
                          <div className="bookmark-card-type">
                            {bookmark.type === 'lesson-plan' ? '📚' : '📋'}
                          </div>
                          <div className="bookmark-card-info">
                            <Link
                              to={getBookmarkUrl(bookmark)}
                              className="bookmark-card-title"
                              onClick={() => {
                                universalBookmarkService.updateLastAccessed(
                                  bookmark.resourceId,
                                  bookmark.type
                                );
                              }}
                            >
                              {bookmark.title}
                            </Link>
                            <div className="bookmark-card-meta">
                              Area {bookmark.areaNumber} • {bookmark.type === 'lesson-plan' ? 'Lesson Plan' : 'ACS Task'}
                              {bookmark.category && (
                                <span className="bookmark-category"> • {bookmark.category}</span>
                              )}
                            </div>
                          </div>
                          <div className="bookmark-card-actions">
                            {editingBookmark === bookmark.id ? (
                              <>
                                <button
                                  onClick={() => handleEditSave(bookmark)}
                                  className="btn-save"
                                  title="Save"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={handleEditCancel}
                                  className="btn-cancel"
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditStart(bookmark)}
                                  className="btn-edit"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleRemoveBookmark(bookmark)}
                                  className="btn-delete"
                                  title="Remove"
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {editingBookmark === bookmark.id ? (
                          <div className="bookmark-edit-form">
                            <div className="edit-field">
                              <label>Tags (comma-separated)</label>
                              <input
                                type="text"
                                value={editTags.join(', ')}
                                onChange={(e) => {
                                  const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                                  setEditTags(tags);
                                }}
                                placeholder="tag1, tag2, tag3"
                                className="edit-input"
                              />
                            </div>
                            <div className="edit-field">
                              <label>Category</label>
                              <input
                                type="text"
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                placeholder="Optional category"
                                className="edit-input"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            {bookmark.tags.length > 0 && (
                              <div className="bookmark-tags">
                                {bookmark.tags.map(tag => (
                                  <span key={tag} className="bookmark-tag">{tag}</span>
                                ))}
                              </div>
                            )}
                            {bookmark.note && (
                              <div className="bookmark-note">
                                <strong>Note:</strong> {bookmark.note}
                              </div>
                            )}
                            <div className="bookmark-dates">
                              <span>Created: {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                              <span>Last accessed: {new Date(bookmark.lastAccessed).toLocaleDateString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

