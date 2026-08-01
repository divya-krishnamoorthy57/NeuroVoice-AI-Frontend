import React from "react";
import { useNavigate } from "react-router-dom";
import "./Training.css";

function Training() {
  const navigate = useNavigate();

  return (
    <div className="training-page">
      <div className="training-intro">
        <p className="eyebrow">Speech training</p>
        <h1>Choose a guided focus area</h1>
        <p>Every session uses voice feedback and adaptive repetition to help you speak with more ease.</p>
      </div>

      <div className="training-container">
        <div className="training-card">
          <h2>🗣 Word practice</h2>
          <p>Practice everyday words and build a stronger speaking rhythm.</p>
          <button onClick={() => navigate("/word-practice")}>Start words</button>
        </div>

        <div className="training-card">
          <h2>🖼 Image practice</h2>
          <p>Link pictures with simple spoken language for faster recognition.</p>
          <button onClick={() => navigate("/image-practice")}>Start images</button>
        </div>

        <div className="training-card">
          <h2>💬 Phrase practice</h2>
          <p>Build confidence with short phrases and calmer, more fluent speech.</p>
          <button onClick={() => navigate("/phrase-practice")}>Start phrases</button>
        </div>
      </div>
    </div>
  );
}

export default Training;