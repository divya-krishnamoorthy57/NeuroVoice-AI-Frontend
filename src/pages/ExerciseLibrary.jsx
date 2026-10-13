import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import {
  getExercises,
  getExerciseCategories,
  toggleBookmark
} from "../services/api";
import {
  Bookmark,
  BookmarkCheck,
  Filter,
  Play,
  Search,
  Sparkles,
  Volume2
} from "lucide-react";

const ExerciseLibrary = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadExercises();
  }, [selectedCategory, selectedDifficulty, selectedType, searchTerm]);

  const loadCategories = async () => {
    try {
      const cats = await getExerciseCategories();
      setCategories(cats || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadExercises = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (selectedType) params.exercise_type = selectedType;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await getExercises(params);
      setExercises(data || []);
    } catch (err) {
      console.error("Failed to load exercises:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async (e, exId) => {
    e.stopPropagation();
    try {
      const res = await toggleBookmark(exId);
      setExercises((prev) =>
        prev.map((item) =>
          item.id === exId ? { ...item, is_bookmarked: res.is_bookmarked } : item
        )
      );
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    if (onlyBookmarked && !ex.is_bookmarked) return false;
    return true;
  });

  return (
    <AppLayout>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2.2rem", color: "#357F70", marginBottom: "8px" }}>
          📚 Speech Exercise Library
        </h1>
        <p style={{ color: "#6B7772", fontSize: "1.05rem" }}>
          Browse structured speaking prompts across categories, difficulty levels, and conversational scenarios.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="nv-card" style={{ padding: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
          {/* Keyword Search */}
          <div style={{ flex: "1 1 240px", position: "relative" }}>
            <Search size={18} color="#6B7772" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search words or phrases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", paddingLeft: "42px" }}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ flex: "0 1 200px" }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} ({c.exercise_count})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div style={{ flex: "0 1 160px" }}>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Exercise Type */}
          <div style={{ flex: "0 1 160px" }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">All Types</option>
              <option value="word">Words</option>
              <option value="phrase">Phrases</option>
              <option value="sentence">Sentences</option>
              <option value="conversation">Everyday</option>
            </select>
          </div>

          {/* Bookmarks Toggle Button */}
          <div>
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                backgroundColor: onlyBookmarked ? "#D9F7EE" : "#F7FBF9",
                border: "1.5px solid",
                borderColor: onlyBookmarked ? "#357F70" : "#DCE9E3",
                color: onlyBookmarked ? "#357F70" : "#6B7772",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.9rem"
              }}
            >
              {onlyBookmarked ? <BookmarkCheck size={18} color="#357F70" /> : <Bookmark size={18} />}
              <span>{onlyBookmarked ? "Bookmarked Only" : "All Items"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exercises List Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "#6B7772", fontSize: "1.1rem" }}>Loading exercises...</p>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="nv-card" style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🔍</div>
          <h3 style={{ color: "#303B37", marginBottom: "8px" }}>No Exercises Match Your Filters</h3>
          <p style={{ color: "#6B7772", marginBottom: "20px" }}>
            Try resetting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("");
              setSelectedDifficulty("");
              setSelectedType("");
              setSearchTerm("");
              setOnlyBookmarked(false);
            }}
            className="nv-btn-secondary"
            style={{ padding: "10px 20px" }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className="nv-card"
              style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative"
              }}
            >
              <div>
                {/* Header row: pills + bookmark icon */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="nv-pill" style={{ textTransform: "capitalize", fontSize: "0.8rem", padding: "4px 10px" }}>
                      {ex.category_name || ex.exercise_type}
                    </span>
                    <span
                      className="nv-pill"
                      style={{
                        fontSize: "0.8rem",
                        padding: "4px 10px",
                        backgroundColor:
                          ex.difficulty === "beginner"
                            ? "#D9F7EE"
                            : ex.difficulty === "intermediate"
                            ? "#FFF4E5"
                            : "#FBEAEB",
                        color:
                          ex.difficulty === "beginner"
                            ? "#357F70"
                            : ex.difficulty === "intermediate"
                            ? "#B4690E"
                            : "#C53030",
                        borderColor: "transparent",
                        textTransform: "capitalize"
                      }}
                    >
                      {ex.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleBookmarkToggle(e, ex.id)}
                    title={ex.is_bookmarked ? "Remove bookmark" : "Bookmark exercise"}
                    style={{
                      padding: "6px",
                      borderRadius: "8px",
                      color: ex.is_bookmarked ? "#357F70" : "#A0ABA6"
                    }}
                  >
                    {ex.is_bookmarked ? <BookmarkCheck size={20} fill="#357F70" /> : <Bookmark size={20} />}
                  </button>
                </div>

                {/* Target text */}
                <h3 style={{ fontSize: "1.4rem", color: "#303B37", marginBottom: "8px" }}>
                  "{ex.target_text}"
                </h3>

                {/* Prompt & Hints */}
                {ex.prompt && (
                  <p style={{ color: "#6B7772", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "8px" }}>
                    {ex.prompt}
                  </p>
                )}
                {ex.hints && (
                  <p style={{ color: "#357F70", fontSize: "0.85rem", fontStyle: "italic", marginBottom: "16px" }}>
                    💡 Hint: {ex.hints}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div style={{ borderTop: "1px solid #EBF3F0", paddingTop: "18px", marginTop: "16px" }}>
                <button
                  onClick={() => navigate(`/practice/${ex.id}`)}
                  className="nv-btn-primary"
                  style={{ width: "100%", padding: "10px", fontSize: "0.95rem" }}
                >
                  <Play size={16} fill="#FFFFFF" />
                  <span>Practice Exercise</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default ExerciseLibrary;
