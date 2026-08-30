import React, { useState } from "react";
import "./PhrasePractice.css";
import {
  checkSpeech,
  saveProgress,
  getStoredAuth,
} from "../services/api";

const phrases = [
  "Good morning",
  "How are you",
  "I am fine",
  "Thank you",
  "Please help me",
  "I need water",
  "I want food",
  "I am hungry",
  "I am thirsty",
  "My name is Divya",
  "Nice to meet you",
  "Can you help me",
  "Please say it again",
];

function PhrasePractice() {
  const [index, setIndex] = useState(0);
  const [spokenText, setSpokenText] = useState("");
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);

  const currentPhrase = phrases[index];

  // ==========================
  // AI Voice
  // ==========================
  const speakAI = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported.");
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = synth.getVoices();

      const englishVoice =
        voices.find((voice) => voice.lang.startsWith("en")) ||
        voices[0];

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () =>
        console.log("🔊 Speaking:", text);

      utterance.onend = () =>
        console.log("✅ Speech Finished");

      utterance.onerror = (e) =>
        console.error("Speech Error:", e.error);

      synth.speak(utterance);
    };

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => {
        speak();
        synth.onvoiceschanged = null;
      };
    } else {
      speak();
    }
  };

  // ==========================
  // Listen Phrase
  // ==========================
  const listenPhrase = () => {
    speakAI(currentPhrase);
  };

  // ==========================
  // AI Feedback
  // ==========================
  const speakFeedback = (message) => {
    speakAI(message);
  };

  // ==========================
  // Speech Recognition
  // ==========================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    window.speechSynthesis.cancel();

    recognition.onstart = () => {
      setListening(true);
      setSpokenText("");
      setResult(null);
    };

    recognition.onresult = async (event) => {
      const speech = event.results[0][0].transcript;

      setSpokenText(speech);

      try {
        const response = await checkSpeech(
          currentPhrase,
          speech
        );

        console.log("Speech Result:", response);

        setResult(response);

        if (response.accuracy >= 90) {
          speakFeedback(
            "Excellent pronunciation! Keep practicing."
          );
        } else if (response.accuracy >= 70) {
          speakFeedback(
            "Good job! You are improving."
          );
        } else {
          speakFeedback(
            "Keep practicing. Try again."
          );
        }

    const auth = getStoredAuth();

console.log("Auth:", auth);

if (auth?.id) {
  try {

    const save = await saveProgress({
      user_id: auth.id,
      practice_type: "phrase",
      accuracy: Math.round(response.accuracy),
    });

    console.log("✅ Progress Saved:", save);

  } catch (err) {

    console.error(
      "❌ Progress Error:",
      err.response?.data || err.message
    );

  }

} else {

  console.log("❌ User ID not found");

}
      } catch (error) {
        console.error(
          "Speech Error:",
          error.response?.data || error.message
        );

        speakFeedback(
          "Speech evaluation failed. Please try again."
        );
      }
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setListening(false);
      speakFeedback(
        "I could not hear you. Please try again."
      );
    };

    recognition.onend = () => {
      setListening(false);
      console.log("Recognition Ended");
    };

    setTimeout(() => {
      recognition.start();
    }, 300);
  };

  // ==========================
  // Next Phrase
  // ==========================
  const nextPhrase = () => {
    setIndex((prev) => (prev + 1) % phrases.length);
    setSpokenText("");
    setResult(null);
  };
    return (
    <div className="phrase-container">

      <h1>Phrase Practice</h1>

      <p className="subtitle">
        Listen and repeat the sentence with AI feedback
      </p>

      <div className="phrase-card">

        <h2>Say this:</h2>

        <h3>"{currentPhrase}"</h3>

        <button
          className="listen-btn"
          onClick={listenPhrase}
        >
          🔊 Listen
        </button>

        <button
          className="speak-btn"
          onClick={startListening}
          disabled={listening}
        >
          {listening
            ? "🎤 Listening..."
            : "🎤 Repeat"}
        </button>

        <button
          className="next-btn"
          onClick={nextPhrase}
        >
          ➡ Next Phrase
        </button>

      </div>

      {spokenText && (
        <div className="result-card">

          <h3>Your Speech</h3>

          <p>{spokenText}</p>

          {result && (
            <>
              <h3>
                Accuracy: {Math.round(result.accuracy)}%
              </h3>

              <p>{result.message}</p>
            </>
          )}

        </div>
      )}

    </div>
  );
}

export default PhrasePractice;