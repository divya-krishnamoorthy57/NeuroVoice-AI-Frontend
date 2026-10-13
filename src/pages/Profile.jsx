import React, { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/api";
import { CheckCircle, Save, ShieldAlert, Sliders, User } from "lucide-react";

const Profile = () => {
  const { user, refreshUser, highContrast, setHighContrast, fontSize, setFontSize } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age_range: "",
    preferred_language: "en-US",
    daily_practice_goal: 10,
    font_size_preference: "normal",
    high_contrast: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const data = await getProfile();
      setFormData({
        name: data.name || "",
        email: data.email || "",
        age_range: data.age_range || "",
        preferred_language: data.preferred_language || "en-US",
        daily_practice_goal: data.daily_practice_goal || 10,
        font_size_preference: data.font_size_preference || "normal",
        high_contrast: data.high_contrast || false,
      });
      setHighContrast(data.high_contrast || false);
      setFontSize(data.font_size_preference || "normal");
    } catch (err) {
      console.error("Failed to load profile:", err);
      setErrorMsg("Unable to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const updated = await updateProfile({
        name: formData.name.trim(),
        age_range: formData.age_range || null,
        preferred_language: formData.preferred_language,
        daily_practice_goal: parseInt(formData.daily_practice_goal, 10),
        font_size_preference: formData.font_size_preference,
        high_contrast: formData.high_contrast,
      });

      setHighContrast(updated.high_contrast);
      setFontSize(updated.font_size_preference);
      await refreshUser();
      setSuccessMsg("Profile and preferences successfully updated.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setErrorMsg("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ color: "#357F70", fontSize: "1.2rem" }}>Loading profile settings...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: "760px", margin: "0 auto", paddingBottom: "60px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.2rem", color: "#357F70", marginBottom: "8px" }}>
            👤 User Profile & Settings
          </h1>
          <p style={{ color: "#6B7772", fontSize: "1.05rem" }}>
            Manage your personal practice goals, accessibility choices, and account details.
          </p>
        </div>

        <div className="nv-card" style={{ padding: "40px 32px" }}>
          {successMsg && (
            <div style={{
              backgroundColor: "#D9F7EE",
              border: "1.5px solid #8ED8C5",
              color: "#357F70",
              borderRadius: "12px",
              padding: "14px 18px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600"
            }}>
              <CheckCircle size={20} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              backgroundColor: "#FDF2F2",
              border: "1px solid #D9534F",
              color: "#D9534F",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "24px"
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            {/* Account Details */}
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "#303B37", marginBottom: "16px", borderBottom: "1px solid #DCE9E3", paddingBottom: "8px" }}>
                Account Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{ width: "100%", backgroundColor: "#F7FBF9", cursor: "not-allowed" }}
                  />
                </div>
              </div>
            </div>

            {/* Practice Goals & Demographics */}
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "#303B37", marginBottom: "16px", borderBottom: "1px solid #DCE9E3", paddingBottom: "8px" }}>
                Practice Preferences
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                    Daily Practice Target
                  </label>
                  <select
                    name="daily_practice_goal"
                    value={formData.daily_practice_goal}
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
                    name="age_range"
                    value={formData.age_range}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  >
                    <option value="">Prefer not to specify</option>
                    <option value="18-35">18 - 35</option>
                    <option value="36-50">36 - 50</option>
                    <option value="51-65">51 - 65</option>
                    <option value="65+">65 and older</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Accessibility Choices */}
            <div>
              <h3 style={{ fontSize: "1.2rem", color: "#303B37", marginBottom: "16px", borderBottom: "1px solid #DCE9E3", paddingBottom: "8px" }}>
                Visual & Accessibility Preferences
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                    Font Size Scaling
                  </label>
                  <select
                    name="font_size_preference"
                    value={formData.font_size_preference}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  >
                    <option value="normal">Standard Font Size</option>
                    <option value="large">Large Text (+15%)</option>
                    <option value="xlarge">Extra Large Text (+30%)</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "28px" }}>
                  <input
                    type="checkbox"
                    id="highContrastCheck"
                    name="high_contrast"
                    checked={formData.high_contrast}
                    onChange={handleChange}
                    style={{ width: "20px", height: "20px", accentColor: "#357F70" }}
                  />
                  <label htmlFor="highContrastCheck" style={{ fontSize: "0.95rem", color: "#303B37", fontWeight: "600", cursor: "pointer" }}>
                    Enable High Contrast Mode
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div style={{ borderTop: "1px solid #DCE9E3", paddingTop: "24px", marginTop: "10px" }}>
              <button
                type="submit"
                disabled={saving}
                className="nv-btn-primary"
                style={{ padding: "14px 32px" }}
              >
                <Save size={18} />
                <span>{saving ? "Saving Changes..." : "Save Profile Settings"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
