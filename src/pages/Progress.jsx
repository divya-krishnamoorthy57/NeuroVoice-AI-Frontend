import React, { useEffect, useState } from "react";
import { getProgress, getStoredAuth } from "../services/api";

function Progress() {
  const [progress, setProgress] = useState({
    words: 0,
    images: 0,
    phrases: 0,
    correct: 0,
    attempts: 0,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const auth = getStoredAuth();

      if (!auth || !auth.user) return;

      const response = await getProgress(auth.user.id);

      if (response.status === "success") {
        setProgress(response.data);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  const accuracy =
    progress.attempts > 0
      ? ((progress.correct / progress.attempts) * 100).toFixed(1)
      : 0;

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#eafaf3",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#0f766e" }}>
        📊 Progress Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>🗣 Word Practice</h3>
          <h2>{progress.words}</h2>
        </div>

        <div style={cardStyle}>
          <h3>🖼 Image Practice</h3>
          <h2>{progress.images}</h2>
        </div>

        <div style={cardStyle}>
          <h3>💬 Phrase Practice</h3>
          <h2>{progress.phrases}</h2>
        </div>

        <div style={cardStyle}>
          <h3>🎯 Correct Attempts</h3>
          <h2>{progress.correct}</h2>
        </div>

        <div style={cardStyle}>
          <h3>📈 Total Attempts</h3>
          <h2>{progress.attempts}</h2>
        </div>

        <div style={cardStyle}>
          <h3>✅ Accuracy</h3>
          <h2>{accuracy}%</h2>
        </div>
      </div>
    </div>
  );
}

export default Progress;