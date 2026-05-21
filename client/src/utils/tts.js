let utteranceRef = null;
let speakingTextRef = '';

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function playText(text, { lang = 'en-US', rate = 1 } = {}) {
  if (!isSpeechSupported()) return { ok: false, reason: 'not_supported' };
  if (!text) return { ok: false, reason: 'empty_text' };

  stop();

  speakingTextRef = text;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = rate;

  utteranceRef = utter;
  window.speechSynthesis.speak(utter);

  return { ok: true };
}

export function pause() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.pause();
}

export function resume() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.resume();
}

export function stop() {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  utteranceRef = null;
  speakingTextRef = '';
}

export function getSpeakingText() {
  return speakingTextRef;
}

