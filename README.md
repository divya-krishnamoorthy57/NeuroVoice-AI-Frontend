# NeuroVoice AI — Empowering Communication Through Practice

**NeuroVoice AI** is a production-oriented, full-stack AI-assisted speech rehabilitation and communication practice platform designed primarily to support people with aphasia and speech difficulties through structured speaking exercises, speech recognition, pronunciation feedback, personalized practice plans, and persistent progress monitoring.

---

## 1. Project Overview & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS 4, React Router 7, Axios, Web Speech API, SpeechSynthesis API, Lucide React.
- **Backend**: Python 3.14 / FastAPI, Uvicorn, SQLAlchemy 2.0 ORM, PyMySQL / mysql-connector-python, RapidFuzz string comparison, Pydantic v2 schemas.
- **Database**: MySQL 8.0 with safe auto-migrations and seed data (persisting users, profiles, categories, exercises, sessions, responses, preferences, plans, and contact inquiries).
- **Authentication**: JWT access tokens (HS256) with passlib/bcrypt password hashing and role-based access control (RBAC).
- **Testing**: Automated test suites for both backend (Pytest, HTTPX) and frontend (Vitest, React Testing Library, JSDOM).

---

## 2. UI/UX Design System

Calm, friendly, accessible healthcare aesthetic:

- **Primary Mint Green**: `#8ED8C5`
- **Light Mint Background**: `#D9F7EE`
- **Dark Teal-Green**: `#357F70`
- **White Cards**: `#FFFFFF`
- **Main Text**: `#303B37`
- **Secondary Text**: `#6B7772`
- **Borders**: `#DCE9E3`
- **Soft Neutral Background**: `#F7FBF9`
- **Typography**: Poppins with accessible font scaling (`A`, `A+`, `A++`) and a high-contrast mode toggle.
- **Accessible Interactions**: Large buttons, clear iconography, visible focus states, no timing pressure, full manual text fallback when microphone or speech recognition is unavailable.

---

## 3. Directory Structure

```
NeuroVoice/
├── backend/
│   ├── main.py                  # FastAPI entry point, lifespan, CORS, and router registration
│   ├── database.py              # SQLAlchemy engine, SessionLocal, Base, safe migrations & seeding
│   ├── models.py                # Normalized SQLAlchemy models
│   ├── schemas.py               # Pydantic validation and serialization models
│   ├── config.py                # Environment configuration loader
│   ├── auth.py                  # Bcrypt hashing & JWT token generation/validation
│   ├── dependencies.py          # JWT authentication and Admin RBAC dependencies
│   ├── requirements.txt         # Backend Python dependencies
│   ├── .env                     # Local backend database and JWT configuration
│   ├── .env.example             # Template for backend deployment
│   ├── routers/
│   │   ├── auth.py              # /auth/register, /auth/login, /auth/me, /auth/logout
│   │   ├── profile.py           # /profile/ (GET, PUT)
│   │   ├── exercises.py         # /exercises/ (filters, search, categories, bookmarks)
│   │   ├── practice.py          # /practice/sessions, responses, completion, feedback
│   │   ├── dashboard.py         # /dashboard/summary, /dashboard/recent-activity
│   │   ├── progress.py          # /progress/summary, history, breakdown, export CSV
│   │   ├── preferences.py       # /preferences/ (GET, PUT)
│   │   ├── plans.py             # /plans/active, /plans/generate, items complete
│   │   ├── contact.py           # /contact/ validated contact message submissions
│   │   └── admin.py             # /admin/stats, exercises, categories, contacts
│   ├── services/
│   │   ├── speech_feedback.py   # RapidFuzz similarity, token normalization, word breakdown
│   │   ├── analytics_service.py # Dynamic streaks, weekly chart aggregation, session metrics
│   │   └── recommendation_service.py # Rule-based adaptive practice plans
│   └── tests/
│       ├── conftest.py          # Pytest fixtures & in-memory SQLite isolation
│       ├── test_auth.py         # Registration, duplicate email rejection, login, profile
│       ├── test_exercises.py    # Filtering, categories, search, bookmarks
│       ├── test_practice.py     # RapidFuzz evaluation, session lifecycle, user isolation
│       └── test_progress.py     # Real analytics, streak calculation, CSV export, RBAC
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Navbar.jsx       # Responsive header with desktop/mobile drawer & A11y menu
│   │       └── Footer.jsx       # Links, responsible AI notice, and clinical disclaimer
│   ├── context/
│   │   └── AuthContext.jsx      # Global user session state & accessibility toggles
│   ├── layouts/
│   │   ├── PublicLayout.jsx     # Layout for public pages
│   │   └── AppLayout.jsx        # Layout for authenticated application pages
│   ├── pages/
│   │   ├── Home.jsx             # Public landing page with hero, aphasia info, FAQ, demo
│   │   ├── About.jsx            # Platform purpose, intended users, limitations
│   │   ├── Features.jsx         # Speech recognition, text-to-speech, and feedback guide
│   │   ├── Contact.jsx          # Validated contact form connected to MySQL
│   │   ├── Login.jsx            # Authenticated login form
│   │   ├── Register.jsx         # User registration with goal and age options
│   │   ├── Dashboard.jsx        # Real database metrics, streaks, recommended next exercise
│   │   ├── ExerciseLibrary.jsx  # Search, filters, difficulty badges, bookmarks
│   │   ├── PracticeSession.jsx  # Audio playback, Web Speech recognition, manual fallback
│   │   ├── PracticePlan.jsx     # Rule-based routine, completion checks, regeneration
│   │   ├── Progress.jsx         # Session history, weekly activity, and CSV download
│   │   ├── Profile.jsx          # User settings saved permanently to database
│   │   ├── Admin.jsx            # RBAC administrative management panel
│   │   └── NotFound.jsx         # 404 page
│   ├── services/
│   │   └── api.js               # Centralized Axios client with JWT interceptor
│   ├── __tests__/
│   │   ├── Navigation.test.jsx  # Public pages rendering & CTAs
│   │   ├── Auth.test.jsx        # Login & registration validation
│   │   ├── SpeechPractice.test.jsx # Audio controls & manual keyboard fallback
│   │   └── DashboardAndProgress.test.jsx # Dynamic statistics & CSV export
│   ├── App.jsx                  # Main application routing and route guards
│   ├── main.jsx                 # React root render
│   └── index.css                # Design system tokens and accessible styling
├── package.json                 # Frontend dependencies and scripts
├── vite.config.js               # Vite & Vitest configuration
└── vitest.setup.js              # Test setup & Web Speech API browser mocks
```

---

## 4. Database Schema

The database uses MySQL 8.0 (`neurovoice`):

1. **`users`**: `id`, `name`, `email` (UNIQUE), `password` (hashed), `role` (`user` / `admin`), `is_active`, `created_at`.
2. **`user_profiles`**: `id`, `user_id`, `age_range`, `preferred_language`, `practice_preferences`, `daily_practice_goal`, `font_size_preference`, `high_contrast`, `created_at`, `updated_at`.
3. **`exercise_categories`**: `id`, `name`, `slug` (UNIQUE), `description`, `icon`, `display_order`, `is_active`, `created_at`.
4. **`exercises`**: `id`, `category_id`, `title`, `target_text`, `exercise_type` (`word`, `phrase`, `sentence`, `conversation`), `difficulty` (`beginner`, `intermediate`, `advanced`), `prompt`, `hints`, `display_order`, `is_active`, `created_at`.
5. **`practice_sessions`**: `id`, `user_id`, `category_id`, `start_time`, `end_time`, `duration_seconds`, `exercise_count`, `completion_status` (`in_progress`, `completed`, `abandoned`), `created_at`.
6. **`practice_responses`**: `id`, `session_id`, `exercise_id`, `target_text`, `recognized_text`, `similarity_score`, `matched_words`, `missing_words`, `attempt_number`, `created_at`.
7. **`bookmarked_exercises`**: `id`, `user_id`, `exercise_id`, `created_at`.
8. **`user_practice_preferences`**: `id`, `user_id`, `daily_goal_minutes`, `preferred_categories`, `preferred_duration`, `preferred_language`, `speech_rate`.
9. **`practice_plans`**: `id`, `user_id`, `daily_target_minutes`, `target_exercises_per_day`, `plan_notes`, `is_active`, `created_at`, `updated_at`.
10. **`practice_plan_items`**: `id`, `plan_id`, `exercise_id`, `order_index`, `completed`, `completed_at`.
11. **`contact_messages`**: `id`, `name`, `email`, `subject`, `message`, `is_read`, `created_at`.
12. **`progress`**: Legacy progress table maintained for backward compatibility.

---

## 5. Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Python (v3.10+ / v3.14 supported)
- MySQL Server 8.0 running on localhost:3306

### Step 1: Database Setup
Create database and user in MySQL (or use your existing configuration):
```sql
CREATE DATABASE IF NOT EXISTS neurovoice;
CREATE USER IF NOT EXISTS 'neurovoice_user'@'localhost' IDENTIFIED BY 'NeuroVoice@123';
GRANT ALL PRIVILEGES ON neurovoice.* TO 'neurovoice_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Backend Setup
```bash
# Navigate to backend and create/activate virtualenv
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI server on port 8001
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```
API Documentation will be available at `http://127.0.0.1:8001/docs`.

### Step 3: Frontend Setup
```bash
# In the project root:
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 6. Running Automated Tests

### Backend Tests (Pytest)
```bash
# Runs 16 automated tests covering auth, RBAC, sessions, feedback, and isolation:
.\.venv\Scripts\pytest.exe backend/tests -v
```

### Frontend Tests (Vitest)
```bash
# Runs 11 automated tests covering navigation, forms, speech fallback, and dashboard:
npm test
```

---

## 7. Ethical AI & Clinical Boundaries Notice

- **Not a Medical Device**: A text similarity percentage computed by RapidFuzz is a string-distance comparison aid, not a clinically validated assessment of phoneme accuracy or neurological recovery.
- **Privacy First**: Voice audio is processed locally via browser APIs. Audio recordings are never stored on external servers by default.
- **Complementary Care**: NeuroVoice AI is intended as a home practice companion and does not replace speech-language pathologists (SLPs) or medical providers.
