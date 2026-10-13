import "@testing-library/jest-dom/vitest";

// Mock SpeechSynthesis
if (typeof window !== "undefined") {
  window.speechSynthesis = {
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    getVoices: () => [
      { name: "English Voice", lang: "en-US", default: true }
    ],
    onvoiceschanged: null,
  };

  // Mock SpeechRecognition
  window.SpeechRecognition = class MockSpeechRecognition {
    start() {}
    stop() {}
    abort() {}
  };
  window.webkitSpeechRecognition = window.SpeechRecognition;

  // Mock window.URL.createObjectURL
  window.URL.createObjectURL = () => "blob:mock-url";
}
