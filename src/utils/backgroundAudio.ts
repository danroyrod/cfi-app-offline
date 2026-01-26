// Background Audio Support Utilities
// Helps audio continue playing when browser is minimized or phone is locked

export interface MediaSessionMetadata {
  title: string;
  artist: string;
  album?: string;
  artwork?: MediaImage[];
}

export class BackgroundAudioManager {
  private wakeLock: WakeLockSentinel | null = null;
  private isWakeLockSupported: boolean = false;

  constructor() {
    this.isWakeLockSupported = 'wakeLock' in navigator;
  }

  /**
   * Initialize Media Session API for lock screen controls
   */
  initializeMediaSession(metadata: MediaSessionMetadata, handlers: {
    onPlay?: () => void;
    onPause?: () => void;
    onPreviousTrack?: () => void;
    onNextTrack?: () => void;
    onSeekBackward?: () => void;
    onSeekForward?: () => void;
  }): void {
    if (!('mediaSession' in navigator)) {
      console.warn('Media Session API not supported');
      return;
    }

    const { mediaSession } = navigator;

    // Set metadata for lock screen
    mediaSession.metadata = new MediaMetadata({
      title: metadata.title,
      artist: metadata.artist,
      album: metadata.album || 'CFI Training Audio',
      artwork: metadata.artwork || [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    });

    // Set action handlers
    mediaSession.setActionHandler('play', () => {
      console.log('Media Session: Play requested');
      handlers.onPlay?.();
    });

    mediaSession.setActionHandler('pause', () => {
      console.log('Media Session: Pause requested');
      handlers.onPause?.();
    });

    if (handlers.onPreviousTrack) {
      mediaSession.setActionHandler('previoustrack', () => {
        console.log('Media Session: Previous track requested');
        handlers.onPreviousTrack?.();
      });
    }

    if (handlers.onNextTrack) {
      mediaSession.setActionHandler('nexttrack', () => {
        console.log('Media Session: Next track requested');
        handlers.onNextTrack?.();
      });
    }

    if (handlers.onSeekBackward) {
      mediaSession.setActionHandler('seekbackward', (details) => {
        console.log('Media Session: Seek backward requested', details);
        handlers.onSeekBackward?.();
      });
    }

    if (handlers.onSeekForward) {
      mediaSession.setActionHandler('seekforward', (details) => {
        console.log('Media Session: Seek forward requested', details);
        handlers.onSeekForward?.();
      });
    }
  }

  /**
   * Update playback state in Media Session
   */
  updatePlaybackState(state: 'playing' | 'paused' | 'none'): void {
    if (!('mediaSession' in navigator)) return;

    const { mediaSession } = navigator;
    mediaSession.playbackState = state;
  }

  /**
   * Request wake lock to prevent screen from sleeping
   */
  async requestWakeLock(): Promise<boolean> {
    if (!this.isWakeLockSupported) {
      console.warn('Wake Lock API not supported');
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake lock acquired');
      
      // Handle wake lock release (e.g., when screen is manually turned off)
      this.wakeLock.addEventListener('release', () => {
        console.log('Wake lock released');
      });

      return true;
    } catch (error) {
      console.error('Failed to acquire wake lock:', error);
      return false;
    }
  }

  /**
   * Release wake lock
   */
  async releaseWakeLock(): Promise<void> {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
        console.log('Wake lock released');
      } catch (error) {
        console.error('Failed to release wake lock:', error);
      }
    }
  }

  /**
   * Handle visibility change to maintain playback
   * Note: Web Speech API may still pause, but this helps maintain state
   */
  setupVisibilityHandling(onVisibilityChange: (isVisible: boolean) => void): () => void {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      console.log('Visibility changed:', isVisible ? 'visible' : 'hidden');
      onVisibilityChange(isVisible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Return cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }

  /**
   * Clean up all resources
   */
  async cleanup(): Promise<void> {
    await this.releaseWakeLock();
    
    if ('mediaSession' in navigator) {
      const { mediaSession } = navigator;
      mediaSession.metadata = null;
      // Clear all action handlers
      mediaSession.setActionHandler('play', null);
      mediaSession.setActionHandler('pause', null);
      mediaSession.setActionHandler('previoustrack', null);
      mediaSession.setActionHandler('nexttrack', null);
      mediaSession.setActionHandler('seekbackward', null);
      mediaSession.setActionHandler('seekforward', null);
    }
  }
}

// Export singleton instance
export const backgroundAudioManager = new BackgroundAudioManager();
