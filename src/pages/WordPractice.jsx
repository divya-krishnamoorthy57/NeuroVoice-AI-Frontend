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

  const speakAI = (text) => {

    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.8;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);

  };

  const listenWord = () => {

    speakAI(currentWord);

  };

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

    recognition.start();

    recognition.onresult = async (event) => {

      const text = event.results[0][0].transcript;

      setSpokenText(text);

      setStatus("Checking pronunciation...");

      try {

        const result = await checkSpeech(
          currentWord,
          text
        );

        const score = Math.round(result.accuracy);

        setAccuracy(score);

       const auth = getStoredAuth();

console.log("Auth:", auth);

if (auth?.id) {
  try {
    await saveProgress({
      user_id: auth.id,
      practice_type: "word",
      accuracy: Math.round(score),
    });

    console.log("✅ Word progress saved");
  } catch (err) {
    console.error(
      "Word Progress Error:",
      err.response?.data || err.message
    );
  }
}

        let message = "";

        if (score >= 90) {

          message =
            "Excellent pronunciation!";

        } else if (score >= 70) {

          message =
            "Good attempt. Speak a little clearer.";

        } else {

          message =
            "Keep practicing. Listen and try again.";

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

      console.log(event.error);

      setStatus("❌ " + event.error);

      speakAI(
        "I could not hear you. Please try again."
      );

    };

    recognition.onend = () => {

      console.log("Recognition ended");

    };

  };

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
            <b>Your Speech:</b>
            <br />
            {spokenText || "-"}
          </p>

          {accuracy !== null && (

            <p className="accuracy">
              Accuracy: {accuracy}%
            </p>

          )}

          {feedback && (

            <p className="feedback">
              💬 {feedback}
            </p>

          )}

        </div>

        <button
          className="next-btn"
          onClick={nextWord}
        >
          Next Word ➡️
        </button>

      </div>

    </div>

  );

}

export default WordPractice;