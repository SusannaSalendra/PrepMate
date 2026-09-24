# PrepMate — Job Interview Preparation Platform 🚀

PrepMate is a production-ready, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application built to help software engineers, candidates, and tech job seekers excel in interviews. 

It features a curated question bank across core engineering categories, interactive timed mock interview simulations, self-rating confidence analytics, personal question bookmarks, and an admin management suite.

---

## 🌟 Features Overview

1. **Authentication & Role-Based Access Control**
   - JWT-based authentication with bcrypt password hashing
   - Role separation: `user` (candidate) and `admin` (recruiter/creator)
   - Support for both Bearer token headers and `httpOnly` cookies

2. **Curated Technical Question Bank**
   - Questions categorized under **DSA**, **System Design**, **Frontend Engineering**, **Backend & Databases**, and **Behavioral & Leadership**
   - Difficulty tiers (`Easy`, `Medium`, `Hard`)
   - Company tags (Google, Meta, Amazon, Microsoft, Netflix, Uber, Stripe, etc.)
   - Keyword search across titles, descriptions, and tags
   - Server-side pagination and sorting

3. **Live Mock Interview Simulation Suite**
   - Customized sessions by category, difficulty, and question count
   - Randomized question picker algorithm
   - Real-time elapsed timer with formatted countdown/clock
   - Live workspace to type code/explanations and self-rate confidence (1–5 stars)
   - Skip, navigate, and instant answer state syncing

4. **Detailed Session Summary & Scorecard**
   - Instant scorecard upon completion (time taken, average confidence, attempted count)
   - Side-by-side comparison of candidate answers with verified model solutions
   - Past session history archive

5. **Analytics & Progress Dashboard**
   - Recharts visual progress charts showing domain readiness
   - Total questions attempted, completed sessions, and bookmark statistics

6. **Bookmarking & Personal Notebook**
   - Save challenging questions for later review with 1-click optimistic bookmarking

7. **Admin Management Suite**
   - Admin-only CRUD for interview questions and categories with instant updates

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js, Mongoose ODM, JSON Web Token (JWT), bcryptjs |
| **Database** | MongoDB Atlas (Cloud Database) |
| **Security** | Helmet, CORS with credentials, express-rate-limit, express-mongo-sanitize |

---

## 📂 Project Structure

```
PrepMate/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── api/                # Configured Axios instance with interceptors
│   │   ├── components/         # Navbar, Footer, QuestionCard, Pagination, Loader, etc.
│   │   ├── context/            # AuthContext (state management, session persistence)
│   │   ├── pages/              # Home, QuestionBank, MockInterview, Dashboard, etc.
│   │   ├── App.jsx             # React Router route definitions & guards
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind directives & glassmorphism theme
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── server/                     # Backend Express REST API
│   ├── config/                 # db.js (Mongoose connection)
│   ├── controllers/            # Auth, Questions, Categories, Bookmarks, MockSessions, Users
│   ├── middleware/             # authMiddleware (verifyToken, isAdmin), errorMiddleware
│   ├── models/                 # User, Category, Question, Bookmark, MockSession
│   ├── routes/                 # Express API routes
│   ├── seed.js                 # Sample database seeder with realistic test data
│   ├── server.js               # Express application entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## ⚙️ Environment Variables

### 1. Backend (`/server/.env`)
Create a `.env` file inside the `server/` directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/prepmate?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Frontend (`/client/.env`)
Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

Open two terminal tabs:

**In Terminal 1 (Backend):**
```bash
cd server
npm install
```

**In Terminal 2 (Frontend):**
```bash
cd client
npm install
```

---

### Step 2: Seed the Database (Optional but Recommended)

To populate MongoDB Atlas with categories, curated questions, and demo accounts:

```bash
cd server
node seed.js
```

---

### Step 3: Run Backend & Frontend

**Run Backend API Server (Port 5000):**
```bash
cd server
npm run dev
# or npm start
```
*API will run on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)*

**Run Frontend Dev Server (Port 5173):**
```bash
cd client
npm run dev
```
*Frontend will run on `http://localhost:5173`*

---

## 🔑 Demo Test Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@prepmate.com` | `admin123` |
| **Standard User** | `alex@example.com` | `user123` |

*(You can also use the 1-click **"Demo User"** and **"Demo Admin"** quick-fill buttons on the Login page).*

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` — Sign in and receive JWT token + cookie
- `GET /api/auth/me` — Get current authenticated user
- `POST /api/auth/logout` — Clear session / cookie

### Questions
- `GET /api/questions` — List questions (supports `?category=`, `?difficulty=`, `?search=`, `?company=`, `?page=`, `?limit=`)
- `GET /api/questions/:id` — Get question details + bookmark status
- `POST /api/questions` — *(Admin only)* Create question
- `PUT /api/questions/:id` — *(Admin only)* Update question
- `DELETE /api/questions/:id` — *(Admin only)* Delete question

### Categories
- `GET /api/categories` — List all categories with active question counters
- `GET /api/categories/:id` — Get single category details
- `POST /api/categories` — *(Admin only)* Create category
- `PUT /api/categories/:id` — *(Admin only)* Update category
- `DELETE /api/categories/:id` — *(Admin only)* Delete category

### Bookmarks
- `GET /api/bookmarks` — List all saved questions of current user
- `POST /api/bookmarks/:questionId` — Toggle question bookmark (add/remove)

### Mock Interview Sessions
- `POST /api/mock-sessions/start` — Start a new randomized session (`category`, `difficulty`, `count`)
- `PUT /api/mock-sessions/:id/answer` — Submit / update answer for a question
- `PUT /api/mock-sessions/:id/complete` — Complete session and calculate scorecard
- `GET /api/mock-sessions/history` — Get past session history for current user
- `GET /api/mock-sessions/:id` — Get session review & summary details

### User Profile & Analytics
- `GET /api/users/profile` — Get profile + aggregated readiness and confidence metrics
- `PUT /api/users/profile` — Update name, email, or change password
- `GET /api/users` — *(Admin only)* List all registered users
