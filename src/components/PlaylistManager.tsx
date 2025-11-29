import { useState, useEffect } from 'react';
import { playlistService } from '../services/playlistService';
import type { CustomPlaylist } from '../services/playlistService';
import type { LessonPlan } from '../lessonPlanTypes';
import './PlaylistManager.css';

interface PlaylistManagerProps {
  allLessons: LessonPlan[];
  onPlayPlaylist?: (lessonIds: string[]) => void;
  onClose?: () => void;
}

export default function PlaylistManager({ allLessons, onPlayPlaylist, onClose }: PlaylistManagerProps) {
  const [playlists, setPlaylists] = useState<CustomPlaylist[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<CustomPlaylist | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    setPlaylists(playlistService.getAllPlaylists());
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;

    playlistService.createPlaylist(newPlaylistName, newPlaylistDescription, selectedLessons);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setSelectedLessons([]);
    setShowCreateForm(false);
    loadPlaylists();
  };

  const handleUpdatePlaylist = () => {
    if (!editingPlaylist || !newPlaylistName.trim()) return;

    playlistService.updatePlaylist(editingPlaylist.id, {
      name: newPlaylistName,
      description: newPlaylistDescription,
      lessonIds: selectedLessons
    });
    
    setEditingPlaylist(null);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setSelectedLessons([]);
    loadPlaylists();
  };

  const handleDeletePlaylist = (id: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      playlistService.deletePlaylist(id);
      loadPlaylists();
    }
  };

  const handleEditPlaylist = (playlist: CustomPlaylist) => {
    setEditingPlaylist(playlist);
    setNewPlaylistName(playlist.name);
    setNewPlaylistDescription(playlist.description);
    setSelectedLessons(playlist.lessonIds);
    setShowCreateForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPlaylist(null);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setSelectedLessons([]);
    setShowCreateForm(false);
  };

  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const getLessonById = (id: string) => {
    return allLessons.find(l => l.id === id);
  };

  const filteredLessons = allLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDuration = (lessonIds: string[]) => {
    let totalMinutes = 0;
    lessonIds.forEach(id => {
      const lesson = getLessonById(id);
      if (lesson?.estimatedTime) {
        const match = lesson.estimatedTime.match(/(\d+\.?\d*)\s*(hour|min)/);
        if (match) {
          const value = parseFloat(match[1]);
          const unit = match[2];
          totalMinutes += unit.startsWith('hour') ? value * 60 : value;
        }
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="playlist-manager">
      <div className="playlist-manager-header">
        <h2>🎵 Custom Playlists</h2>
        {onClose && (
          <button className="playlist-close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className="playlist-manager-content">
        {!showCreateForm ? (
          <>
            <div className="playlist-actions">
              <button
                className="btn-primary playlist-create-btn"
                onClick={() => setShowCreateForm(true)}
              >
                ➕ Create New Playlist
              </button>
            </div>

            {playlists.length === 0 ? (
              <div className="playlist-empty-state">
                <div className="empty-icon">🎧</div>
                <h3>No Playlists Yet</h3>
                <p>Create your first custom playlist to organize your favorite lessons</p>
              </div>
            ) : (
              <div className="playlist-list">
                {playlists.map(playlist => (
                  <div key={playlist.id} className="playlist-card">
                    <div className="playlist-card-header">
                      <div className="playlist-card-info">
                        <h3>{playlist.name}</h3>
                        {playlist.description && (
                          <p className="playlist-description">{playlist.description}</p>
                        )}
                      </div>
                      <div className="playlist-card-actions">
                        <button
                          className="playlist-btn playlist-edit-btn"
                          onClick={() => handleEditPlaylist(playlist)}
                          title="Edit playlist"
                        >
                          ✏️
                        </button>
                        <button
                          className="playlist-btn playlist-delete-btn"
                          onClick={() => handleDeletePlaylist(playlist.id)}
                          title="Delete playlist"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="playlist-card-meta">
                      <span>{playlist.lessonIds.length} lessons</span>
                      <span>•</span>
                      <span>{calculateDuration(playlist.lessonIds)}</span>
                    </div>

                    <div className="playlist-lessons-preview">
                      {playlist.lessonIds.slice(0, 3).map(lessonId => {
                        const lesson = getLessonById(lessonId);
                        return lesson ? (
                          <div key={lessonId} className="playlist-lesson-item">
                            {lesson.title}
                          </div>
                        ) : null;
                      })}
                      {playlist.lessonIds.length > 3 && (
                        <div className="playlist-lesson-more">
                          +{playlist.lessonIds.length - 3} more
                        </div>
                      )}
                    </div>

                    {onPlayPlaylist && playlist.lessonIds.length > 0 && (
                      <button
                        className="playlist-play-btn"
                        onClick={() => onPlayPlaylist(playlist.lessonIds)}
                      >
                        ▶️ Play Playlist
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="playlist-form">
            <h3>{editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}</h3>

            <div className="form-group">
              <label>Playlist Name *</label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="e.g., Morning Commute, Checkride Prep"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                placeholder="What's this playlist for?"
                className="form-textarea"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Select Lessons ({selectedLessons.length} selected)</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons..."
                className="form-input search-input"
              />
              <div className="lesson-selector">
                {filteredLessons.map(lesson => (
                  <label key={lesson.id} className="lesson-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedLessons.includes(lesson.id)}
                      onChange={() => toggleLessonSelection(lesson.id)}
                    />
                    <span className="lesson-checkbox-label">
                      <span className="lesson-checkbox-title">{lesson.title}</span>
                      <span className="lesson-checkbox-meta">{lesson.estimatedTime}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist}
                disabled={!newPlaylistName.trim() || selectedLessons.length === 0}
              >
                {editingPlaylist ? 'Update Playlist' : 'Create Playlist'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}






