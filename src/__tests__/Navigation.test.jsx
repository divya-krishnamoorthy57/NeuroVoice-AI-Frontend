import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Home from "../pages/Home";
import About from "../pages/About";
import Features from "../pages/Features";
import Contact from "../pages/Contact";

describe("Public Pages & Navigation", () => {
  it("renders the Home landing page with the official tagline and CTAs", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Empowering Communication Through Practice/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Rebuild Speech Confidence with Supportive AI Guidance/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start Practicing Now/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Features/i })).toBeInTheDocument();
  });

  it("renders the About page with purpose and clinical boundaries", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <About />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/About NeuroVoice AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Our Purpose & Vision/i)).toBeInTheDocument();
    expect(screen.getByText(/Limitations & Clinical Boundaries/i)).toBeInTheDocument();
  });

  it("renders the Features page with speech recognition and feedback descriptions", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Features />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Platform Features/i)).toBeInTheDocument();
    expect(screen.getByText(/Adaptive Text-to-Speech Audio Playback/i)).toBeInTheDocument();
    expect(screen.getByText(/Real Speech Recognition & Manual Fallback/i)).toBeInTheDocument();
  });

  it("renders the Contact page with validated input fields", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Contact />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Contact & Support/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Alex Johnson/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/alex@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Message/i })).toBeInTheDocument();
  });
});
