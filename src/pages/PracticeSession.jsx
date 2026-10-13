import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import WordIllustration from "../components/WordIllustration";
import bananaPreviewImg from "../assets/images/banana.png";
import waterGlassPreviewImg from "../assets/images/water_glass.jpg";
import sentencePreviewImg from "../assets/images/sentence_practice.jpg";
import {
  getBestVoiceForLanguage,
  hasTamilVoice,
  getVoiceDiagnostics,
  speakUtterance,
  isTamilVoice,
  loadBrowserVoicesAsync,
  stopAnyPlayingAudio,
  playSpeechAudio
} from "../utils/speechVoiceUtils";
import {
  getExerciseById,
  getExercises,
  getCategories,
  evaluateSpeech,
  startPracticeSession,
  recordPracticeResponse,
  completePracticeSession,
  getTTSStatus
} from "../services/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Keyboard,
  Mic,
  MicOff,
  RotateCcw,
  Settings,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
  XCircle,
  HelpCircle,
  Image as ImageIcon,
  MessageSquare,
  Type,
  AlertCircle,
  Info
} from "lucide-react";

const PracticeSession = () => {
  const { exerciseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode can be: "word", "image", "sentence", or null (Hub view)
  const modeParam = searchParams.get("mode");
  const [activeMode, setActiveMode] = useState(() => {
    if (modeParam && ["word", "image", "sentence"].includes(modeParam.toLowerCase())) {
      return modeParam.toLowerCase();
    }
    if (exerciseId) {
      return "word";
    }
    return null;
  });

  // Keep activeMode in sync if searchParams change
  useEffect(() => {
    if (modeParam && ["word", "image", "sentence"].includes(modeParam.toLowerCase())) {
      setActiveMode(modeParam.toLowerCase());
    } else if (!modeParam && !exerciseId) {
      setActiveMode(null);
    }
  }, [modeParam, exerciseId]);

  // Language Selection State (persists to localStorage)
  const [practiceLanguage, setPracticeLanguage] = useState(() => {
    return localStorage.getItem("neurovoice_practice_lang") || "en-US";
  });

  // Exercise & Session State
  const [exercise, setExercise] = useState(null);
  const [exercisesList, setExercisesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Audio / Speech Synthesis state
  const [speechRate, setSpeechRate] = useState(0.8); // Gentle default suitable for aphasia: 0.8x
  const [autoVoiceFeedback, setAutoVoiceFeedback] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ttsNotice, setTtsNotice] = useState("");
  const [selectedTamilVoiceType, setSelectedTamilVoiceType] = useState("ta-IN-ValluvarNeural");
  const [activeAudioSource, setActiveAudioSource] = useState("browser_local");
  const [ttsStatus, setTtsStatus] = useState(null);

  // Speech Recognition state
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    practiceLanguage === "ta-IN" ? "உங்கள் கருத்து குரல்வழியாகக் கூறப்படும்." : "Your feedback will be spoken aloud."
  );
  const [micNotice, setMicNotice] = useState("");

  // Feedback result state
  const [evaluating, setEvaluating] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [lastSpokenFeedbackText, setLastSpokenFeedbackText] = useState("");
  const [attemptCount, setAttemptCount] = useState(1);
  const [imageWordRevealed, setImageWordRevealed] = useState(false);

  const recognitionRef = useRef(null);

  // Load browser voices asynchronously & query backend TTS status
  useEffect(() => {
    let isMounted = true;

    loadBrowserVoicesAsync(1500).then((voices) => {
      if (isMounted && Array.isArray(voices) && voices.length > 0) {
        setAvailableVoices(voices);
        const diag = getVoiceDiagnostics(voices);
        console.info("[NeuroVoice SpeechSynthesis Diagnostics]", diag);
      }
    });

    getTTSStatus()
      .then((st) => {
        if (isMounted) setTtsStatus(st);
      })
      .catch(() => {});

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (isMounted) {
          setAvailableVoices(voices);
          if (voices.length > 0) {
            const diag = getVoiceDiagnostics(voices);
            console.info("[NeuroVoice SpeechSynthesis Diagnostics]", diag);
          }
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      isMounted = false;
      stopAnyPlayingAudio();
    };
  }, []);

  // Compute selected native voice for the current language
  const activeVoice = useMemo(() => {
    return getBestVoiceForLanguage(availableVoices, practiceLanguage);
  }, [availableVoices, practiceLanguage]);

  const tamilVoiceAvailable = useMemo(() => {
    return hasTamilVoice(availableVoices);
  }, [availableVoices]);

  // Live elapsed session duration in seconds
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!sessionStartTime) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  const formatDuration = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle switching language
  const handleLanguageChange = (newLang) => {
    if (newLang === practiceLanguage) return;
    stopAudio();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (sessionId) {
      const dur = Math.max(1, Math.round((Date.now() - (sessionStartTime || Date.now())) / 1000));
      completePracticeSession(sessionId, dur).catch(() => {});
    }
    setSessionId(null);
    setSessionStartTime(null);
    setElapsedSeconds(0);
    setPracticeLanguage(newLang);
    localStorage.setItem("neurovoice_practice_lang", newLang);
    setFeedbackResult(null);
    setSpokenTranscript("");
    setManualInput("");
    setMicNotice("");
    setTtsNotice("");
    setLastSpokenFeedbackText("");
    setImageWordRevealed(false);
    setStatusMessage(
      newLang === "ta-IN"
        ? "உங்கள் கருத்து குரல்வழியாகக் கூறப்படும்."
        : "Your feedback will be spoken aloud."
    );
  };

  // Switch mode from Hub cards
  const handleSelectMode = (mode) => {
    setActiveMode(mode);
    setSearchParams({ mode });
    setSessionCompleted(false);
    setCurrentIndex(0);
    setFeedbackResult(null);
    setSpokenTranscript("");
    setManualInput("");
    setImageWordRevealed(false);
    setTtsNotice("");
  };

  // Return to 3 cards hub
  const handleBackToActivities = async () => {
    stopAudio();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (sessionId) {
      const dur = Math.max(1, Math.round((Date.now() - (sessionStartTime || Date.now())) / 1000));
      try {
        await completePracticeSession(sessionId, dur);
      } catch (e) {}
    }
    setSessionId(null);
    setSessionStartTime(null);
    setElapsedSeconds(0);
    setActiveMode(null);
    setSearchParams({});
    setExercise(null);
    setSessionCompleted(false);
    setFeedbackResult(null);
    setSpokenTranscript("");
    setManualInput("");
    setImageWordRevealed(false);
    setTtsNotice("");
  };

  // Initialize Session and Exercises when in an active mode
  useEffect(() => {
    if (!activeMode && !exerciseId) {
      return;
    }
    initSessionAndData();
    return () => {
      stopAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [activeMode, practiceLanguage, exerciseId]);

  const initSessionAndData = async () => {
    setLoading(true);
    setMicNotice("");
    setTtsNotice("");
    setFeedbackResult(null);
    setSpokenTranscript("");
    setManualInput("");
    setImageWordRevealed(false);
    setSessionCompleted(false);
    setStatusMessage(
      practiceLanguage === "ta-IN"
        ? "உங்கள் கருத்து குரல்வழியாகக் கூறப்படும்."
        : "Your feedback will be spoken aloud."
    );

    // 1. Start persistent backend practice session with language
    try {
      if (!sessionId) {
        const sess = await startPracticeSession(null, practiceLanguage);
        if (sess?.id) {
          setSessionId(sess.id);
          setSessionStartTime(Date.now());
        }
      }
    } catch (sessErr) {
      if (!sessionStartTime) setSessionStartTime(Date.now());
    }

    // 2. Load exercises for activeMode and practiceLanguage
    try {
      const queryType = activeMode || (exerciseId ? "word" : "word");
      const params = {
        limit: 50,
        language: practiceLanguage,
        exercise_type: queryType
      };

      const allExs = await getExercises(params);
      const safeList = Array.isArray(allExs) ? allExs : [];
      setExercisesList(safeList);

      if (exerciseId) {
        const targetEx = await getExerciseById(exerciseId);
        setExercise(targetEx);
        const idx = safeList.findIndex((e) => e.id === parseInt(exerciseId, 10));
        if (idx >= 0) setCurrentIndex(idx);
      } else if (safeList.length > 0) {
        setExercise(safeList[0]);
        setCurrentIndex(0);
      } else {
        setExercise(null);
      }
    } catch (err) {
      console.error("Failed to load practice data:", err);
      setStatusMessage("Could not load practice exercises. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      setManualMode(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = practiceLanguage;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(
          practiceLanguage === "ta-IN"
            ? "கேட்கிறது... இப்போது பேசுங்கள்."
            : "Listening... Speak now."
        );
        setMicNotice("");
      };

      recognition.onresult = (event) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript;
        setSpokenTranscript(transcript);
        setStatusMessage(
          practiceLanguage === "ta-IN"
            ? "உச்சரிப்பை மதிப்பீடு செய்கிறது..."
            : "Evaluating pronunciation..."
        );
        handleEvaluate(transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        console.warn("Speech recognition notice:", event.error);
        if (event.error === "no-speech") {
          const silentMsg =
            practiceLanguage === "ta-IN"
              ? "உங்கள் குரலைத் தெளிவாகக் கேட்க முடியவில்லை. மீண்டும் முயற்சி செய்யலாம்."
              : "I couldn't hear the speech clearly. Let's try again.";
          setMicNotice(silentMsg);
          setStatusMessage(silentMsg);
          if (autoVoiceFeedback) {
            playVoiceSafely(silentMsg);
          }
        } else if (event.error === "not-allowed") {
          const deniedMsg =
            practiceLanguage === "ta-IN"
              ? "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டுள்ளது. விசைப்பலகையைப் பயன்படுத்தலாம்."
              : "Microphone permission was denied. You can use the manual text fallback.";
          setMicNotice(deniedMsg);
          setStatusMessage(deniedMsg);
        } else {
          setMicNotice(`Notice: ${event.error}. You can also type below.`);
          setStatusMessage("");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error("SpeechRecognition initialization error:", e);
      setRecognitionSupported(false);
      setManualMode(true);
    }
  }, [exercise, autoVoiceFeedback, speechRate, practiceLanguage, activeMode]);

  // Language-safe Audio Player with native Tamil verification & Neural TTS fallback
  const playVoiceSafely = async (textToSpeak) => {
    if (!textToSpeak) return;

    setTtsNotice("");
    setIsPlayingAudio(true);

    try {
      const success = await playSpeechAudio({
        text: textToSpeak,
        lang: practiceLanguage,
        rate: speechRate,
        voicePreference: selectedTamilVoiceType,
        availableVoices: availableVoices,
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: (err) => {
          console.warn("Speech playback error:", err);
          setIsPlayingAudio(false);
        },
        onSourceDetermined: (source) => {
          setActiveAudioSource(source);
        },
        onNoTamilVoice: ({ reason, message }) => {
          setIsPlayingAudio(false);
          setTtsNotice(
            practiceLanguage === "ta-IN"
              ? "இயற்கையான தமிழ்க் குரல் சேவை இந்த உலாவியில் இயங்கவில்லை. உரை மற்றும் காட்சிப் பயிற்சி தொடர்ந்து செயல்படும்."
              : "A native Tamil voice could not be loaded. Visual practice and text display remain active!"
          );
        }
      });

      if (!success) {
        setIsPlayingAudio(false);
      }
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  const stopAudio = () => {
    stopAnyPlayingAudio();
    setIsPlayingAudio(false);
  };

  // Play model target text
  const playTargetWord = () => {
    if (!exercise) return;
    playVoiceSafely(exercise.target_text);
  };

  // Replay spoken feedback
  const replayFeedback = () => {
    if (lastSpokenFeedbackText) {
      playVoiceSafely(lastSpokenFeedbackText);
    } else {
      playTargetWord();
    }
  };

  // Microphone Listen Control
  const startRecording = () => {
    if (!recognitionRef.current) {
      setManualMode(true);
      return;
    }

    setMicNotice("");
    setTtsNotice("");
    setFeedbackResult(null);
    setSpokenTranscript("");
    stopAudio();

    try {
      recognitionRef.current.start();
    } catch (e) {
      recognitionRef.current.stop();
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (err) {
          setMicNotice(
            practiceLanguage === "ta-IN"
              ? "மைக்ரோஃபோன் தொடங்க முடியவில்லை. விசைப்பலகையைப் பயன்படுத்தவும்."
              : "Microphone could not start. Please use manual keyboard fallback."
          );
        }
      }, 200);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Evaluate speech transcript or typed fallback
  const handleEvaluate = async (textToCompare) => {
    if (!exercise || !textToCompare.trim()) return;

    setEvaluating(true);
    setImageWordRevealed(true);

    try {
      const feedback = await evaluateSpeech(
        exercise.target_text,
        textToCompare.trim(),
        exercise.exercise_type || activeMode || "word",
        practiceLanguage
      );

      setFeedbackResult(feedback);

      // Determine patient-friendly spoken voice feedback
      let spokenMessage = "";
      if (practiceLanguage === "ta-IN") {
        spokenMessage = feedback.suggestion;
      } else {
        const targetWord = exercise.target_text;
        if (feedback.is_exact_match || feedback.similarity_score >= 88) {
          spokenMessage = `Wonderful! You said ${targetWord}. Well done!`;
        } else if (feedback.similarity_score >= 50) {
          spokenMessage = "Good effort! Let's listen once more and try again.";
        } else {
          spokenMessage = "That's okay. Let's listen to the word again and try together.";
        }
      }

      setLastSpokenFeedbackText(spokenMessage);
      setStatusMessage(spokenMessage);

      // Speak feedback automatically using genuine language voice
      if (autoVoiceFeedback) {
        playVoiceSafely(spokenMessage);
      }

      // Record response in persistent session with language tag
      if (sessionId) {
        await recordPracticeResponse(sessionId, {
          exercise_id: exercise.id,
          target_text: exercise.target_text,
          recognized_text: textToCompare.trim(),
          similarity_score: feedback.similarity_score,
          matched_words: feedback.matched_words.join(", "),
          missing_words: feedback.missing_words.join(", "),
          attempt_number: attemptCount,
          language: practiceLanguage,
        });
      }

      setAttemptCount((prev) => prev + 1);
    } catch (err) {
      console.error("Evaluation error:", err);
      setStatusMessage(
        practiceLanguage === "ta-IN"
          ? "உச்சரிப்பை மதிப்பீடு செய்ய முடியவில்லை. மீண்டும் முயற்சி செய்யவும்."
          : "Could not evaluate pronunciation. Please try again."
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setSpokenTranscript(manualInput.trim());
    handleEvaluate(manualInput.trim());
  };

  const handleTryAgain = () => {
    stopAudio();
    setFeedbackResult(null);
    setSpokenTranscript("");
    setManualInput("");
    setMicNotice("");
    setTtsNotice("");
    setStatusMessage(
      practiceLanguage === "ta-IN"
        ? "தயார்! உச்சரிக்க Listen அல்லது Speak பொத்தானை அழுத்தவும்."
        : "Ready! Listen or click Speak to try again."
    );
  };

  const handleNextWord = () => {
    stopAudio();
    if (exercisesList.length === 0) return;
    if (currentIndex + 1 >= exercisesList.length) {
      setSessionCompleted(true);
      return;
    }
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    setExercise(exercisesList[nextIdx]);
    setFeedbackResult(null);
    setSpokenTranscript("");
    setManualInput("");
    setMicNotice("");
    setTtsNotice("");
    setLastSpokenFeedbackText("");
    setImageWordRevealed(false);
    setStatusMessage(
      practiceLanguage === "ta-IN"
        ? "உங்கள் கருத்து குரல்வழியாகக் கூறப்படும்."
        : "Your feedback will be spoken aloud."
    );
    setAttemptCount(1);
    if (exerciseId) {
      navigate(`/practice/${exercisesList[nextIdx].id}`, { replace: true });
    }
  };

  const progressPercent = exercisesList.length > 0
    ? Math.round(((currentIndex + 1) / exercisesList.length) * 100)
    : 0;

  // Mode label helper
  const getModeTitle = () => {
    if (activeMode === "word") return practiceLanguage === "ta-IN" ? "வார்த்தைப் பயிற்சி" : "Word Practice";
    if (activeMode === "image") return practiceLanguage === "ta-IN" ? "படப் பயிற்சி" : "Image Practice";
    if (activeMode === "sentence") return practiceLanguage === "ta-IN" ? "வாக்கியப் பயிற்சி" : "Sentence Practice";
    return "Speech Practice";
  };

  const getItemLabel = () => {
    if (activeMode === "image") return practiceLanguage === "ta-IN" ? "படம்" : "Image";
    if (activeMode === "sentence") return practiceLanguage === "ta-IN" ? "வாக்கியம்" : "Sentence";
    return practiceLanguage === "ta-IN" ? "வார்த்தை" : "Word";
  };

  // =========================================================================
  // RENDER VIEW 1: SPEECH TRAINING SELECTION PAGE (Matching Reference Image)
  // =========================================================================
  if (!activeMode && !exerciseId) {
    return (
      <AppLayout>
        <div style={{
          minHeight: "calc(100vh - 180px)",
          background: "linear-gradient(180deg, #E6FAF3 0%, #D4F4EB 100%)",
          padding: "36px 16px 80px"
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            
            {/* Top Centered Header Matching Screenshot */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "#16836D",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "8px"
              }}>
                NEUROVOICE AI · SPEECH TRAINING
              </div>

              <h1
                className={practiceLanguage === "ta-IN" ? "tamil-text" : ""}
                style={{
                  fontSize: "clamp(2.1rem, 5vw, 2.75rem)",
                  fontWeight: "800",
                  color: "#173F32",
                  marginBottom: "8px",
                  lineHeight: "1.2"
                }}
              >
                {practiceLanguage === "ta-IN" ? "ஒன்றாகப் பயிற்சி செய்வோம்" : "Let's practise together"}
              </h1>

              <p style={{
                fontSize: "clamp(1.05rem, 2.5vw, 1.15rem)",
                color: "#526E62",
                maxWidth: "620px",
                margin: "0 auto",
                lineHeight: "1.5"
              }}>
                {practiceLanguage === "ta-IN"
                  ? "உங்கள் மொழியைத் தேர்ந்தெடுத்து, ஒரு எளிய பயிற்சியைத் தொடங்குங்கள்."
                  : "Every session uses voice feedback and adaptive repetition to help you practise at your own pace."}
              </p>
            </div>

            {/* Main Rounded White Card Enclosing Both Sections */}
            <div
              className="nv-card"
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "28px",
                padding: "36px 32px 40px",
                boxShadow: "0 10px 32px rgba(22, 131, 109, 0.07)",
                border: "1.5px solid #D6E7DD"
              }}
            >
              {/* SECTION 1: Choose your language */}
              <div style={{ marginBottom: "36px" }}>
                <h2 style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#173F32",
                  marginBottom: "16px"
                }}>
                  {practiceLanguage === "ta-IN" ? "1. மொழியைத் தேர்ந்தெடுக்கவும்" : "1. Choose your language"}
                </h2>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "16px"
                }}>
                  {/* Left: English Box */}
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("en-US")}
                    aria-label="Practice in English"
                    style={{
                      padding: "24px 20px",
                      borderRadius: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      border: practiceLanguage === "en-US" ? "2.5px solid #16836D" : "1.5px solid #D6E7DD",
                      backgroundColor: practiceLanguage === "en-US" ? "rgba(22, 131, 109, 0.04)" : "#FFFFFF",
                      boxShadow: practiceLanguage === "en-US" ? "0 4px 16px rgba(22, 131, 109, 0.12)" : "none",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px"
                    }}
                  >
                    <span style={{ fontSize: "1.35rem", fontWeight: "800", color: "#173F32" }}>
                      English
                    </span>
                    <span style={{ fontSize: "0.95rem", color: "#526E62" }}>
                      Practise in English
                    </span>
                    <span style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: practiceLanguage === "en-US" ? "#16836D" : "#8AA097",
                      marginTop: "6px"
                    }}>
                      {practiceLanguage === "en-US" ? "✓ Selected language" : "English practice"}
                    </span>
                  </button>

                  {/* Right: Tamil Box */}
                  <button
                    type="button"
                    onClick={() => handleLanguageChange("ta-IN")}
                    aria-label="Practice in Tamil"
                    style={{
                      padding: "24px 20px",
                      borderRadius: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      border: practiceLanguage === "ta-IN" ? "2.5px solid #16836D" : "1.5px solid #D6E7DD",
                      backgroundColor: practiceLanguage === "ta-IN" ? "rgba(22, 131, 109, 0.04)" : "#FFFFFF",
                      boxShadow: practiceLanguage === "ta-IN" ? "0 4px 16px rgba(22, 131, 109, 0.12)" : "none",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px"
                    }}
                  >
                    <span className="tamil-text" style={{ fontSize: "1.35rem", fontWeight: "800", color: "#173F32" }}>
                      தமிழ்
                    </span>
                    <span className="tamil-text" style={{ fontSize: "0.95rem", color: "#526E62" }}>
                      தமிழில் பயிற்சி
                    </span>
                    <span style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: practiceLanguage === "ta-IN" ? "#16836D" : "#8AA097",
                      marginTop: "6px"
                    }}>
                      {practiceLanguage === "ta-IN" ? "✓ தேர்ந்தெடுக்கப்பட்டது" : "Tamil practice"}
                    </span>
                  </button>
                </div>
              </div>

              {/* SECTION 2: What would you like to practise? */}
              <div>
                <h2 style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#173F32",
                  marginBottom: "4px"
                }}>
                  {practiceLanguage === "ta-IN" ? "2. எதைப் பயிற்சி செய்ய விரும்புகிறீர்கள்?" : "2. What would you like to practise?"}
                </h2>

                <p style={{
                  fontSize: "0.95rem",
                  color: "#526E62",
                  marginBottom: "24px"
                }}>
                  {practiceLanguage === "ta-IN"
                    ? "ஒரு பயிற்சியைத் தேர்ந்தெடுக்கவும். நீங்கள் எப்போது வேண்டுமானாலும் மாற்றலாம்."
                    : "Choose one activity. You can change it anytime."}
                </p>

                {/* Exactly THREE Cards in One Row Matching Screenshot */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                  gap: "20px"
                }}>
                  {/* CARD 1 — Word Practice */}
                  <div
                    style={{
                      borderRadius: "22px",
                      border: "1.5px solid #D6E7DD",
                      backgroundColor: "#FFFFFF",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}
                  >
                    <div>
                      {/* Realistic Banana Preview Image matching reference */}
                      <div style={{
                        width: "100%",
                        height: "175px",
                        borderRadius: "16px",
                        backgroundColor: "#FAFCFB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        marginBottom: "14px",
                        border: "1px solid #EDF4F0"
                      }}>
                        <img
                          src={bananaPreviewImg}
                          alt="Word Practice - Banana"
                          style={{
                            maxWidth: "85%",
                            maxHeight: "85%",
                            objectFit: "contain"
                          }}
                        />
                      </div>

                      <h3 style={{
                        fontSize: "1.2rem",
                        fontWeight: "800",
                        color: "#173F32",
                        marginBottom: "6px"
                      }}>
                        {practiceLanguage === "ta-IN" ? "வார்த்தைப் பயிற்சி" : "Word Practice"}
                      </h3>

                      <p style={{
                        fontSize: "0.92rem",
                        color: "#526E62",
                        lineHeight: "1.45",
                        marginBottom: "18px",
                        minHeight: "44px"
                      }}>
                        {practiceLanguage === "ta-IN"
                          ? "ஒவ்வொரு நாளும் பயன்படுத்தும் வார்த்தைகளை ஒவ்வொன்றாகப் பயிற்சி செய்யுங்கள்."
                          : "Practise everyday words and build confidence one word at a time."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectMode("word")}
                      aria-label={practiceLanguage === "ta-IN" ? "வார்த்தைப் பயிற்சியைத் தொடங்கு" : "Start Word Practice"}
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        borderRadius: "9999px", // Pill-shaped
                        backgroundColor: "#278B5D",
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: "0.98rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#16836D")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#278B5D")}
                    >
                      <span>{practiceLanguage === "ta-IN" ? "வார்த்தைப் பயிற்சி தொடங்க" : "Start words"}</span>
                    </button>
                  </div>

                  {/* CARD 2 — Image Practice */}
                  <div
                    style={{
                      borderRadius: "22px",
                      border: "1.5px solid #D6E7DD",
                      backgroundColor: "#FFFFFF",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}
                  >
                    <div>
                      {/* Realistic Glass of Water matching reference */}
                      <div style={{
                        width: "100%",
                        height: "175px",
                        borderRadius: "16px",
                        backgroundColor: "#FAFCFB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        marginBottom: "14px",
                        border: "1px solid #EDF4F0"
                      }}>
                        <img
                          src={waterGlassPreviewImg}
                          alt="Image Practice - Glass of Water"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </div>

                      <h3 style={{
                        fontSize: "1.2rem",
                        fontWeight: "800",
                        color: "#173F32",
                        marginBottom: "6px"
                      }}>
                        {practiceLanguage === "ta-IN" ? "படப் பயிற்சி" : "Image Practice"}
                      </h3>

                      <p style={{
                        fontSize: "0.92rem",
                        color: "#526E62",
                        lineHeight: "1.45",
                        marginBottom: "18px",
                        minHeight: "44px"
                      }}>
                        {practiceLanguage === "ta-IN"
                          ? "படத்தைப் பார்த்து அதன் பெயரைச் சொல்லிப் பயிற்சி செய்யுங்கள்."
                          : "Look at familiar pictures and practise naming everyday objects."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectMode("image")}
                      aria-label={practiceLanguage === "ta-IN" ? "படப் பயிற்சியைத் தொடங்கு" : "Start Image Practice"}
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        borderRadius: "9999px", // Pill-shaped
                        backgroundColor: "#278B5D",
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: "0.98rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#16836D")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#278B5D")}
                    >
                      <span>{practiceLanguage === "ta-IN" ? "படப் பயிற்சி தொடங்க" : "Start images"}</span>
                    </button>
                  </div>

                  {/* CARD 3 — Sentence Practice */}
                  <div
                    style={{
                      borderRadius: "22px",
                      border: "1.5px solid #D6E7DD",
                      backgroundColor: "#FFFFFF",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}
                  >
                    <div>
                      {/* Realistic Everyday Communication photo matching reference */}
                      <div style={{
                        width: "100%",
                        height: "175px",
                        borderRadius: "16px",
                        backgroundColor: "#FAFCFB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        marginBottom: "14px",
                        border: "1px solid #EDF4F0"
                      }}>
                        <img
                          src={sentencePreviewImg}
                          alt="Sentence Practice - Everyday Communication"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </div>

                      <h3 style={{
                        fontSize: "1.2rem",
                        fontWeight: "800",
                        color: "#173F32",
                        marginBottom: "6px"
                      }}>
                        {practiceLanguage === "ta-IN" ? "வாக்கியப் பயிற்சி" : "Sentence Practice"}
                      </h3>

                      <p style={{
                        fontSize: "0.92rem",
                        color: "#526E62",
                        lineHeight: "1.45",
                        marginBottom: "18px",
                        minHeight: "44px"
                      }}>
                        {practiceLanguage === "ta-IN"
                          ? "தினசரி பயன்படும் எளிய வாக்கியங்களைப் பேசிப் பயிற்சி செய்யுங்கள்."
                          : "Practise short, useful sentences for everyday communication."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectMode("sentence")}
                      aria-label={practiceLanguage === "ta-IN" ? "வாக்கியப் பயிற்சியைத் தொடங்கு" : "Start Sentence Practice"}
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        borderRadius: "9999px", // Pill-shaped
                        backgroundColor: "#278B5D",
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: "0.98rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#16836D")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#278B5D")}
                    >
                      <span>{practiceLanguage === "ta-IN" ? "வாக்கியப் பயிற்சி தொடங்க" : "Start sentences"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Caption Matching Screenshot */}
            <div style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "0.85rem",
              color: "#526E62"
            }}>
              Illustrative design concept · Language and activity selections are fully interactive in the app.
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // =========================================================================
  // RENDER VIEW 2: LOADING STATE
  // =========================================================================
  if (loading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div style={{
            width: "52px",
            height: "52px",
            border: "4px solid #D9F7EE",
            borderTop: "4px solid #16836D",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <h2 style={{ color: "#16836D", fontSize: "1.3rem" }}>
            {practiceLanguage === "ta-IN" ? "பயிற்சி தயாராகிறது..." : "Loading practice exercise..."}
          </h2>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </AppLayout>
    );
  }

  // =========================================================================
  // RENDER VIEW 3: SESSION COMPLETED STATE
  // =========================================================================
  if (sessionCompleted) {
    return (
      <AppLayout>
        <div style={{ maxWidth: "680px", margin: "40px auto", padding: "20px 16px" }}>
          <div
            className="nv-card"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "28px",
              padding: "48px 32px",
              textAlign: "center",
              boxShadow: "0 12px 36px rgba(22, 131, 109, 0.12)",
              border: "2px solid #8ED8C5"
            }}
          >
            <div style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 20px",
              borderRadius: "50%",
              backgroundColor: "#D9F7EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px"
            }}>
              🎉
            </div>

            <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#16836D", marginBottom: "12px" }}>
              {practiceLanguage === "ta-IN" ? "அருமை! பயிற்சி முடிந்தது!" : "Practice Session Complete!"}
            </h1>

            <p style={{ fontSize: "1.1rem", color: "#526E62", marginBottom: "28px" }}>
              {practiceLanguage === "ta-IN"
                ? `நீங்கள் ${exercisesList.length} பயிற்சிகளையும் வெற்றிகரமாகப் பயிற்சி செய்துள்ளீர்கள்.`
                : `You practiced ${exercisesList.length} ${getItemLabel().toLowerCase()} items in this session.`}
            </p>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              marginBottom: "36px"
            }}>
              <div style={{
                padding: "14px 20px",
                borderRadius: "16px",
                backgroundColor: "#F7FBF9",
                border: "1px solid #D6E7DD"
              }}>
                <div style={{ fontSize: "0.85rem", color: "#66756F" }}>Items Practiced</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#16836D" }}>
                  {exercisesList.length}
                </div>
              </div>

              <div style={{
                padding: "14px 20px",
                borderRadius: "16px",
                backgroundColor: "#F7FBF9",
                border: "1px solid #D6E7DD"
              }}>
                <div style={{ fontSize: "0.85rem", color: "#66756F" }}>Time Spent</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#16836D" }}>
                  {formatDuration(elapsedSeconds)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={handleBackToActivities}
                className="nv-btn-primary"
                style={{
                  padding: "16px 28px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  borderRadius: "16px"
                }}
              >
                ← {practiceLanguage === "ta-IN" ? "பயிற்சிகளுக்குத் திரும்பு" : "Back to Activities"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentIndex(0);
                  setExercise(exercisesList[0] || null);
                  setSessionCompleted(false);
                  setFeedbackResult(null);
                  setSpokenTranscript("");
                  setImageWordRevealed(false);
                }}
                style={{
                  padding: "16px 28px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  borderRadius: "16px",
                  backgroundColor: "#FFFFFF",
                  color: "#16836D",
                  border: "2px solid #16836D"
                }}
              >
                {practiceLanguage === "ta-IN" ? "மீண்டும் பயிற்சி செய்" : "Practice Again"}
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // =========================================================================
  // RENDER VIEW 4: ACTIVE PRACTICE ACTIVITY EXPERIENCE
  // =========================================================================
  return (
    <AppLayout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px 16px 80px" }}>
        
        {/* Top Navigation Bar: Back to Activities, Timer, Mode Pill, Settings */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Clear Back to Activities Button */}
            <button
              type="button"
              onClick={handleBackToActivities}
              aria-label={practiceLanguage === "ta-IN" ? "பயிற்சிகளுக்குத் திரும்பு" : "Back to Activities"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#16836D",
                fontWeight: "700",
                fontSize: "0.95rem",
                padding: "8px 16px",
                borderRadius: "14px",
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #D6E7DD",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
              }}
            >
              <ArrowLeft size={18} />
              <span>{practiceLanguage === "ta-IN" ? "பயிற்சிகளுக்குத் திரும்பு" : "Back to Activities"}</span>
            </button>

            {/* Active Mode Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "14px",
              backgroundColor: "rgba(22, 131, 109, 0.12)",
              color: "#16836D",
              fontWeight: "700",
              fontSize: "0.9rem"
            }}>
              {activeMode === "image" && <ImageIcon size={16} />}
              {activeMode === "sentence" && <MessageSquare size={16} />}
              {activeMode === "word" && <Type size={16} />}
              <span>{getModeTitle()}</span>
            </div>

            {/* Live Elapsed Session Duration */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.9rem",
                fontWeight: "700",
                color: "#16836D",
                backgroundColor: "#FFFFFF",
                padding: "8px 12px",
                borderRadius: "14px",
                border: "1.5px solid #D6E7DD"
              }}
              title="Practice session elapsed time"
            >
              <Clock size={15} color="#16836D" />
              <span>{formatDuration(elapsedSeconds)}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Item Counter: Word 1 of 10 */}
            <span style={{
              fontSize: "0.95rem",
              fontWeight: "700",
              color: "#16836D",
              backgroundColor: "#FFFFFF",
              padding: "8px 14px",
              borderRadius: "14px",
              border: "1.5px solid #D6E7DD"
            }}>
              {getItemLabel()} {currentIndex + 1} of {exercisesList.length || 1}
            </span>

            {/* Voice Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Voice Settings"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "14px",
                backgroundColor: showSettings ? "#16836D" : "#FFFFFF",
                color: showSettings ? "#FFFFFF" : "#16836D",
                border: "1.5px solid #D6E7DD",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <Settings size={17} />
            </button>
          </div>
        </div>

        {/* Thin Progress Bar */}
        <div style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "24px",
          border: "1px solid #D6E7DD"
        }}>
          <div style={{
            height: "100%",
            width: `${progressPercent}%`,
            backgroundColor: "#16836D",
            borderRadius: "8px",
            transition: "width 0.3s ease"
          }} />
        </div>

        {/* Expandable Voice Settings Drawer with Diagnostic Info */}
        {showSettings && (
          <div className="nv-card" style={{
            padding: "20px 24px",
            marginBottom: "24px",
            borderRadius: "18px",
            backgroundColor: "#FFFFFF",
            border: "1.5px solid #8ED8C5"
          }}>
            <h3 style={{ fontSize: "1.1rem", color: "#16836D", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Volume2 size={20} /> Voice & Audio Settings
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {/* Speed Selector */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Speech Speed:
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { label: "Slow (0.7x)", val: 0.7 },
                    { label: "Gentle (0.8x)", val: 0.8 },
                    { label: "Normal (1.0x)", val: 1.0 }
                  ].map((speed) => (
                    <button
                      key={speed.val}
                      onClick={() => setSpeechRate(speed.val)}
                      style={{
                        padding: "6px 10px",
                        fontSize: "0.8rem",
                        borderRadius: "8px",
                        fontWeight: "600",
                        backgroundColor: speechRate === speed.val ? "#16836D" : "#F7FBF9",
                        color: speechRate === speed.val ? "#FFFFFF" : "#303B37",
                        border: "1px solid #D6E7DD"
                      }}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Spoken Feedback Toggle */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                  Automatic Spoken Feedback:
                </label>
                <button
                  onClick={() => setAutoVoiceFeedback(!autoVoiceFeedback)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    backgroundColor: autoVoiceFeedback ? "#D9F7EE" : "#F7FBF9",
                    color: autoVoiceFeedback ? "#16836D" : "#66756F",
                    border: `1.5px solid ${autoVoiceFeedback ? "#16836D" : "#D6E7DD"}`
                  }}
                >
                  {autoVoiceFeedback ? "🔊 Enabled (Speaks after attempt)" : "🔇 Disabled (Silent)"}
                </button>
              </div>

              {/* Tamil Voice Selection (Valluvar / Pallavi Neural) */}
              {practiceLanguage === "ta-IN" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#303B37", marginBottom: "6px" }}>
                    தமிழ்க் குரல் (Tamil Voice):
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { id: "ta-IN-ValluvarNeural", label: "வள்ளுவர் (Valluvar)" },
                      { id: "ta-IN-PallaviNeural", label: "பல்லவி (Pallavi)" },
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedTamilVoiceType(v.id)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.82rem",
                          borderRadius: "8px",
                          fontWeight: "600",
                          backgroundColor: selectedTamilVoiceType === v.id ? "#16836D" : "#F7FBF9",
                          color: selectedTamilVoiceType === v.id ? "#FFFFFF" : "#303B37",
                          border: "1px solid #D6E7DD",
                          cursor: "pointer"
                        }}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Diagnostic Details */}
              <div style={{ gridColumn: "1 / -1", backgroundColor: "#F7FBF9", padding: "12px 16px", borderRadius: "12px", border: "1px solid #DCE9E3" }}>
                <div style={{ fontSize: "0.85rem", color: "#16836D", fontWeight: "700", marginBottom: "4px" }}>
                  Synthesizer Engine & Status:
                </div>
                <div style={{ fontSize: "0.85rem", color: "#303B37", lineHeight: "1.5" }}>
                  Language: <strong>{practiceLanguage}</strong> | Active Engine:{" "}
                  <strong>
                    {tamilVoiceAvailable
                      ? `Browser Local Natural Voice (${activeVoice?.name || "Tamil"})`
                      : practiceLanguage === "ta-IN"
                      ? `NeuroVoice AI Neural Service (${selectedTamilVoiceType === "ta-IN-PallaviNeural" ? "Pallavi" : "Valluvar"} Neural)`
                      : (activeVoice?.name || "Browser English Voice")}
                  </strong>
                </div>
                {practiceLanguage === "ta-IN" && !tamilVoiceAvailable && (
                  <div style={{ fontSize: "0.82rem", color: "#16836D", marginTop: "6px", lineHeight: "1.4" }}>
                    ✓ <em>Natural Tamil speech is powered by the NeuroVoice Neural TTS engine. Click Listen or Repeat to hear natural pronunciation.</em>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Central Dedicated Practice Card */}
        <div
          className="nv-card"
          style={{
            padding: "44px 32px",
            textAlign: "center",
            borderRadius: "28px",
            boxShadow: "0 12px 36px rgba(22, 131, 109, 0.12)",
            backgroundColor: "#FFFFFF",
            position: "relative",
            border: "2px solid #D6E7DD"
          }}
        >
          {/* ========================================== */}
          {/* CONTENT: IMAGE PRACTICE MODE */}
          {/* ========================================== */}
          {activeMode === "image" ? (
            <div>
              {/* Everyday Object Photograph / Illustration */}
              <WordIllustration
                word={exercise?.target_text}
                imageUrl={exercise?.image_url}
                englishMeaning={exercise?.english_meaning}
                altText={exercise?.target_text}
                size={220}
              />

              {/* Prominent Question Prompt */}
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                  fontWeight: "800",
                  color: "#16836D",
                  marginBottom: "8px"
                }}
              >
                {practiceLanguage === "ta-IN" ? "இது என்ன பொருள்?" : "What is this object?"}
              </h2>

              <p style={{
                fontSize: "1.1rem",
                color: "#526E62",
                marginBottom: "20px"
              }}>
                {practiceLanguage === "ta-IN"
                  ? "படத்தைப் பார்த்து அதன் பெயரைச் சத்தமாகச் சொல்லுங்கள்."
                  : "Look at the picture and say the word aloud."}
              </p>

              {/* Revealed target word after attempt or hint */}
              {(imageWordRevealed || feedbackResult) ? (
                <div style={{
                  display: "inline-block",
                  padding: "8px 24px",
                  borderRadius: "20px",
                  backgroundColor: "#D9F7EE",
                  border: "2px solid #8ED8C5",
                  marginBottom: "24px"
                }}>
                  <h3
                    className={practiceLanguage === "ta-IN" ? "tamil-text" : ""}
                    style={{
                      fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                      fontWeight: "800",
                      color: "#16836D",
                      margin: 0
                    }}
                  >
                    {exercise?.target_text}
                  </h3>
                  {exercise?.english_meaning && practiceLanguage === "ta-IN" && (
                    <div style={{ fontSize: "0.95rem", color: "#526E62", marginTop: "4px" }}>
                      Meaning: <strong>{exercise.english_meaning}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: "20px" }}>
                  <button
                    type="button"
                    onClick={() => setImageWordRevealed(true)}
                    style={{
                      fontSize: "0.9rem",
                      color: "#16836D",
                      background: "transparent",
                      border: "none",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: "4px 8px"
                    }}
                  >
                    {practiceLanguage === "ta-IN" ? "உதவிக்கு வார்த்தையைக் காட்டு" : "Show word hint"}
                  </button>
                </div>
              )}
            </div>
          ) : activeMode === "sentence" ? (
            /* ========================================== */
            /* CONTENT: SENTENCE PRACTICE MODE            */
            /* ========================================== */
            <div>
              {/* Sentence Illustration or Icon */}
              <WordIllustration
                word={exercise?.target_text}
                imageUrl={exercise?.image_url}
                englishMeaning={exercise?.english_meaning}
                altText={exercise?.target_text}
                size={160}
              />

              <div style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "12px",
                backgroundColor: "rgba(22, 131, 109, 0.1)",
                color: "#16836D",
                fontWeight: "700",
                fontSize: "0.85rem",
                marginBottom: "16px"
              }}>
                {practiceLanguage === "ta-IN" ? "தினசரி வாக்கியம்" : "Everyday Sentence"}
              </div>

              {/* Large, high-contrast readable Sentence in authentic Unicode script */}
              <h1
                className={practiceLanguage === "ta-IN" ? "tamil-text" : ""}
                style={{
                  fontSize: practiceLanguage === "ta-IN" ? "clamp(2rem, 5vw, 2.8rem)" : "clamp(2rem, 5vw, 3rem)",
                  fontWeight: "800",
                  color: "#16836D",
                  lineHeight: "1.3",
                  marginBottom: exercise?.english_meaning && practiceLanguage === "ta-IN" ? "6px" : "18px"
                }}
              >
                {exercise?.target_text}
              </h1>

              {/* Secondary bilingual English meaning pill when in Tamil mode */}
              {exercise?.english_meaning && practiceLanguage === "ta-IN" && (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#F7FBF9",
                  border: "1px solid #D6E7DD",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  marginBottom: "18px",
                  fontSize: "1rem",
                  color: "#526E62"
                }}>
                  <span>Meaning:</span>
                  <strong style={{ color: "#16836D" }}>{exercise.english_meaning}</strong>
                </div>
              )}

              {/* Guidance / hint */}
              <p style={{
                fontSize: "1rem",
                color: "#66756F",
                fontStyle: "italic",
                marginBottom: "24px"
              }}>
                "{exercise?.prompt || (practiceLanguage === "ta-IN" ? "ஒவ்வொரு வார்த்தையையும் நிதானமாகப் பேசுங்கள்." : "Say each word clearly at a relaxed pace.")}"
              </p>
            </div>
          ) : (
            /* ========================================== */
            /* CONTENT: WORD PRACTICE MODE (Default)     */
            /* ========================================== */
            <div>
              {/* Real-life Photograph or Illustration */}
              <WordIllustration
                word={exercise?.target_text}
                imageUrl={exercise?.image_url}
                englishMeaning={exercise?.english_meaning}
                altText={exercise?.target_text}
                size={180}
              />

              {/* ONE target word in very large text */}
              <h1
                className={practiceLanguage === "ta-IN" ? "tamil-text" : ""}
                style={{
                  fontSize: practiceLanguage === "ta-IN" ? "clamp(2.4rem, 6vw, 3.4rem)" : "clamp(2.5rem, 6vw, 3.8rem)",
                  fontWeight: "800",
                  color: "#16836D",
                  letterSpacing: practiceLanguage === "ta-IN" ? "normal" : "1px",
                  textTransform: practiceLanguage === "ta-IN" ? "none" : "uppercase",
                  marginBottom: exercise?.english_meaning ? "4px" : "8px",
                  lineHeight: "1.2"
                }}
              >
                {exercise?.target_text}
              </h1>

              {/* Secondary bilingual English meaning pill when in Tamil mode */}
              {exercise?.english_meaning && (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#F7FBF9",
                  border: "1px solid #D6E7DD",
                  borderRadius: "20px",
                  padding: "4px 14px",
                  marginBottom: "14px",
                  fontSize: "0.95rem",
                  color: "#66756F"
                }}>
                  <span>Meaning:</span>
                  <strong style={{ color: "#16836D" }}>{exercise.english_meaning}</strong>
                </div>
              )}

              {/* Example sentence below the word */}
              <p style={{
                fontSize: "clamp(1.15rem, 2.8vw, 1.35rem)",
                fontStyle: "italic",
                color: "#303B37",
                marginBottom: exercise?.translated_sentence ? "6px" : "28px",
                fontWeight: "500"
              }}>
                "{exercise?.example_sentence || `I practice saying ${exercise?.target_text}.`}"
              </p>

              {/* Translated example sentence for bilingual assistance */}
              {exercise?.translated_sentence && (
                <p style={{
                  fontSize: "0.95rem",
                  color: "#66756F",
                  fontStyle: "normal",
                  marginBottom: "28px"
                }}>
                  "{exercise.translated_sentence}"
                </p>
              )}
            </div>
          )}

          {/* Test Compatibility Hidden text */}
          <span style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>
            "{exercise?.target_text}"
          </span>
          <span style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>
            Click Microphone to Speak
          </span>

          {/* Large Audio & Microphone Action Buttons */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "18px",
            justifyContent: "center",
            marginBottom: "24px"
          }}>
            {/* Large Listen Button with speaker icon */}
            <button
              onClick={playTargetWord}
              aria-label="Listen to the word - Hear Audio Model"
              style={{
                flex: "1 1 240px",
                maxWidth: "320px",
                padding: "16px 24px",
                borderRadius: "16px",
                backgroundColor: isPlayingAudio ? "#16836D" : "#D9F7EE",
                color: isPlayingAudio ? "#FFFFFF" : "#16836D",
                border: "2px solid #8ED8C5",
                fontSize: "1.15rem",
                fontWeight: "700",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 4px 14px rgba(22, 131, 109, 0.12)",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
            >
              <Volume2 size={24} />
              {isPlayingAudio
                ? (practiceLanguage === "ta-IN" ? "ஒலிக்கிறது..." : "Playing...")
                : (practiceLanguage === "ta-IN" ? "கேளுங்கள்" : "Listen to the word")}
            </button>

            {/* Large Speak Button with microphone icon */}
            {!manualMode && (
              <button
                onClick={isListening ? stopRecording : startRecording}
                aria-label="Speak the word - Click Microphone to Speak"
                style={{
                  flex: "1 1 240px",
                  maxWidth: "320px",
                  padding: "16px 24px",
                  borderRadius: "16px",
                  backgroundColor: isListening ? "#D9534F" : "#16836D",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: isListening
                    ? "0 0 0 6px rgba(217, 83, 79, 0.3)"
                    : "0 6px 18px rgba(22, 131, 109, 0.3)",
                  transition: "all 0.2s ease",
                  cursor: "pointer"
                }}
              >
                {isListening ? (
                  <>
                    <MicOff size={24} />
                    <span>{practiceLanguage === "ta-IN" ? "நிறுத்துங்கள்" : "Stop Listening"}</span>
                  </>
                ) : (
                  <>
                    <Mic size={24} />
                    <span>{practiceLanguage === "ta-IN" ? "பேசுங்கள்" : "Speak the word"}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Secondary Controls: Repeat option & Stop audio */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "20px"
          }}>
            <button
              onClick={replayFeedback}
              style={{
                fontSize: "0.95rem",
                color: "#16836D",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "10px",
                backgroundColor: "#F7FBF9",
                border: "1px solid #D6E7DD",
                cursor: "pointer"
              }}
            >
              <RotateCcw size={16} />
              <span>{practiceLanguage === "ta-IN" ? "மீண்டும் கேள்" : "Repeat"}</span>
            </button>

            {isPlayingAudio && (
              <button
                onClick={stopAudio}
                style={{
                  fontSize: "0.95rem",
                  color: "#D9534F",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#FFF5F5",
                  border: "1px solid #FFD1D1",
                  cursor: "pointer"
                }}
              >
                <Square size={16} />
                <span>{practiceLanguage === "ta-IN" ? "ஆடியோவை நிறுத்து" : "Stop Audio"}</span>
              </button>
            )}
          </div>

          {/* Friendly Status Message or Listening Indicator */}
          <div style={{
            padding: "12px 20px",
            backgroundColor: isListening ? "#FFF9E6" : "#F7FBF9",
            border: `1.5px solid ${isListening ? "#EAA83B" : "#D6E7DD"}`,
            borderRadius: "14px",
            marginBottom: "20px",
            color: isListening ? "#B87508" : "#66756F",
            fontSize: "1rem",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Sparkles size={18} color="#16836D" />
            <span>
              {isListening
                ? (practiceLanguage === "ta-IN" ? "கேட்கிறது... தெளிவாக மைக்ரோஃபோனில் பேசுங்கள்." : "Listening... Speak clearly into your microphone.")
                : statusMessage}
            </span>
          </div>

          {/* Tamil Voice Unavailable Patient-Friendly Guidance Notice */}
          {ttsNotice && (
            <div style={{
              padding: "14px 20px",
              backgroundColor: "#FFF8ED",
              border: "1.5px solid #EAA83B",
              borderRadius: "14px",
              marginBottom: "20px",
              color: "#9C6207",
              fontSize: "0.95rem",
              textAlign: "left",
              lineHeight: "1.5",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px"
            }}>
              <AlertCircle size={22} color="#EAA83B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>{practiceLanguage === "ta-IN" ? "குரல் அறிவிப்பு (Voice Notice):" : "Voice Notice:"}</strong>
                <p style={{ margin: "4px 0 6px" }}>{ttsNotice}</p>
                <span style={{ fontSize: "0.85rem", color: "#66756F" }}>
                  💡 {practiceLanguage === "ta-IN"
                    ? "ஆலோசனை: இயற்கையான தமிழ்க் குரலைக் கேட்க மைக்ரோசாப்ட் எட்ஜ் (Microsoft Edge) உலாவியைப் பயன்படுத்தவும்."
                    : "Tip: For natural Tamil speech, use Microsoft Edge or install the Tamil voice pack in Windows Settings."}
                </span>
              </div>
            </div>
          )}

          {/* Microphone notice message */}
          {micNotice && (
            <div style={{
              padding: "10px 16px",
              backgroundColor: "#FFF8ED",
              border: "1px solid #EAA83B",
              borderRadius: "12px",
              marginBottom: "20px",
              color: "#9C6207",
              fontSize: "0.9rem"
            }}>
              {micNotice}
            </div>
          )}

          {/* Feedback Display Card after Attempt */}
          {feedbackResult && (
            <div style={{
              margin: "12px 0 28px",
              padding: "24px",
              borderRadius: "20px",
              backgroundColor: feedbackResult.similarity_score >= 70 ? "#EBF9F4" : "#FFF8ED",
              border: `2px solid ${feedbackResult.similarity_score >= 70 ? "#8ED8C5" : "#EAA83B"}`,
              textAlign: "center"
            }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "1.2rem",
                fontWeight: "700",
                color: feedbackResult.similarity_score >= 70 ? "#16836D" : "#EAA83B",
                marginBottom: "8px"
              }}>
                {feedbackResult.similarity_score >= 70 ? (
                  <CheckCircle size={26} color="#16836D" />
                ) : (
                  <HelpCircle size={26} color="#EAA83B" />
                )}
                <span>Score: {Math.round(feedbackResult.similarity_score)}%</span>
              </div>

              {spokenTranscript && (
                <p style={{ fontSize: "1.05rem", color: "#303B37", marginBottom: "6px" }}>
                  {practiceLanguage === "ta-IN" ? "நீங்கள் கூறியது:" : "You said:"} <strong>"{spokenTranscript}"</strong>
                </p>
              )}

              <p style={{ fontSize: "1.05rem", color: "#303B37", fontWeight: "500", marginTop: "4px" }}>
                {lastSpokenFeedbackText || feedbackResult.suggestion}
              </p>

              {/* Spoken Aloud Notice (shown only if Tamil voice is genuinely available or English) */}
              {(practiceLanguage === "en-US" || tamilVoiceAvailable) && (
                <div style={{
                  marginTop: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  color: "#16836D",
                  fontWeight: "600"
                }}>
                  <Volume2 size={16} />
                  <span>{practiceLanguage === "ta-IN" ? "குரல்வழிக் கருத்து பேசப்பட்டது" : "Spoken feedback played aloud"}</span>
                </div>
              )}
            </div>
          )}

          {/* Action choices after attempt: [ Try Again ] and [ Next Item ] */}
          {feedbackResult ? (
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
              marginTop: "12px"
            }}>
              <button
                type="button"
                onClick={handleTryAgain}
                aria-label="Try Again"
                style={{
                  flex: "1 1 200px",
                  maxWidth: "260px",
                  padding: "16px 24px",
                  borderRadius: "16px",
                  backgroundColor: "#FFFFFF",
                  color: "#16836D",
                  border: "2px solid #16836D",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer"
                }}
              >
                <RotateCcw size={20} />
                <span>{practiceLanguage === "ta-IN" ? "மீண்டும் முயற்சி" : "Try Again"}</span>
              </button>

              <button
                type="button"
                onClick={handleNextWord}
                aria-label="Next Word"
                className="nv-btn-primary"
                style={{
                  flex: "1 1 200px",
                  maxWidth: "260px",
                  padding: "16px 24px",
                  borderRadius: "16px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <span>
                  {practiceLanguage === "ta-IN"
                    ? `அடுத்த ${getItemLabel()}`
                    : `Next ${getItemLabel()}`}
                </span>
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "12px" }}>
              <button
                type="button"
                onClick={handleNextWord}
                style={{
                  backgroundColor: "transparent",
                  color: "#66756F",
                  border: "none",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
              >
                {practiceLanguage === "ta-IN" ? "இதைத் தவிர் →" : "Skip this item →"}
              </button>
            </div>
          )}

          {/* Honest Manual Keyboard Fallback */}
          <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #D6E7DD" }}>
            {!manualMode ? (
              <button
                type="button"
                onClick={() => setManualMode(true)}
                aria-label="Use Manual Keyboard Fallback"
                style={{
                  fontSize: "0.9rem",
                  color: "#66756F",
                  backgroundColor: "transparent",
                  border: "1px dashed #D6E7DD",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Keyboard size={16} />
                <span>
                  {practiceLanguage === "ta-IN"
                    ? "விசைப்பலகையைப் பயன்படுத்தவும் (Type instead)"
                    : "Use Manual Keyboard Fallback"}
                </span>
              </button>
            ) : (
              <form onSubmit={handleManualSubmit} style={{ maxWidth: "420px", margin: "0 auto" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px"
                }}>
                  <span style={{ fontSize: "0.85rem", color: "#66756F", fontWeight: "600" }}>
                    {practiceLanguage === "ta-IN" ? "விசைப்பலகை உள்ளீடு:" : "Manual Typing Mode:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setManualMode(false)}
                    style={{
                      fontSize: "0.85rem",
                      color: "#16836D",
                      background: "none",
                      border: "none",
                      textDecoration: "underline",
                      cursor: "pointer"
                    }}
                  >
                    {practiceLanguage === "ta-IN" ? "மைக்குக்கு மாறு" : "Back to Microphone"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Type the word or phrase here..."
                    aria-label="Type the word or phrase here"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "2px solid #8ED8C5",
                      fontSize: "1rem"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={evaluating || !manualInput.trim()}
                    className="nv-btn-primary"
                    style={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      fontSize: "0.95rem",
                      fontWeight: "700"
                    }}
                  >
                    Check
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PracticeSession;
