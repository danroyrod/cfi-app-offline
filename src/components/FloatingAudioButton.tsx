import { useAudio } from '../contexts/AudioContext';
import './FloatingAudioButton.css';

export default function FloatingAudioButton() {
  const { currentLesson, showPlayer, setShowPlayer, stopAudio } = useAudio();

  // Don't show if no lesson is loaded
  if (!currentLesson) {
    return null;
  }

  // Don't show if full player is visible
  if (showPlayer) {
    return null;
  }

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the player
    stopAudio();
  };

  return (
    <button
      className="floating-audio-button"
      onClick={() => setShowPlayer(true)}
      title="Tap to restore audio player"
      aria-label="Restore audio player"
    >
      <span className="floating-audio-icon">🎧</span>
      <span className="floating-audio-text">
        <span className="floating-audio-label">Tap to Restore Player</span>
        <span className="floating-audio-title">{currentLesson.title}</span>
      </span>
      <button
        className="floating-audio-close"
        onClick={handleStop}
        title="Stop audio completely"
        aria-label="Stop audio"
      >
        ✕
      </button>
      <span className="floating-audio-pulse"></span>
    </button>
  );
}





