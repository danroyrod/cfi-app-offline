import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { universalBookmarkService, type UniversalBookmark } from '../services/universalBookmarkService';
import './QuickAccessPanel.css';

interface QuickAccessPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAccessPanel({ isOpen, onClose }: QuickAccessPanelProps) {
  const [bookmarks, setBookmarks] = useState<UniversalBookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');

  useEffect(() => {
    if (isOpen) {
      loadBookmarks();
    }
  }, [isOpen]);

  const loadBookmarks = useCallback(() => {
    if (activeTab === 'recent') {
      setBookmarks(universalBookmarkService.getRecentBookmarks(10));
    } else {
      setBookmarks(universalBookmarkService.getAllBookmarks());
    }
  }, [activeTab]);

  useEffect(() => {
    loadBookmarks();
  }, [activeTab, loadBookmarks]);

  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      bookmark.title.toLowerCase().includes(searchLower) ||
      bookmark.areaNumber.toLowerCase().includes(searchLower) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      bookmark.note?.toLowerCase().includes(searchLower)
    );
  });

  const handleBookmarkClick = (bookmark: UniversalBookmark) => {
    universalBookmarkService.updateLastAccessed(bookmark.resourceId, bookmark.type);
    onClose();
  };

  const handleRemoveBookmark = (e: React.MouseEvent, bookmark: UniversalBookmark) => {
    e.stopPropagation();
    universalBookmarkService.removeBookmark(bookmark.resourceId, bookmark.type);
    loadBookmarks();
  };

  const getBookmarkUrl = (bookmark: UniversalBookmark): string => {
    if (bookmark.type === 'lesson-plan') {
      return `/lesson-plan/${bookmark.resourceId}`;
    } else {
      const [area, task] = bookmark.resourceId.split('.');
      return `/area/${area}/task/${task}`;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="quick-access-overlay" onClick={onClose} />
      <div className="quick-access-panel">
        <div className="quick-access-header">
          <h2>Quick Access</h2>
          <button 
            className="quick-access-close"
            onClick={onClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        <div className="quick-access-tabs">
          <button
            className={`quick-access-tab ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            Recent
          </button>
          <button
            className={`quick-access-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({bookmarks.length})
          </button>
        </div>

        <div className="quick-access-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="quick-access-search-input"
          />
        </div>

        <div className="quick-access-content">
          {filteredBookmarks.length === 0 ? (
            <div className="quick-access-empty">
              <span className="empty-icon">📭</span>
              <p>
                {searchTerm 
                  ? 'No bookmarks match your search'
                  : activeTab === 'recent'
                  ? 'No recent bookmarks'
                  : 'No bookmarks yet'}
              </p>
              {!searchTerm && activeTab === 'all' && (
                <p className="empty-hint">Bookmark lessons or tasks to access them quickly</p>
              )}
            </div>
          ) : (
            <div className="quick-access-list">
              {filteredBookmarks.map(bookmark => (
                <Link
                  key={bookmark.id}
                  to={getBookmarkUrl(bookmark)}
                  className="quick-access-item"
                  onClick={() => handleBookmarkClick(bookmark)}
                >
                  <div className="quick-access-item-header">
                    <div className="quick-access-item-type">
                      {bookmark.type === 'lesson-plan' ? '📚' : '📋'}
                    </div>
                    <div className="quick-access-item-info">
                      <div className="quick-access-item-title">{bookmark.title}</div>
                      <div className="quick-access-item-meta">
                        Area {bookmark.areaNumber} • {bookmark.type === 'lesson-plan' ? 'Lesson' : 'Task'}
                      </div>
                    </div>
                    <button
                      className="quick-access-item-remove"
                      onClick={(e) => handleRemoveBookmark(e, bookmark)}
                      aria-label="Remove bookmark"
                    >
                      ✕
                    </button>
                  </div>
                  {bookmark.tags.length > 0 && (
                    <div className="quick-access-item-tags">
                      {bookmark.tags.map(tag => (
                        <span key={tag} className="quick-access-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  {bookmark.note && (
                    <div className="quick-access-item-note">{bookmark.note}</div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

