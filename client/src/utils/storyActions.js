import { playText, pause, resume, stop } from './tts.js';

// Backward-compatible wrappers
export function speakText(text, opts) {
  const { ok } = playText(text, opts);
  return ok;
}

export function pauseSpeech() {
  pause();
}

export function resumeSpeech() {
  resume();
}

export function stopSpeech() {
  stop();
}


