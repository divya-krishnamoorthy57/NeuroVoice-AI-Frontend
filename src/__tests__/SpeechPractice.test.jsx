import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PracticeSession from "../pages/PracticeSession";
import * as api from "../services/api";

describe("Speech Practice Module - 3 Practice Modes Redesign", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/practice");
    vi.restoreAllMocks();
  });

  it("renders Speech Training hub with prominent language selector and exactly three practice modes", async () => {
    vi.spyOn(api, "startPracticeSession").mockResolvedValue({ id: 99 });
    vi.spyOn(api, "getExercises").mockResolvedValue([]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <PracticeSession />
        </AuthProvider>
      </BrowserRouter>
    );

    // Verify friendly heading
    expect(screen.getByRole("heading", { name: /Let's practise together/i })).toBeInTheDocument();

    // Verify prominent Language Selector options
    expect(screen.getByRole("button", { name: /Practice in English/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Practice in Tamil/i })).toBeInTheDocument();

    // Verify exactly THREE practice mode cards
    expect(screen.getByRole("heading", { name: /Word Practice/i })).toBeInTheDocument();
    expect(screen.getByText(/Practise everyday words and build confidence one word at a time\./i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start Word Practice/i })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /Image Practice/i })).toBeInTheDocument();
    expect(screen.getByText(/Look at familiar pictures and practise naming everyday objects\./i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start Image Practice/i })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /Sentence Practice/i })).toBeInTheDocument();
    expect(screen.getByText(/Practise short, useful sentences for everyday communication\./i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start Sentence Practice/i })).toBeInTheDocument();
  });

  it("switches language between English and Tamil on the hub and updates cards and descriptions", async () => {
    vi.spyOn(api, "startPracticeSession").mockResolvedValue({ id: 99 });
    vi.spyOn(api, "getExercises").mockResolvedValue([]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <PracticeSession />
        </AuthProvider>
      </BrowserRouter>
    );

    // Switch to Tamil
    const tamilToggle = screen.getByRole("button", { name: /Practice in Tamil/i });
    fireEvent.click(tamilToggle);

    // Verify Tamil heading
    expect(await screen.findByRole("heading", { name: /ஒன்றாகப் பயிற்சி செய்வோம்/i })).toBeInTheDocument();

    // Verify Tamil card titles & buttons
    expect(screen.getByRole("heading", { name: /வார்த்தைப் பயிற்சி/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /வார்த்தைப் பயிற்சியைத் தொடங்கு/i })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /படப் பயிற்சி/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /படப் பயிற்சியைத் தொடங்கு/i })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /வாக்கியப் பயிற்சி/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /வாக்கியப் பயிற்சியைத் தொடங்கு/i })).toBeInTheDocument();
  });

  it("starts Word Practice activity with one-word-at-a-time, audio controls, and back button", async () => {
    vi.spyOn(api, "startPracticeSession").mockResolvedValue({ id: 101 });
    vi.spyOn(api, "getExercises").mockResolvedValue([
      {
        id: 1,
        title: "Apple",
        target_text: "Apple",
        exercise_type: "word",
        difficulty: "beginner",
        prompt: "A crisp fruit",
        example_sentence: "I eat an apple.",
        image_url: "apple.png"
      }
    ]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <PracticeSession />
        </AuthProvider>
      </BrowserRouter>
    );

    // Click Start Word Practice
    const startWordBtn = screen.getByRole("button", { name: /Start Word Practice/i });
    fireEvent.click(startWordBtn);

    // Verify navigation bar shows Back to Activities and timer
    expect(await screen.findByRole("button", { name: /Back to Activities/i })).toBeInTheDocument();
    expect(screen.getByText(/Word 1 of 1/i)).toBeInTheDocument();

    // Verify central card content
    expect(screen.getByRole("heading", { name: /APPLE/i })).toBeInTheDocument();
    expect(screen.getByText(/"I eat an apple."/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Listen to the word/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Speak the word/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Repeat/i })).toBeInTheDocument();
  });

  it("supports manual keyboard fallback and evaluates speech with spoken feedback", async () => {
    vi.spyOn(api, "startPracticeSession").mockResolvedValue({ id: 101 });
    vi.spyOn(api, "getExercises").mockResolvedValue([
      {
        id: 1,
        title: "Water",
        target_text: "Water",
        exercise_type: "word",
        difficulty: "beginner",
        example_sentence: "I drink water."
      }
    ]);
    vi.spyOn(api, "evaluateSpeech").mockResolvedValue({
      target_text: "Water",
      spoken_text: "water",
      similarity_score: 100,
      is_exact_match: true,
      matched_words: ["water"],
      missing_words: [],
      suggestion: "Wonderful! You said Water. Well done!"
    });
    vi.spyOn(api, "recordPracticeResponse").mockResolvedValue({ id: 1 });

    render(
      <BrowserRouter>
        <AuthProvider>
          <PracticeSession />
        </AuthProvider>
      </BrowserRouter>
    );

    // Launch Word Practice
    fireEvent.click(screen.getByRole("button", { name: /Start Word Practice/i }));

    // Toggle manual fallback
    const fallbackBtn = await screen.findByRole("button", { name: /Use Manual Keyboard Fallback/i });
    fireEvent.click(fallbackBtn);

    // Type and submit word
    const input = screen.getByPlaceholderText(/Type the word or phrase here/i);
    fireEvent.change(input, { target: { value: "water" } });
    fireEvent.click(screen.getByRole("button", { name: /Check/i }));

    // Verify feedback score and next actions
    await waitFor(() => {
      expect(screen.getByText(/Score: 100%/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Try Again/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Next Word/i })).toBeInTheDocument();
    });
  });

  it("starts Image Practice mode with object naming prompt and word reveal", async () => {
    vi.spyOn(api, "startPracticeSession").mockResolvedValue({ id: 102 });
    vi.spyOn(api, "getExercises").mockResolvedValue([
      {
        id: 20,
        title: "Phone (Naming)",
        target_text: "Phone",
        exercise_type: "image",
        difficulty: "beginner",
        prompt: "Look at the picture and say what this is.",
        image_url: "phone.png"
      }
    ]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <PracticeSession />
        </AuthProvider>
      </BrowserRouter>
    );

    // Click Start Image Practice
    fireEvent.click(screen.getByRole("button", { name: /Start Image Practice/i }));

    // Verify Image Practice prompt
    expect(await screen.findByRole("heading", { name: /What is this object\?/i })).toBeInTheDocument();
    expect(screen.getByText(/Look at the picture and say the word aloud\./i)).toBeInTheDocument();
    expect(screen.getByText(/Image 1 of 1/i)).toBeInTheDocument();

    // Verify hint button reveals target word
    const hintBtn = screen.getByRole("button", { name: /Show word hint/i });
    fireEvent.click(hintBtn);
    expect(screen.getByRole("heading", { name: /Phone/i })).toBeInTheDocument();
  });

  it("starts Sentence Practice mode with everyday sentences and bilingual translation in Tamil", async () => {
    vi.spyOn(api, "startPracticeSession").mockResolvedValue({ id: 103 });
    vi.spyOn(api, "getExercises").mockResolvedValue([
      {
        id: 301,
        title: "எனக்குத் தண்ணீர் வேண்டும்.",
        target_text: "எனக்குத் தண்ணீர் வேண்டும்.",
        english_meaning: "I need water.",
        exercise_type: "sentence",
        difficulty: "beginner",
        prompt: "தாகத்தின் போது தண்ணீர் கேட்கும் வாக்கியத்தைப் பயிற்சி செய்யுங்கள்.",
        language: "ta-IN"
      }
    ]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <PracticeSession />
        </AuthProvider>
      </BrowserRouter>
    );

    // Select Tamil
    fireEvent.click(screen.getByRole("button", { name: /Practice in Tamil/i }));

    // Click Start Sentence Practice in Tamil
    const startSentenceBtn = await screen.findByRole("button", { name: /வாக்கியப் பயிற்சியைத் தொடங்கு/i });
    fireEvent.click(startSentenceBtn);

    // Verify Tamil Sentence Practice view
    expect(await screen.findByRole("heading", { name: /எனக்குத் தண்ணீர் வேண்டும்\./i })).toBeInTheDocument();
    expect(screen.getByText(/I need water\./i)).toBeInTheDocument();
    expect(screen.getByText(/வாக்கியம் 1 of 1/i)).toBeInTheDocument();

    // Verify Back to Activities returns to hub
    const backBtn = screen.getByRole("button", { name: /பயிற்சிகளுக்குத் திரும்பு/i });
    fireEvent.click(backBtn);

    expect(await screen.findByRole("heading", { name: /ஒன்றாகப் பயிற்சி செய்வோம்/i })).toBeInTheDocument();
  });
});
