import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { useAuth } from "../context/AuthContext";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Headphones,
  HelpCircle,
  Mic,
  RotateCcw,
  Shield,
  Sliders,
  Sparkles,
  Volume2
} from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Mini live demo state
  const demoTarget = "Good morning";
  const [demoSpoken, setDemoSpoken] = useState("");
  const [demoScore, setDemoScore] = useState(null);
  const [demoFeedback, setDemoFeedback] = useState("");

  const handleDemoSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(demoTarget);
    utt.rate = 0.9;
    synth.speak(utt);
  };

  const handleDemoEvaluate = (sample) => {
    setDemoSpoken(sample);
    if (sample.toLowerCase() === demoTarget.toLowerCase()) {
      setDemoScore(100);
      setDemoFeedback("Excellent pronunciation! All words matched perfectly.");
    } else {
      setDemoScore(75);
      setDemoFeedback("Good attempt! Matched key word. Try pacing yourself evenly.");
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(180deg, #D9F7EE 0%, #F7FBF9 100%)",
        padding: "64px 20px 80px",
        textAlign: "center",
        borderBottom: "1px solid #DCE9E3"
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #8ED8C5",
            borderRadius: "30px",
            padding: "8px 18px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(53, 127, 112, 0.08)"
          }}>
            <Sparkles size={16} color="#16836D" />
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#16836D", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Empowering Communication Through Practice
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: "800",
            color: "#16836D",
            marginBottom: "20px",
            lineHeight: "1.2"
          }}>
            Rebuild Speech Confidence with Supportive AI Guidance
          </h1>

          <p style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            color: "#303B37",
            lineHeight: "1.7",
            marginBottom: "36px",
            maxWidth: "760px",
            marginInline: "auto"
          }}>
            NeuroVoice AI is a calm, accessible web application designed to support people with aphasia and speech difficulties. Practice structured speaking exercises, receive clear pronunciation feedback, and monitor progress at your own pace.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="nv-btn-primary"
              style={{ fontSize: "1.1rem", padding: "14px 32px" }}
            >
              <span>{isAuthenticated ? "Go to Dashboard" : "Start Practicing Now"}</span>
              <ArrowRight size={20} />
            </Link>

            <Link
              to="/features"
              className="nv-btn-secondary"
              style={{ fontSize: "1.1rem", padding: "14px 28px" }}
            >
              <span>Explore Features</span>
            </Link>
          </div>
        </div>
      </section>

      {/* What is Aphasia & Why Practice Matters */}
      <section style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #DCE9E3",
          padding: "48px 36px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "40px",
          alignItems: "center",
          boxShadow: "0 6px 24px rgba(53, 127, 112, 0.04)"
        }}>
          <div>
            <span className="nv-pill" style={{ marginBottom: "16px" }}>
              Understanding Aphasia
            </span>
            <h2 style={{ fontSize: "2rem", color: "#16836D", marginBottom: "18px" }}>
              Communication Takes Practice, Not Pressure
            </h2>
            <p style={{ color: "#303B37", fontSize: "1.05rem", lineHeight: "1.8", marginBottom: "16px" }}>
              Aphasia is a neurological condition that affects how the brain produces and comprehends language—frequently following a stroke, brain injury, or neurological illness.
            </p>
            <p style={{ color: "#6B7772", lineHeight: "1.7" }}>
              Cognitive linguistics and rehabilitation science show that frequent, low-stress repetition helps reinforce neural pathways. NeuroVoice AI eliminates the fear of judgment, giving you an infinite, patient partner to practice words, phrases, and everyday requests.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px"
          }}>
            <div className="nv-card" style={{ padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🗣️</div>
              <h4 style={{ color: "#303B37", fontSize: "1.05rem", marginBottom: "6px" }}>Vocal Articulation</h4>
              <p style={{ fontSize: "0.85rem", color: "#6B7772" }}>Hear target sounds clearly and replicate them calmly.</p>
            </div>
            <div className="nv-card" style={{ padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🎧</div>
              <h4 style={{ color: "#303B37", fontSize: "1.05rem", marginBottom: "6px" }}>Audio Repetition</h4>
              <p style={{ fontSize: "0.85rem", color: "#6B7772" }}>Adjustable playback rate to match your processing speed.</p>
            </div>
            <div className="nv-card" style={{ padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📊</div>
              <h4 style={{ color: "#303B37", fontSize: "1.05rem", marginBottom: "6px" }}>Transparent Matching</h4>
              <p style={{ fontSize: "0.85rem", color: "#6B7772" }}>Fuzzy string matching clearly labeled as approximate.</p>
            </div>
            <div className="nv-card" style={{ padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🌱</div>
              <h4 style={{ color: "#303B37", fontSize: "1.05rem", marginBottom: "6px" }}>Gentle Habit</h4>
              <p style={{ fontSize: "0.85rem", color: "#6B7772" }}>Streak tracking to celebrate every small, steady win.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ padding: "40px 20px 80px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <span className="nv-pill" style={{ marginBottom: "14px" }}>
            Comprehensive Modules
          </span>
          <h2 style={{ fontSize: "2.25rem", color: "#16836D", marginBottom: "14px" }}>
            Designed for Practical, Everyday Speech
          </h2>
          <p style={{ color: "#6B7772", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Step through progressive categories designed to support both individual vocabulary and connected conversations.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          <div className="nv-card" style={{ padding: "32px 28px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16836D",
              marginBottom: "20px"
            }}>
              <Volume2 size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#303B37", marginBottom: "10px" }}>Word Practice</h3>
            <p style={{ color: "#6B7772", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "18px" }}>
              Practice single target words across objects, animals, food, and daily essentials with prompt hints and syllable guidance.
            </p>
            <Link to="/exercises" style={{ color: "#16836D", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Explore Words <ArrowRight size={16} />
            </Link>
          </div>

          <div className="nv-card" style={{ padding: "32px 28px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16836D",
              marginBottom: "20px"
            }}>
              <Headphones size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#303B37", marginBottom: "10px" }}>Everyday Phrases</h3>
            <p style={{ color: "#6B7772", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "18px" }}>
              Rebuild natural fluency through greetings, requests, and essential conversational phrases like "Good morning" and "Please help me".
            </p>
            <Link to="/exercises" style={{ color: "#16836D", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Practice Phrases <ArrowRight size={16} />
            </Link>
          </div>

          <div className="nv-card" style={{ padding: "32px 28px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16836D",
              marginBottom: "20px"
            }}>
              <Calendar size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#303B37", marginBottom: "10px" }}>Personalized Plans</h3>
            <p style={{ color: "#6B7772", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "18px" }}>
              Receive automated, rule-based practice plans that prioritize exercises you haven't reviewed recently to keep practice well-rounded.
            </p>
            <Link to="/plan" style={{ color: "#16836D", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              View Plan System <ArrowRight size={16} />
            </Link>
          </div>

          <div className="nv-card" style={{ padding: "32px 28px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16836D",
              marginBottom: "20px"
            }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", color: "#303B37", marginBottom: "10px" }}>Progress & Analytics</h3>
            <p style={{ color: "#6B7772", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "18px" }}>
              All practice data is saved to your account in MySQL. Track sessions, completed exercises, daily streaks, and export progress summaries.
            </p>
            <Link to="/progress" style={{ color: "#16836D", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              View Progress <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Practice Preview */}
      <section style={{
        padding: "64px 20px",
        backgroundColor: "#D9F7EE",
        borderTop: "1px solid #DCE9E3",
        borderBottom: "1px solid #DCE9E3"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <span className="nv-pill" style={{ marginBottom: "14px", backgroundColor: "#FFFFFF" }}>
            Interactive Preview
          </span>
          <h2 style={{ fontSize: "2rem", color: "#16836D", marginBottom: "14px" }}>
            Experience How Practice Works
          </h2>
          <p style={{ color: "#303B37", fontSize: "1.05rem", marginBottom: "32px" }}>
            Listen to the audio target, test recognition feedback, and view matching results below:
          </p>

          <div className="nv-card" style={{ padding: "36px", textAlign: "left", maxWidth: "620px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.9rem", color: "#6B7772", fontWeight: "600" }}>TARGET PHRASE</span>
              <span style={{ fontSize: "0.85rem", color: "#16836D", backgroundColor: "#D9F7EE", padding: "4px 10px", borderRadius: "12px", fontWeight: "600" }}>
                Beginner
              </span>
            </div>

            <h3 style={{ fontSize: "1.8rem", color: "#16836D", marginBottom: "20px" }}>
              "{demoTarget}"
            </h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
              <button
                onClick={handleDemoSpeak}
                className="nv-btn-secondary"
                style={{ padding: "10px 18px", fontSize: "0.95rem" }}
              >
                <Volume2 size={18} />
                <span>Hear Phrase</span>
              </button>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#6B7772", marginBottom: "8px" }}>
              Simulate recognition response:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              <button
                onClick={() => handleDemoEvaluate("Good morning")}
                className="nv-btn-outline"
                style={{ fontSize: "0.85rem", padding: "6px 14px" }}
              >
                Match: "Good morning"
              </button>
              <button
                onClick={() => handleDemoEvaluate("Good")}
                className="nv-btn-outline"
                style={{ fontSize: "0.85rem", padding: "6px 14px" }}
              >
                Partial: "Good"
              </button>
            </div>

            {demoSpoken && (
              <div style={{
                backgroundColor: "#F7FBF9",
                borderRadius: "12px",
                border: "1px solid #DCE9E3",
                padding: "16px",
                marginTop: "16px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#303B37" }}>
                    Recognized: <em>"{demoSpoken}"</em>
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#16836D" }}>
                    Score: {demoScore}%
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#6B7772", margin: 0 }}>
                  💡 {demoFeedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Accessibility & Responsible AI */}
      <section style={{ padding: "80px 20px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "36px"
        }}>
          <div className="nv-card" style={{ padding: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <Sliders size={24} color="#16836D" />
              <h3 style={{ fontSize: "1.4rem", color: "#16836D", margin: 0 }}>
                Accessibility First
              </h3>
            </div>
            <p style={{ color: "#6B7772", lineHeight: "1.7", marginBottom: "16px" }}>
              Designed from the ground up for people who may face visual, motor, or cognitive fatigue:
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#303B37", fontSize: "0.95rem" }}>
                <CheckCircle size={18} color="#16836D" />
                <span>Large, readable Poppins typography with scalable font sizes.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#303B37", fontSize: "0.95rem" }}>
                <CheckCircle size={18} color="#16836D" />
                <span>Calm mint-green and dark teal palette avoiding overstimulating colors.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#303B37", fontSize: "0.95rem" }}>
                <CheckCircle size={18} color="#16836D" />
                <span>High-contrast toggle and keyboard focus outlines.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#303B37", fontSize: "0.95rem" }}>
                <CheckCircle size={18} color="#16836D" />
                <span>Keyboard accessibility and full manual text fallback for recognition.</span>
              </li>
            </ul>
          </div>

          <div className="nv-card" style={{ padding: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <Shield size={24} color="#16836D" />
              <h3 style={{ fontSize: "1.4rem", color: "#16836D", margin: 0 }}>
                Privacy & Responsible AI
              </h3>
            </div>
            <p style={{ color: "#6B7772", lineHeight: "1.7", marginBottom: "16px" }}>
              We respect your voice and privacy with strict, transparent engineering principles:
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#303B37", fontSize: "0.95rem" }}>
                <CheckCircle size={18} color="#16836D" />
                <span>No raw audio is recorded or stored on server databases by default.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#303B37", fontSize: "0.95rem" }}>
                <CheckCircle size={18} color="#16836D" />
                <span>Recognition occurs via browser Web Speech API.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#303B37", fontSize: "0.95rem" }}>
                <CheckCircle size={18} color="#16836D" />
                <span>Similarity scores are clearly labeled as text string comparison aids.</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#303B37", fontSize: "0.95rem" }}>
                <CheckCircle size={18} color="#16836D" />
                <span>Never claims to clinically diagnose or grade neurological recovery.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ padding: "40px 20px 80px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "2rem", color: "#16836D", marginBottom: "12px" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: "#6B7772" }}>Common questions about using NeuroVoice AI for daily practice.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="nv-card" style={{ padding: "24px" }}>
            <h4 style={{ color: "#303B37", fontSize: "1.1rem", marginBottom: "8px" }}>
              What is aphasia, and who is this platform for?
            </h4>
            <p style={{ color: "#6B7772", lineHeight: "1.6", margin: 0 }}>
              Aphasia is a language disorder that makes communicating difficult after brain injury or stroke. NeuroVoice AI is designed for anyone who wants structured, self-paced speech practice to rebuild word retrieval and verbal confidence.
            </p>
          </div>

          <div className="nv-card" style={{ padding: "24px" }}>
            <h4 style={{ color: "#303B37", fontSize: "1.1rem", marginBottom: "8px" }}>
              What happens if my browser does not support microphone speech recognition?
            </h4>
            <p style={{ color: "#6B7772", lineHeight: "1.6", margin: 0 }}>
              While Google Chrome and Chromium browsers offer optimal Web Speech API recognition, NeuroVoice AI includes a complete manual text-entry fallback. You can still listen to the audio model, type what you practiced, and receive instant feedback.
            </p>
          </div>

          <div className="nv-card" style={{ padding: "24px" }}>
            <h4 style={{ color: "#303B37", fontSize: "1.1rem", marginBottom: "8px" }}>
              Is this a replacement for speech therapy with a licensed pathologist?
            </h4>
            <p style={{ color: "#6B7772", lineHeight: "1.6", margin: 0 }}>
              No. NeuroVoice AI is an empowering home practice companion. It does not replace clinical evaluation or therapy delivered by a certified Speech-Language Pathologist (SLP).
            </p>
          </div>

          <div className="nv-card" style={{ padding: "24px" }}>
            <h4 style={{ color: "#303B37", fontSize: "1.1rem", marginBottom: "8px" }}>
              Is my personal data and speech private?
            </h4>
            <p style={{ color: "#6B7772", lineHeight: "1.6", margin: 0 }}>
              Yes. All user records are protected with JWT authentication and password hashing. We do not store raw audio recordings on our servers.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{
        background: "linear-gradient(135deg, #8ED8C5, #16836D)",
        padding: "60px 20px",
        textAlign: "center",
        color: "#FFFFFF"
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ color: "#FFFFFF", fontSize: "2.25rem", marginBottom: "16px" }}>
            Start Your Practice Journey Today
          </h2>
          <p style={{ color: "#E8F8F4", fontSize: "1.1rem", lineHeight: "1.6", marginBottom: "32px" }}>
            Join NeuroVoice AI to build consistent speaking habits, track your progress, and practice in a supportive, low-pressure environment.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#16836D",
              fontWeight: "700",
              padding: "14px 32px",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
            }}
          >
            <span>{isAuthenticated ? "Open Dashboard" : "Create Free Account"}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;