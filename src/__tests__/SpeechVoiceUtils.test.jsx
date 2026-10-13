import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isTamilVoice,
  getBestVoiceForLanguage,
  hasTamilVoice,
  getVoiceDiagnostics,
  speakUtterance,
  playSpeechAudio,
  loadBrowserVoicesAsync,
  stopAnyPlayingAudio,
} from "../utils/speechVoiceUtils";
import * as apiService from "../services/api";

describe("Speech Voice Utilities & Native Tamil TTS", () => {
  const mockVoices = [
    { name: "Microsoft David Desktop - English (United States)", lang: "en-US", default: true },
    { name: "Microsoft Zira Desktop - English (United States)", lang: "en-US", default: false },
    { name: "Google US English", lang: "en-US", default: false },
    { name: "Microsoft Valluvar Online (Natural) - Tamil (India)", lang: "ta-IN", default: false },
    { name: "Google தமிழ்", lang: "ta-IN", default: false },
  ];

  const englishOnlyVoices = [
    { name: "Microsoft David Desktop - English (United States)", lang: "en-US", default: true },
    { name: "Microsoft Zira Desktop - English (United States)", lang: "en-US", default: false },
  ];

  beforeEach(() => {
    window.speechSynthesis = {
      cancel: vi.fn(),
      speak: vi.fn(),
      getVoices: vi.fn(() => mockVoices),
    };
    window.SpeechSynthesisUtterance = vi.fn(function (text) {
      this.text = text;
      this.lang = "en-US";
      this.rate = 1;
      this.voice = null;
    });
  });

  it("accurately identifies Tamil voices by language code and known names", () => {
    expect(isTamilVoice({ name: "Google தமிழ்", lang: "ta-IN" })).toBe(true);
    expect(isTamilVoice({ name: "Microsoft Valluvar Online (Natural) - Tamil (India)", lang: "ta-IN" })).toBe(true);
    expect(isTamilVoice({ name: "Apple Vani", lang: "ta-IN" })).toBe(true);
    expect(isTamilVoice({ name: "Microsoft David", lang: "en-US" })).toBe(false);
    expect(isTamilVoice(null)).toBe(false);
  });

  it("selects the best native Tamil voice when available", () => {
    const selected = getBestVoiceForLanguage(mockVoices, "ta-IN");
    expect(selected).not.toBeNull();
    expect(selected.lang).toBe("ta-IN");
    expect(isTamilVoice(selected)).toBe(true);
  });

  it("CRITICAL RULE: Never returns an English voice when Tamil is requested and no Tamil voice exists", () => {
    const selected = getBestVoiceForLanguage(englishOnlyVoices, "ta-IN");
    // MUST return null, not Microsoft David or English default!
    expect(selected).toBeNull();
    expect(hasTamilVoice(englishOnlyVoices)).toBe(false);
  });

  it("selects high-quality English voice when English is requested", () => {
    const selected = getBestVoiceForLanguage(mockVoices, "en-US");
    expect(selected).not.toBeNull();
    expect(selected.lang).toBe("en-US");
  });

  it("generates development diagnostics accurately", () => {
    const diag = getVoiceDiagnostics(mockVoices);
    expect(diag.totalVoices).toBe(5);
    expect(diag.hasTamilVoice).toBe(true);
    expect(diag.tamilVoiceCount).toBe(2);
    expect(diag.selectedTamilVoice).toContain("Valluvar");

    const diagEngOnly = getVoiceDiagnostics(englishOnlyVoices);
    expect(diagEngOnly.hasTamilVoice).toBe(false);
    expect(diagEngOnly.selectedTamilVoice).toBeNull();
  });

  it("refuses to speak Tamil through an English voice and calls onNoTamilVoice callback", () => {
    const onNoTamilVoice = vi.fn();
    const result = speakUtterance({
      text: "தண்ணீர்",
      lang: "ta-IN",
      availableVoices: englishOnlyVoices,
      onNoTamilVoice,
    });

    expect(result).toBe(false);
    expect(onNoTamilVoice).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "no_tamil_voice",
      })
    );
  });

  it("playSpeechAudio uses local browser voice when genuine Tamil voice exists", async () => {
    const onSourceDetermined = vi.fn();
    const result = await playSpeechAudio({
      text: "தண்ணீர்",
      lang: "ta-IN",
      availableVoices: mockVoices,
      onSourceDetermined,
    });

    expect(result).toBe(true);
    expect(onSourceDetermined).toHaveBeenCalledWith("browser_local");
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it("playSpeechAudio invokes fallback callback when both local voice and neural service fail", async () => {
    vi.spyOn(apiService, "synthesizeSpeechAudio").mockRejectedValue(new Error("Network Error"));
    const onNoTamilVoice = vi.fn();

    const result = await playSpeechAudio({
      text: "தண்ணீர்",
      lang: "ta-IN",
      availableVoices: englishOnlyVoices,
      onNoTamilVoice,
    });

    expect(result).toBe(false);
    expect(onNoTamilVoice).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "no_voice_available",
      })
    );
  });
});
