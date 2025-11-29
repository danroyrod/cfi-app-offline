import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { LessonPlan } from '../lessonPlanTypes';

interface AudioContextType {
  currentLesson: LessonPlan | null;
  playlist: LessonPlan[];
  currentIndex: number;
  isPlaying: boolean;
  showPlayer: boolean;
  startPlaylist: (lessons: LessonPlan[], startIndex: number) => void;
  setShowPlayer: (show: boolean) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentLesson, setCurrentLesson] = useState<LessonPlan | null>(null);
  const [playlist, setPlaylist] = useState<LessonPlan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const startPlaylist = (lessons: LessonPlan[], startIndex: number) => {
    setPlaylist(lessons);
    setCurrentIndex(startIndex);
    setCurrentLesson(lessons[startIndex]);
    setShowPlayer(true);
    setIsPlaying(true);
  };

  const goToNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentLesson(playlist[nextIndex]);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentLesson(playlist[prevIndex]);
    }
  };

  const stopAudio = () => {
    setCurrentLesson(null);
    setPlaylist([]);
    setCurrentIndex(0);
    setIsPlaying(false);
    setShowPlayer(false);
  };

  return (
    <AudioContext.Provider
      value={{
        currentLesson,
        playlist,
        currentIndex,
        isPlaying,
        showPlayer,
        startPlaylist,
        setShowPlayer,
        goToNext,
        goToPrevious,
        stopAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}


