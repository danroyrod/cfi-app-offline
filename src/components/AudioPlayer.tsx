import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { audioService } from '../services/audioService';
import type { PodcastScript } from '../services/audioService';
import type { LessonPlan } from '../lessonPlanTypes';
import type { AudioPlaylistMode } from '../contexts/AudioContext';
import { useAudio } from '../contexts/AudioContext';
import { audioPresets, loadPresetPreference, savePresetPreference } from '../services/audioPresets';
import type { AudioPreset } from '../services/audioPresets';
import { bookmarkService } from '../services/bookmarkService';
import type { Bookmark } from '../services/bookmarkService';
import { requestTabAudioStream, releaseTabAudioStream, isTabAudioCaptureSupported } from '../services/audioCapture';
import { BlobPlaybackController } from '../services/blobPlayback';
import './AudioPlayer.css';

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;

interface AudioPlayerProps {
  currentLesson: LessonPlan;
  playlist: LessonPlan[];
  areaName: string;
  playlistMode?: AudioPlaylistMode;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose?: () => void;
  onStopAudio?: () => void;
}

export default function AudioPlayer({
  currentLesson,
  playlist,
  areaName,
  playlistMode: playlistModeProp,
  onNext,
  onPrevious,
  onClose,
  onStopAudio
}: AudioPlayerProps) {
  const { playlistMode: contextPlaylistMode } = useAudio();
  const playlistMode = playlistModeProp ?? contextPlaylistMode ?? 'full';

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPreset, setCurrentPreset] = useState<AudioPreset>(loadPresetPreference());
  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    const saved = localStorage.getItem('audio-speed-preference');
    const num = saved ? parseFloat(saved) : 1;
    return SPEED_OPTIONS.includes(num as typeof SPEED_OPTIONS[number]) ? num : 1;
  });
  const [currentSegment, setCurrentSegment] = useState(0);
  const [totalSegments, setTotalSegments] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [podcastScript, setPodcastScript] = useState<PodcastScript | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [showSpeedSelector, setShowSpeedSelector] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(currentPreset.volume);
  const [useBlobPlayback, setUseBlobPlayback] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [askBackgroundPermission, setAskBackgroundPermission] = useState(false);
  const [preparingProgress, setPreparingProgress] = useState({ segment: 0, total: 0 });

  const timerRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const togglePlayPauseRef = useRef<() => void>(() => {});
  const blobControllerRef = useRef<BlobPlaybackController | null>(null);
  const playbackModeRef = useRef<'tts' | 'blob'>('tts');
  const blobProgressIntervalRef = useRef<number | null>(null);

  // Media Session API: lock-screen / notification controls (behavior may vary by OS/browser)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;

    // MediaMetadata is not in all TS DOM libs; cast required for mediaSession.metadata
    navigator.mediaSession.metadata = new (window as Window & { MediaMetadata: new (init: MediaMetadataInit) => MediaMetadata }).MediaMetadata({
      title: currentLesson.title,
      artist: `${areaName} • CFI Training Audio`,
      album: playlist.length > 0 ? `Lesson ${playlist.findIndex(l => l.id === currentLesson.id) + 1} of ${playlist.length}` : ''
    });

    return () => {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
    };
  }, [currentLesson?.id, currentLesson?.title, areaName, playlist.length]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
    navigator.mediaSession.setActionHandler('play', () => {
      togglePlayPauseRef.current();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      togglePlayPauseRef.current();
    });
    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
    };
  }, []);

  // Keep ref updated so Media Session handlers call latest togglePlayPause
  useEffect(() => {
    togglePlayPauseRef.current = togglePlayPause;
  });

  // Update volume when preset changes
  useEffect(() => {
    setVolume(currentPreset.volume);
  }, [currentPreset]);

  // Sync volume to service and blob controller so mid-playback slider changes apply
  useEffect(() => {
    audioService.setCurrentVolume(volume);
    blobControllerRef.current?.setVolume(volume);
  }, [volume]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ': // Spacebar - play/pause
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft': // Left arrow - rewind
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight': // Right arrow - forward
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp': // Up arrow - volume up
          e.preventDefault();
          setVolume(prev => Math.min(prev + 0.1, 1));
          break;
        case 'ArrowDown': // Down arrow - volume down
          e.preventDefault();
          setVolume(prev => Math.max(prev - 0.1, 0));
          break;
        case 'n': // N - next
          if (onNext && e.shiftKey) {
            e.preventDefault();
            onNext();
          }
          break;
        case 'p': // P - previous
          if (onPrevious && e.shiftKey) {
            e.preventDefault();
            onPrevious();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, onNext, onPrevious]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = audioService.getAvailableVoices();
      setAvailableVoices(voices);
      
      // Load saved voice preference
      const savedVoiceName = localStorage.getItem('audio-preferred-voice');
      if (savedVoiceName) {
        const voice = voices.find(v => v.name === savedVoiceName);
        if (voice) {
          setSelectedVoice(voice);
          return;
        }
      }
      
      // Use first voice as default
      if (voices.length > 0) {
        setSelectedVoice(voices[0]);
      }
    };

    loadVoices();
    
    // Voices load asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Generate podcast script when lesson changes (full vs lite based on playlistMode)
  useEffect(() => {
    if (blobControllerRef.current) {
      blobControllerRef.current.stop();
      blobControllerRef.current = null;
    }
    setUseBlobPlayback(false);
    playbackModeRef.current = 'tts';

    const lessonIndex = playlist.findIndex(l => l.id === currentLesson.id);
    const script = playlistMode === 'lite'
      ? audioService.generateLitePodcastScript(currentLesson, areaName, lessonIndex + 1, playlist.length)
      : audioService.generatePodcastScript(currentLesson, areaName, lessonIndex + 1, playlist.length);
    setPodcastScript(script);
    setDuration(script.estimatedDuration);
    setTotalSegments(script.segments.length);
    setCurrentTime(0);
    setCurrentSegment(0);

    const savedProgress = localStorage.getItem(`audio-progress-${currentLesson.id}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentTime(progress.time || 0);
      setCurrentSegment(progress.segment || 0);
    }

    setBookmarks(bookmarkService.getLessonBookmarks(currentLesson.id));
  }, [currentLesson, playlist, areaName, playlistMode]);

  // Save progress periodically
  useEffect(() => {
    if (isPlaying) {
      const saveInterval = setInterval(() => {
        localStorage.setItem(`audio-progress-${currentLesson.id}`, JSON.stringify({
          time: currentTime,
          segment: currentSegment,
          timestamp: Date.now()
        }));
      }, 5000); // Save every 5 seconds

      return () => clearInterval(saveInterval);
    }
  }, [isPlaying, currentTime, currentSegment, currentLesson.id]);

  const clearBlobProgressInterval = () => {
    if (blobProgressIntervalRef.current !== null) {
      clearInterval(blobProgressIntervalRef.current);
      blobProgressIntervalRef.current = null;
    }
  };

  const startBlobPlayback = (entries: { blobUrl: string | null; pauseAfter: number }[]) => {
    const controller = new BlobPlaybackController(podcastScript?.estimatedDuration ?? 0);
    controller.setSegments(entries, podcastScript?.segments.length ?? 0);
    controller.setVolume(volume);
    controller.setPlaybackRate(playbackRate);
    controller.setCallbacks({
      onProgress: (seg, total) => {
        setCurrentSegment(seg);
        setTotalSegments(total);
      },
      onEnd: () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        clearBlobProgressInterval();
        if (autoplayEnabled && onNext) setTimeout(() => onNext(), 2000);
      },
      onPause: () => {
        setIsPlaying(false);
        isPlayingRef.current = false;
        clearBlobProgressInterval();
      }
    });
    blobControllerRef.current = controller;
    playbackModeRef.current = 'blob';
    setUseBlobPlayback(true);
    setIsPlaying(true);
    isPlayingRef.current = true;
    controller.play();
    blobProgressIntervalRef.current = window.setInterval(() => {
      if (blobControllerRef.current?.isPlaybackActive()) {
        setCurrentTime(blobControllerRef.current.getCurrentTime());
        setDuration(blobControllerRef.current.getDuration());
      }
    }, 500) as unknown as number;
  };

  const startTTSPlayback = async (voiceToUse: SpeechSynthesisVoice) => {
    if (!podcastScript) return;
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsLoading(false);
    timerRef.current = window.setInterval(() => {
      if (isPlayingRef.current) setCurrentTime(prev => Math.min(prev + 1, duration));
    }, 1000);
    audioService.setCurrentVoice(voiceToUse);
    audioService.setCurrentRate(playbackRate);
    try {
      await audioService.speakPodcastScript(podcastScript, {
        rate: playbackRate,
        voice: voiceToUse,
        volume,
        onProgress: (segment, total) => {
          setCurrentSegment(segment);
          setTotalSegments(total);
        },
        onPause: () => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      });
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoplayEnabled && onNext) setTimeout(() => onNext(), 2000);
    } catch (err) {
      console.error('Audio playback error:', err);
      setError('Audio playback failed. Please try again or select a different voice.');
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlayPause = async () => {
    if (!podcastScript) {
      setError('No audio script available. Please try reloading the lesson.');
      return;
    }

    if (isPlaying) {
      if (playbackModeRef.current === 'blob' && blobControllerRef.current) {
        blobControllerRef.current.pause();
        clearBlobProgressInterval();
      } else {
        audioService.pauseSpeech();
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (useBlobPlayback && blobControllerRef.current && !blobControllerRef.current.isPlaybackActive()) {
      blobControllerRef.current.play();
      setIsPlaying(true);
      isPlayingRef.current = true;
      blobProgressIntervalRef.current = window.setInterval(() => {
        if (blobControllerRef.current?.isPlaybackActive()) {
          setCurrentTime(blobControllerRef.current.getCurrentTime());
          setDuration(blobControllerRef.current.getDuration());
        }
      }, 500) as unknown as number;
      return;
    }

    setError(null);
    setIsLoading(true);

    if (!window.speechSynthesis) {
      setError('Speech synthesis is not supported in your browser. Please try Chrome, Edge, or Safari.');
      setIsLoading(false);
      return;
    }
    if (availableVoices.length === 0) {
      setError('Loading voices... Please wait a moment and try again.');
      setIsLoading(false);
      return;
    }

    let voiceToUse = selectedVoice ?? availableVoices[0];
    if (!voiceToUse) {
      setSelectedVoice(availableVoices[0]);
      voiceToUse = availableVoices[0];
    }

    const cached = audioService.getCachedBlobEntries(
      currentLesson.id,
      playlistMode,
      voiceToUse.name,
      playbackRate
    );
    if (cached && cached.length > 0) {
      setIsLoading(false);
      startBlobPlayback(cached);
      return;
    }

    if (isTabAudioCaptureSupported()) {
      setAskBackgroundPermission(true);
      setIsLoading(false);
      return;
    }

    playbackModeRef.current = 'tts';
    await startTTSPlayback(voiceToUse);
  };

  const handleAllowBackgroundCapture = async () => {
    if (!podcastScript || !selectedVoice) return;
    setError(null);
    setIsPreparing(true);
    setAskBackgroundPermission(false);
    try {
      const stream = await requestTabAudioStream();
      const entries = await audioService.prepareScriptToBlobs(podcastScript, {
        voice: selectedVoice,
        rate: playbackRate,
        volume,
        mode: playlistMode,
        stream,
        onSegmentProgress: (seg, total) => setPreparingProgress({ segment: seg, total })
      });
      releaseTabAudioStream(stream);
      setIsPreparing(false);
      startBlobPlayback(entries);
    } catch (err) {
      console.error('Tab capture error:', err);
      setError('Could not capture tab audio. Click "Skip" to play without background playback.');
      setIsPreparing(false);
      setAskBackgroundPermission(true);
    }
  };

  const handleSkipBackgroundCapture = async () => {
    setAskBackgroundPermission(false);
    if (!selectedVoice && availableVoices.length > 0) {
      setSelectedVoice(availableVoices[0]);
    }
    const voiceToUse = selectedVoice ?? availableVoices[0];
    if (voiceToUse) {
      playbackModeRef.current = 'tts';
      await startTTSPlayback(voiceToUse);
    }
  };

  // Stop playback
  const stop = () => {
    if (blobControllerRef.current) {
      blobControllerRef.current.stop();
      blobControllerRef.current = null;
    }
    clearBlobProgressInterval();
    audioService.stop();
    setUseBlobPlayback(false);
    playbackModeRef.current = 'tts';
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentTime(0);
    setCurrentSegment(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typeof navigator !== 'undefined' && navigator.mediaSession) {
      navigator.mediaSession.playbackState = 'none';
      navigator.mediaSession.metadata = null;
    }
  };

  // Handle close - stop audio and close the player
  const handleClose = () => {
    console.log('🛑 Closing audio player completely');
    stop();
    onStopAudio?.(); // Call stopAudio to clear the player state
    onClose?.(); // Call the original close handler
  };

  // Skip forward
  const skipForward = () => {
    if (useBlobPlayback && blobControllerRef.current) {
      const next = blobControllerRef.current.getCurrentSegmentIndex();
      blobControllerRef.current.seekToSegment(next);
    } else {
      setCurrentTime(prev => Math.min(prev + 30, duration));
    }
  };

  // Skip backward
  const skipBackward = () => {
    if (useBlobPlayback && blobControllerRef.current) {
      const prev = Math.max(0, blobControllerRef.current.getCurrentSegmentIndex() - 2);
      blobControllerRef.current.seekToSegment(prev);
    } else {
      setCurrentTime(prev => Math.max(prev - 15, 0));
    }
  };

  // Change preset (volume/quality only; speed is separate)
  const handlePresetChange = (preset: AudioPreset) => {
    setCurrentPreset(preset);
    savePresetPreference(preset.id);
    setShowPresetSelector(false);
    setVolume(preset.volume);
  };

  // Change playback speed (0.75x–2x)
  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    localStorage.setItem('audio-speed-preference', String(rate));
    audioService.setCurrentRate(rate);
    blobControllerRef.current?.setPlaybackRate(rate);
  };

  // Change voice
  const handleVoiceChange = (voiceName: string) => {
    const voice = availableVoices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
      localStorage.setItem('audio-preferred-voice', voice.name);
      setShowVoiceSelector(false);
      
      // Update voice in audio service for mid-playback changes
      audioService.setCurrentVoice(voice);
      
      // If playing, the new voice will apply to the next segment automatically
      // No need to restart - changes apply immediately to future segments
    }
  };

  // Create bookmark
  const createBookmark = () => {
    const note = bookmarkNote.trim() || `Segment ${currentSegment}`;
    bookmarkService.createBookmark(
      currentLesson.id,
      currentLesson.title,
      currentSegment,
      currentTime,
      note
    );
    setBookmarks(bookmarkService.getLessonBookmarks(currentLesson.id));
    setBookmarkNote('');
  };

  // Delete bookmark
  const deleteBookmark = (id: string) => {
    bookmarkService.deleteBookmark(id);
    setBookmarks(bookmarkService.getLessonBookmarks(currentLesson.id));
  };

  // Jump to bookmark
  const jumpToBookmark = (bookmark: Bookmark) => {
    setCurrentTime(bookmark.time);
    setCurrentSegment(bookmark.segment);
    setShowBookmarks(false);
    
    // Restart playback from this point if playing
    if (isPlaying) {
      stop();
      setTimeout(() => togglePlayPause(), 100);
    }
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Get next lesson title
  const currentIndex = playlist.findIndex(l => l.id === currentLesson.id);
  const nextLesson = currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null;

  return (
    <div className="audio-player">
      <div className="audio-player-header">
        <div className="audio-player-icon">🎧</div>
        <div className="audio-player-info">
          <div className="audio-player-title">{currentLesson.title}</div>
          <div className="audio-player-meta">
            {areaName} • Lesson {currentIndex + 1} of {playlist.length}
          </div>
        </div>
        <div className="audio-player-actions">
          <button 
            className="audio-player-minimize" 
            onClick={onClose} 
            title="Minimize player"
            aria-label="Minimize audio player"
          >
            ➖ Minimize
          </button>
          {(onClose || onStopAudio) && (
            <button 
              className="audio-player-close" 
              onClick={handleClose} 
              title="Close player completely"
              aria-label="Close audio player"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="audio-error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button className="error-dismiss" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Background playback: Allow tab audio or Skip */}
      {askBackgroundPermission && !isPreparing && (
        <div className="audio-background-permission">
          <p className="audio-background-permission-text">
            Enable background playback? Audio will continue when you minimize or lock the screen. You will be asked to share this tab&apos;s audio.
          </p>
          <div className="audio-background-permission-actions">
            <button type="button" className="audio-control-btn audio-allow-btn" onClick={handleAllowBackgroundCapture}>
              Allow tab audio
            </button>
            <button type="button" className="audio-control-btn audio-skip-background-btn" onClick={handleSkipBackgroundCapture}>
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Preparing: capturing segments */}
      {isPreparing && (
        <div className="audio-preparing">
          <span className="audio-preparing-icon">⏳</span>
          <span className="audio-preparing-text">
            Preparing… Segment {preparingProgress.segment} of {preparingProgress.total || totalSegments}
          </span>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      {!isPlaying && !error && (
        <div className="audio-keyboard-hint">
          <span className="hint-text">
            ⌨️ Shortcuts: Space (Play/Pause) • ← → (Skip) • ↑ ↓ (Volume)
          </span>
        </div>
      )}

      <div className="audio-player-progress-section">
        <div className="audio-progress-bar-container">
          <div className="audio-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="audio-time-display">
          <span>{formatTime(currentTime)}</span>
          <span className="audio-segment-info">
            Segment {currentSegment} / {totalSegments}
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="audio-player-controls">
        <button
          className="audio-control-btn audio-skip-btn"
          onClick={skipBackward}
          title="Rewind 15 seconds"
        >
          <span className="audio-icon">⏪</span>
          <span className="audio-skip-label">15s</span>
        </button>

        {onPrevious && (
          <button
            className="audio-control-btn"
            onClick={onPrevious}
            title="Previous lesson"
            disabled={currentIndex === 0}
          >
            <span className="audio-icon">⏮️</span>
          </button>
        )}

        <button
          className="audio-control-btn audio-play-btn"
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="audio-icon audio-loading">⏳</span>
          ) : (
            <span className="audio-icon">{isPlaying ? '⏸️' : '▶️'}</span>
          )}
        </button>

        {onNext && (
          <button
            className="audio-control-btn"
            onClick={onNext}
            title="Next lesson"
            disabled={currentIndex === playlist.length - 1}
          >
            <span className="audio-icon">⏭️</span>
          </button>
        )}

        <button
          className="audio-control-btn audio-skip-btn"
          onClick={skipForward}
          title="Skip forward 30 seconds"
        >
          <span className="audio-icon">⏩</span>
          <span className="audio-skip-label">30s</span>
        </button>
      </div>

      <div className="audio-player-settings">
        <div className="audio-setting">
          <label className="audio-setting-label">Quality</label>
          <button 
            className="audio-preset-btn" 
            onClick={() => setShowPresetSelector(!showPresetSelector)}
            title="Audio quality presets"
          >
            {currentPreset.icon} {currentPreset.name}
          </button>
        </div>

        <div className="audio-setting">
          <label className="audio-setting-label">Autoplay</label>
          <button
            className={`audio-toggle-btn ${autoplayEnabled ? 'active' : ''}`}
            onClick={() => setAutoplayEnabled(!autoplayEnabled)}
          >
            {autoplayEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="audio-setting">
          <label className="audio-setting-label">Speed</label>
          <button
            className="audio-speed-btn"
            onClick={() => setShowSpeedSelector(!showSpeedSelector)}
            title="Playback speed"
          >
            {playbackRate}x
          </button>
        </div>

        <div className="audio-setting audio-voice-setting">
          <label className="audio-setting-label">Voice</label>
          <button
            className="audio-voice-btn"
            onClick={() => setShowVoiceSelector(!showVoiceSelector)}
            title="Select voice"
          >
            🎙️
          </button>
        </div>

        <div className="audio-setting audio-volume-setting">
          <label className="audio-setting-label">🔊</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="audio-volume-slider"
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
          <span className="volume-percentage">{Math.round(volume * 100)}%</span>
        </div>

        <div className="audio-setting">
          <label className="audio-setting-label">Bookmarks</label>
          <button
            className="audio-bookmark-btn"
            onClick={() => setShowBookmarks(!showBookmarks)}
            title="View bookmarks"
          >
            🔖 {bookmarks.length > 0 && `(${bookmarks.length})`}
          </button>
        </div>
      </div>

      {showSpeedSelector && createPortal(
        <>
          <div className="audio-preset-backdrop" onClick={() => setShowSpeedSelector(false)} />
          <div className="audio-speed-selector">
            <div className="audio-speed-selector-header">
              <span>Playback Speed</span>
              <button
                className="audio-speed-close"
                onClick={() => setShowSpeedSelector(false)}
              >
                ✕
              </button>
            </div>
            <div className="audio-speed-list">
              {SPEED_OPTIONS.map((rate) => (
                <button
                  key={rate}
                  className={`audio-speed-option ${playbackRate === rate ? 'active' : ''}`}
                  onClick={() => {
                    handleSpeedChange(rate);
                    setShowSpeedSelector(false);
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}

      {showVoiceSelector && createPortal(
        <>
          <div className="audio-preset-backdrop" onClick={() => setShowVoiceSelector(false)} />
          <div className="audio-voice-selector">
            <div className="audio-voice-selector-header">
              <span>Select Voice</span>
              <button 
                className="audio-voice-close"
                onClick={() => setShowVoiceSelector(false)}
              >
                ✕
              </button>
            </div>
            <div className="audio-voice-list">
              {availableVoices.length === 0 ? (
                <div className="audio-voice-empty">
                  <p>Loading voices... Please wait.</p>
                </div>
              ) : (
                availableVoices.map((voice) => (
                  <button
                    key={voice.name}
                    className={`audio-voice-option ${selectedVoice?.name === voice.name ? 'active' : ''}`}
                    onClick={() => handleVoiceChange(voice.name)}
                  >
                    <div className="voice-name">{voice.name}</div>
                    <div className="voice-lang">{voice.lang}</div>
                    {selectedVoice?.name === voice.name && (
                      <span className="voice-checkmark">✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      {showPresetSelector && createPortal(
        <>
          <div className="audio-preset-backdrop" onClick={() => setShowPresetSelector(false)} />
          <div className="audio-preset-selector">
            <div className="audio-preset-selector-header">
              <span>Audio Quality Presets</span>
              <button 
                className="audio-preset-close"
                onClick={() => setShowPresetSelector(false)}
              >
                ✕
              </button>
            </div>
            <div className="audio-preset-list">
              {audioPresets.map((preset) => (
                <button
                  key={preset.id}
                  className={`audio-preset-option ${currentPreset.id === preset.id ? 'active' : ''}`}
                  onClick={() => handlePresetChange(preset)}
                >
                  <div className="preset-header">
                    <span className="preset-icon">{preset.icon}</span>
                    <span className="preset-name">{preset.name}</span>
                  </div>
                  <div className="preset-description">{preset.description}</div>
                  <div className="preset-details">
                    Speed: {preset.rate}x • Volume: {Math.round(preset.volume * 100)}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}

      {showBookmarks && (
        <div className="audio-bookmarks-panel">
          <div className="audio-bookmarks-header">
            <span>Bookmarks ({bookmarks.length})</span>
            <button 
              className="audio-bookmarks-close"
              onClick={() => setShowBookmarks(false)}
            >
              ✕
            </button>
          </div>

          <div className="audio-bookmark-creator">
            <input
              type="text"
              placeholder="Add note (optional)"
              value={bookmarkNote}
              onChange={(e) => setBookmarkNote(e.target.value)}
              className="bookmark-note-input"
              onKeyPress={(e) => e.key === 'Enter' && createBookmark()}
            />
            <button 
              className="bookmark-add-btn"
              onClick={createBookmark}
              title="Add bookmark at current position"
            >
              ➕ Add Bookmark
            </button>
          </div>

          {bookmarks.length === 0 ? (
            <div className="bookmarks-empty">
              <p>No bookmarks yet. Add one at your current position!</p>
            </div>
          ) : (
            <div className="audio-bookmarks-list">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bookmark-item">
                  <div className="bookmark-info">
                    <div className="bookmark-note">{bookmark.note}</div>
                    <div className="bookmark-meta">
                      Segment {bookmark.segment} • {formatTime(bookmark.time)}
                    </div>
                  </div>
                  <div className="bookmark-actions">
                    <button
                      className="bookmark-jump-btn"
                      onClick={() => jumpToBookmark(bookmark)}
                      title="Jump to this bookmark"
                    >
                      ▶️
                    </button>
                    <button
                      className="bookmark-delete-btn"
                      onClick={() => deleteBookmark(bookmark.id)}
                      title="Delete bookmark"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {nextLesson && autoplayEnabled && (
        <div className="audio-player-next">
          <span className="audio-next-label">Up next:</span>
          <span className="audio-next-title">{nextLesson.title}</span>
        </div>
      )}
    </div>
  );
}

