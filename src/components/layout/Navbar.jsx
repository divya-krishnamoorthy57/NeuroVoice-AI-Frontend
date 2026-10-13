import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Menu, User, X } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #DCE9E3",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 2px 8px rgba(22, 131, 109, 0.04)"
    }}>
      <div style={{
        maxWidth: "1140px",
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "68px"
      }}>
        {/* Left: Neat Brand Logo & Name */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none"
          }}
        >
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "#D9F7EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            lineHeight: 1
          }}>
            🧠
          </div>
          <span style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#16836D",
            letterSpacing: "-0.2px"
          }}>
            NeuroVoice AI
          </span>
        </Link>

        {/* Right: Desktop Navigation Links */}
        <nav
          style={{ display: "none", alignItems: "center", gap: "28px" }}
          className="desktop-nav"
        >
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                style={{
                  fontWeight: isActive("/") ? "700" : "500",
                  color: isActive("/") ? "#16836D" : "#303B37",
                  fontSize: "0.95rem"
                }}
              >
                Home
              </Link>
              <Link
                to="/practice"
                style={{
                  fontWeight: isActive("/practice") ? "700" : "500",
                  color: isActive("/practice") ? "#16836D" : "#303B37",
                  fontSize: "0.95rem"
                }}
              >
                Speech Practice
              </Link>
              <Link
                to="/about"
                style={{
                  fontWeight: isActive("/about") ? "700" : "500",
                  color: isActive("/about") ? "#16836D" : "#303B37",
                  fontSize: "0.95rem"
                }}
              >
                About
              </Link>
              <div style={{ width: "1px", height: "20px", backgroundColor: "#DCE9E3", margin: "0 4px" }} />
              <Link
                to="/login"
                style={{
                  fontWeight: "600",
                  color: "#16836D",
                  fontSize: "0.95rem"
                }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="nv-btn-pill"
                style={{
                  padding: "8px 20px",
                  fontSize: "0.9rem",
                  textDecoration: "none"
                }}
              >
                Start Practicing
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                style={{
                  fontWeight: isActive("/dashboard") ? "700" : "500",
                  color: isActive("/dashboard") ? "#16836D" : "#303B37",
                  fontSize: "0.95rem"
                }}
              >
                Home
              </Link>
              <Link
                to="/practice"
                style={{
                  fontWeight: isActive("/practice") ? "700" : "500",
                  color: isActive("/practice") ? "#16836D" : "#303B37",
                  fontSize: "0.95rem"
                }}
              >
                Speech Practice
              </Link>
              <Link
                to="/progress"
                style={{
                  fontWeight: isActive("/progress") ? "700" : "500",
                  color: isActive("/progress") ? "#16836D" : "#303B37",
                  fontSize: "0.95rem"
                }}
              >
                My Progress
              </Link>

              <div style={{ width: "1px", height: "20px", backgroundColor: "#DCE9E3", margin: "0 4px" }} />

              {/* Minimal Profile & Logout Controls */}
              <Link
                to="/profile"
                title="Profile"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  backgroundColor: "#F7FBF9",
                  border: "1px solid #DCE9E3",
                  color: "#303B37",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                <User size={15} color="#16836D" />
                <span>{user?.name?.split(" ")[0] || "Profile"}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                style={{
                  padding: "6px 10px",
                  borderRadius: "20px",
                  border: "1px solid #FFD1D1",
                  color: "#D9534F",
                  backgroundColor: "#FFF8F8",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: "600",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            padding: "8px",
            borderRadius: "10px",
            border: "1px solid #DCE9E3",
            color: "#16836D",
            backgroundColor: "#F7FBF9",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu (Clean, no overlap) */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #DCE9E3",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)"
        }}>
          {!isAuthenticated ? (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontWeight: "600", color: "#303B37" }}>Home</Link>
              <Link to="/practice" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontWeight: "600", color: "#303B37" }}>Speech Practice</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontWeight: "600", color: "#303B37" }}>About</Link>
              <div style={{ height: "1px", backgroundColor: "#DCE9E3", margin: "4px 0" }} />
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontWeight: "600", color: "#16836D" }}>Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="nv-btn-pill" style={{ textAlign: "center", padding: "10px" }}>Start Practicing</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontWeight: "600", color: "#303B37" }}>Home</Link>
              <Link to="/practice" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontWeight: "600", color: "#303B37" }}>Speech Practice</Link>
              <Link to="/progress" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontWeight: "600", color: "#303B37" }}>My Progress</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ padding: "8px 0", fontWeight: "600", color: "#303B37" }}>Profile</Link>
              <div style={{ height: "1px", backgroundColor: "#DCE9E3", margin: "4px 0" }} />
              <button onClick={handleLogout} style={{ textAlign: "left", padding: "8px 0", color: "#D9534F", fontWeight: "600", background: "none", border: "none", cursor: "pointer" }}>Logout</button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
