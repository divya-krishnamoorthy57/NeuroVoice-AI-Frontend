import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import {
  getProgressSummary,
  getProgressHistory,
  downloadProgressCsv
} from "../services/api";
import {
  Activity,
  ArrowDown,
  BarChart2,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Flame,
  Globe,
  Info,
  TrendingUp,
  Volume2
} from "lucide-react";

const Progress = () => {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(""); // "" = All, "en-US" = English, "ta-IN" = Tamil
  const [expandedSessions, setExpandedSessions] = useState({});

  useEffect(() => {
    loadProgress(selectedLanguage);
  }, [selectedLanguage]);

  const loadProgress = async (lang = selectedLanguage) => {
    setLoading(true);
    setError("");
    try {
      const params = lang ? { language: lang } : {};
      const sumData = await getProgressSummary(params);
      setSummary(sumData);

      const histData = await getProgressHistory(params);
      setHistory(histData.data || []);
    } catch (err) {
      console.error("Progress load error:", err);
      setError("Unable to load latest progress records. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageFilter = (lang) => {
    setSelectedLanguage(lang);
  };

  const toggleSessionExpand = (sessionId) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const handleCsvDownload = async () => {
    setExporting(true);
    try {
      const blob = await downloadProgressCsv(selectedLanguage || null);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv;charset=utf-8;" }));
      const link = document.createElement("a");
      link.href = url;
      const langSuffix = selectedLanguage ? `_${selectedLanguage}` : "_all";
      link.setAttribute("download", `neurovoice_progress${langSuffix}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("CSV download error:", err);
      alert("Failed to export progress CSV. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ color: "#16836D", fontSize: "1.2rem" }}>Loading progress history and metrics...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header and CSV Export */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", color: "#16836D", marginBottom: "6px" }}>
            📈 Speech Progress & History
          </h1>
          <p style={{ color: "#6B7772", fontSize: "1.05rem" }}>
            Track practice duration, session consistency, category performance, and download data.
          </p>
        </div>

        <button
          onClick={handleCsvDownload}
          disabled={exporting}
          className="nv-btn-secondary"
          style={{ padding: "12px 22px" }}
        >
          <Download size={18} />
          <span>{exporting ? "Generating CSV..." : "Export Progress (CSV)"}</span>
        </button>
      </div>

      {/* Language Filter Tabs */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        backgroundColor: "#FFFFFF",
        padding: "12px 18px",
        borderRadius: "16px",
        border: "1px solid #DCE9E3",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        marginBottom: "28px"
      }}>
        <span style={{
          fontSize: "0.92rem",
          fontWeight: "700",
          color: "#303B37",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <Globe size={18} color="#16836D" />
          Filter Language:
        </span>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleLanguageFilter("")}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              fontSize: "0.88rem",
              fontWeight: "600",
              border: selectedLanguage === "" ? "2px solid #16836D" : "1px solid #DCE9E3",
              backgroundColor: selectedLanguage === "" ? "#16836D" : "#F7FBF9",
              color: selectedLanguage === "" ? "#FFFFFF" : "#303B37",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            🌐 All Languages (அனைத்தும்)
          </button>

          <button
            type="button"
            onClick={() => handleLanguageFilter("en-US")}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              fontSize: "0.88rem",
              fontWeight: "600",
              border: selectedLanguage === "en-US" ? "2px solid #16836D" : "1px solid #DCE9E3",
              backgroundColor: selectedLanguage === "en-US" ? "#16836D" : "#F7FBF9",
              color: selectedLanguage === "en-US" ? "#FFFFFF" : "#303B37",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            🇬🇧 English Only
          </button>

          <button
            type="button"
            onClick={() => handleLanguageFilter("ta-IN")}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              fontSize: "0.88rem",
              fontWeight: "600",
              border: selectedLanguage === "ta-IN" ? "2px solid #16836D" : "1px solid #DCE9E3",
              backgroundColor: selectedLanguage === "ta-IN" ? "#16836D" : "#F7FBF9",
              color: selectedLanguage === "ta-IN" ? "#FFFFFF" : "#303B37",
              cursor: "pointer",
              fontFamily: "'Noto Sans Tamil', 'Poppins', sans-serif",
              transition: "all 0.2s ease"
            }}
          >
            🇮🇳 தமிழ் (Tamil Only)
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: "#FDF2F2",
          border: "1px solid #D9534F",
          color: "#D9534F",
          borderRadius: "10px",
          padding: "14px",
          marginBottom: "24px"
        }}>
          {error}
        </div>
      )}

      {/* KPI Overview Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "32px"
      }}>
        <div className="nv-card" style={{ padding: "24px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600", textTransform: "uppercase" }}>
            Completed Sessions
          </span>
          <h2 style={{ fontSize: "2.2rem", color: "#16836D", margin: "8px 0" }}>
            {summary?.total_sessions || 0}
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#6B7772" }}>Full practice routines</span>
        </div>

        <div className="nv-card" style={{ padding: "24px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600", textTransform: "uppercase" }}>
            Total Exercises
          </span>
          <h2 style={{ fontSize: "2.2rem", color: "#16836D", margin: "8px 0" }}>
            {summary?.total_exercises || 0}
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#6B7772" }}>Words & phrases spoken</span>
        </div>

        <div className="nv-card" style={{ padding: "24px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600", textTransform: "uppercase" }}>
            Practice Time
          </span>
          <h2 style={{ fontSize: "2.2rem", color: "#16836D", margin: "8px 0" }}>
            {summary?.total_practice_time_minutes || 0} <span style={{ fontSize: "1rem", color: "#6B7772", fontWeight: "normal" }}>min</span>
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#6B7772" }}>Cumulative duration</span>
        </div>

        <div className="nv-card" style={{ padding: "24px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600", textTransform: "uppercase" }}>
            Average Match Score
          </span>
          <h2 style={{ fontSize: "2.2rem", color: "#16836D", margin: "8px 0" }}>
            {summary?.average_similarity_score || 0}%
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#6B7772" }}>Algorithmic string match</span>
        </div>

        <div className="nv-card" style={{ padding: "24px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600", textTransform: "uppercase" }}>
            Practice Streak
          </span>
          <h2 style={{ fontSize: "2.2rem", color: "#EAA83B", margin: "8px 0" }}>
            {summary?.current_streak || 0} <span style={{ fontSize: "1rem", color: "#6B7772", fontWeight: "normal" }}>days</span>
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#6B7772" }}>Active consecutive days</span>
        </div>
      </div>

      {/* Metric Limitation Notice */}
      <div style={{
        backgroundColor: "#F7FBF9",
        borderRadius: "14px",
        border: "1px solid #DCE9E3",
        padding: "16px 20px",
        marginBottom: "32px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }}>
        <Info size={20} color="#16836D" style={{ flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "0.85rem", color: "#6B7772", margin: 0, lineHeight: "1.5" }}>
          <strong>Understanding Matching Scores:</strong> Text similarity scores reflect string distance comparisons calculated by RapidFuzz. They are affected by background audio, microphone sensitivity, and dialect. A higher text similarity score represents closer transcription matching and must not be interpreted as proof of clinical neurological recovery.
        </p>
      </div>

      {/* Weekly Activity & Category Breakdown Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginBottom: "32px"
      }}>
        {/* Weekly Activity Visual Breakdown */}
        <div className="nv-card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.3rem", color: "#303B37", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={20} color="#16836D" />
            7-Day Activity Breakdown
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {summary?.weekly_activity?.map((day, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "600", color: "#303B37" }}>{day.date}</span>
                  <span style={{ color: "#6B7772" }}>
                    {day.minutes} min ({day.exercises} exercises)
                  </span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "#EBF3F0", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(100, (day.minutes / 20) * 100)}%`,
                    height: "100%",
                    backgroundColor: day.minutes > 0 ? "#16836D" : "transparent",
                    borderRadius: "4px"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category-Wise Performance */}
        <div className="nv-card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.3rem", color: "#303B37", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <BarChart2 size={20} color="#16836D" />
            Category Practice Breakdown
          </h3>

          {summary?.category_breakdown?.length === 0 ? (
            <p style={{ color: "#6B7772", fontSize: "0.95rem" }}>No category activity recorded yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {summary?.category_breakdown?.map((cat, idx) => (
                <div key={idx} style={{
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor: "#F7FBF9",
                  border: "1px solid #DCE9E3"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontWeight: "700", color: "#303B37", fontSize: "0.95rem" }}>
                      {cat.category_name}
                    </span>
                    <span style={{ fontWeight: "700", color: "#16836D", fontSize: "0.95rem" }}>
                      {cat.average_score}% avg
                    </span>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "#6B7772" }}>
                    {cat.attempts} total practice attempts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chronological Session History Table */}
      <div className="nv-card" style={{ padding: "32px", marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1.35rem", color: "#303B37", marginBottom: "20px" }}>
          Chronological Session Log
        </h3>

        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#6B7772" }}>No practice session history recorded yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #DCE9E3", color: "#6B7772", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px" }}>Date</th>
                  <th style={{ padding: "12px 16px" }}>Language</th>
                  <th style={{ padding: "12px 16px" }}>Duration</th>
                  <th style={{ padding: "12px 16px" }}>Items Spoken</th>
                  <th style={{ padding: "12px 16px" }}>Avg Similarity</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {history.map((sess) => (
                  <React.Fragment key={sess.session_id}>
                    <tr style={{ borderBottom: "1px solid #EBF3F0", fontSize: "0.95rem" }}>
                      <td style={{ padding: "16px", color: "#303B37", fontWeight: "500" }}>{sess.date}</td>
                      <td style={{ padding: "16px" }}>
                        {sess.language?.startsWith("ta") ? (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            backgroundColor: "#E6F4EA",
                            color: "#137333",
                            fontWeight: "600",
                            fontSize: "0.82rem",
                            fontFamily: "'Noto Sans Tamil', 'Poppins', sans-serif"
                          }}>
                            🇮🇳 தமிழ்
                          </span>
                        ) : (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            backgroundColor: "#E8F0FE",
                            color: "#1967D2",
                            fontWeight: "600",
                            fontSize: "0.82rem"
                          }}>
                            🇬🇧 English
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "16px", color: "#6B7772" }}>
                        {Math.max(1, Math.round(sess.duration_seconds / 60))} min ({sess.duration_seconds}s)
                      </td>
                      <td style={{ padding: "16px", color: "#303B37" }}>{sess.exercise_count} items</td>
                      <td style={{ padding: "16px" }}>
                        <span style={{
                          fontWeight: "700",
                          color: sess.average_score >= 80 ? "#16836D" : sess.average_score >= 60 ? "#EAA83B" : "#D9534F"
                        }}>
                          {sess.average_score}%
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span className="nv-pill" style={{ fontSize: "0.8rem", textTransform: "capitalize" }}>
                          {sess.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        {sess.responses && sess.responses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleSessionExpand(sess.session_id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#16836D",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            {expandedSessions[sess.session_id] ? (
                              <>Hide <ChevronUp size={16} /></>
                            ) : (
                              <>View Items ({sess.responses.length}) <ChevronDown size={16} /></>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedSessions[sess.session_id] && sess.responses && (
                      <tr style={{ backgroundColor: "#F7FBF9" }}>
                        <td colSpan={7} style={{ padding: "16px 24px" }}>
                          <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                          }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#6B7772", textTransform: "uppercase" }}>
                              Words & Phrases Practiced:
                            </span>
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                              gap: "12px"
                            }}>
                              {sess.responses.map((resp, rIdx) => (
                                <div
                                  key={rIdx}
                                  style={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #DCE9E3",
                                    borderRadius: "12px",
                                    padding: "12px 14px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px"
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <span style={{
                                      fontWeight: "700",
                                      fontSize: "1.05rem",
                                      color: "#303B37",
                                      fontFamily: resp.language?.startsWith("ta") ? "'Noto Sans Tamil', 'Poppins', sans-serif" : "inherit"
                                    }}>
                                      {resp.target_text}
                                    </span>
                                    <span style={{
                                      fontWeight: "700",
                                      fontSize: "0.85rem",
                                      color: resp.similarity_score >= 80 ? "#16836D" : resp.similarity_score >= 60 ? "#EAA83B" : "#D9534F"
                                    }}>
                                      {resp.similarity_score}%
                                    </span>
                                  </div>
                                  {resp.english_meaning && (
                                    <span style={{
                                      fontSize: "0.8rem",
                                      color: "#16836D",
                                      backgroundColor: "#D9F7EE",
                                      padding: "2px 8px",
                                      borderRadius: "8px",
                                      alignSelf: "flex-start",
                                      fontWeight: "500"
                                    }}>
                                      Meaning: {resp.english_meaning}
                                    </span>
                                  )}
                                  <div style={{ fontSize: "0.8rem", color: "#6B7772" }}>
                                    Spoken: <span style={{ color: "#303B37", fontStyle: "italic" }}>"{resp.recognized_text || "(no speech detected)"}"</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Progress;