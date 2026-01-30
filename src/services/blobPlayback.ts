/**
 * Playback of pre-captured segment blobs via HTMLAudioElement.
 * Enables background playback (audio continues when app is minimized or screen locked).
 */

export interface BlobSegmentEntry {
  blobUrl: string | null;
  pauseAfter: number;
}

export interface BlobPlaybackCallbacks {
  onProgress?: (segmentIndex: number, total: number) => void;
  onEnd?: () => void;
  onPause?: () => void;
}

export class BlobPlaybackController {
  private segments: BlobSegmentEntry[] = [];
  private totalSegments: number = 0;
  private currentIndex: number = 0;
  private audio: HTMLAudioElement;
  private volume: number = 1;
  private playbackRate: number = 1;
  private isPlaying: boolean = false;
  private isStopped: boolean = false;
  private pauseAfterTimeout: number | null = null;
  private segmentDurations: number[] = [];
  private estimatedTotalDuration: number = 0;
  private callbacks: BlobPlaybackCallbacks = {};
  private timeUpdateInterval: number | null = null;

  constructor(estimatedDurationSeconds: number = 0) {
    this.audio = new Audio();
    this.estimatedTotalDuration = estimatedDurationSeconds;

    this.audio.onended = () => this.handleSegmentEnded();
    this.audio.onerror = () => {
      this.advanceToNextSegment();
    };
  }

  setCallbacks(callbacks: BlobPlaybackCallbacks): void {
    this.callbacks = callbacks;
  }

  setSegments(entries: BlobSegmentEntry[], totalForProgress: number): void {
    this.segments = entries;
    this.totalSegments = totalForProgress;
    this.segmentDurations = new Array(entries.length).fill(0);
  }

  play(): void {
    if (this.segments.length === 0) {
      this.callbacks.onEnd?.();
      return;
    }
    this.isStopped = false;
    this.isPlaying = true;
    this.startTimeUpdateInterval();
    this.playSegmentAt(this.currentIndex);
  }

  pause(): void {
    this.isPlaying = false;
    this.audio.pause();
    this.clearPauseAfterTimeout();
    this.stopTimeUpdateInterval();
    this.callbacks.onPause?.();
  }

  stop(): void {
    this.isStopped = true;
    this.isPlaying = false;
    this.audio.pause();
    this.audio.src = '';
    this.audio.currentTime = 0;
    this.currentIndex = 0;
    this.clearPauseAfterTimeout();
    this.stopTimeUpdateInterval();
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    this.audio.volume = this.volume;
  }

  setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    this.audio.playbackRate = this.playbackRate;
  }

  getCurrentTime(): number {
    let t = 0;
    for (let i = 0; i < this.currentIndex && i < this.segments.length; i++) {
      const d = this.segmentDurations[i] ?? 0;
      t += d + (this.segments[i].pauseAfter || 0) / 1000;
    }
    if (this.currentIndex < this.segments.length && this.audio.src) {
      t += this.audio.currentTime;
    }
    return Math.floor(t);
  }

  getDuration(): number {
    const known = this.segmentDurations.reduce((a, b) => a + b, 0);
    const pauses = this.segments.reduce((a, s) => a + (s.pauseAfter || 0) / 1000, 0);
    if (known > 0) return Math.floor(known + pauses);
    return Math.max(0, this.estimatedTotalDuration);
  }

  getCurrentSegmentIndex(): number {
    return this.currentIndex + 1;
  }

  getTotalSegments(): number {
    return this.totalSegments;
  }

  isPlaybackActive(): boolean {
    return this.isPlaying && !this.isStopped;
  }

  /**
   * Seek to a segment by index (0-based). Stops current segment and starts from the given segment.
   */
  seekToSegment(index: number): void {
    const i = Math.max(0, Math.min(index, this.segments.length - 1));
    this.clearPauseAfterTimeout();
    this.audio.pause();
    this.audio.src = '';
    this.currentIndex = i;
    if (this.isPlaying && !this.isStopped) {
      this.playSegmentAt(this.currentIndex);
    }
  }

  private startTimeUpdateInterval(): void {
    this.stopTimeUpdateInterval();
    this.timeUpdateInterval = window.setInterval(() => {
      if (!this.isPlaying || this.isStopped) return;
        // Time is derived from getCurrentTime(); UI can poll or we could emit.
      }, 500) as unknown as number;
  }

  private stopTimeUpdateInterval(): void {
    if (this.timeUpdateInterval !== null) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  private clearPauseAfterTimeout(): void {
    if (this.pauseAfterTimeout !== null) {
      clearTimeout(this.pauseAfterTimeout);
      this.pauseAfterTimeout = null;
    }
  }

  private playSegmentAt(index: number): void {
    if (this.isStopped || index >= this.segments.length) {
      this.isPlaying = false;
      this.stopTimeUpdateInterval();
      this.callbacks.onEnd?.();
      return;
    }

    this.currentIndex = index;
    this.callbacks.onProgress?.(index + 1, this.totalSegments);

    const entry = this.segments[index];
    if (entry.blobUrl) {
      this.audio.volume = this.volume;
      this.audio.playbackRate = this.playbackRate;
      this.audio.src = entry.blobUrl;
      this.audio.currentTime = 0;
      this.audio.onloadedmetadata = () => {
        this.segmentDurations[index] = this.audio.duration;
      };
      this.audio.play().catch(() => this.advanceToNextSegment());
    } else {
      this.segmentDurations[index] = 0;
      this.advanceToNextSegment();
    }
  }

  private handleSegmentEnded(): void {
    const entry = this.segments[this.currentIndex];
    if (entry && this.audio.duration && !isNaN(this.audio.duration)) {
      this.segmentDurations[this.currentIndex] = this.audio.duration;
    }
    const pauseAfter = entry?.pauseAfter ?? 0;
    if (pauseAfter > 0) {
      this.pauseAfterTimeout = window.setTimeout(() => {
        this.pauseAfterTimeout = null;
        this.advanceToNextSegment();
      }, pauseAfter);
    } else {
      this.advanceToNextSegment();
    }
  }

  private advanceToNextSegment(): void {
    if (this.isStopped) return;
    const next = this.currentIndex + 1;
    if (next >= this.segments.length) {
      this.isPlaying = false;
      this.stopTimeUpdateInterval();
      this.callbacks.onEnd?.();
      return;
    }
    this.playSegmentAt(next);
  }
}
