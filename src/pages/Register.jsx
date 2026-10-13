import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { useAuth } from "../context/AuthContext";
import { UserPlus, ShieldAlert, CheckCircle } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    ageRange: "",
    dailyGoal: 10,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        age_range: form.ageRange || null,
        daily_practice_goal: parseInt(form.dailyGoal, 10) || 10,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. An account with this email may already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div style={{ maxWidth: "520px", margin: "40px auto 80px", padding: "0 20px" }}>
        <div className="nv-card" style={{ padding: "40px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #8ED8C5, #357F70)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "26px",
              margin: "0 auto 16px",
              boxShadow: "0 4px 12px rgba(53, 127, 112, 0.25)"
            }}>
              🗣️
            </div>
            <h1 style={{ fontSize: "1.85rem", color: "#357F70", marginBottom: "8px" }}>
              Begin Your Practice
            </h1>
            <p style={{ color: "#6B7772", fontSize: "0.95rem" }}>
              Create an account to track your speech sessions and progress.
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: "#FDF2F2",
              border: "1px solid #D9534F",
              color: "#D9534F",
              borderRadius: "10px",
              padding: "12px 14px",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px"
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Sarah Davis"
                required
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="sarah@example.com"
                required
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Daily Practice Goal
                </label>
                <select
                  name="dailyGoal"
                  value={form.dailyGoal}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                >
                  <option value={5}>5 minutes / day</option>
                  <option value={10}>10 minutes / day</option>
                  <option value={15}>15 minutes / day</option>
                  <option value={20}>20 minutes / day</option>
                  <option value={30}>30 minutes / day</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Age Range (Optional)
                </label>
                <select
                  name="ageRange"
                  value={form.ageRange}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                >
                  <option value="">Prefer not to say</option>
                  <option value="18-35">18 - 35</option>
                  <option value="36-50">36 - 50</option>
                  <option value="51-65">51 - 65</option>
                  <option value="65+">65 and older</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="nv-btn-primary"
              style={{ width: "100%", padding: "14px", marginTop: "12px" }}
            >
              <UserPlus size={18} />
              <span>{loading ? "Creating Account..." : "Create Account & Start"}</span>
            </button>
          </form>

          <div style={{ borderTop: "1px solid #DCE9E3", marginTop: "28px", paddingTop: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "0.95rem", color: "#6B7772" }}>
              Already registered?{" "}
              <Link to="/login" style={{ color: "#357F70", fontWeight: "700" }}>
                Log In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;