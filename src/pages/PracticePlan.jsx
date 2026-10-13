import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import {
  getActivePlan,
  generatePlan,
  completePlanItem,
  getExerciseCategories
} from "../services/api";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Play,
  RefreshCw,
  Sparkles
} from "lucide-react";

const PracticePlan = () => {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Customization modal/settings
  const [targetMinutes, setTargetMinutes] = useState(15);
  const [difficulty, setDifficulty] = useState("beginner");

  useEffect(() => {
    loadPlanAndCategories();
  }, []);

  const loadPlanAndCategories = async () => {
    setLoading(true);
    try {
      const activePlan = await getActivePlan();
      setPlan(activePlan);
      if (activePlan) {
        setTargetMinutes(activePlan.daily_target_minutes || 15);
      }

      const cats = await getExerciseCategories();
      setCategories(cats || []);
    } catch (err) {
      console.error("Failed to load practice plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewPlan = async () => {
    setGenerating(true);
    try {
      const newPlan = await generatePlan({
        daily_target_minutes: targetMinutes,
        difficulty_preference: difficulty,
      });
      setPlan(newPlan);
    } catch (err) {
      console.error("Failed to generate plan:", err);
      alert("Unable to generate new practice plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleItemComplete = async (itemId) => {
    try {
      await completePlanItem(itemId);
      setPlan((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId
            ? { ...item, completed: true, completed_at: new Date().toISOString() }
            : item
        ),
      }));
    } catch (err) {
      console.error("Failed to update item status:", err);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ color: "#357F70", fontSize: "1.2rem" }}>Loading personalized practice plan...</p>
        </div>
      </AppLayout>
    );
  }

  const completedCount = plan?.items?.filter((i) => i.completed).length || 0;
  const totalCount = plan?.items?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <AppLayout>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2.2rem", color: "#357F70", marginBottom: "8px" }}>
          📅 Personalized Practice Plan
        </h1>
        <p style={{ color: "#6B7772", fontSize: "1.05rem" }}>
          Transparent, rule-based practice suggestions curated from exercises you haven't reviewed recently.
        </p>
      </div>

      {/* Plan Header Card */}
      <div className="nv-card" style={{ padding: "32px", marginBottom: "32px" }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Sparkles size={20} color="#357F70" />
              <h2 style={{ fontSize: "1.5rem", color: "#303B37", margin: 0 }}>
                Today's Curated Routine
              </h2>
            </div>
            <p style={{ color: "#6B7772", margin: 0, fontSize: "0.95rem" }}>
              Target: {plan?.daily_target_minutes || 15} minutes • {totalCount} structured exercises
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={handleGenerateNewPlan}
              disabled={generating}
              className="nv-btn-secondary"
              style={{ padding: "10px 18px", fontSize: "0.9rem" }}
            >
              <RefreshCw size={16} />
              <span>{generating ? "Updating Plan..." : "Regenerate Plan"}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "6px" }}>
            <span style={{ fontWeight: "600", color: "#303B37" }}>
              Today's Completion: {completedCount} of {totalCount} items finished
            </span>
            <span style={{ fontWeight: "700", color: "#357F70" }}>
              {progressPercent}%
            </span>
          </div>
          <div style={{ width: "100%", height: "10px", backgroundColor: "#EBF3F0", borderRadius: "5px", overflow: "hidden" }}>
            <div style={{
              width: `${progressPercent}%`,
              height: "100%",
              backgroundColor: "#357F70",
              borderRadius: "5px",
              transition: "width 0.4s ease"
            }} />
          </div>
        </div>
      </div>

      {/* Planned Exercises List */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1.35rem", color: "#303B37", marginBottom: "18px" }}>
          Suggested Practice Sequence
        </h3>

        {totalCount === 0 ? (
          <div className="nv-card" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "#6B7772" }}>No exercises currently scheduled.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {plan.items.map((item, idx) => (
              <div
                key={item.id}
                className="nv-card"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  borderLeft: item.completed ? "6px solid #357F70" : "6px solid #DCE9E3",
                  backgroundColor: item.completed ? "#FAFEFC" : "#FFFFFF"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <button
                    onClick={() => handleToggleItemComplete(item.id)}
                    title={item.completed ? "Completed" : "Mark as completed"}
                    style={{ color: item.completed ? "#357F70" : "#A0ABA6" }}
                  >
                    {item.completed ? <CheckCircle size={28} /> : <Circle size={28} />}
                  </button>

                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#6B7772" }}>
                        Step #{idx + 1}
                      </span>
                      {item.exercise && (
                        <span className="nv-pill" style={{ fontSize: "0.75rem", padding: "2px 8px" }}>
                          {item.exercise.difficulty}
                        </span>
                      )}
                    </div>
                    <h4 style={{
                      fontSize: "1.25rem",
                      color: item.completed ? "#6B7772" : "#303B37",
                      textDecoration: item.completed ? "line-through" : "none",
                      margin: 0
                    }}>
                      "{item.exercise?.target_text || "Exercise"}"
                    </h4>
                    {item.exercise?.prompt && (
                      <p style={{ fontSize: "0.85rem", color: "#6B7772", margin: "4px 0 0" }}>
                        {item.exercise.prompt}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    onClick={() => navigate(`/practice/${item.exercise_id}`)}
                    className="nv-btn-primary"
                    style={{ padding: "8px 18px", fontSize: "0.9rem" }}
                  >
                    <Play size={16} fill="#FFFFFF" />
                    <span>Practice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Rules & Non-Clinical Notice */}
      <div className="nv-card" style={{ padding: "28px", backgroundColor: "#F7FBF9" }}>
        <h4 style={{ color: "#357F70", fontSize: "1.05rem", marginBottom: "10px" }}>
          Transparent Recommendation Rules
        </h4>
        <p style={{ fontSize: "0.9rem", color: "#6B7772", lineHeight: "1.6", margin: 0 }}>
          This schedule is generated using transparent algorithmic rules: it queries active exercises, filters by your preferred categories, prioritizes exercises that have not been practiced recently, and paces content into manageable sets. These suggestions are practice aids and do not constitute customized medical prescription or therapy.
        </p>
      </div>
    </AppLayout>
  );
};

export default PracticePlan;
