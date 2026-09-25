// Web Speech API and Audio Effects Utility for PrepMate AI Mentor & Voice Assistant

/**
 * Check if Text-to-Speech (SpeechSynthesis) is supported
 */
export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

/**
 * Check if Speech Recognition (STT) is supported
 */
export const isSpeechRecognitionSupported = () => {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
};

/**
 * Clean markdown symbols for natural speech reading
 */
export const cleanTextForSpeech = (text = '') => {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' [code block omitted] ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#+\s/g, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[-*+]\s/g, ' ')
    .replace(/>\s/g, '')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Speak text with Web Speech Synthesis API
 */
export const speakText = (
  rawText,
  {
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    lang = 'en-US',
    voiceName = '',
    onStart = () => {},
    onEnd = () => {},
    onError = () => {},
  } = {}
) => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('SpeechSynthesis is not supported in this browser environment.');
    onError(new Error('SpeechSynthesis not supported'));
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const textToSpeak = cleanTextForSpeech(rawText);
  if (!textToSpeak) {
    onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  utterance.lang = lang;

  // Pick suitable natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    let chosenVoice = null;
    if (voiceName) {
      chosenVoice = voices.find((v) => v.name.toLowerCase().includes(voiceName.toLowerCase()));
    }
    if (!chosenVoice) {
      // Prefer Google / Natural / Premium English voices
      chosenVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Daniel') ||
            v.name.includes('Premium'))
      ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];
    }
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
  }

  utterance.onstart = () => {
    onStart();
  };

  utterance.onend = () => {
    onEnd();
  };

  utterance.onerror = (e) => {
    // Avoid noise for manual user cancellation
    if (e.error === 'canceled' || e.error === 'interrupted') {
      onEnd();
    } else {
      console.error('Speech synthesis error:', e);
      onError(e);
    }
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * Stop any ongoing Text-to-Speech
 */
export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Setup Speech Recognition Instance
 */
export const createSpeechRecognizer = ({
  onResult = () => {},
  onInterim = () => {},
  onStart = () => {},
  onEnd = () => {},
  onError = () => {},
  lang = 'en-US',
  continuous = true,
} = {}) => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = continuous;
  recognition.interimResults = true;
  recognition.lang = lang;
  recognition.maxAlternatives = 1;

  let accumulatedFinal = '';

  recognition.onstart = () => {
    onStart();
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        accumulatedFinal += (accumulatedFinal ? ' ' : '') + transcript.trim();
      } else {
        interimTranscript += transcript;
      }
    }
    onInterim(interimTranscript);
    if (accumulatedFinal) {
      onResult(accumulatedFinal, interimTranscript);
    }
  };

  recognition.onerror = (event) => {
    // 'no-speech' is common when pausing to think, don't break session
    if (event.error !== 'no-speech') {
      console.warn('Speech recognition status:', event.error);
      onError(event.error);
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        accumulatedFinal = '';
        recognition.start();
      } catch (err) {
        // Recognition might already be running
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (err) {}
    },
    abort: () => {
      try {
        recognition.abort();
      } catch (err) {}
    },
    reset: () => {
      accumulatedFinal = '';
    },
  };
};

/**
 * Subtle synthesized Web Audio sound effects for sleek feedback
 */
export const playSoundEffect = (type = 'ding') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'start') {
      // Upward chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'stop') {
      // Downward chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'success') {
      // Success bell chord
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    // Ignore audio context autoplay restrictions
  }
};
