import { useState, useEffect, useRef } from 'react';
import { audioService } from '../services/audioService';
import type { PodcastScript } from '../services/audioService';
import type { LessonPlan } from '../lessonPlanTypes';
import { audioPresets, loadPresetPreference, savePresetPreference } from '../services/audioPresets';
import type { AudioPreset } from '../services/audioPresets';
import { bookmarkService } from '../services/bookmarkService';
import type { Bookmark } from '../services/bookmarkService';
import { useAudio } from '../contexts/AudioContext';
import './AudioPlayer.css';

interface AudioPlayerProps {
  currentLesson: LessonPlan;
  playlist: LessonPlan[];
  areaName: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onClose?: () => void;
  onStopAudio?: () => void;
}

export default function AudioPlayer({
  currentLesson,
  playlist,
  areaName,
  onNext,
  onPrevious,
  onClose,
  onStopAudio
}: AudioPlayerProps) {
  const { audioMode } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPreset, setCurrentPreset] = useState<AudioPreset>(loadPresetPreference());
  const [currentSegment, setCurrentSegment] = useState(0);
  const [totalSegments, setTotalSegments] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [podcastScript, setPodcastScript] = useState<PodcastScript | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(currentPreset.volume);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedSelector, setShowSpeedSelector] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  
  // Available speed options
  const speedOptions = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  // Update volume when preset changes
  useEffect(() => {
    setVolume(currentPreset.volume);
    // Reset speed to 1.0 when preset changes (preset rate is separate)
    setPlaybackRate(1.0);
  }, [currentPreset]);
  
  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    audioService.setCurrentRate(speed);
    setShowSpeedSelector(false);
    // If currently playing, update rate immediately
    if (isPlaying) {
      // The rate will be used for the next segment in speakPodcastScript
      console.log(`Speed changed to ${speed}x`);
    }
  };

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

  // Generate podcast script when lesson changes
  useEffect(() => {
    const lessonIndex = playlist.findIndex(l => l.id === currentLesson.id);
    const script = audioMode === 'lite'
      ? audioService.generateLitePodcastScript(
          currentLesson,
          areaName,
          lessonIndex + 1,
          playlist.length
        )
      : audioService.generatePodcastScript(
          currentLesson,
          areaName,
          lessonIndex + 1,
          playlist.length
        );
    setPodcastScript(script);
    setDuration(script.estimatedDuration);
    setTotalSegments(script.segments.length);
    setCurrentTime(0);
    setCurrentSegment(0);
    
    // Load saved progress
    const savedProgress = localStorage.getItem(`audio-progress-${currentLesson.id}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentTime(progress.time || 0);
      setCurrentSegment(progress.segment || 0);
    }

    // Load bookmarks
    setBookmarks(bookmarkService.getLessonBookmarks(currentLesson.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLesson, playlist, areaName, audioMode]);

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

  // Play/Pause toggle
  const togglePlayPause = async () => {
    console.log('🎮 togglePlayPause called, isPlaying:', isPlaying);
    
    if (!podcastScript) {
      console.error('❌ No podcast script available');
      setError('No audio script available. Please try reloading the lesson.');
      return;
    }

    if (isPlaying) {
      console.log('⏸️ Pausing audio...');
      audioService.pauseSpeech();
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      // Clear any previous errors
      setError(null);
      setIsLoading(true);
      console.log('▶️ Starting audio playback initialization...');
      
      // Check if speech synthesis is available
      console.log('🔍 Checking speech synthesis availability...');
      if (!window.speechSynthesis) {
        console.error('❌ Speech synthesis not available');
        setError('Speech synthesis is not supported in your browser. Please try Chrome, Edge, or Safari.');
        setIsLoading(false);
        return;
      }
      console.log('✅ Speech synthesis available');

      // Check if we need to wait for voices to load
      if (availableVoices.length === 0) {
        console.log('⏳ Waiting for voices to load...');
        setError('Loading voices... Please wait a moment and try again.');
        
        // Try to load voices again
        const loadVoices = () => {
          const voices = audioService.getAvailableVoices();
          setAvailableVoices(voices);
          
          if (voices.length > 0 && !selectedVoice) {
            setSelectedVoice(voices[0]);
            setError(null);
            console.log('Voices loaded:', voices.length);
          }
        };
        
        // Wait a bit and try again
        setTimeout(() => {
          loadVoices();
          if (window.speechSynthesis.onvoiceschanged) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
          }
        }, 1000);
        
        setIsLoading(false);
        return;
      }

      // Check if voice is available
      let voiceToUse = selectedVoice;
      if (!voiceToUse) {
        const defaultVoice = availableVoices[0];
        if (defaultVoice) {
          setSelectedVoice(defaultVoice);
          voiceToUse = defaultVoice;
          console.log('Using default voice:', defaultVoice.name);
        } else {
          setError('No voices available. Please wait a moment and try again.');
          setIsLoading(false);
          return;
        }
      }
      
      console.log('🎧 Starting audio playback...');
      console.log('Voice:', voiceToUse.name);
      console.log('Preset:', currentPreset.name);
      console.log('Rate:', playbackRate);
      console.log('Volume:', volume);
      console.log('Podcast script segments:', podcastScript.segments.length);

      setIsPlaying(true);
      isPlayingRef.current = true;
      setIsLoading(false);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        if (isPlayingRef.current) {
          setCurrentTime(prev => Math.min(prev + 1, duration));
        }
      }, 1000);

      // Set initial voice and rate in audio service
      audioService.setCurrentVoice(voiceToUse);
      audioService.setCurrentRate(playbackRate);

      try {
        console.log('▶️ Calling audioService.speakPodcastScript...');
        await audioService.speakPodcastScript(podcastScript, {
          rate: playbackRate,
          voice: voiceToUse || undefined,
          onProgress: (segment, total) => {
            console.log(`Segment ${segment} of ${total}`);
            setCurrentSegment(segment);
            setTotalSegments(total);
          },
          onPause: () => {
            console.log('⏸️ Playback paused');
            setIsPlaying(false);
            isPlayingRef.current = false;
          }
        });
        console.log('✅ Audio playback completed successfully');

        // Finished playing
        setIsPlaying(false);
        isPlayingRef.current = false;
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        // Auto-play next if enabled
        if (autoplayEnabled && onNext) {
          setTimeout(() => {
            onNext();
          }, 2000);
        }
      } catch (error) {
        console.error('Audio playback error:', error);
        setError('Audio playback failed. Please try again or select a different voice.');
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsLoading(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  };

  // Stop playback
  const stop = () => {
    console.log('🛑 Stopping audio playback');
    audioService.stop();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentTime(0);
    setCurrentSegment(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
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
    setCurrentTime(prev => Math.min(prev + 30, duration));
  };

  // Skip backward
  const skipBackward = () => {
    setCurrentTime(prev => Math.max(prev - 15, 0));
  };

  // Change preset
  const handlePresetChange = (preset: AudioPreset) => {
    setCurrentPreset(preset);
    savePresetPreference(preset.id);
    setShowPresetSelector(false);
    setVolume(preset.volume);
    
    // Update rate in audio service for mid-playback changes
    audioService.setCurrentRate(preset.rate);
    
    // If playing, the new rate will apply to the next segment automatically
    // No need to restart - changes apply immediately to future segments
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

        <div className="audio-setting audio-speed-setting">
          <label className="audio-setting-label">Speed</label>
          <div className="audio-speed-control">
            <button
              className="audio-speed-btn"
              onClick={() => setShowSpeedSelector(!showSpeedSelector)}
              title="Playback speed"
            >
              {playbackRate}x
            </button>
            {showSpeedSelector && (
              <>
                <div className="audio-preset-backdrop" onClick={() => setShowSpeedSelector(false)} />
                <div className="audio-speed-selector">
                  {speedOptions.map((speed) => (
                    <button
                      key={speed}
                      className={`audio-speed-option ${playbackRate === speed ? 'active' : ''}`}
                      onClick={() => handleSpeedChange(speed)}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
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

      {showVoiceSelector && (
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
        </>
      )}

      {showPresetSelector && (
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
        </>
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

