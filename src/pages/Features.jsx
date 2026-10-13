import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Headphones,
  Mic,
  Sliders,
  Sparkles,
  Volume2
} from "lucide-react";

const Features = () => {
  return (
    <PublicLayout>
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "60px 20px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <span className="nv-pill" style={{ marginBottom: "14px" }}>
            Platform Features
          </span>
          <h1 style={{ fontSize: "2.5rem", color: "#357F70", marginBottom: "16px" }}>
            Every Tool Designed for Speech Practice
          </h1>
          <p style={{ color: "#6B7772", fontSize: "1.15rem", maxWidth: "680px", margin: "0 auto", lineHeight: "1.7" }}>
            Explore how our integrated audio synthesis, speech recognition, fuzzy matching engine, and analytics support your rehabilitation journey.
          </p>
        </div>

        {/* Feature 1: Speech Synthesis */}
        <div className="nv-card" style={{ padding: "40px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#357F70",
              flexShrink: 0
            }}>
              <Volume2 size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "#303B37", marginBottom: "12px" }}>
                1. Adaptive Text-to-Speech Audio Playback
              </h2>
              <p style={{ color: "#6B7772", lineHeight: "1.7", marginBottom: "14px" }}>
                Hear each target word or phrase spoken clearly using the browser’s built-in SpeechSynthesis API. Adjust the vocal playback speed (from slow 0.7x to natural 1.0x) so you can listen repeatedly and absorb the articulation pattern without feeling rushed.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#357F70", fontSize: "0.9rem", fontWeight: "600" }}>
                <span>• Adjustable Rate (0.7x - 1.0x)</span>
                <span>• Unlimited Repetitions</span>
                <span>• Voice Selection Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Browser Speech Recognition & Fallback */}
        <div className="nv-card" style={{ padding: "40px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#357F70",
              flexShrink: 0
            }}>
              <Mic size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "#303B37", marginBottom: "12px" }}>
                2. Real Speech Recognition & Manual Fallback
              </h2>
              <p style={{ color: "#6B7772", lineHeight: "1.7", marginBottom: "14px" }}>
                Speak directly into your microphone using the native Web Speech API. Visual status badges indicate when listening is active, processing, or complete. If your browser does not support voice recognition or microphone permissions are disabled, you can seamlessly switch to the built-in manual text typing fallback.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#357F70", fontSize: "0.9rem", fontWeight: "600" }}>
                <span>• Explicit Microphone Activation</span>
                <span>• Immediate Transcript Display</span>
                <span>• Keyboard Typing Fallback</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: RapidFuzz Feedback Engine */}
        <div className="nv-card" style={{ padding: "40px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#357F70",
              flexShrink: 0
            }}>
              <Sparkles size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "#303B37", marginBottom: "12px" }}>
                3. RapidFuzz Performance Analysis & Word Highlighting
              </h2>
              <p style={{ color: "#6B7772", lineHeight: "1.7", marginBottom: "14px" }}>
                Our backend feedback engine cleans punctuation, normalizes case and spacing, and calculates string similarity via RapidFuzz. It highlights which words were articulated clearly and which were missing, providing encouraging, actionable suggestions.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#357F70", fontSize: "0.9rem", fontWeight: "600" }}>
                <span>• Word-by-Word Matching</span>
                <span>• Missing Word Detection</span>
                <span>• Supportive Suggestions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4: Exercise Library & Personal Plans */}
        <div className="nv-card" style={{ padding: "40px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#357F70",
              flexShrink: 0
            }}>
              <BookOpen size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "#303B37", marginBottom: "12px" }}>
                4. Exercise Library & Adaptive Practice Plans
              </h2>
              <p style={{ color: "#6B7772", lineHeight: "1.7", marginBottom: "14px" }}>
                Filter exercises across Word Practice, Everyday Phrases, Sentence Practice, and Everyday Communication. Filter by difficulty (Beginner, Intermediate, Advanced) or search by keyword. Save favorite exercises with one-click bookmarks and generate automated daily practice plans.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#357F70", fontSize: "0.9rem", fontWeight: "600" }}>
                <span>• Filter by Difficulty & Type</span>
                <span>• Bookmarking System</span>
                <span>• Rule-Based Daily Plan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 5: Progress Monitoring & CSV Export */}
        <div className="nv-card" style={{ padding: "40px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
            <div style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#357F70",
              flexShrink: 0
            }}>
              <Activity size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "#303B37", marginBottom: "12px" }}>
                5. Persistent Progress Tracking & Data Portability
              </h2>
              <p style={{ color: "#6B7772", lineHeight: "1.7", marginBottom: "14px" }}>
                Every practice session is stored in the database. Monitor practice time, completed exercises, daily streaks, category-wise breakdowns, and visual weekly activity charts. Export your complete practice history in CSV format to review with your speech therapist or caregiver.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#357F70", fontSize: "0.9rem", fontWeight: "600" }}>
                <span>• Streak Calculation</span>
                <span>• Activity Visualizations</span>
                <span>• One-Click CSV Export</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link to="/register" className="nv-btn-primary" style={{ padding: "14px 32px", fontSize: "1.1rem" }}>
            <span>Explore Practice Tools</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Features;
