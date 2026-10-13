/**
 * speechVoiceUtils.js
 * Comprehensive language-aware speech synthesis utilities for NeuroVoice AI.
 * Ensures native-sounding speech, strict language tag enforcement,
 * zero English fallback for Tamil utterances, and seamless backend
 * Neural Text-to-Speech integration when local Tamil voices are missing.
 */

import { synthesizeSpeechAudio } from "../services/api";

// Active HTML5 Audio instance for backend neural TTS playback
let _activeAudioInstance = null;

/**
 * Identifies if a voice is genuinely a Tamil voice by language tag or verified locale name.
 */
export const isTamilVoice = (voice) => {
  if (!voice) return false;
  const lang = (voice.lang || "").toLowerCase().trim();
  const name = (voice.name || "").toLowerCase().trim();

  // Exact Tamil language codes
  if (
    lang === "ta" ||
    lang === "ta-in" ||
    lang === "ta-lk" ||
    lang === "ta-sg" ||
    lang.startsWith("ta-") ||
    lang.startsWith("ta_")
  ) {
    return true;
  }

  // Common system voice names for Tamil (Google, Microsoft, Apple)
  if (
    name.includes("tamil") ||
    name.includes("valluvar") || // Microsoft Valluvar Online (Natural) - Tamil (India)
    name.includes("pallavi") ||  // Microsoft Pallavi Online (Natural) - Tamil (India)
    name.includes("vani") ||     // Apple Vani - Tamil (India)
    name.includes("latha")
  ) {
    return true;
  }

  return false;
};

/**
 * Finds the highest quality available voice for the target language.
 * IMPORTANT: NEVER returns an English or non-Tamil voice when Tamil is requested.
 */
export const getBestVoiceForLanguage = (voices = [], langCode = "en-US") => {
  if (!Array.isArray(voices) || voices.length === 0) return null;
  const cleanLang = (langCode || "en-US").toLowerCase().trim();

  if (cleanLang.startsWith("ta")) {
    // 1. Exact ta-IN match
    const exactTamil = voices.find((v) => (v.lang || "").toLowerCase() === "ta-in");
    if (exactTamil) return exactTamil;

    // 2. Any Tamil voice
    const anyTamil = voices.find((v) => isTamilVoice(v));
    if (anyTamil) return anyTamil;

    // RULE: If no native Tamil voice is installed, return null!
    // Never fall back to English or default synthesizer voice for Tamil text.
    return null;
  }

  // English voice selection: prioritize natural/online voices
  const exactEng = voices.find(
    (v) =>
      (v.lang || "").toLowerCase() === cleanLang &&
      ((v.name || "").includes("Natural") || (v.name || "").includes("Google"))
  );
  if (exactEng) return exactEng;

  const anyExactEng = voices.find((v) => (v.lang || "").toLowerCase() === cleanLang);
  if (anyExactEng) return anyExactEng;

  const anyEng = voices.find((v) => (v.lang || "").toLowerCase().startsWith("en"));
  if (anyEng) return anyEng;

  return voices[0] || null;
};

/**
 * Checks if a Tamil voice is available in the current browser/OS environment.
 */
export const hasTamilVoice = (voices = []) => {
  return Boolean(getBestVoiceForLanguage(voices, "ta-IN"));
};

/**
 * Asynchronously loads browser voices by waiting for the 'voiceschanged' event
 * if initial getVoices() is empty. Never hangs past timeoutMs.
 */
export const loadBrowserVoicesAsync = (timeoutMs = 1200) => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }

    const immediate = window.speechSynthesis.getVoices();
    if (Array.isArray(immediate) && immediate.length > 0) {
      resolve(immediate);
      return;
    }

    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        const currentVoices = window.speechSynthesis.getVoices();
        resolve(Array.isArray(currentVoices) ? currentVoices : []);
      }
    }, timeoutMs);

    window.speechSynthesis.onvoiceschanged = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        const loaded = window.speechSynthesis.getVoices();
        resolve(Array.isArray(loaded) ? loaded : []);
      }
    };
  });
};

/**
 * Returns development diagnostics about available voices without exposing
 * clinical or confusing technical details to patients.
 */
export const getVoiceDiagnostics = (voices = []) => {
  const tamilVoices = voices.filter(isTamilVoice);
  const englishVoices = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));

  return {
    totalVoices: voices.length,
    hasTamilVoice: tamilVoices.length > 0,
    tamilVoiceCount: tamilVoices.length,
    tamilVoicesList: tamilVoices.map((v) => ({ name: v.name, lang: v.lang, default: v.default })),
    selectedTamilVoice: getBestVoiceForLanguage(voices, "ta-IN")?.name || null,
    selectedEnglishVoice: getBestVoiceForLanguage(voices, "en-US")?.name || null,
    englishVoiceCount: englishVoices.length,
  };
};

/**
 * Immediately stops any currently playing audio from SpeechSynthesis or HTML5 Audio.
 */
export const stopAnyPlayingAudio = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }

  if (_activeAudioInstance) {
    try {
      _activeAudioInstance.pause();
      _activeAudioInstance.currentTime = 0;
    } catch (e) {}
    _activeAudioInstance = null;
  }
};

/**
 * Safely speaks an utterance using Web Speech Synthesis.
 * Refuses to play Tamil text through an English voice.
 */
export const speakUtterance = ({
  text,
  lang = "en-US",
  rate = 0.85,
  availableVoices = [],
  onStart,
  onEnd,
  onError,
  onNoTamilVoice,
}) => {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined" ||
    !text
  ) {
    if (onError) onError(new Error("SpeechSynthesis not supported"));
    return false;
  }

  stopAnyPlayingAudio();

  const isTamil = lang.toLowerCase().startsWith("ta");
  const selectedVoice = getBestVoiceForLanguage(availableVoices, lang);

  // CRITICAL SAFETY CHECK: Never speak Tamil with an English or non-Tamil voice!
  if (isTamil && (!selectedVoice || !isTamilVoice(selectedVoice))) {
    console.warn(
      "[NeuroVoice TTS Notice] No native Tamil voice is available on this browser/OS. Skipping synthetic fallback to prevent English-accent mispronunciation.",
      {
        text,
        lang,
        totalVoices: availableVoices.length,
      }
    );
    if (onNoTamilVoice) {
      onNoTamilVoice({
        reason: "no_tamil_voice",
        message: "A native Tamil voice is not installed on this browser or device.",
        text,
      });
    }
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = isTamil ? "ta-IN" : "en-US";
  // Moderate, gentle speech rate suitable for people with aphasia
  utterance.rate = isTamil ? Math.min(rate, 0.8) : rate;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  // Development diagnostic log
  if (process.env.NODE_ENV !== "production") {
    console.debug("[NeuroVoice TTS]", {
      text,
      lang: utterance.lang,
      voiceName: selectedVoice?.name || "System Default",
      voiceLang: selectedVoice?.lang || "N/A",
      rate: utterance.rate,
    });
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

/**
 * Universal Audio Playback Controller.
 * Plays speech using:
 * 1. Native browser Web Speech API if a genuine voice exists for the language.
 * 2. Backend Neural TTS service if Tamil is selected and no browser Tamil voice is installed.
 * 3. Graceful fallback notice if both are unavailable.
 */
export const playSpeechAudio = async ({
  text,
  lang = "en-US",
  rate = 0.8,
  voicePreference = null,
  availableVoices = [],
  onStart,
  onEnd,
  onError,
  onNoTamilVoice,
  onSourceDetermined,
}) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    return false;
  }

  stopAnyPlayingAudio();

  const isTamil = (lang || "").toLowerCase().startsWith("ta");

  // Strategy 1: If English or if the browser HAS a genuine Tamil voice, use Web Speech API
  const localVoice = getBestVoiceForLanguage(availableVoices, lang);
  if (!isTamil || (localVoice && isTamilVoice(localVoice))) {
    if (onSourceDetermined) onSourceDetermined("browser_local");
    return speakUtterance({
      text,
      lang,
      rate,
      availableVoices,
      onStart,
      onEnd,
      onError,
      onNoTamilVoice,
    });
  }

  // Strategy 2: For Tamil with no local browser voice, seamlessly invoke Backend Neural TTS
  try {
    if (onStart) onStart();
    if (onSourceDetermined) onSourceDetermined("backend_neural");

    const audioBlob = await synthesizeSpeechAudio({
      text: text.trim(),
      language: "ta-IN",
      voice: voicePreference || "ta-IN-ValluvarNeural",
      rate,
    });

    if (!audioBlob || audioBlob.size === 0) {
      throw new Error("Empty audio received from neural TTS service");
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    _activeAudioInstance = audio;

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      if (_activeAudioInstance === audio) {
        _activeAudioInstance = null;
      }
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      URL.revokeObjectURL(audioUrl);
      if (_activeAudioInstance === audio) {
        _activeAudioInstance = null;
      }
      if (onError) onError(e);
      if (onNoTamilVoice) {
        onNoTamilVoice({
          reason: "audio_playback_error",
          message: "Could not play neural audio stream.",
          text,
        });
      }
    };

    await audio.play();
    return true;
  } catch (backendErr) {
    console.warn(
      "[NeuroVoice TTS] Backend Neural TTS unavailable or network offline. Falling back to guidance notice.",
      backendErr
    );

    if (onError) onError(backendErr);
    if (onNoTamilVoice) {
      onNoTamilVoice({
        reason: "no_voice_available",
        message: "No local or cloud Tamil voice is currently available on this device.",
        text,
      });
    }
    return false;
  }
};
