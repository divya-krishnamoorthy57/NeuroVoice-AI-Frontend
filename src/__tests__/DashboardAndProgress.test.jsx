import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import Progress from "../pages/Progress";
import * as api from "../services/api";

describe("Dashboard & Progress Pages", () => {
  it("renders dashboard statistics from backend response", async () => {
    vi.spyOn(api, "getDashboardSummary").mockResolvedValue({
      user_name: "Divya",
      daily_goal_minutes: 15,
      today_practice_minutes: 10,
      today_completed_exercises: 5,
      daily_goal_percentage: 67,
      total_completed_exercises: 25,
      total_sessions_completed: 4,
      current_streak_days: 3,
      average_accuracy: 88.5,
      recommended_exercise: {
        id: 2,
        title: "Water",
        target_text: "Water",
        exercise_type: "word",
        difficulty: "beginner",
        prompt: "Say water"
      }
    });

    vi.spyOn(api, "getDashboardRecentActivity").mockResolvedValue({
      status: "success",
      data: [
        {
          session_id: 1,
          category: "Word Practice",
          exercise_count: 5,
          duration_seconds: 120,
          duration_formatted: "2 min",
          average_score: 90.0,
          date: "Oct 13, 2026 - 10:00"
        }
      ]
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(await screen.findByText(/Welcome back, Divya/i)).toBeInTheDocument();
    expect(screen.getAllByText(/NeuroVoice AI/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Let's practice speaking together/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Speech Practice/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /My Progress/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /About Aphasia/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Start Practicing/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /View Progress/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Learn More/i })).toBeInTheDocument();
  });

  it("renders progress overview and CSV export button", async () => {
    vi.spyOn(api, "getProgressSummary").mockResolvedValue({
      total_sessions: 5,
      total_exercises: 30,
      total_practice_time_minutes: 45,
      average_similarity_score: 87.0,
      current_streak: 4,
      category_breakdown: [
        { category_name: "Word Practice", slug: "word-practice", attempts: 15, average_score: 90.0 },
        { category_name: "Everyday Phrases", slug: "phrase-practice", attempts: 15, average_score: 84.0 },
      ],
      weekly_activity: [
        { date: "Mon 12", minutes: 15, exercises: 10 }
      ],
      score_trends: []
    });

    vi.spyOn(api, "getProgressHistory").mockResolvedValue({
      status: "success",
      data: []
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Progress />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(await screen.findByText(/Speech Progress & History/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Export Progress \(CSV\)/i })).toBeInTheDocument();
    expect(screen.getByText(/45/i)).toBeInTheDocument();
    expect(screen.getByText(/87%/i)).toBeInTheDocument();
  });

  it("filters progress records by language and displays Tamil badge with expanded item details", async () => {
    const summarySpy = vi.spyOn(api, "getProgressSummary").mockResolvedValue({
      total_sessions: 3,
      total_exercises: 15,
      total_practice_time_minutes: 20,
      average_similarity_score: 92.0,
      current_streak: 2,
      category_breakdown: [
        { category_name: "Food and drinks", slug: "food-and-drinks", attempts: 10, average_score: 95.0 }
      ],
      weekly_activity: []
    });

    const historySpy = vi.spyOn(api, "getProgressHistory").mockResolvedValue({
      status: "success",
      data: [
        {
          session_id: 101,
          language: "ta-IN",
          date: "2026-10-14 10:00:00",
          duration_seconds: 180,
          exercise_count: 1,
          average_score: 95.0,
          status: "completed",
          responses: [
            {
              target_text: "தண்ணீர்",
              english_meaning: "Water",
              recognized_text: "தண்ணீர்",
              similarity_score: 100.0,
              attempt_number: 1,
              language: "ta-IN"
            }
          ]
        }
      ]
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Progress />
        </AuthProvider>
      </BrowserRouter>
    );

    // Verify filter buttons exist
    expect(await screen.findByRole("button", { name: /All Languages \(அனைத்தும்\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /English Only/i })).toBeInTheDocument();
    const tamilFilterBtn = screen.getByRole("button", { name: /தமிழ் \(Tamil Only\)/i });
    expect(tamilFilterBtn).toBeInTheDocument();

    // Verify Tamil session language badge is rendered in the log table
    expect(screen.getByText(/^🇮🇳 தமிழ்$/i)).toBeInTheDocument();

    // Expand session details
    const viewItemsBtn = screen.getByRole("button", { name: /View Items \(1\)/i });
    expect(viewItemsBtn).toBeInTheDocument();
    fireEvent.click(viewItemsBtn);

    // Verify expanded word details
    expect(screen.getByText("தண்ணீர்")).toBeInTheDocument();
    expect(screen.getByText(/Meaning: Water/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();

    // Click Tamil filter and verify API called with language param
    fireEvent.click(tamilFilterBtn);
    await waitFor(() => {
      expect(summarySpy).toHaveBeenCalledWith({ language: "ta-IN" });
      expect(historySpy).toHaveBeenCalledWith({ language: "ta-IN" });
    });
  });
});
