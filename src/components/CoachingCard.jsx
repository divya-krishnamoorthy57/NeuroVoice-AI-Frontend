import React, { useEffect, useState } from "react";
import "./CoachingCard.css";
import { getCoachingTip, getStoredAuth } from "../services/api";

function CoachingCard() {

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadCoach();

  }, []);

  const loadCoach = async () => {

    try {

      const user = getStoredAuth();

      if (!user) {
        setLoading(false);
        return;
      }

      const response = await getCoachingTip(14);

      setCoach(response);

    } catch (error) {

      console.log("Coach Error:", error);

    } finally {

      setLoading(false);

    }

  };

  const speakCoach = () => {

    if (!coach) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(coach.tip);

    speech.lang = "en-US";
    speech.rate = 0.85;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

  };

  if (loading) {

    return (
      <div className="coach-card">
        <h2>🤖 AI Speech Coach</h2>
        <p>Loading coaching...</p>
      </div>
    );

  }

  if (!coach) {

    return (
      <div className="coach-card">
        <h2>🤖 AI Speech Coach</h2>
        <p>No coaching available.</p>
      </div>
    );

  }

  return (

    <div className="coach-card">

      <h2>🤖 AI Speech Coach</h2>

      <div className="coach-item">
        <span>🎯 Accuracy</span>
        <strong>{coach.accuracy}%</strong>
      </div>

      <div className="coach-item">
        <span>✅ Strength</span>
        <strong>{coach.strength}</strong>
      </div>

      <div className="coach-item">
        <span>📈 Focus</span>
        <strong>{coach.focus}</strong>
      </div>

      <div className="coach-item">
        <span>🏆 Goal</span>
        <strong>{coach.goal}</strong>
      </div>

      <div className="coach-tip">
        <h3>💡 Coach's Advice</h3>
        <p>{coach.tip}</p>
      </div>

      <button
        className="coach-btn"
        onClick={speakCoach}
      >
        🔊 Listen to Coach
      </button>

    </div>

  );

}

export default CoachingCard;