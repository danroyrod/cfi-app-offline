/**
 * TTS provider abstraction so we can swap browser SpeechSynthesis for cloud TTS later
 * (e.g. Google Cloud TTS, Amazon Polly, Azure Speech) without changing playback code.
 *
 * Current: BrowserTTSProvider (Web Speech API) is used via AudioLessonService.
 * Future: CloudTTSProvider can implement this interface and return audio blobs/bytes;
 * playback already accepts blobs (blobPlayback.ts), so cloud TTS would feed the same pipeline.
 */

export interface TTSOptions {
  voiceId?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * Synthesize text to audio. Returns a Blob (or ArrayBuffer) for the segment.
 * Browser TTS uses SpeechSynthesis and capture; cloud TTS would call an API and return the response.
 */
export interface ITTSProvider {
  synthesize(text: string, options: TTSOptions): Promise<Blob | ArrayBuffer | null>;
  /** Optional: list of voice IDs or names this provider supports */
  getVoiceIds?(): string[] | Promise<string[]>;
}
