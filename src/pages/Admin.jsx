import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import {
  getAdminStats,
  getAdminExercises,
  createAdminExercise,
  updateAdminExercise,
  deleteAdminExercise,
  getAdminCategories,
  getAdminContacts,
  markContactRead
} from "../services/api";
import {
  BookOpen,
  CheckCircle,
  Eye,
  Mail,
  Plus,
  Shield,
  Trash2,
  Users
} from "lucide-react";

const Admin = () => {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("exercises"); // "exercises", "contacts"
  const [loading, setLoading] = useState(true);

  // New Exercise Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEx, setNewEx] = useState({
    title: "",
    target_text: "",
    category_id: "",
    exercise_type: "word",
    difficulty: "beginner",
    prompt: "",
    hints: "",
  });

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, exData, catData, contactsData] = await Promise.all([
        getAdminStats(),
        getAdminExercises(),
        getAdminCategories(),
        getAdminContacts(),
      ]);
      setStats(statsData);
      setExercises(exData || []);
      setCategories(catData || []);
      setContacts(contactsData || []);
      if (catData && catData.length > 0) {
        setNewEx((prev) => ({ ...prev, category_id: catData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    try {
      const created = await createAdminExercise({
        ...newEx,
        category_id: parseInt(newEx.category_id, 10),
      });
      setExercises((prev) => [...prev, created]);
      setShowAddModal(false);
      setNewEx({
        title: "",
        target_text: "",
        category_id: categories[0]?.id || "",
        exercise_type: "word",
        difficulty: "beginner",
        prompt: "",
        hints: "",
      });
    } catch (err) {
      console.error("Failed to create exercise:", err);
      alert("Error adding exercise. Please verify all fields.");
    }
  };

  const handleDeleteExercise = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this exercise?")) return;
    try {
      await deleteAdminExercise(id);
      setExercises((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_active: false } : e))
      );
    } catch (err) {
      console.error("Failed to delete exercise:", err);
    }
  };

  const handleMarkContactRead = async (id) => {
    try {
      await markContactRead(id);
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_read: true } : c))
      );
    } catch (err) {
      console.error("Failed to mark contact as read:", err);
    }
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <Shield size={48} color="#D9534F" style={{ margin: "0 auto 16px" }} />
          <h2 style={{ color: "#303B37", marginBottom: "8px" }}>Access Denied</h2>
          <p style={{ color: "#6B7772" }}>Administrative credentials are required to view this panel.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <Shield size={28} color="#357F70" />
          <h1 style={{ fontSize: "2.2rem", color: "#357F70", margin: 0 }}>
            Platform Administration
          </h1>
        </div>
        <p style={{ color: "#6B7772", fontSize: "1.05rem" }}>
          Manage exercise library content, review usage metrics, and address contact messages.
        </p>
      </div>

      {/* Stats Overview Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "18px",
        marginBottom: "32px"
      }}>
        <div className="nv-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600" }}>TOTAL USERS</span>
          <h3 style={{ fontSize: "2rem", color: "#357F70", margin: "6px 0 0" }}>{stats?.total_users || 0}</h3>
        </div>

        <div className="nv-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600" }}>ACTIVE EXERCISES</span>
          <h3 style={{ fontSize: "2rem", color: "#357F70", margin: "6px 0 0" }}>{stats?.total_exercises || 0}</h3>
        </div>

        <div className="nv-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600" }}>PRACTICE SESSIONS</span>
          <h3 style={{ fontSize: "2rem", color: "#357F70", margin: "6px 0 0" }}>{stats?.total_sessions || 0}</h3>
        </div>

        <div className="nv-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600" }}>SPEECH RESPONSES</span>
          <h3 style={{ fontSize: "2rem", color: "#357F70", margin: "6px 0 0" }}>{stats?.total_responses || 0}</h3>
        </div>

        <div className="nv-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.85rem", color: "#6B7772", fontWeight: "600" }}>UNREAD INQUIRIES</span>
          <h3 style={{ fontSize: "2rem", color: stats?.unread_contacts > 0 ? "#D9534F" : "#357F70", margin: "6px 0 0" }}>
            {stats?.unread_contacts || 0}
          </h3>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #DCE9E3", paddingBottom: "12px" }}>
        <button
          onClick={() => setActiveTab("exercises")}
          style={{
            padding: "8px 18px",
            borderRadius: "10px",
            backgroundColor: activeTab === "exercises" ? "#D9F7EE" : "transparent",
            color: activeTab === "exercises" ? "#357F70" : "#6B7772",
            fontWeight: "700",
            fontSize: "0.95rem"
          }}
        >
          Exercises Management ({exercises.length})
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          style={{
            padding: "8px 18px",
            borderRadius: "10px",
            backgroundColor: activeTab === "contacts" ? "#D9F7EE" : "transparent",
            color: activeTab === "contacts" ? "#357F70" : "#6B7772",
            fontWeight: "700",
            fontSize: "0.95rem"
          }}
        >
          Contact Messages ({contacts.length})
        </button>
      </div>

      {/* Exercises Tab */}
      {activeTab === "exercises" && (
        <div className="nv-card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.3rem", color: "#303B37", margin: 0 }}>
              Curated Exercise Content
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="nv-btn-primary"
              style={{ padding: "10px 18px", fontSize: "0.9rem" }}
            >
              <Plus size={16} />
              <span>Create New Exercise</span>
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #DCE9E3", color: "#6B7772", fontSize: "0.85rem", textTransform: "uppercase" }}>
                  <th style={{ padding: "10px 14px" }}>ID</th>
                  <th style={{ padding: "10px 14px" }}>Title / Target Text</th>
                  <th style={{ padding: "10px 14px" }}>Category</th>
                  <th style={{ padding: "10px 14px" }}>Type</th>
                  <th style={{ padding: "10px 14px" }}>Difficulty</th>
                  <th style={{ padding: "10px 14px" }}>Status</th>
                  <th style={{ padding: "10px 14px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex) => (
                  <tr key={ex.id} style={{ borderBottom: "1px solid #EBF3F0", fontSize: "0.9rem" }}>
                    <td style={{ padding: "12px 14px", color: "#6B7772" }}>#{ex.id}</td>
                    <td style={{ padding: "12px 14px", color: "#303B37", fontWeight: "600" }}>"{ex.target_text}"</td>
                    <td style={{ padding: "12px 14px" }}>{ex.category_name || "General"}</td>
                    <td style={{ padding: "12px 14px", textTransform: "capitalize" }}>{ex.exercise_type}</td>
                    <td style={{ padding: "12px 14px", textTransform: "capitalize" }}>{ex.difficulty}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className="nv-pill" style={{
                        fontSize: "0.75rem",
                        backgroundColor: ex.is_active ? "#D9F7EE" : "#FDF2F2",
                        color: ex.is_active ? "#357F70" : "#D9534F"
                      }}>
                        {ex.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {ex.is_active && (
                        <button
                          onClick={() => handleDeleteExercise(ex.id)}
                          style={{ color: "#D9534F", padding: "4px" }}
                          title="Deactivate Exercise"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact Messages Tab */}
      {activeTab === "contacts" && (
        <div className="nv-card" style={{ padding: "32px" }}>
          <h3 style={{ fontSize: "1.3rem", color: "#303B37", marginBottom: "20px" }}>
            Submitted Contact Messages
          </h3>

          {contacts.length === 0 ? (
            <p style={{ color: "#6B7772" }}>No contact messages submitted yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {contacts.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid #DCE9E3",
                    backgroundColor: c.is_read ? "#FFFFFF" : "#F7FBF9",
                    borderLeft: c.is_read ? "1px solid #DCE9E3" : "5px solid #357F70"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <h4 style={{ color: "#303B37", fontSize: "1.1rem", margin: 0 }}>{c.subject}</h4>
                      <span style={{ fontSize: "0.85rem", color: "#6B7772" }}>
                        From: <strong>{c.name}</strong> ({c.email})
                      </span>
                    </div>
                    {!c.is_read && (
                      <button
                        onClick={() => handleMarkContactRead(c.id)}
                        className="nv-btn-outline"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      >
                        <CheckCircle size={14} />
                        <span>Mark as Read</span>
                      </button>
                    )}
                  </div>
                  <p style={{ color: "#303B37", fontSize: "0.95rem", lineHeight: "1.6", margin: "10px 0 0" }}>
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Exercise Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "20px"
        }}>
          <div className="nv-card" style={{ maxWidth: "560px", width: "100%", padding: "32px" }}>
            <h3 style={{ fontSize: "1.4rem", color: "#357F70", marginBottom: "20px" }}>
              Create New Exercise Prompt
            </h3>
            <form onSubmit={handleCreateExercise} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#303B37" }}>Exercise Title *</label>
                <input
                  type="text"
                  required
                  value={newEx.title}
                  onChange={(e) => setNewEx({ ...newEx, title: e.target.value })}
                  style={{ width: "100%" }}
                  placeholder="e.g., Apple"
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#303B37" }}>Target Text To Articulate *</label>
                <input
                  type="text"
                  required
                  value={newEx.target_text}
                  onChange={(e) => setNewEx({ ...newEx, target_text: e.target.value })}
                  style={{ width: "100%" }}
                  placeholder="e.g., Apple"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#303B37" }}>Category</label>
                  <select
                    value={newEx.category_id}
                    onChange={(e) => setNewEx({ ...newEx, category_id: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#303B37" }}>Difficulty</label>
                  <select
                    value={newEx.difficulty}
                    onChange={(e) => setNewEx({ ...newEx, difficulty: e.target.value })}
                    style={{ width: "100%" }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#303B37" }}>Prompt Instruction</label>
                <input
                  type="text"
                  value={newEx.prompt}
                  onChange={(e) => setNewEx({ ...newEx, prompt: e.target.value })}
                  style={{ width: "100%" }}
                  placeholder="e.g., Say the crisp red fruit"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="nv-btn-outline"
                  style={{ padding: "10px 18px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="nv-btn-primary"
                  style={{ padding: "10px 20px" }}
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Admin;
