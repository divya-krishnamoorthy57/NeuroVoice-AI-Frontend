import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { ArrowRight, CheckCircle, Heart, Shield, Users, Volume2 } from "lucide-react";

const About = () => {
  return (
    <PublicLayout>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="nv-pill" style={{ marginBottom: "14px" }}>
            About NeuroVoice AI
          </span>
          <h1 style={{ fontSize: "2.5rem", color: "#16836D", marginBottom: "16px" }}>
            Empowering Communication Through Practice
          </h1>
          <p style={{ color: "#6B7772", fontSize: "1.15rem", maxWidth: "720px", margin: "0 auto", lineHeight: "1.7" }}>
            Our mission is to provide an accessible, compassionate, and low-pressure environment for speech rehabilitation and verbal repetition.
          </p>
        </div>

        {/* Core Purpose Card */}
        <div className="nv-card" style={{ padding: "40px", marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.6rem", color: "#303B37", marginBottom: "16px" }}>
            Our Purpose & Vision
          </h2>
          <p style={{ color: "#303B37", lineHeight: "1.8", marginBottom: "16px", fontSize: "1.05rem" }}>
            Speaking difficulties and aphasia—whether resulting from a stroke, traumatic brain injury (TBI), or other neurological conditions—can make everyday communication feel exhausting and isolating.
          </p>
          <p style={{ color: "#6B7772", lineHeight: "1.8", marginBottom: "16px" }}>
            Traditional speech therapy sessions are invaluable, yet individuals often lack structured tools to continue repetitive practice between clinic appointments. NeuroVoice AI was built to fill this gap by pairing browser-based speech technologies with calm, evidence-informed repetition exercises.
          </p>
          <p style={{ color: "#6B7772", lineHeight: "1.8" }}>
            There are no timers rushing you, no penalties for mispronunciations, and no gamified pressure. You can listen as many times as you need, repeat at your own rhythm, and watch your practice consistency grow.
          </p>
        </div>

        {/* Intended Users Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "36px"
        }}>
          <div className="nv-card" style={{ padding: "32px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16836D",
              marginBottom: "16px"
            }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: "1.2rem", color: "#303B37", marginBottom: "10px" }}>
              Who It's For
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", color: "#6B7772", fontSize: "0.95rem" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle size={16} color="#16836D" style={{ marginTop: "4px", flexShrink: 0 }} />
                <span>Individuals recovering from stroke or traumatic brain injury.</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle size={16} color="#16836D" style={{ marginTop: "4px", flexShrink: 0 }} />
                <span>People living with expressive or receptive aphasia.</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle size={16} color="#16836D" style={{ marginTop: "4px", flexShrink: 0 }} />
                <span>Caregivers and family members supporting home speech exercises.</span>
              </li>
            </ul>
          </div>

          <div className="nv-card" style={{ padding: "32px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16836D",
              marginBottom: "16px"
            }}>
              <Volume2 size={22} />
            </div>
            <h3 style={{ fontSize: "1.2rem", color: "#303B37", marginBottom: "10px" }}>
              Practice Tools Available
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", color: "#6B7772", fontSize: "0.95rem" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle size={16} color="#16836D" style={{ marginTop: "4px", flexShrink: 0 }} />
                <span>Speech Synthesis with adjustable speaking rates (0.7x - 1.0x).</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle size={16} color="#16836D" style={{ marginTop: "4px", flexShrink: 0 }} />
                <span>Browser Speech Recognition with manual typing fallback.</span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <CheckCircle size={16} color="#16836D" style={{ marginTop: "4px", flexShrink: 0 }} />
                <span>RapidFuzz string similarity and word difference breakdown.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Limitations & Ethical Boundaries */}
        <div className="nv-card" style={{ padding: "40px", marginBottom: "40px", backgroundColor: "#F7FBF9", border: "1.5px solid #DCE9E3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <Shield size={24} color="#16836D" />
            <h2 style={{ fontSize: "1.4rem", color: "#16836D", margin: 0 }}>
              Limitations & Clinical Boundaries
            </h2>
          </div>
          <p style={{ color: "#303B37", lineHeight: "1.7", marginBottom: "14px" }}>
            We believe in honest, transparent software engineering without exaggerated clinical claims:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", color: "#6B7772", lineHeight: "1.6" }}>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: "#16836D", fontWeight: "700" }}>•</span>
              <span><strong>Not a Medical Diagnosis:</strong> Text similarity scores are mathematical string comparisons, not clinical evaluations of phoneme placement or neurological recovery.</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: "#16836D", fontWeight: "700" }}>•</span>
              <span><strong>Microphone Variability:</strong> Recognition accuracy can be affected by ambient room noise, microphone sensitivity, accents, and browser connection speed.</span>
            </li>
            <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: "#16836D", fontWeight: "700" }}>•</span>
              <span><strong>Complementary Care:</strong> NeuroVoice AI is designed to support, not replace, speech-language pathologists (SLPs) and medical healthcare providers.</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link to="/register" className="nv-btn-primary" style={{ padding: "14px 32px", fontSize: "1.1rem" }}>
            <span>Join NeuroVoice AI Today</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default About;