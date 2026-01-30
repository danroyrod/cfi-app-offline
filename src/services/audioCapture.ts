/**
 * Capture Speech Synthesis output to audio blobs via tab capture.
 * Used for background playback: play blobs via HTMLAudioElement so audio continues when app is in background.
 * Requires user to grant getDisplayMedia (share tab with audio) once per session.
 */

/**
 * Request a media stream that captures this tab's audio (and optionally video).
 * User must select "This tab" and enable "Share audio" in the picker.
 * Call releaseTabAudioStream(stream) when done to stop tracks.
 */
export async function requestTabAudioStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('Tab audio capture is not supported in this browser.');
  }
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  });
  return stream;
}

/**
 * Stop all tracks on a stream. Call when done capturing to release the capture.
 */
export function releaseTabAudioStream(stream: MediaStream): void {
  stream.getTracks().forEach(track => track.stop());
}

/**
 * Capture one segment of TTS to a blob by playing the utterance while recording the tab audio.
 * Requires an active tab-capture stream (from requestTabAudioStream).
 * Returns null if text is empty (caller should use pause-only segment).
 */
export function captureSegmentToBlob(
  stream: MediaStream,
  text: string,
  options: {
    voice?: SpeechSynthesisVoice | null;
    rate?: number;
    volume?: number;
  }
): Promise<Blob | null> {
  if (!text || !text.trim()) {
    return Promise.resolve(null);
  }

  const synthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = options.voice || null;
  utterance.rate = options.rate ?? 1;
  utterance.volume = Math.max(0, Math.min(1, options.volume ?? 1));
  utterance.lang = 'en-US';

  return new Promise<Blob | null>((resolve, reject) => {
    const chunks: Blob[] = [];
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';
    const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 128000 });

    recorder.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      if (chunks.length === 0) {
        resolve(null);
        return;
      }
      resolve(new Blob(chunks, { type: mimeType }));
    };

    recorder.onerror = () => {
      reject(new Error('Recording failed'));
    };

    utterance.onend = () => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    };

    utterance.onerror = () => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
      resolve(null);
    };

    recorder.start(100);
    synthesis.speak(utterance);
  });
}

/**
 * Check if tab audio capture is available (getDisplayMedia with audio).
 */
export function isTabAudioCaptureSupported(): boolean {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    'getDisplayMedia' in navigator.mediaDevices &&
    typeof MediaRecorder !== 'undefined'
  );
}
