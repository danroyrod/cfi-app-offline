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
  private currentVoice: SpeechSynthesisVoice | null = null;
  private currentRate: number = 1.0;
  private currentVolume: number = 1.0;
  private isPlaying: boolean = false;
  
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  /**
   * Score a voice for quality (higher is better)
   */
  private scoreVoiceQuality(voice: SpeechSynthesisVoice): number {
    let score = 0;
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();

    // Language quality (prefer en-US over generic en)
    if (lang === 'en-us') score += 100;
    else if (lang.startsWith('en')) score += 50;

    // Premium/Neural voice indicators (highest quality)
    if (name.includes('neural')) score += 200;
    if (name.includes('premium')) score += 150;
    if (name.includes('enhanced')) score += 100;

    // Known high-quality voice providers
    if (name.includes('google')) {
      score += 80;
      if (name.includes('us english')) score += 50;
      if (name.includes('neural')) score += 100;
    }
    if (name.includes('microsoft')) {
      score += 70;
      // Microsoft Neural voices are excellent
      if (name.includes('aria') || name.includes('jenny') || name.includes('guy')) score += 100;
      if (name.includes('david') || name.includes('zira')) score += 60;
    }
    if (name.includes('amazon') || name.includes('polly')) {
      score += 90;
      if (name.includes('neural')) score += 100;
    }
    if (name.includes('apple')) {
      score += 75;
      // macOS premium voices
      if (name.includes('samantha') || name.includes('alex') || name.includes('daniel')) score += 80;
    }

    // Voice type indicators
    if (name.includes('female') || name.includes('male')) score += 10;
    
    // Avoid system/default voices (usually lower quality)
    if (name.includes('system') || name.includes('default')) score -= 50;

    return score;
  }

  /**
   * Load available voices and select the best one
   */
  private loadVoices(): void {
    const setVoice = () => {
      const voices = this.synthesis.getVoices();
      
      if (voices.length === 0) {
        return;
      }

      // Enhanced list of preferred high-quality voices (in priority order)
      const preferredVoices = [
        // Google Neural voices (highest quality)
        'Google US English (Neural)',
        'Google US English',
        'Google en-US Neural',
        // Microsoft Neural voices
        'Microsoft Aria',
        'Microsoft Jenny',
        'Microsoft Guy',
        'Microsoft David',
        'Microsoft Zira',
        // Amazon/Polly voices
        'Amazon Polly',
        'Polly Neural',
        // Apple/macOS premium voices
        'Samantha',
        'Alex',
        'Daniel',
        'Victoria',
        // Other known quality voices
        'Karen', // macOS
        'Moira', // macOS
        'Tessa', // macOS
      ];

      // First, try exact or partial matches from preferred list
      for (const preferred of preferredVoices) {
        const voice = voices.find(v => 
          v.name.toLowerCase().includes(preferred.toLowerCase())
        );
        if (voice) {
          this.defaultVoice = voice;
          console.log('🎤 Selected preferred voice:', voice.name);
          return;
        }
      }

      // If no preferred voice found, score all English voices and pick the best
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      if (englishVoices.length > 0) {
        // Sort by quality score (highest first)
        englishVoices.sort((a, b) => {
          const scoreA = this.scoreVoiceQuality(a);
          const scoreB = this.scoreVoiceQuality(b);
          return scoreB - scoreA; // Descending order
        });

        this.defaultVoice = englishVoices[0];
        console.log('🎤 Selected highest-scored voice:', this.defaultVoice.name, 
          `(score: ${this.scoreVoiceQuality(this.defaultVoice)})`);
        return;
      }

      // Final fallback: any available voice
      this.defaultVoice = voices[0];
      console.log('🎤 Using fallback voice:', this.defaultVoice?.name);
    };

    setVoice();
    
    // Voice list loads asynchronously
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = setVoice;
    }
  }

  /**
   * Get all available voices, sorted by quality (best first)
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    const voices = this.synthesis.getVoices().filter(v => v.lang.startsWith('en'));
    
    // Sort by quality score (highest first) so users see best voices at the top
    return voices.sort((a, b) => {
      const scoreA = this.scoreVoiceQuality(a);
      const scoreB = this.scoreVoiceQuality(b);
      return scoreB - scoreA; // Descending order
    });
  }

  /**
   * Generate a lite podcast-style script from a lesson plan (summary version)
   * Includes: Objectives, Key Points (no full teaching scripts), Key Teaching Points, Completion Standards
   */
  generateLitePodcastScript(lesson: LessonPlan, areaName: string, lessonNumber: number, totalLessons: number): PodcastScript {
    const segments: AudioSegment[] = [];

    // INTRO
    segments.push({
      text: 'Welcome to CFI Training Audio - Lite Version.',
      type: 'intro',
      pauseAfter: 800
    });

    segments.push({
      text: `Today's lesson: ${lesson.title}.`,
      type: 'title',
      pauseAfter: 1000
    });

    segments.push({
      text: `This is lesson ${lessonNumber} of ${totalLessons} in the ${areaName} series.`,
      type: 'intro',
      pauseAfter: 1200
    });

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

    // KEY POINTS FROM EACH LESSON COMPONENT (no full teaching scripts)
    if (lesson.teachingScript && lesson.teachingScript.length > 0) {
      segments.push({
        text: 'Key Points.',
        type: 'transition',
        pauseAfter: 700
      });

      // Process each phase but only include key points
      lesson.teachingScript.forEach((script, scriptIndex) => {
        if (script.keyPoints && script.keyPoints.length > 0) {
          // Remove time durations from phase names (e.g., "Introduction (10 minutes)" -> "Introduction")
          const phaseName = script.phase.replace(/\s*\([^)]*\)\s*/g, '').trim();
          segments.push({
            text: `${phaseName} - Key Points.`,
            type: 'transition',
            pauseAfter: 500
          });

          script.keyPoints.forEach((point, pointIndex) => {
            segments.push({
              text: this.cleanTextForSpeech(point),
              type: 'content',
              pauseAfter: pointIndex === script.keyPoints.length - 1 ? 700 : 500
            });
          });

          segments.push({
            text: '',
            type: 'content',
            pauseAfter: scriptIndex === lesson.teachingScript.length - 1 ? 1000 : 700
          });
        }
      });
    }

    // KEY TEACHING POINTS
    if (lesson.keyTeachingPoints && lesson.keyTeachingPoints.length > 0) {
      segments.push({
        text: 'Key Teaching Points.',
        type: 'transition',
        pauseAfter: 700
      });

      lesson.keyTeachingPoints.forEach((point, index) => {
        segments.push({
          text: `${this.cleanTextForSpeech(point)}`,
          type: 'content',
          pauseAfter: index === lesson.keyTeachingPoints.length - 1 ? 800 : 600
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1200
      });
    }

    // COMPLETION STANDARDS
    if (lesson.completionStandards && lesson.completionStandards.length > 0) {
      segments.push({
        text: 'Completion Standards.',
        type: 'transition',
        pauseAfter: 700
      });

      lesson.completionStandards.forEach((standard, index) => {
        let standardText = this.cleanTextForSpeech(standard.standard);
        if (standard.tolerance) {
          standardText += ` Tolerance: ${standard.tolerance}.`;
        }
        // ACS Reference/task code excluded from audio - not needed for listening
        segments.push({
          text: standardText,
          type: 'content',
          pauseAfter: index === lesson.completionStandards.length - 1 ? 800 : 600
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1200
      });
    }

    // OUTRO
    segments.push({
      text: `That concludes the lite version of ${lesson.title}.`,
      type: 'outro',
      pauseAfter: 1000
    });

    // Estimate duration (rough calculation: ~150 words per minute)
    const totalWords = segments.reduce((sum, seg) => sum + seg.text.split(' ').length, 0);
    const estimatedDuration = Math.ceil((totalWords / 150) * 60) + 20; // Add buffer

    return {
      segments,
      estimatedDuration,
      lessonId: lesson.id,
      lessonTitle: lesson.title
    };
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
      pauseAfter: 800
    });

    segments.push({
      text: `Today's lesson: ${lesson.title}.`,
      type: 'title',
      pauseAfter: 1000
    });

    segments.push({
      text: `This is lesson ${lessonNumber} of ${totalLessons} in the ${areaName} series.`,
      type: 'intro',
      pauseAfter: 1200
    });

    // OVERVIEW
    if (lesson.overview) {
      segments.push({
        text: 'Overview.',
        type: 'transition',
        pauseAfter: 600
      });
      
      segments.push({
        text: this.cleanTextForSpeech(lesson.overview),
        type: 'content',
        pauseAfter: 1200
      });
    }

    // OBJECTIVES
    if (lesson.objectives && lesson.objectives.length > 0) {
      segments.push({
        text: 'Learning Objectives.',
        type: 'transition',
        pauseAfter: 600
      });

      lesson.objectives.forEach((obj, index) => {
        segments.push({
          text: this.cleanTextForSpeech(obj),
          type: 'content',
          pauseAfter: index === lesson.objectives.length - 1 ? 800 : 600
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1200
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
      lesson.teachingScript.forEach((script, scriptIndex) => {
        // Remove time durations from phase names (e.g., "Introduction (10 minutes)" -> "Introduction")
        const phaseName = script.phase.replace(/\s*\([^)]*\)\s*/g, '').trim();
        segments.push({
          text: `${phaseName}.`,
          type: 'transition',
          pauseAfter: 700
        });

        // Instructor actions
        if (script.instructorActions && script.instructorActions.length > 0) {
          segments.push({
            text: 'Instructor actions.',
            type: 'transition',
            pauseAfter: 500
          });

          script.instructorActions.forEach((action, actionIndex) => {
            segments.push({
              text: this.cleanTextForSpeech(action),
              type: 'content',
              pauseAfter: actionIndex === script.instructorActions.length - 1 ? 600 : 500
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
            pauseAfter: 500
          });

          script.keyPoints.forEach((point, pointIndex) => {
            segments.push({
              text: this.cleanTextForSpeech(point),
              type: 'content',
              pauseAfter: pointIndex === script.keyPoints.length - 1 ? 700 : 500
            });
          });
        }

        segments.push({
          text: '',
          type: 'content',
          pauseAfter: scriptIndex === lesson.teachingScript.length - 1 ? 1200 : 1000
        });
      });
    }

    // KEY TEACHING POINTS (from improved lesson plans)
    if (lesson.keyTeachingPoints && lesson.keyTeachingPoints.length > 0) {
      segments.push({
        text: 'Key Teaching Points.',
        type: 'transition',
        pauseAfter: 700
      });

      lesson.keyTeachingPoints.forEach((point, index) => {
        segments.push({
          text: `${this.cleanTextForSpeech(point)}`,
          type: 'content',
          pauseAfter: index === lesson.keyTeachingPoints.length - 1 ? 800 : 600
        });
      });

      segments.push({
        text: '',
        type: 'content',
        pauseAfter: 1200
      });
    }

    // COMMON ERRORS, SAFETY CONSIDERATIONS, and COMPLETION STANDARDS
    // Excluded from audio lessons - focus on overview, objectives, teaching script, and key points only

    // OUTRO
    segments.push({
      text: `That concludes ${lesson.title}.`,
      type: 'outro',
      pauseAfter: 1000
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
      // Add natural pauses: add commas before conjunctions in long sentences
      .replace(/\s+and\s+/gi, ', and ')
      .replace(/\s+or\s+/gi, ', or ')
      .replace(/\s+but\s+/gi, ', but ')
      // Add pauses after introductory phrases (if sentence is long)
      .replace(/(\w+),(\s+\w+\s+[A-Z])/g, '$1,$2') // Add comma before capitalized words (likely new clause)
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Split long sentences into more natural chunks for better speech flow
   */
  private chunkTextForNaturalSpeech(text: string): string[] {
    // If text is short enough, return as single chunk
    if (text.length <= 150) {
      return [text];
    }

    const chunks: string[] = [];
    const sentences = text.split(/([.!?]+\s+)/).filter(s => s.trim().length > 0);
    
    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i];
      
      // If sentence is very long (>200 chars), try to split at natural break points
      if (sentence.length > 200) {
        // Split at commas, semicolons, or conjunctions
        const breakPoints = [
          /,\s+/g,
          /;\s+/g,
          /\s+and\s+/gi,
          /\s+or\s+/gi,
          /\s+but\s+/gi,
          /\s+however\s+/gi,
          /\s+therefore\s+/gi,
        ];

        let split = false;
        for (const pattern of breakPoints) {
          const matches = [...sentence.matchAll(pattern)];
          if (matches.length > 0) {
            // Find the middle break point for balanced chunks
            const midPoint = Math.floor(matches.length / 2);
            if (midPoint > 0) {
              const splitIndex = matches[midPoint].index! + matches[midPoint][0].length;
              chunks.push(sentence.substring(0, splitIndex).trim());
              sentence = sentence.substring(splitIndex).trim();
              split = true;
              break;
            }
          }
        }

        if (!split) {
          // If no natural break point, split at middle space
          const midSpace = sentence.lastIndexOf(' ', Math.floor(sentence.length / 2));
          if (midSpace > 0) {
            chunks.push(sentence.substring(0, midSpace).trim() + ',');
            sentence = sentence.substring(midSpace).trim();
          }
        }
      }
      
      if (sentence.trim().length > 0) {
        chunks.push(sentence.trim());
      }
    }

    return chunks.length > 0 ? chunks : [text];
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
      utterance.pitch = options?.pitch !== undefined ? options.pitch : 0.95; // Slightly lower pitch for more natural sound
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
   * Set current volume (for mid-playback changes)
   */
  setCurrentVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
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
   * Get current volume
   */
  getCurrentVolume(): number {
    return this.currentVolume;
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
    
    // Initialize current voice, rate, and volume from options
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
        // Chunk long text for more natural speech flow
        const textChunks = this.chunkTextForNaturalSpeech(segment.text);
        
        for (let j = 0; j < textChunks.length; j++) {
          const chunk = textChunks[j];
          
          // Use current voice, rate, and volume (which can be updated mid-playback)
          await this.textToSpeech(chunk, {
            voice: this.currentVoice || undefined,
            rate: this.currentRate,
            pitch: 0.95, // Natural pitch
            volume: this.currentVolume
          });
          
          // Add brief pause between chunks (except for last chunk)
          if (j < textChunks.length - 1) {
            await this.pause(200); // Brief pause between chunks
          }
        }
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

