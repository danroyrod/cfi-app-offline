// Playlist Service for Custom Audio Playlists

export interface CustomPlaylist {
  id: string;
  name: string;
  description: string;
  lessonIds: string[];
  createdAt: number;
  updatedAt: number;
}

class PlaylistService {
  private readonly STORAGE_KEY = 'audio-custom-playlists';

  /**
   * Get all custom playlists
   */
  getAllPlaylists(): CustomPlaylist[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Get a specific playlist by ID
   */
  getPlaylist(id: string): CustomPlaylist | null {
    const playlists = this.getAllPlaylists();
    return playlists.find(p => p.id === id) || null;
  }

  /**
   * Create a new playlist
   */
  createPlaylist(name: string, description: string, lessonIds: string[]): CustomPlaylist {
    const playlists = this.getAllPlaylists();
    
    const newPlaylist: CustomPlaylist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      lessonIds,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    playlists.push(newPlaylist);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(playlists));
    
    return newPlaylist;
  }

  /**
   * Update an existing playlist
   */
  updatePlaylist(id: string, updates: Partial<Omit<CustomPlaylist, 'id' | 'createdAt'>>): boolean {
    const playlists = this.getAllPlaylists();
    const index = playlists.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    playlists[index] = {
      ...playlists[index],
      ...updates,
      updatedAt: Date.now()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(playlists));
    return true;
  }

  /**
   * Delete a playlist
   */
  deletePlaylist(id: string): boolean {
    const playlists = this.getAllPlaylists();
    const filtered = playlists.filter(p => p.id !== id);
    
    if (filtered.length === playlists.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Add a lesson to a playlist
   */
  addLessonToPlaylist(playlistId: string, lessonId: string): boolean {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;
    
    if (!playlist.lessonIds.includes(lessonId)) {
      playlist.lessonIds.push(lessonId);
      return this.updatePlaylist(playlistId, { lessonIds: playlist.lessonIds });
    }
    
    return true;
  }

  /**
   * Remove a lesson from a playlist
   */
  removeLessonFromPlaylist(playlistId: string, lessonId: string): boolean {
    const playlist = this.getPlaylist(playlistId);
    if (!playlist) return false;
    
    const filtered = playlist.lessonIds.filter(id => id !== lessonId);
    return this.updatePlaylist(playlistId, { lessonIds: filtered });
  }

  /**
   * Reorder lessons in a playlist
   */
  reorderPlaylist(playlistId: string, newOrder: string[]): boolean {
    return this.updatePlaylist(playlistId, { lessonIds: newOrder });
  }
}

export const playlistService = new PlaylistService();






