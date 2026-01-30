// Audio Service for CFI Training Lessons
// Converts lesson plans to high-quality audio podcasts

import type { LessonPlan } from '../lessonPlanTypes';
import { captureSegmentToBlob } from './audioCapture';
import type { BlobSegmentEntry } from './blobPlayback';

export interface AudioSegment {
  text: string;
  type: 'intro' | 'title' | 'content' | 'transition' | 'outro';
  pauseAfter?: number; // milliseconds
}

export interface PodcastScript {
  segments: AudioSegment[];
  estimatedDuration: number; // seconds
  lessonId: string;
  lessonTitle: string;
}

export class AudioLessonService {
  private synthesis: SpeechSynthesis;
  private defaultVoice: SpeechSynthesisVoice | null = null;
  private currentVoice: SpeechSynthesisVoice | null = null;
  private currentRate: number = 1.0;
  private currentVolume: number = 1;
  private isPlaying: boolean = false;
  
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  /**
   * Preferred voice names (often higher quality). Network voices (localService === false) are preferred when available.
   */
  private static readonly PREFERRED_VOICE_NAMES = [
    'Google US English',
    'Microsoft David',
    'Microsoft Zira',
    'Alex', // macOS
    'Samantha', // macOS
  ];

  private preferredVoiceIndex(name: string): number {
    const i = AudioLessonService.PREFERRED_VOICE_NAMES.findIndex(p => name.includes(p));
    return i >= 0 ? i : AudioLessonService.PREFERRED_VOICE_NAMES.length;
  }

  /**
   * Sort English voices: network first (localService === false), then by preferred name order.
   */
  private sortVoicesForQuality(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
    const en = voices.filter(v => v.lang.startsWith('en'));
    return en.slice().sort((a, b) => {
      const aNetwork = (a as SpeechSynthesisVoice & { localService?: boolean }).localService === false ? 0 : 1;
      const bNetwork = (b as SpeechSynthesisVoice & { localService?: boolean }).localService === false ? 0 : 1;
      if (aNetwork !== bNetwork) return aNetwork - bNetwork;
      return this.preferredVoiceIndex(a.name) - this.preferredVoiceIndex(b.name) || a.name.localeCompare(b.name);
    });
  }

  /**
   * Load available voices and select the best one (prefer network, then preferred names).
   */
  private loadVoices(): void {
    const setVoice = () => {
      const voices = this.synthesis.getVoices();
      const sorted = this.sortVoicesForQuality(voices);
      this.defaultVoice = sorted[0] || voices.find(v => v.lang.startsWith('en')) || voices[0];
    };

    setVoice();

    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = setVoice;
    }
  }

  /**
   * Get all available voices, sorted: network first, then by preferred name order.
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.sortVoicesForQuality(this.synthesis.getVoices());
  }

  /** In-memory cache for blob segments: key = lessonId-mode-voiceName-rate, value = entries + URLs to revoke on evict. Max 3 lessons. */
  private static readonly BLOB_CACHE_MAX = 3;
  private blobCache = new Map<string, { entries: BlobSegmentEntry[]; urlsToRevoke: string[] }>();

  private blobCacheKey(lessonId: string, mode: 'full' | 'lite', voiceName: string, rate: number): string {
    return `${lessonId}-${mode}-${voiceName}-${rate}`;
  }

  /**
   * Prepare a podcast script to blob entries by capturing each segment via the given tab audio stream.
   * Call requestTabAudioStream() before this and releaseTabAudioStream() when done.
   */
  async prepareScriptToBlobs(
    script: PodcastScript,
    options: {
      voice: SpeechSynthesisVoice | null;
      rate: number;
      volume: number;
      mode: 'full' | 'lite';
      stream: MediaStream;
      onSegmentProgress?: (segment: number, total: number) => void;
    }
  ): Promise<BlobSegmentEntry[]> {
    const entries: BlobSegmentEntry[] = [];
    const urlsToRevoke: string[] = [];
    const total = script.segments.length;

    for (let i = 0; i < script.segments.length; i++) {
      options.onSegmentProgress?.(i + 1, total);
      const seg = script.segments[i];
      const pauseAfter = seg.pauseAfter ?? 0;

      if (!seg.text || !seg.text.trim()) {
        entries.push({ blobUrl: null, pauseAfter });
        continue;
      }

      const blob = await captureSegmentToBlob(options.stream, seg.text, {
        voice: options.voice,
        rate: options.rate,
        volume: options.volume
      });

      if (blob) {
        const url = URL.createObjectURL(blob);
        urlsToRevoke.push(url);
        entries.push({ blobUrl: url, pauseAfter });
      } else {
        entries.push({ blobUrl: null, pauseAfter });
      }
    }

    const key = this.blobCacheKey(script.lessonId, options.mode, options.voice?.name ?? '', options.rate);
    this.setCachedBlobEntries(key, entries, urlsToRevoke);
    return entries;
  }

  /**
   * Get cached blob entries for a lesson/mode/voice/rate. Returns null if not cached.
   */
  getCachedBlobEntries(lessonId: string, mode: 'full' | 'lite', voiceName: string, rate: number): BlobSegmentEntry[] | null {
    const key = this.blobCacheKey(lessonId, mode, voiceName, rate);
    const cached = this.blobCache.get(key);
    return cached ? cached.entries : null;
  }

  /**
   * Store blob entries in cache. Evicts oldest if over BLOB_CACHE_MAX.
   */
  private setCachedBlobEntries(key: string, entries: BlobSegmentEntry[], urlsToRevoke: string[]): void {
    while (this.blobCache.size >= AudioLessonService.BLOB_CACHE_MAX && this.blobCache.size > 0) {
      const firstKey = this.blobCache.keys().next().value as string;
      const old = this.blobCache.get(firstKey);
      if (old) {
        old.urlsToRevoke.forEach(u => URL.revokeObjectURL(u));
      }
      this.blobCache.delete(firstKey);
    }
    this.blobCache.set(key, { entries, urlsToRevoke });
  }

  /**
   * Generate a podcast-style script from a lesson plan
   */
  generatePodcastScript(lesson: LessonPlan, areaName: string, lessonNumber: number, totalLessons: number): PodcastScript {
    const segments: AudioSegment[] = [];

    // INTRO
    segments.push({
      text: 'Welcome to CFI Training Audio.',
      type: 'intro',
      pauseAfter: 500
    });

    segments.push({
      text: `Today's lesson: ${lesson.title}.`,
      type: 'title',
      pauseAfter: 700
    });

    segments.push({
      text: `This is lesson ${lessonNumber} of ${totalLessons} in the ${areaName} series.`,
      type: 'intro',
      pauseAfter: 1000
    });

    // OVERVIEW
    if (lesson.overview) {
      segments.push({
        text: 'Overview.',
        type: 'transition',
        pauseAfter: 300
      });
      
      segments.push({
        text: this.cleanTextForSpeech(lesson.overview),
        type: 'content',
        pauseAfter: 1000
      });
    }

    // OBJECTIVES
    if (lesson.objectives && lesson.objectives.length > 0) {
      segments.push({
        text: 'Learning Objectives.',
        type: 'transition',
        pauseAfter: 300
      });

      lesson.objectives.forEach((obj) => {
        segments.push({
          text: this.cleanTextForSpeech(obj),
          type: 'content',
          pauseAfter: 500
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1000
      });
    }

    // TEACHING SCRIPT - Main Content
    if (lesson.teachingScript && lesson.teachingScript.length > 0) {
      segments.push({
        text: 'Teaching Script.',
        type: 'transition',
        pauseAfter: 500
      });

      // Process each phase
      lesson.teachingScript.forEach(script => {
        segments.push({
          text: `${this.phaseTitleForSpeech(script.phase)}.`,
          type: 'transition',
          pauseAfter: 500
        });

        // Instructor actions
        if (script.instructorActions && script.instructorActions.length > 0) {
          segments.push({
            text: 'Instructor actions.',
            type: 'transition',
            pauseAfter: 200
          });

          script.instructorActions.forEach(action => {
            segments.push({
              text: this.cleanTextForSpeech(action),
              type: 'content',
              pauseAfter: 400
            });
          });
        }

        // Student actions - EXCLUDED from audio lessons per requirements
        // Audio lessons focus on instructor content only

        // Key points
        if (script.keyPoints && script.keyPoints.length > 0) {
          segments.push({
            text: 'Key teaching points.',
            type: 'transition',
            pauseAfter: 200
          });

          script.keyPoints.forEach(point => {
            segments.push({
              text: this.cleanTextForSpeech(point),
              type: 'content',
              pauseAfter: 400
            });
          });
        }

        segments.push({
          text: '',
          type: 'content',
          pauseAfter: 1000
        });
      });
    }

    // KEY TEACHING POINTS (from improved lesson plans)
    if (lesson.keyTeachingPoints && lesson.keyTeachingPoints.length > 0) {
      segments.push({
        text: 'Key Teaching Points.',
        type: 'transition',
        pauseAfter: 500
      });

      lesson.keyTeachingPoints.forEach((point) => {
        segments.push({
          text: `${this.cleanTextForSpeech(point)}`,
          type: 'content',
          pauseAfter: 500
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1000
      });
    }

    // COMMON ERRORS, SAFETY CONSIDERATIONS, and COMPLETION STANDARDS
    // Excluded from audio lessons - focus on overview, objectives, teaching script, and key points only

    // OUTRO
    segments.push({
      text: `End of ${lesson.title}.`,
      type: 'outro',
      pauseAfter: 500
    });

    const totalWords = segments.reduce((sum, seg) => sum + seg.text.split(' ').length, 0);
    const estimatedDuration = Math.ceil((totalWords / 150) * 60) + 30; // Add buffer

    return {
      segments,
      estimatedDuration,
      lessonId: lesson.id,
      lessonTitle: lesson.title
    };
  }

  /**
   * Generate a concise lite script: title, summary of objectives, key points per phase, key teaching points only.
   * No completion standards, no ACS codes, no full instructor actions, no thank-you message.
   */
  generateLitePodcastScript(lesson: LessonPlan, areaName: string, lessonNumber: number, totalLessons: number): PodcastScript {
    const segments: AudioSegment[] = [];

    segments.push({
      text: `Lite lesson: ${lesson.title}.`,
      type: 'intro',
      pauseAfter: 500
    });

    segments.push({
      text: `Lesson ${lessonNumber} of ${totalLessons} in the ${areaName} series.`,
      type: 'intro',
      pauseAfter: 700
    });

    // Brief objectives summary (first objective or short summary, not each read in full)
    if (lesson.objectives && lesson.objectives.length > 0) {
      segments.push({
        text: 'Objectives.',
        type: 'transition',
        pauseAfter: 300
      });
      const summary = lesson.objectives.length === 1
        ? this.cleanTextForSpeech(lesson.objectives[0])
        : lesson.objectives.slice(0, 2).map(o => this.cleanTextForSpeech(o)).join('. ');
      segments.push({
        text: summary,
        type: 'content',
        pauseAfter: 800
      });
    }

    // Teaching script: phase name + only key points (no instructor actions)
    if (lesson.teachingScript && lesson.teachingScript.length > 0) {
      lesson.teachingScript.forEach(script => {
        segments.push({
          text: `${this.phaseTitleForSpeech(script.phase)}.`,
          type: 'transition',
          pauseAfter: 400
        });
        if (script.keyPoints && script.keyPoints.length > 0) {
          script.keyPoints.forEach(point => {
            segments.push({
              text: this.cleanTextForSpeech(point),
              type: 'content',
              pauseAfter: 400
            });
          });
        }
        segments.push({ text: '', type: 'content', pauseAfter: 500 });
      });
    }

    // Key teaching points
    if (lesson.keyTeachingPoints && lesson.keyTeachingPoints.length > 0) {
      segments.push({
        text: 'Key Teaching Points.',
        type: 'transition',
        pauseAfter: 400
      });
      lesson.keyTeachingPoints.forEach(point => {
        segments.push({
          text: this.cleanTextForSpeech(point),
          type: 'content',
          pauseAfter: 400
        });
      });
    }

    segments.push({
      text: `End of ${lesson.title}.`,
      type: 'outro',
      pauseAfter: 500
    });

    const totalWords = segments.reduce((sum, seg) => sum + seg.text.split(' ').length, 0);
    const estimatedDuration = Math.ceil((totalWords / 150) * 60) + 20;

    return {
      segments,
      estimatedDuration,
      lessonId: lesson.id,
      lessonTitle: lesson.title
    };
  }

  /**
   * Section/phase title for speech: strip trailing duration (e.g. " (20 minutes)") so TTS doesn't read it.
   */
  private phaseTitleForSpeech(phase: string): string {
    return phase.replace(/\s*\(\d+\s*minutes?\)\s*$/i, '').trim() || phase;
  }

  /**
   * Clean text for better speech synthesis
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      // Convert bullet points
      .replace(/^[-•]/gm, '')
      // Expand abbreviations for better pronunciation
      .replace(/\bCFI\b/g, 'Certified Flight Instructor')
      .replace(/\bACS\b/g, 'Airman Certification Standards')
      .replace(/\bFAA\b/g, 'F. A. A.')
      .replace(/\bPTS\b/g, 'Practical Test Standards')
      .replace(/\bADM\b/g, 'Aeronautical Decision Making')
      .replace(/\bCRM\b/g, 'Crew Resource Management')
      // Fix common aviation terms
      .replace(/\bkts\b/gi, 'knots')
      .replace(/\bft\b/gi, 'feet')
      .replace(/\balt\b/gi, 'altitude')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Convert text to speech and return audio blob
   */
  async textToSpeech(text: string, options?: {
    voice?: SpeechSynthesisVoice;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🎤 Creating utterance...');
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.voice = options?.voice || this.defaultVoice;
      utterance.rate = options?.rate || 1.0;
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 1.0;

      console.log('🎤 Utterance config:', {
        voice: utterance.voice?.name,
        rate: utterance.rate,
        pitch: utterance.pitch,
        volume: utterance.volume
      });

      utterance.onstart = () => {
        console.log('🎤 Utterance started');
      };

      utterance.onend = () => {
        console.log('🎤 Utterance ended');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('🎤 Utterance error:', event);
        reject(event);
      };

      console.log('🎤 Calling synthesis.speak()...');
      this.synthesis.speak(utterance);
      console.log('🎤 synthesis.speak() called, synthesis state:', {
        speaking: this.synthesis.speaking,
        pending: this.synthesis.pending,
        paused: this.synthesis.paused
      });
    });
  }

  /**
   * Set current voice (for mid-playback changes)
   */
  setCurrentVoice(voice: SpeechSynthesisVoice | null): void {
    this.currentVoice = voice;
  }

  /**
   * Set current rate (for mid-playback changes)
   */
  setCurrentRate(rate: number): void {
    this.currentRate = rate;
  }

  /**
   * Set current volume (for mid-playback changes). Clamped 0-1.
   */
  setCurrentVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get current voice
   */
  getCurrentVoice(): SpeechSynthesisVoice | null {
    return this.currentVoice;
  }

  /**
   * Get current rate
   */
  getCurrentRate(): number {
    return this.currentRate;
  }

  /**
   * Speak an entire podcast script
   */
  async speakPodcastScript(
    script: PodcastScript,
    options?: {
      voice?: SpeechSynthesisVoice;
      rate?: number;
      volume?: number;
      onProgress?: (segment: number, total: number) => void;
      onPause?: () => void;
    }
  ): Promise<void> {
    console.log('📜 Starting speakPodcastScript with', script.segments.length, 'segments');
    
    // Cancel any existing speech to prevent queue issues
    this.synthesis.cancel();
    
    // Initialize current voice and rate from options
    if (options?.voice) {
      this.currentVoice = options.voice;
    } else if (!this.currentVoice) {
      this.currentVoice = this.defaultVoice;
    }
    
    if (options?.rate !== undefined) {
      this.currentRate = options.rate;
    }

    if (options?.volume !== undefined) {
      this.currentVolume = Math.max(0, Math.min(1, options.volume));
    }

    this.isPlaying = true;

    for (let i = 0; i < script.segments.length; i++) {
      // Check if stopped
      if (!this.isPlaying) {
        console.log('🛑 Playback stopped');
        break;
      }

      const segment = script.segments[i];
      
      console.log(`📜 Processing segment ${i + 1}/${script.segments.length}: "${segment.text?.substring(0, 50)}..."`);
      
      if (options?.onProgress) {
        options.onProgress(i + 1, script.segments.length);
      }

      if (segment.text) {
        // Use current voice, rate, and volume (volume can be updated mid-playback via setCurrentVolume)
        await this.textToSpeech(segment.text, {
          voice: this.currentVoice || undefined,
          rate: this.currentRate,
          volume: this.currentVolume
        });
      }

      if (segment.pauseAfter) {
        console.log(`⏸️ Pausing for ${segment.pauseAfter}ms`);
        await this.pause(segment.pauseAfter);
      }

      // Check if paused
      if (this.synthesis.paused) {
        console.log('⏸️ Synthesis paused, breaking');
        options?.onPause?.();
        break;
      }
    }
    
    this.isPlaying = false;
    console.log('📜 speakPodcastScript completed');
  }

  /**
   * Pause for specified duration
   */
  private pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Stop current speech
   */
  stop(): void {
    this.synthesis.cancel();
    this.isPlaying = false;
  }

  /**
   * Pause current speech
   */
  pauseSpeech(): void {
    this.synthesis.pause();
  }

  /**
   * Resume paused speech
   */
  resumeSpeech(): void {
    this.synthesis.resume();
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  /**
   * Check if paused
   */
  isPaused(): boolean {
    return this.synthesis.paused;
  }
}

// Export singleton instance
export const audioService = new AudioLessonService();

