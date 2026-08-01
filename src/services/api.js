import axios from "axios";

const API_URL = "http://127.0.0.1:8001";

const api = axios.create({
  baseURL: API_URL,
});

// =========================
// AUTH
// =========================

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

// =========================
// SESSION
// =========================

export const saveAuthSession = (data) => {
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

export const getStoredAuth = () => {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token || !user) {
    return null;
  }

  return {
    token,
    ...user,
  };
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// =========================
// SPEECH
// =========================

export const checkSpeech = async (
  expectedWord,
  spokenWord
) => {
  const response = await api.post(
    "/speech/check",
    {
      expected_word: expectedWord,
      spoken_word: spokenWord,
    }
  );

  return response.data;
};

// Alias for ImagePractice & PhrasePractice
export const evaluateSpeech = checkSpeech;

// =========================
// PROGRESS
// =========================

export const saveProgress = async (
  progressData
) => {
  const response = await api.post(
    "/progress/save",
    progressData
  );

  return response.data;
};

export const getProgress = async (
  userId
) => {
  const response = await api.get(
    `/progress/${userId}`
  );

  return response.data;
};

// Alias for Dashboard
export const fetchProgress = getProgress;

// =========================
// AI COACHING
// =========================

export const getCoachingTip = async (
  userId
) => {
  const response = await api.get(
    `/progress/coach/${userId}`
  );

  return response.data;
};

// =========================
// LOCAL PROGRESS
// =========================

export const saveLocalProgress = (
  progress
) => {
  localStorage.setItem(
    "progress",
    JSON.stringify(progress)
  );
};

export const getLocalProgress = () => {
  const data = localStorage.getItem("progress");

  return data
    ? JSON.parse(data)
    : {
        words: 0,
        images: 0,
        phrases: 0,
        correct: 0,
        attempts: 0,
      };
};

export default api;