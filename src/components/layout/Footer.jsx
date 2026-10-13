import React from "react";
import { Link } from "react-router-dom";
import { Heart, Shield, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: "#FFFFFF",
      borderTop: "1px solid #DCE9E3",
      padding: "48px 20px 24px",
      marginTop: "auto"
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "36px",
        marginBottom: "36px"
      }}>
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #8ED8C5, #357F70)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "18px",
              fontWeight: "bold"
            }}>
              🗣️
            </div>
            <span style={{ fontSize: "1.15rem", fontWeight: "700", color: "#357F70" }}>
              NeuroVoice AI
            </span>
          </div>
          <p style={{ fontSize: "0.95rem", color: "#6B7772", lineHeight: "1.6", marginBottom: "14px" }}>
            “Empowering Communication Through Practice”
          </p>
          <p style={{ fontSize: "0.85rem", color: "#6B7772" }}>
            A calm, supportive platform designed to help people with aphasia and speech difficulties rebuild communication confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "#303B37", fontSize: "1rem", fontWeight: "700", marginBottom: "14px" }}>
            Explore Platform
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><Link to="/" style={{ color: "#6B7772", fontSize: "0.9rem" }}>Home</Link></li>
            <li><Link to="/about" style={{ color: "#6B7772", fontSize: "0.9rem" }}>About Aphasia & Purpose</Link></li>
            <li><Link to="/features" style={{ color: "#6B7772", fontSize: "0.9rem" }}>Practice Features</Link></li>
            <li><Link to="/contact" style={{ color: "#6B7772", fontSize: "0.9rem" }}>Get in Touch</Link></li>
          </ul>
        </div>

        {/* Practice Modules */}
        <div>
          <h4 style={{ color: "#303B37", fontSize: "1rem", fontWeight: "700", marginBottom: "14px" }}>
            Practice Tools
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><Link to="/exercises" style={{ color: "#6B7772", fontSize: "0.9rem" }}>Exercise Library</Link></li>
            <li><Link to="/word-practice" style={{ color: "#6B7772", fontSize: "0.9rem" }}>Word Practice</Link></li>
            <li><Link to="/phrase-practice" style={{ color: "#6B7772", fontSize: "0.9rem" }}>Everyday Phrases</Link></li>
            <li><Link to="/progress" style={{ color: "#6B7772", fontSize: "0.9rem" }}>Progress Tracking</Link></li>
          </ul>
        </div>

        {/* Responsible AI & Privacy Notice */}
        <div>
          <h4 style={{ color: "#303B37", fontSize: "1rem", fontWeight: "700", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Shield size={18} color="#357F70" />
            Responsible AI & Privacy
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#6B7772", lineHeight: "1.5", marginBottom: "12px" }}>
            Speech recognition happens in your browser. Audio recordings are never stored on external servers without explicit consent.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#357F70", fontSize: "0.85rem", fontWeight: "600" }}>
            <Mail size={16} />
            <span>support@neurovoice.ai</span>
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer Banner */}
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "16px 20px",
        backgroundColor: "#F7FBF9",
        borderRadius: "12px",
        border: "1px solid #DCE9E3",
        marginBottom: "24px"
      }}>
        <p style={{ fontSize: "0.8rem", color: "#6B7772", textAlign: "center", margin: 0, lineHeight: "1.5" }}>
          <strong>Supportive Care Notice:</strong> NeuroVoice AI provides supportive speech practice software. It does not provide clinical diagnosis, medical evaluation, or replace care provided by certified speech-language pathologists (SLPs).
        </p>
      </div>

      {/* Copyright */}
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #DCE9E3",
        paddingTop: "20px",
        fontSize: "0.85rem",
        color: "#6B7772"
      }}>
        <p>© 2026 NeuroVoice AI. All rights reserved.</p>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Use</span>
          <span>•</span>
          <span>Accessibility Commitment</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
