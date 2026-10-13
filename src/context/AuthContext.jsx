import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredAuth,
  saveAuthSession,
  clearAuthSession,
  fetchCurrentUser,
  loginUser,
  registerUser,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("normal"); // "normal", "large", "xlarge"

  useEffect(() => {
    const initAuth = async () => {
      const stored = getStoredAuth();
      if (stored && stored.token) {
        try {
          const freshUser = await fetchCurrentUser();
          setUser(freshUser);
        } catch (e) {
          console.warn("Session expired or invalid, logging out:", e);
          clearAuthSession();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Sync contrast & font size with body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("contrast-high");
    } else {
      document.body.classList.remove("contrast-high");
    }

    document.body.classList.remove("font-scale-large", "font-scale-xlarge");
    if (fontSize === "large") {
      document.body.classList.add("font-scale-large");
    } else if (fontSize === "xlarge") {
      document.body.classList.add("font-scale-xlarge");
    }
  }, [highContrast, fontSize]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res.access_token) {
      saveAuthSession(res);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.access_token) {
      saveAuthSession(res);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const freshUser = await fetchCurrentUser();
      setUser(freshUser);
      return freshUser;
    } catch (e) {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        login,
        register,
        logout,
        refreshUser,
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
