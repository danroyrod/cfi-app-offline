import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import lessonPlansDataRaw from '../lessonPlansData.json';
import acsDataRaw from '../acs_data.json';
import type { LessonPlan } from '../lessonPlanTypes';
import { useAudio } from '../contexts/AudioContext';
import { audioService } from '../services/audioService';
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

  // Calculate actual audio duration for Lite lessons (in minutes, rounded)
  const getLiteAudioDuration = (lesson: LessonPlan, allLessons: LessonPlan[]): number => {
    const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
    const areaMatch = lesson.id.match(/LP-([IVX]+)/);
    const areaCode = areaMatch ? areaMatch[1] : '';
    const area = acsData.areas.find(a => a.number === areaCode);
    const areaName = area?.name || `Area ${areaCode}`;
    
    const script = audioService.generateLitePodcastScript(
      lesson,
      areaName,
      lessonIndex + 1,
      allLessons.length
    );
    
    // Convert seconds to minutes and round to nearest minute
    return Math.round(script.estimatedDuration / 60);
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
          // Calculate durations on the fly for sorting
          const aDuration = getLiteAudioDuration(a, allLessons);
          const bDuration = getLiteAudioDuration(b, allLessons);
          return aDuration - bDuration;
        case 'order':
        default:
          return a.id.localeCompare(b.id);
      }
    });

    return filtered;
  }, [allLessons, searchQuery, selectedArea, sortBy]);

  // Memoize audio durations for filtered lessons (computed after filtering)
  const lessonDurations = useMemo(() => {
    const durations = new Map<string, number>();
    filteredLessons.forEach(lesson => {
      durations.set(lesson.id, getLiteAudioDuration(lesson, allLessons));
    });
    return durations;
  }, [filteredLessons, allLessons]);

  // Start playing a lesson
  const playLesson = (lesson: LessonPlan) => {
    const index = filteredLessons.findIndex(l => l.id === lesson.id);
    startPlaylist(filteredLessons, index, 'lite');
  };

  // Play all lessons
  const playAll = () => {
    startPlaylist(filteredLessons, 0, 'lite');
  };

  // Play custom playlist
  const playCustomPlaylist = (lessonIds: string[]) => {
    const lessons = lessonIds
      .map(id => allLessons.find(l => l.id === id))
      .filter((l): l is LessonPlan => l !== undefined);
    
    if (lessons.length > 0) {
      startPlaylist(lessons, 0, 'lite');
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

  // Format duration (for Lite lessons, use actual audio duration)
  const formatDuration = (lesson: LessonPlan): string => {
    const minutes = lessonDurations.get(lesson.id) || 0;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="audio-lessons-page">
      <div className="container">
        <Breadcrumbs items={getBreadcrumbsForRoute(location.pathname)} />
        {/* Header */}
        <div className="audio-header">
          <Link to="/audio-lessons" className="back-link">← Back to Audio Lessons</Link>
          <h1 className="audio-page-title">
            <span className="audio-title-icon">⚡</span>
            Lite Audio Lessons
          </h1>
          <p className="audio-page-subtitle">
            Quick summaries with objectives, key points, and completion standards. Perfect for quick review.
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
              {Math.round(filteredLessons.reduce((sum, l) => sum + (lessonDurations.get(l.id) || 0), 0) / 60)}h
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
                    ⏱️ {formatDuration(lesson)}
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

