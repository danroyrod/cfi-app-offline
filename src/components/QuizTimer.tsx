import { useState, useEffect, useRef } from 'react';
import './QuizTimer.css';

interface QuizTimerProps {
  timeLimit?: number;    // minutes (0 or undefined = no limit)
  startTime: number;
  onTimeUp?: () => void;
  isPaused?: boolean;
}

export default function QuizTimer({ timeLimit, startTime, onTimeUp, isPaused = false }: QuizTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : 0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    const calculateTime = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setTimeElapsed(elapsed);

      if (timeLimit) {
        const remaining = (timeLimit * 60) - elapsed;
        setTimeRemaining(Math.max(0, remaining));

        if (remaining <= 0 && onTimeUp) {
          onTimeUp();
        }
      }
    };

    // Update immediately
    calculateTime();

    // Then update every second
    timerRef.current = window.setInterval(calculateTime, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, timeLimit, isPaused, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (!timeLimit) return 'timer-unlimited';
    if (timeRemaining <= 300) return 'timer-warning';  // 5 minutes
    if (timeRemaining <= 60) return 'timer-critical';  // 1 minute
    return 'timer-normal';
  };

  const getProgress = (): number => {
    if (!timeLimit) return 0;
    return (timeElapsed / (timeLimit * 60)) * 100;
  };

  if (!timeLimit) {
    // Unlimited time - show elapsed
    return (
      <div className="quiz-timer timer-unlimited">
        <span className="timer-icon">⏱️</span>
        <span className="timer-label">Time Elapsed:</span>
        <span className="timer-value">{formatTime(timeElapsed)}</span>
      </div>
    );
  }

  // Timed quiz
  return (
    <div className={`quiz-timer ${getTimerClass()}`}>
      <div className="timer-display">
        <span className="timer-icon">⏰</span>
        <span className="timer-label">Time Remaining:</span>
        <span className="timer-value">{formatTime(timeRemaining)}</span>
      </div>
      
      <div className="timer-progress-bar">
        <div 
          className="timer-progress-fill" 
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      {timeRemaining <= 300 && timeRemaining > 60 && (
        <div className="timer-warning-message">
          ⚠️ Less than 5 minutes remaining!
        </div>
      )}

      {timeRemaining <= 60 && timeRemaining > 0 && (
        <div className="timer-critical-message">
          🚨 Less than 1 minute remaining!
        </div>
      )}
    </div>
  );
}






