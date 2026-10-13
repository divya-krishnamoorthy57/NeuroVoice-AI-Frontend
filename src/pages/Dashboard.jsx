import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getDashboardSummary()
      .then((data) => {
        if (isMounted) setSummary(data);
      })
      .catch((err) => {
        console.warn("Dashboard summary fetch notice:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const userName = summary?.user_name || user?.name;

  return (
    <AppLayout>
      <div style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "48px 16px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Top Centered Section (matching reference screenshot) */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          {/* Logo with Brain Icon */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "14px"
          }}>
            <span style={{ fontSize: "2rem", lineHeight: 1 }}>🧠</span>
            <span style={{
              fontSize: "2.1rem",
              fontWeight: "700",
              color: "#16836D",
              letterSpacing: "-0.5px"
            }}>
              NeuroVoice AI
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: "1.65rem",
            fontWeight: "600",
            color: "#303B37",
            marginBottom: "8px",
            lineHeight: 1.3
          }}>
            Welcome Back{userName ? `, ${userName}` : ""} 👋
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "1.1rem",
            color: "#66756F",
            fontWeight: "400",
            margin: 0
          }}>
            Continue your speech recovery journey — let's practice speaking together.
          </p>
        </div>

        {/* Three Navigation Cards (matching reference screenshot) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "28px",
          width: "100%",
          alignItems: "stretch"
        }}>
          {/* Card 1: Speech Training / Speech Practice */}
          <div
            className="nv-card"
            style={{
              padding: "44px 28px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "center",
              borderRadius: "28px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div>
              <h2
                aria-label="Speech Practice - Speech Training"
                style={{
                  fontSize: "1.45rem",
                  fontWeight: "700",
                  color: "#16836D",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                <span>🗣️</span>
                <span>Speech Training</span>
              </h2>

              <p style={{
                fontSize: "1.02rem",
                color: "#66756F",
                lineHeight: "1.55",
                marginBottom: "36px"
              }}>
                Practice words, images and phrases to improve your speech.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link
                to="/practice"
                aria-label="Start Practicing - Start Training"
                className="nv-btn-pill"
                style={{
                  width: "82%",
                  maxWidth: "220px",
                  padding: "13px 20px"
                }}
              >
                Start Training
              </Link>
            </div>
          </div>

          {/* Card 2: Progress / My Progress */}
          <div
            className="nv-card"
            style={{
              padding: "44px 28px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "center",
              borderRadius: "28px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div>
              <h2
                aria-label="My Progress - Progress"
                style={{
                  fontSize: "1.45rem",
                  fontWeight: "700",
                  color: "#16836D",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                <span>📊</span>
                <span>Progress</span>
              </h2>

              <p style={{
                fontSize: "1.02rem",
                color: "#66756F",
                lineHeight: "1.55",
                marginBottom: "36px"
              }}>
                Track your daily improvement and completed exercises.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link
                to="/progress"
                aria-label="View Progress"
                className="nv-btn-pill"
                style={{
                  width: "82%",
                  maxWidth: "220px",
                  padding: "13px 20px"
                }}
              >
                View Progress
              </Link>
            </div>
          </div>

          {/* Card 3: About Aphasia */}
          <div
            className="nv-card"
            style={{
              padding: "44px 28px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "center",
              borderRadius: "28px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div>
              <h2
                aria-label="About Aphasia"
                style={{
                  fontSize: "1.45rem",
                  fontWeight: "700",
                  color: "#16836D",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                <span>🧠</span>
                <span>About Aphasia</span>
              </h2>

              <p style={{
                fontSize: "1.02rem",
                color: "#66756F",
                lineHeight: "1.55",
                marginBottom: "36px"
              }}>
                Learn about aphasia and how NeuroVoice AI helps recovery.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link
                to="/about"
                aria-label="Learn More"
                className="nv-btn-pill"
                style={{
                  width: "82%",
                  maxWidth: "220px",
                  padding: "13px 20px"
                }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;