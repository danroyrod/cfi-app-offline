import { useState, useEffect } from 'react';
import { universalBookmarkService } from '../services/universalBookmarkService';
import './BookmarkButton.css';

interface BookmarkButtonProps {
  type: 'lesson-plan' | 'acs-task';
  resourceId: string;
  title: string;
  areaNumber: string;
  onToggle?: (isBookmarked: boolean) => void;
  className?: string;
}

export default function BookmarkButton({
  type,
  resourceId,
  title,
  areaNumber,
  onToggle,
  className = ''
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsBookmarked(universalBookmarkService.isBookmarked(resourceId, type));
  }, [resourceId, type]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const newState = universalBookmarkService.toggleBookmark(
        type,
        resourceId,
        title,
        areaNumber
      );
      
      setIsBookmarked(newState);
      
      if (onToggle) {
        onToggle(newState);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''} ${className}`}
      onClick={handleClick}
      disabled={isLoading}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <span className="bookmark-icon">
        {isBookmarked ? '⭐' : '☆'}
      </span>
      <span className="bookmark-text">
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </span>
    </button>
  );
}

