import React, { useState } from "react";
import "./WordPractice.css";
import {
  checkSpeech,
  saveProgress,
  getStoredAuth,
} from "../services/api";

const words = [
  "Apple",
  "Banana",
  "Orange",
  "Mango",
  "Grapes",
  "Dog",
  "Cat",
  "Cow",
  "Lion",
  "Elephant",
  "Water",
  "Medicine",
  "Hello",
  "Thank you",
];

function WordPractice() {
  const [currentWord, setCurrentWord] = useState(
    words[Math.floor(Math.random() * words.length)]
  );

  const [spokenText, setSpokenText] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");

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

      utterance.onstart = () => {
        console.log("🔊 Speaking:", text);
      };

      utterance.onend = () => {
        console.log("✅ Speech Finished");
      };

      utterance.onerror = (event) => {
        console.error("Speech Error:", event.error);
      };

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
  // Listen Word
  // ==========================
  const listenWord = () => {
    speakAI(currentWord);
  };

  // ==========================
  // Speech Recognition
  // ==========================
  const startSpeaking = () => {
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

    setStatus("🎧 Listening...");

    // Stop speech before starting recognition
    window.speechSynthesis.cancel();

    setTimeout(() => {
      recognition.start();
    }, 300);

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;

      setSpokenText(text);
      setStatus("Checking pronunciation...");

      try {
        const result = await checkSpeech(currentWord, text);

        const score = Math.round(result.accuracy);
        setAccuracy(score);

        const auth = getStoredAuth();

        if (auth?.id) {
          try {
            await saveProgress({
              user_id: auth.id,
              practice_type: "word",
              accuracy: score,
            });

            console.log("✅ Progress Saved");
          } catch (err) {
            console.error(
              "Progress Error:",
              err.response?.data || err.message
            );
          }
        }

        let message = "";

        if (score >= 90) {
          message = "Excellent pronunciation!";
        } else if (score >= 70) {
          message = "Good attempt. Speak a little clearer.";
        } else {
          message = "Keep practicing. Listen and try again.";
        }

        setFeedback(message);
        setStatus("Completed ✅");

        speakAI(message);

      } catch (error) {
        console.error(
          "Speech Error:",
          error.response?.data || error.message
        );

        setStatus("Speech evaluation failed ❌");

        speakAI(
          "Speech evaluation failed. Please try again."
        );
      }
    };

    recognition.onerror = (event) => {
      console.error(event.error);

      setStatus("❌ " + event.error);

      speakAI(
        "I could not hear you. Please try again."
      );
    };

    recognition.onend = () => {
      console.log("Recognition Ended");
    };
  };

  // ==========================
  // Next Word
  // ==========================
  const nextWord = () => {
    let newWord;

    do {
      newWord =
        words[
          Math.floor(
            Math.random() * words.length
          )
        ];
    } while (newWord === currentWord);

    setCurrentWord(newWord);
    setSpokenText("");
    setAccuracy(null);
    setFeedback("");
    setStatus("");

    setTimeout(() => {
      speakAI(newWord);
    }, 300);
  };
    return (
    <div className="word-container">
      <div className="word-card">

        <h1>Word Practice</h1>

        <p className="instruction">
          Listen and pronounce the word clearly
        </p>

        <div className="word-box">
          {currentWord}
        </div>

        <button
          className="listen-btn"
          onClick={listenWord}
        >
          🔊 Hear Word
        </button>

        <button
          className="speak-btn"
          onClick={startSpeaking}
        >
          🎤 Start Speaking
        </button>

        <div className="result-box">

          <h3>{status}</h3>

          <p>
            <strong>Your Speech:</strong>
            <br />
            {spokenText || "-"}
          </p>

          {accuracy !== null && (
            <p className="accuracy">
              Accuracy: <strong>{accuracy}%</strong>
            </p>
          )}

          {feedback && (
            <p className="feedback">
              💬 {feedback}
            </p>
          )}

        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="next-btn"
            onClick={nextWord}
          >
            Next Word ➡️
          </button>

          {/* Temporary voice test button */}
          <button
            className="listen-btn"
            onClick={() =>
              speakAI("Hello Divya, welcome to NeuroVoice")
            }
          >
            🔊 Test Voice
          </button>
        </div>

      </div>
    </div>
  );
}

export default WordPractice;