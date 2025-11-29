import { useAudio } from '../contexts/AudioContext';
import AudioPlayer from './AudioPlayer';
import acsDataRaw from '../acs_data.json';

const acsData = acsDataRaw as { areas: Array<{ number: string; name: string; tasks: any[] }> };

export default function GlobalAudioPlayer() {
  const { currentLesson, playlist, showPlayer, setShowPlayer, goToNext, goToPrevious, stopAudio } = useAudio();

  if (!currentLesson || !showPlayer) {
    return null;
  }

  // Get area name for current lesson
  const getAreaName = (lessonId: string): string => {
    const areaMatch = lessonId.match(/LP-([IVX]+)/);
    if (!areaMatch) return 'Unknown';
    
    const areaCode = areaMatch[1];
    const area = acsData.areas.find(a => a.number === areaCode);
    return area?.name || `Area ${areaCode}`;
  };

  return (
    <AudioPlayer
      currentLesson={currentLesson}
      playlist={playlist}
      areaName={getAreaName(currentLesson.id)}
      onNext={goToNext}
      onPrevious={goToPrevious}
      onClose={() => setShowPlayer(false)}
      onStopAudio={stopAudio}
    />
  );
}


