import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-card">
        <p className="eyebrow">About aphasia</p>
        <h1>Recovery starts with simple, repeated practice.</h1>
        <p>Aphasia is a communication disorder that can make speaking, understanding speech, reading, or writing harder after a stroke or brain injury. NeuroVoice AI offers a compassionate, low-pressure space to rebuild confidence through guided repetition and voice feedback.</p>

        <div className="info-grid">
          <div className="info-card">
            <h2>What it is</h2>
            <p>Aphasia affects language processing in the brain, often making everyday conversations feel frustrating.</p>
          </div>
          <div className="info-card">
            <h2>What helps</h2>
            <p>Repeated practice with words, pictures, and short phrases can help shape stronger communication habits.</p>
          </div>
          <div className="info-card">
            <h2>How NeuroVoice AI helps</h2>
            <p>Speech recognition, friendly prompts, and progress tracking turn each session into a calm win.</p>
          </div>
        </div>

        <button onClick={() => navigate("/training")}>Begin practice</button>
      </div>
    </div>
  );
}

export default About;