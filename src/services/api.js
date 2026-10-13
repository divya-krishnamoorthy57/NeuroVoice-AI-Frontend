import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTHENTICATION & SESSION
// ==========================================

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // Silent catch
  } finally {
    clearAuthSession();
  }
};

export const saveAuthSession = (data) => {
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
  }
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};

export const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

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

// ==========================================
// USER PROFILE
// ==========================================

export const getProfile = async () => {
  const response = await api.get("/profile/");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/profile/", profileData);
  return response.data;
};

// ==========================================
// EXERCISE LIBRARY
// ==========================================

export const getExerciseCategories = async () => {
  const response = await api.get("/exercises/categories");
  return response.data;
};

export const getCategories = getExerciseCategories;

export const getExercises = async (params = {}) => {
  const response = await api.get("/exercises/", { params });
  return response.data;
};

export const getExerciseById = async (id) => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};

export const toggleBookmark = async (exerciseId) => {
  const response = await api.post(`/exercises/${exerciseId}/bookmark`);
  return response.data;
};

export const getBookmarkedExercises = async () => {
  const response = await api.get("/exercises/bookmarked/list");
  return response.data;
};

// ==========================================
// PRACTICE SESSION & FEEDBACK
// ==========================================

export const evaluateSpeech = async (targetText, spokenText, exerciseType = "word", language = "en-US") => {
  const response = await api.post("/practice/feedback", {
    target_text: targetText,
    spoken_text: spokenText,
    exercise_type: exerciseType,
    language: language,
  });
  return response.data;
};

export const startPracticeSession = async (categoryId = null, language = "en-US") => {
  const response = await api.post("/practice/sessions", {
    category_id: categoryId,
    language: language,
  });
  return response.data;
};

export const getPracticeSessions = async (params = {}) => {
  const response = await api.get("/practice/sessions", { params });
  return response.data;
};

export const getPracticeSessionDetails = async (sessionId) => {
  const response = await api.get(`/practice/sessions/${sessionId}`);
  return response.data;
};

export const recordPracticeResponse = async (sessionId, responseData) => {
  const response = await api.post(`/practice/sessions/${sessionId}/responses`, responseData);
  return response.data;
};

export const completePracticeSession = async (sessionId, durationSeconds) => {
  const response = await api.post(`/practice/sessions/${sessionId}/complete`, {
    duration_seconds: durationSeconds,
  });
  return response.data;
};

// ==========================================
// DASHBOARD & PROGRESS
// ==========================================

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

export const getDashboardRecentActivity = async () => {
  const response = await api.get("/dashboard/recent-activity");
  return response.data;
};

export const getProgressSummary = async (params = {}) => {
  const response = await api.get("/progress/summary", { params });
  return response.data;
};

export const getProgressHistory = async (params = {}) => {
  const response = await api.get("/progress/history", { params });
  return response.data;
};

export const getCategoryBreakdown = async (params = {}) => {
  const response = await api.get("/progress/category-breakdown", { params });
  return response.data;
};

export const downloadProgressCsv = async (language = null) => {
  const params = language ? { language } : {};
  const response = await api.get("/progress/export", {
    params,
    responseType: "blob",
  });
  return response.data;
};

// ==========================================
// PREFERENCES & PRACTICE PLANS
// ==========================================

export const getPreferences = async () => {
  const response = await api.get("/preferences/");
  return response.data;
};

export const updatePreferences = async (prefData) => {
  const response = await api.put("/preferences/", prefData);
  return response.data;
};

export const getActivePlan = async () => {
  const response = await api.get("/plans/active");
  return response.data;
};

export const generatePlan = async (planData = {}) => {
  const response = await api.post("/plans/generate", planData);
  return response.data;
};

export const completePlanItem = async (itemId) => {
  const response = await api.post(`/plans/items/${itemId}/complete`);
  return response.data;
};

// ==========================================
// CONTACT MESSAGES
// ==========================================

export const submitContactMessage = async (messageData) => {
  const response = await api.post("/contact/", messageData);
  return response.data;
};

// ==========================================
// ADMINISTRATIVE FUNCTIONS
// ==========================================

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAdminExercises = async () => {
  const response = await api.get("/admin/exercises");
  return response.data;
};

export const createAdminExercise = async (data) => {
  const response = await api.post("/admin/exercises", data);
  return response.data;
};

export const updateAdminExercise = async (id, data) => {
  const response = await api.put(`/admin/exercises/${id}`, data);
  return response.data;
};

export const deleteAdminExercise = async (id) => {
  const response = await api.delete(`/admin/exercises/${id}`);
  return response.data;
};

export const getAdminCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data;
};

export const createAdminCategory = async (data) => {
  const response = await api.post("/admin/categories", data);
  return response.data;
};

export const getAdminContacts = async () => {
  const response = await api.get("/admin/contacts");
  return response.data;
};

export const markContactRead = async (id) => {
  const response = await api.put(`/admin/contacts/${id}/read`);
  return response.data;
};

// ==========================================
// LEGACY COMPATIBILITY HELPERS
// ==========================================

export const checkSpeech = async (expectedWord, spokenWord) => {
  const response = await api.post("/speech/check", {
    expected_word: expectedWord,
    spoken_word: spokenWord,
  });
  return response.data;
};

export const saveProgress = async (progressData) => {
  const response = await api.post("/progress/save", progressData);
  return response.data;
};

export const getProgress = async (userId) => {
  const response = await api.get(`/progress/${userId}`);
  return response.data;
};

export const fetchProgress = getProgress;

export const getCoachingTip = async (userId) => {
  const response = await api.get(`/progress/coach/${userId}`);
  return response.data;
};

export const getLocalProgress = () => {
  const data = localStorage.getItem("progress");
  return data
    ? JSON.parse(data)
    : { words: 0, images: 0, phrases: 0, correct: 0, attempts: 0 };
};

// ==========================================
// TEXT-TO-SPEECH (TTS) API
// ==========================================

export const getTTSStatus = async () => {
  const response = await api.get("/practice/tts/status");
  return response.data;
};

export const synthesizeSpeechAudio = async ({ text, language = "ta-IN", voice, rate = 0.8 }) => {
  const response = await api.post(
    "/practice/tts/synthesize",
    {
      text,
      language,
      voice,
      rate,
    },
    {
      responseType: "blob",
    }
  );
  return response.data; // audio/mpeg Blob
};

export default api;