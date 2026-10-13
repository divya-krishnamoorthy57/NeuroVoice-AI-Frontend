import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { useAuth } from "../context/AuthContext";
import { LogIn, ShieldAlert, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid login credentials. Please verify your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div style={{ maxWidth: "460px", margin: "60px auto 80px", padding: "0 20px" }}>
        <div className="nv-card" style={{ padding: "40px 32px", textAlign: "center" }}>
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
            margin: "0 auto 20px",
            boxShadow: "0 4px 12px rgba(53, 127, 112, 0.25)"
          }}>
            🗣️
          </div>

          <h1 style={{ fontSize: "1.75rem", color: "#357F70", marginBottom: "8px" }}>
            Welcome Back
          </h1>
          <p style={{ color: "#6B7772", fontSize: "0.95rem", marginBottom: "28px" }}>
            Log in to continue your speech practice.
          </p>

          {error && (
            <div style={{
              backgroundColor: "#FDF2F2",
              border: "1px solid #D9534F",
              color: "#D9534F",
              borderRadius: "10px",
              padding: "12px 14px",
              fontSize: "0.9rem",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px"
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px", textAlign: "left" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{ width: "100%" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="nv-btn-primary"
              style={{ width: "100%", padding: "14px", marginTop: "10px" }}
            >
              <LogIn size={18} />
              <span>{loading ? "Signing In..." : "Log In"}</span>
            </button>
          </form>

          <div style={{ borderTop: "1px solid #DCE9E3", marginTop: "28px", paddingTop: "20px" }}>
            <p style={{ fontSize: "0.95rem", color: "#6B7772" }}>
              Don't have an account yet?{" "}
              <Link to="/register" style={{ color: "#357F70", fontWeight: "700" }}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;