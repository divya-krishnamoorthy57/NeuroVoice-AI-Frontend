import React, { useState } from "react";
import PublicLayout from "../layouts/PublicLayout";
import { submitContactMessage } from "../services/api";
import { CheckCircle, Mail, MessageSquare, Send, ShieldAlert } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate inputs
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (formData.message.trim().length < 10) {
      setErrorMsg("Message must be at least 10 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (res && res.id) {
        setSuccessMsg("Thank you! Your message has been received by our support team.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setErrorMsg("Unable to submit message. Please try again.");
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail || "Failed to deliver contact submission. Please check your connection."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="nv-pill" style={{ marginBottom: "14px" }}>
            Contact & Support
          </span>
          <h1 style={{ fontSize: "2.5rem", color: "#357F70", marginBottom: "16px" }}>
            We're Here to Listen
          </h1>
          <p style={{ color: "#6B7772", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Have feedback, accessibility suggestions, or technical questions? Send a direct message to our team below.
          </p>
        </div>

        <div className="nv-card" style={{ padding: "40px 32px" }}>
          {successMsg ? (
            <div style={{
              backgroundColor: "#D9F7EE",
              border: "1.5px solid #8ED8C5",
              borderRadius: "14px",
              padding: "32px 24px",
              textAlign: "center"
            }}>
              <CheckCircle size={44} color="#357F70" style={{ marginBottom: "16px", marginInline: "auto" }} />
              <h3 style={{ color: "#357F70", fontSize: "1.4rem", marginBottom: "10px" }}>
                Message Sent Successfully
              </h3>
              <p style={{ color: "#303B37", marginBottom: "24px" }}>
                {successMsg}
              </p>
              <button
                onClick={() => setSuccessMsg("")}
                className="nv-btn-primary"
                style={{ padding: "10px 20px" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {errorMsg && (
                <div style={{
                  backgroundColor: "#FDF2F2",
                  border: "1px solid #D9534F",
                  color: "#D9534F",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Alex Johnson"
                  required
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Your Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., alex@example.com"
                  required
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Question about everyday phrases practice"
                  required
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message or inquiry here..."
                  required
                  style={{ width: "100%" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="nv-btn-primary"
                style={{ padding: "14px 28px", alignSelf: "flex-start", marginTop: "8px" }}
              >
                <Send size={18} />
                <span>{submitting ? "Sending Message..." : "Send Message"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
