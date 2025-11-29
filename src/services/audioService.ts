// Audio Service for CFI Training Lessons
// Converts lesson plans to high-quality audio podcasts

import type { LessonPlan } from '../lessonPlanTypes';

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
  
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  /**
   * Load available voices and select the best one
   */
  private loadVoices(): void {
    const setVoice = () => {
      const voices = this.synthesis.getVoices();
      
      // Prefer high-quality English voices
      const preferredVoices = [
        'Google US English',
        'Microsoft David',
        'Microsoft Zira',
        'Alex', // macOS
        'Samantha', // macOS
      ];

      for (const preferred of preferredVoices) {
        const voice = voices.find(v => v.name.includes(preferred));
        if (voice) {
          this.defaultVoice = voice;
          return;
        }
      }

      // Fallback to any English voice
      this.defaultVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    };

    setVoice();
    
    // Voice list loads asynchronously
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = setVoice;
    }
  }

  /**
   * Get all available voices
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices().filter(v => v.lang.startsWith('en'));
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
          text: `${script.phase}.`,
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

        // Student actions
        if (script.studentActions && script.studentActions.length > 0) {
          segments.push({
            text: 'Student actions.',
            type: 'transition',
            pauseAfter: 200
          });

          script.studentActions.forEach(action => {
            segments.push({
              text: this.cleanTextForSpeech(action),
              type: 'content',
              pauseAfter: 400
            });
          });
        }

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

    // COMMON ERRORS
    if (lesson.commonErrors && lesson.commonErrors.length > 0) {
      segments.push({
        text: 'Common Errors to Avoid.',
        type: 'transition',
        pauseAfter: 500
      });

      lesson.commonErrors.forEach((error, idx) => {
        segments.push({
          text: `Error ${idx + 1}: ${this.cleanTextForSpeech(error)}`,
          type: 'content',
          pauseAfter: 600
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1000
      });
    }

    // SAFETY CONSIDERATIONS
    if (lesson.safetyConsiderations && lesson.safetyConsiderations.length > 0) {
      segments.push({
        text: 'Safety Considerations.',
        type: 'transition',
        pauseAfter: 500
      });

      lesson.safetyConsiderations.forEach(consideration => {
        segments.push({
          text: this.cleanTextForSpeech(consideration),
          type: 'content',
          pauseAfter: 400
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1000
      });
    }

    // COMPLETION STANDARDS
    if (lesson.completionStandards && lesson.completionStandards.length > 0) {
      segments.push({
        text: 'Completion Standards.',
        type: 'transition',
        pauseAfter: 500
      });

      lesson.completionStandards.forEach(standard => {
        // Handle both string and object formats
        const standardText = typeof standard === 'string' ? standard : standard.standard || String(standard);
        segments.push({
          text: this.cleanTextForSpeech(standardText),
          type: 'content',
          pauseAfter: 400
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1000
      });
    }

    // OUTRO
    segments.push({
      text: `That concludes ${lesson.title}.`,
      type: 'outro',
      pauseAfter: 700
    });

    segments.push({
      text: 'Thank you for learning with CFI Training Audio.',
      type: 'outro',
      pauseAfter: 500
    });

    // Estimate duration (rough calculation: ~150 words per minute)
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
   * Speak an entire podcast script
   */
  async speakPodcastScript(
    script: PodcastScript,
    options?: {
      voice?: SpeechSynthesisVoice;
      rate?: number;
      onProgress?: (segment: number, total: number) => void;
      onPause?: () => void;
    }
  ): Promise<void> {
    console.log('📜 Starting speakPodcastScript with', script.segments.length, 'segments');
    
    // Cancel any existing speech to prevent queue issues
    this.synthesis.cancel();
    
    for (let i = 0; i < script.segments.length; i++) {
      const segment = script.segments[i];
      
      console.log(`📜 Processing segment ${i + 1}/${script.segments.length}: "${segment.text?.substring(0, 50)}..."`);
      
      if (options?.onProgress) {
        options.onProgress(i + 1, script.segments.length);
      }

      if (segment.text) {
        await this.textToSpeech(segment.text, {
          voice: options?.voice,
          rate: options?.rate
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

