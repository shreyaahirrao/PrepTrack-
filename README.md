# PrepTrack 🎯

**Placement Progress & Application Tracker** — a MERN stack dashboard that ties your job/internship applications directly to your personal prep roadmap, so you always know where you stand and what to do next.

🔗 **Live Demo:** [preptrack-indol.vercel.app](https://preptrack-indol.vercel.app)
📂 **Backend API:** [preptrack-backend-lzx9.onrender.com](https://preptrack-backend-lzx9.onrender.com)
💻 **Source Code:** [github.com/shreyaahirrao/PrepTrack](https://github.com/shreyaahirrao/PrepTrack)

> ⚠️ Note: The backend is hosted on Render's free tier, which spins down after inactivity. The first request after idling may take 30–60 seconds to respond.

---

## 📖 About

Most placement trackers are just spreadsheets or generic to-do apps — they don't connect *what you've applied to* with *how prepared you actually are*. PrepTrack closes that gap by cross-referencing your application pipeline against a prep roadmap you define yourself.

Built for students of **any branch** (Core Engineering, Software/IT, Data Science, or otherwise) with a **flexible prep duration** — not locked to a fixed 6-month timeline.

## ✨ Features

**Application Tracking**
- Log applications with company, role type, and status (Applied → OA → Interview → Offer/Rejected)
- Search and filter by company/role name, status, and role type
- Priority rating (1–5 stars) to flag which roles matter most
- Referral tracking — contact name, LinkedIn link, and a "followed up" checkbox
- Auto-logged status timeline showing exactly when each stage change happened
- Per-application interview question log, to remember what you were asked
- Auto-flagged overdue follow-ups
- Export all applications to CSV

**Prep Roadmap**
- Track topics covered, categorized however you like (DSA, Core Subject, Aptitude, etc.)
- Log DSA problems solved vs. target per topic, with a mini progress bar
- Log milestones — mock interviews, resume reviews, test series
- Flexible prep duration (in weeks) — not locked to any fixed timeline
- Editable anytime from a dedicated Profile page, including a one-click "reset timeline to today"

**Dashboard**
- Visual progress ring + bar for "days remaining vs topics left"
- Application status breakdown chart (pie/donut)
- Animated stat cards for topics left, DSA problems solved, and mock interviews completed

**UI/UX**
- Full dark mode, persisted across sessions
- Page transitions, animated counters, and empty-state illustrations throughout (Framer Motion)
- Responsive, mobile-friendly layout

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Framer Motion, React Router, Axios, Recharts, React Icons, React Hot Toast, PapaParse
**Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, JWT (cookie-based auth), bcrypt
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## 📸 Screenshots

| Landing Page | Dashboard | Applications |
|---|---|---|
| *(add screenshot)* | *(add screenshot)* | *(add screenshot)* |

## 🏗️ Project Structure

```
preptrack/
├── backend/
│   ├── config/          # Database connection
│   ├── models/          # User, Application, RoadmapTopic, Milestone schemas
│   ├── controllers/     # Route logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── jobs/            # Cron jobs (follow-up reminders)
│   ├── utils/           # Email helper
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI (Navbar, EmptyState, ProgressRing, StatusChart, etc.)
    │   ├── pages/        # Landing, Login, Register, Dashboard, Applications, Roadmap, Profile
    │   ├── context/      # Auth and Theme contexts
    │   └── api/          # Axios instance
```

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/shreyaahirrao/PrepTrack.git
cd PrepTrack
```

### 2. Backend setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```
(`EMAIL_USER`/`EMAIL_PASS` are only needed if you want the daily follow-up reminder emails to send — otherwise the app runs fine without them.)

Run it:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:5000/api
```
Run it:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile / prep duration / reset timeline |
| GET/POST | `/api/applications` | List (with search/filter) / create applications |
| PUT/DELETE | `/api/applications/:id` | Update / delete an application |
| GET | `/api/applications/overdue` | Get overdue follow-ups |
| POST | `/api/applications/:id/questions` | Log an interview question for an application |
| GET/POST | `/api/roadmap/topics` | List / create prep topics |
| PUT/DELETE | `/api/roadmap/topics/:id` | Update / delete a topic |
| GET | `/api/roadmap/progress` | Get overall progress summary |
| GET/POST | `/api/roadmap/milestones` | List / log milestones (mock interviews, etc.) |

## 🎯 Why This Project

Ties directly to a real placement timeline — application CRUD, prep-roadmap sync, and deadline logic combined in one schema-linked system, rather than treating job hunting and prep as separate spreadsheets. Extended beyond the basics with priority scoring, referral tracking, and interview question logging — features that mirror how people actually manage a real job search, not just a tutorial CRUD app.

## 🧩 Deployment Notes

Deployed as two independently hosted services:
- **Frontend** (Vercel) — builds from `frontend/`, with `VITE_API_URL` set as a build-time environment variable pointing to the Render backend
- **Backend** (Render) — runs from `backend/`, with `CLIENT_URL` set to the Vercel domain for CORS, and cookies configured with `sameSite: "none"` and `secure: true` in production to support cross-origin authentication
