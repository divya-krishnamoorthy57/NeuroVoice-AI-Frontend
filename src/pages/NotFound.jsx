import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <PublicLayout>
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ fontSize: "5rem", color: "#357F70", fontWeight: "800", marginBottom: "12px" }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.75rem", color: "#303B37", marginBottom: "16px" }}>
          Page Not Found
        </h2>
        <p style={{ color: "#6B7772", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto 32px" }}>
          The page or exercise you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="nv-btn-primary" style={{ padding: "12px 28px" }}>
          <Home size={18} />
          <span>Return to Home</span>
        </Link>
      </div>
    </PublicLayout>
  );
};

export default NotFound;
