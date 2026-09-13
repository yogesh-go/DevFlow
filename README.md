# DevFlow — AI-Powered Developer Workspace

[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](#)

> **DevFlow** is a full-stack developer productivity platform engineered for SDE interview preparation, DSA tracking with automated spaced repetition, technical note-taking, progress analytics, and AI-assisted code evaluation.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Folder Structure](#folder-structure)
6. [Database Schema & Design](#database-schema--design)
7. [API Specification](#api-specification)
8. [Spaced Repetition Engine](#spaced-repetition-engine)
9. [AI Assistant Layer](#ai-assistant-layer)
10. [Security & Production Practices](#security--production-practices)
11. [Setup & Local Development](#setup--local-development)
12. [Interview Pitch & Talking Points](#interview-pitch--talking-points)

---

## 1. Project Overview

DevFlow was created to solve a common engineering challenge: preparing for software engineering technical interviews often leaves candidates juggling spreadsheets for DSA tracking, random text files for notes, and forgetting problem patterns days after solving them.

DevFlow unites the entire preparation workflow into a cohesive developer workspace:
- **DSA Problem Tracker**: Scoped to user, featuring server-side regex search, multi-field filtering, difficulty pills, and pagination.
- **Automated Spaced Repetition**: Solved problems automatically schedule 5 review stages (Day 1, 3, 7, 15, 30) to guarantee long-term retention.
- **Technical Notes**: Markdown editor with syntax blocks, problem associations, and tag-based filtering.
- **Real-Time Analytics**: MongoDB aggregation pipelines computing streaks, topic mastery, difficulty ratios, and weekly solve frequency.
- **AI Developer Suite**: Extensible provider-agnostic service for code explanation, complexity detection, code optimization, note generation, and ATS resume analysis.
- **Developer Ecosystem**: Live contest calendar across LeetCode, Codeforces, CodeChef, and public GitHub profile analytics.

---

## 2. Key Features

### Placement MVP (Phase 1)
- **Authentication**: Stateless JWT authentication, salted bcrypt password hashing (10 rounds), protected routes, automatic 401 expiration handling.
- **Developer Workspace Layout**: Collapsible dark sidebar with active indicators, top navigation with breadcrumbs and user profile, and responsive mobile drawer.
- **DSA Tracker**: Track title, platform (LeetCode, Codeforces, etc.), difficulty (Easy, Medium, Hard), topic categories, status, time spent, and solution notes.
- **Problem Details View**: Dedicated view per problem with external launcher, markdown notes editor, and interactive revision timeline.
- **Spaced Repetition Planner**: Review queues categorized into Due Today, Overdue, Upcoming, and Completed History.
- **Technical Notes**: Full markdown support, problem linking, and tag categorization.
- **Analytics**: Real database aggregates calculating active streaks, topic mastery bars, difficulty distribution, and 7-day solve histograms.

### AI Features (Phase 2)
- **Explain Code**: Explains time & space complexity, detects recursion stack depths and off-by-one boundary bugs.
- **Optimize Code**: Pinpoints unoptimized traversals and suggests optimal Hash Map / Two Pointers approaches.
- **Generate Revision Notes**: Creates structured takeaways, invariant steps, and common edge-case traps.
- **Resume ATS Analyzer**: Scores resumes against SDE keywords, recommends missing industry terms, and suggests quantified bullet points.
- **Interview Simulator**: Curates technical questions across DSA, Backend, and System Design.

### Advanced Ecosystem (Phase 3)
- **Contest Calendar**: Fetches upcoming coding contests across LeetCode, Codeforces, CodeChef, and GeeksforGeeks.
- **GitHub Analytics**: Inspects public GitHub repositories, stars, forks, and top language distributions.

---

## 3. Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router v7 | Fast SPA rendering, component lifecycle, modular routing |
| **Styling** | Tailwind CSS v4, Lucide React, clsx | Dark developer UI, responsive utility styling, modern icons |
| **Feedback** | React Hot Toast | Toast feedback for async CRUD actions and errors |
| **Backend** | Node.js, Express 5 | RESTful API design, controller-service pattern, routing |
| **Database** | MongoDB, Mongoose 9 | Document persistence, compound indexing, aggregation pipelines |
| **Security** | JWT, bcryptjs, CORS | Stateless token auth, salted password hashing, IDOR prevention |

---

## 4. System Architecture

```
React Client (Vite + Tailwind CSS v4)
      │
      ├── Public Routes: / (Home), /features, /pricing, /login, /signup  ──> PublicLayout
      └── Protected Routes: /dashboard, /problems, /notes, etc.         ──> AppLayout
            │
            ▼
      api.js (Bearer JWT + Auto-401 Interception)
            │
            ▼ [HTTP JSON REST]
      Express 5 Backend (server.js)
            │
            ├── CORS & JSON Middleware
            ├── JWT Auth Middleware (req.user = decoded)
            │
            ├── Route Controllers (auth, problems, revisions, notes, analytics, ai, contests, github)
            │      │
            │      ▼
            ├── Service Layer (problemService, revisionService, analyticsService, aiService)
            │      │
            │      ▼
            ├── Mongoose ODM Models (User, Problem, Revision, Note, Task)
            │      │
            │      ▼
            └── MongoDB Atlas (Indexed Collections & Aggregation Pipelines)
```

---

## 5. Folder Structure

```
devflow/
├── client/                              # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/                  # Sidebar, TopNavbar, AppLayout, PublicLayout, Navbar
│   │   │   ├── problems/                # ProblemFilters, ProblemItem, ProblemModal, ProblemBadge
│   │   │   ├── tasks/                   # Legacy task components preserved
│   │   │   └── ui/                      # Button, Card, Container, Input, GitHubIcon, LoadingSpinner
│   │   ├── context/                     # AuthContext (token verification on mount, 401 handler)
│   │   ├── pages/                       # Dashboard, Problems, ProblemDetail, Notes, Revision,
│   │   │                                # Analytics, AITools, Contests, GitHubAnalytics, Profile
│   │   ├── routes/                      # AppRoutes, ProtectedRoute
│   │   └── services/                    # api, problemService, revisionService, noteService,
│   │                                    # analyticsService, aiService, contestService, githubService
│   └── package.json
│
└── server/                              # Backend Express Application
    ├── src/
    │   ├── config/                      # db.js (Mongoose connection)
    │   ├── controllers/                 # auth, problem, revision, note, analytics, ai, contest, github
    │   ├── middleware/                  # authMiddleware, errorHandler
    │   ├── models/                      # User, Problem, Revision, Note, Task
    │   ├── routes/                      # auth, problem, revision, note, analytics, ai, contest, github
    │   ├── services/                    # problemService, revisionService, analyticsService, aiService, etc.
    │   ├── utils/                       # validateObjectId
    │   └── server.js                    # Express bootstrap & route mounting
    ├── .env                             # Environment configuration
    └── package.json
```

---

## 6. Database Schema & Design

### Problem Model (`Problem.js`)
- `title`: String (required, trimmed)
- `platform`: Enum (`LeetCode`, `Codeforces`, `CodeChef`, `GeeksforGeeks`, `HackerRank`, `Other`)
- `problemUrl`: String
- `difficulty`: Enum (`Easy`, `Medium`, `Hard`)
- `topic`: Enum (`Arrays`, `Strings`, `Two Pointers`, `Sliding Window`, `Trees`, `DP`, etc.)
- `status`: Enum (`Not Started`, `Attempted`, `Solved`, `Need Revision`)
- `revisionCount`: Number
- `timeTaken`: Number (minutes)
- `solvedDate`, `lastRevisedDate`, `nextRevisionDate`: Date
- `user`: ObjectId (ref: `User`, indexed)
- **Indexes**: Compound indexes on `{ user: 1, status: 1 }`, `{ user: 1, topic: 1 }`, `{ user: 1, difficulty: 1 }`, `{ user: 1, createdAt: -1 }`.

### Revision Model (`Revision.js`)
- `problem`: ObjectId (ref: `Problem`, indexed)
- `user`: ObjectId (ref: `User`, indexed)
- `scheduledDate`: Date (indexed)
- `completedDate`: Date
- `status`: Enum (`pending`, `completed`, `overdue`)
- `revisionNumber`: Number (1 to 5)
- `intervalDays`: Number (1, 3, 7, 15, 30)
- `confidence`: Enum (`low`, `medium`, `high`)

### Note Model (`Note.js`)
- `title`: String (required)
- `content`: String (Markdown formatted)
- `tags`: Array of Strings
- `problem`: ObjectId (ref: `Problem`, optional)
- `user`: ObjectId (ref: `User`, indexed)

---

## 7. API Specification

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new developer account | No |
| `POST` | `/api/auth/login` | Authenticate & receive JWT | No |
| `GET` | `/api/users/me` | Fetch authenticated developer profile | Yes |
| `GET` | `/api/problems` | Query problems with pagination, search, topic, difficulty, status | Yes |
| `POST` | `/api/problems` | Create new DSA problem (auto-schedules spaced repetition if Solved) | Yes |
| `GET` | `/api/problems/:id` | Fetch problem by ID scoped to user | Yes |
| `PUT` | `/api/problems/:id` | Update problem metadata, notes, or status | Yes |
| `DELETE`| `/api/problems/:id` | Delete problem | Yes |
| `GET` | `/api/revision` | Get grouped revisions (due today, overdue, upcoming, completed) | Yes |
| `POST` | `/api/revision` | Manually schedule revision intervals | Yes |
| `PUT` | `/api/revision/:id` | Mark revision completed with confidence score | Yes |
| `GET` | `/api/notes` | Query notes with search and tag filters | Yes |
| `POST` | `/api/notes` | Create technical note with problem link | Yes |
| `PUT` | `/api/notes/:id` | Update note content or tags | Yes |
| `DELETE`| `/api/notes/:id` | Delete note | Yes |
| `GET` | `/api/analytics` | Real-time MongoDB aggregations (streaks, difficulty, topic coverage) | Yes |
| `GET` | `/api/ai/status` | AI provider health and configuration diagnostics | Yes |
| `GET` | `/api/ai/profile-context` | Aggregated user profile context for AI simulation | Yes |
| `POST` | `/api/ai/resume` | ATS resume keyword & SDE profile review | Yes |
| `POST` | `/api/ai/interview`| Dynamic contextual SDE interview question generator | Yes |
| `GET` | `/api/contests` | Live upcoming competitive programming contests | Yes |
| `GET` | `/api/github/:username` | GitHub public profile, star metrics, and top languages | Yes |

---

## 8. Spaced Repetition Engine

When a problem is marked as **Solved**:
1. `problemService` checks if revisions already exist.
2. If new, it creates 5 staged records in MongoDB via `revisionService`:
   - Stage 1: +1 Day
   - Stage 2: +3 Days
   - Stage 3: +7 Days
   - Stage 4: +15 Days
   - Stage 5: +30 Days
3. The problem's `nextRevisionDate` is linked to Stage 1.
4. When a revision is completed, the problem's `revisionCount` increments, `lastRevisedDate` updates, and `nextRevisionDate` rolls over to the next stage in sequence.

---

## 9. AI Assistant Layer

DevFlow features an **extensible service abstraction** (`aiService.js`):
- **Zero Lock-In**: Calls external LLM providers (e.g., OpenAI `gpt-4o-mini` or Google Gemini) when an API key (`OPENAI_API_KEY`) is present in `.env`.
- **Heuristic Fallback Engine**: If no API key is provided, DevFlow seamlessly falls back to its built-in algorithmic heuristic engine that parses loops for $O(N^2)$ nesting, recursive stack boundaries, off-by-one array bounds, and ATS keyword vectors.

---

## 10. Security & Production Practices

1. **Stateless JWT with Expiration**: Tokens expire in 24 hours. Client intercepts 401s, immediately clearing storage and dispatching an unauthenticated redirect event.
2. **IDOR Defense**: All database queries enforce `{ _id: resourceId, user: req.user.userId }`, ensuring users can never access or mutate another developer's records.
3. **NoSQL Injection Prevention**: User inputs are strictly typed and sanitized.
4. **ObjectId Validation**: Centralized `isValidObjectId` utility rejects malformed hex strings before querying MongoDB, preventing unhandled CastError 500 crashes.
5. **Centralized Error Middleware**: Uniform JSON error responses `{ success: false, message: "..." }`.

---

## 11. Setup & Local Development

### Prerequisites
- Node.js >= 18
- MongoDB instance (local or MongoDB Atlas)

### 1. Backend Setup
```bash
cd server
npm install
```
Configure your `.env` in `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
# Optional for external LLM:
OPENAI_API_KEY=your_openai_key
```
Start server:
```bash
npm run dev
# or npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
cd client
npm run build
```

---

## 12. Interview Pitch & Talking Points

> *"DevFlow is a full-stack developer workspace I architected using React 19, Tailwind CSS v4, Node.js, Express 5, and MongoDB. Unlike generic todo lists, DevFlow addresses real software engineering preparation: it pairs a DSA problem tracker with an automated 5-stage spaced repetition engine (Day 1, 3, 7, 15, 30) to eliminate pattern decay before interviews.*
>
> *On the backend, I designed a controller-service architecture, implemented secure JWT authentication with IDOR protection, and leveraged MongoDB aggregation pipelines to calculate dynamic streaks and topic mastery without heavy in-memory operations. I also engineered an extensible AI service layer with a fallback heuristic engine for code complexity analysis and ATS resume feedback."*
