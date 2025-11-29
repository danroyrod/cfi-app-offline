// Audio Quality Presets for Different Use Cases

export interface AudioPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const audioPresets: AudioPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Conversational pace, perfect for focused listening',
    icon: '🎧',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  },
  {
    id: 'podcast',
    name: 'Podcast',
    description: 'Slightly faster, great for commuting',
    icon: '🎙️',
    rate: 1.15,
    pitch: 1.0,
    volume: 1.0
  },
  {
    id: 'speed-learning',
    name: 'Speed Learning',
    description: 'Faster pace for review and reinforcement',
    icon: '⚡',
    rate: 1.5,
    pitch: 1.05,
    volume: 1.0
  },
  {
    id: 'detailed-study',
    name: 'Detailed Study',
    description: 'Slower, clearer articulation for complex topics',
    icon: '📚',
    rate: 0.85,
    pitch: 1.0,
    volume: 1.0
  },
  {
    id: 'background',
    name: 'Background',
    description: 'Lower volume for multitasking',
    icon: '🔉',
    rate: 1.0,
    pitch: 1.0,
    volume: 0.6
  },
  {
    id: 'bedtime',
    name: 'Bedtime',
    description: 'Slower pace, softer volume for relaxed learning',
    icon: '🌙',
    rate: 0.75,
    pitch: 0.95,
    volume: 0.7
  }
];

/**
 * Get a preset by ID
 */
export function getPreset(id: string): AudioPreset | undefined {
  return audioPresets.find(p => p.id === id);
}

/**
 * Get the default preset
 */
export function getDefaultPreset(): AudioPreset {
  return audioPresets[0]; // Natural
}

/**
 * Save preset preference
 */
export function savePresetPreference(presetId: string): void {
  localStorage.setItem('audio-preset-preference', presetId);
}

/**
 * Load preset preference
 */
export function loadPresetPreference(): AudioPreset {
  const savedId = localStorage.getItem('audio-preset-preference');
  return getPreset(savedId || '') || getDefaultPreset();
}






