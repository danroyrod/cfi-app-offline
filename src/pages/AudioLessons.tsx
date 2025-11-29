import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import lessonPlansDataRaw from '../lessonPlansData.json';
import acsDataRaw from '../acs_data.json';
import type { LessonPlan } from '../lessonPlanTypes';
import { useAudio } from '../contexts/AudioContext';
import PlaylistManager from '../components/PlaylistManager';
import Breadcrumbs from '../components/Breadcrumbs';
import { getBreadcrumbsForRoute } from '../utils/breadcrumbs';
import './AudioLessons.css';

const lessonPlansData = lessonPlansDataRaw as { lessonPlans: LessonPlan[] };
const acsData = acsDataRaw as { areas: Array<{ number: string; name: string; tasks: any[] }> };

export default function AudioLessons() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [sortBy, setSortBy] = useState<'order' | 'duration' | 'title'>('order');
  const [showPlaylistManager, setShowPlaylistManager] = useState(false);
  const { startPlaylist } = useAudio();

  const allLessons: LessonPlan[] = lessonPlansData.lessonPlans;

  // Get unique areas
  const areas = useMemo(() => {
    const areaSet = new Set<string>();
    allLessons.forEach(lesson => {
      const areaMatch = lesson.id.match(/LP-([IVX]+)/);
      if (areaMatch) {
        areaSet.add(areaMatch[1]);
      }
    });
    return Array.from(areaSet).sort();
  }, [allLessons]);

  // Helper to convert time string to minutes
  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+\.?\d*)\s*(hour|min)/);
    if (!match) return 30; // default
    const value = parseFloat(match[1]);
    const unit = match[2];
    return unit.startsWith('hour') ? value * 60 : value;
  };

  // Filter and sort lessons
  const filteredLessons = useMemo(() => {
    let filtered = allLessons;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(query) ||
        lesson.overview?.toLowerCase().includes(query)
      );
    }

    // Filter by area
    if (selectedArea !== 'all') {
      filtered = filtered.filter(lesson => lesson.id.startsWith(`LP-${selectedArea}`));
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return parseTime(a.estimatedTime) - parseTime(b.estimatedTime);
        case 'order':
        default:
          return a.id.localeCompare(b.id);
      }
    });

    return filtered;
  }, [allLessons, searchQuery, selectedArea, sortBy]);

  // Start playing a lesson
  const playLesson = (lesson: LessonPlan) => {
    const index = filteredLessons.findIndex(l => l.id === lesson.id);
    startPlaylist(filteredLessons, index);
  };

  // Play all lessons
  const playAll = () => {
    startPlaylist(filteredLessons, 0);
  };

  // Play custom playlist
  const playCustomPlaylist = (lessonIds: string[]) => {
    const lessons = lessonIds
      .map(id => allLessons.find(l => l.id === id))
      .filter((l): l is LessonPlan => l !== undefined);
    
    if (lessons.length > 0) {
      startPlaylist(lessons, 0);
      setShowPlaylistManager(false);
    }
  };

  // Get area name for display
  const getAreaName = (lesson: LessonPlan): string => {
    const areaMatch = lesson.id.match(/LP-([IVX]+)/);
    if (!areaMatch) return 'Unknown';
    
    const areaCode = areaMatch[1];
    const area = acsData.areas.find(a => a.number === areaCode);
    return area?.name || `Area ${areaCode}`;
  };

  // Format duration
  const formatDuration = (timeStr: string): string => {
    const minutes = parseTime(timeStr);
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="audio-lessons-page">
      <div className="container">
        <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
        {/* Header */}
        <div className="audio-header">
          <Link to="/" className="back-link">← Home</Link>
          <h1 className="audio-page-title">
            <span className="audio-title-icon">🎧</span>
            Audio Lessons
          </h1>
          <p className="audio-page-subtitle">
            Learn while driving, commuting, or doing other activities
          </p>
        </div>

        {/* Stats */}
        <div className="audio-stats">
          <div className="audio-stat-card">
            <div className="audio-stat-number">{filteredLessons.length}</div>
            <div className="audio-stat-label">Lessons Available</div>
          </div>
          <div className="audio-stat-card">
            <div className="audio-stat-number">{areas.length}</div>
            <div className="audio-stat-label">Areas Covered</div>
          </div>
          <div className="audio-stat-card">
            <div className="audio-stat-number">
              {Math.round(filteredLessons.reduce((sum, l) => sum + parseTime(l.estimatedTime), 0) / 60)}h
            </div>
            <div className="audio-stat-label">Total Content</div>
          </div>
        </div>

        {/* Controls */}
        <div className="audio-controls">
          <div className="audio-search-section">
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="audio-search-input"
            />
          </div>

          <div className="audio-filters">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="audio-filter-select"
            >
              <option value="all">All Areas</option>
              {areas.map(area => {
                const areaData = acsData.areas.find(a => a.number === area);
                return (
                  <option key={area} value={area}>
                    Area {area}: {areaData?.name || 'Unknown'}
                  </option>
                );
              })}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'order' | 'duration' | 'title')}
              className="audio-filter-select"
            >
              <option value="order">Order</option>
              <option value="title">Title</option>
              <option value="duration">Duration</option>
            </select>

            <button className="audio-play-all-btn" onClick={playAll}>
              ▶️ Play All ({filteredLessons.length})
            </button>

            <button 
              className="audio-playlist-btn" 
              onClick={() => setShowPlaylistManager(!showPlaylistManager)}
            >
              🎵 My Playlists
            </button>
          </div>
        </div>

        {/* Playlist Manager */}
        {showPlaylistManager && (
          <PlaylistManager
            allLessons={allLessons}
            onPlayPlaylist={playCustomPlaylist}
            onClose={() => setShowPlaylistManager(false)}
          />
        )}

        {/* Lesson List */}
        <div className="audio-lessons-grid">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="audio-lesson-card">
              <div className="audio-lesson-header">
                <div className="audio-lesson-icon">🎙️</div>
                <div className="audio-lesson-meta">
                  <div className="audio-lesson-area">{getAreaName(lesson)}</div>
                  <div className="audio-lesson-duration">
                    ⏱️ {formatDuration(lesson.estimatedTime)}
                  </div>
                </div>
              </div>

              <h3 className="audio-lesson-title">{lesson.title}</h3>
              
              <p className="audio-lesson-description">
                {lesson.overview?.slice(0, 150)}...
              </p>

              <div className="audio-lesson-actions">
                <button
                  className="audio-play-btn-card"
                  onClick={() => playLesson(lesson)}
                >
                  ▶️ Play
                </button>
                <Link
                  to={`/lesson-plan/${lesson.id}`}
                  className="audio-view-btn"
                >
                  📄 View Text
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="audio-no-results">
            <div className="audio-no-results-icon">🔍</div>
            <h3>No lessons found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

