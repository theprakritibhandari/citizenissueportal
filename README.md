# Citizen Issue Reporting Portal 🏛️

A modern, full-stack civic complaint and resolution management platform built for municipal corporations and citizens. Citizens can submit geo-tagged public grievances with evidence photos, track real-time resolution pipelines, while municipal administrators can manage, triage, dispatch engineering crews, and update statuses with audit trails.

---

## 🚀 Tech Stack

### Frontend (`client/`)
- **React 19** with **Vite**
- **React Router v7** for single-page routing & role protection
- **Lucide React** for civic and UI iconography
- **Pure Vanilla CSS Design System** (responsive from 320px mobile to ultra-wide screens, glassmorphism, civic color palette, status badge tokens, interactive timeline)

### Backend (`server/`)
- **Node.js** & **Express.js** (REST API)
- **MongoDB** with **Mongoose** ORM
- **JWT (JSON Web Tokens)** for stateless session authentication
- **bcryptjs** for salted password hashing
- **Multer** for issue evidence photo uploads (`/uploads/...`)
- **CORS** & **Dotenv** configuration

---

## 📂 Project Structure

```text
citizen issue reporting portal/
├── client/                               # React + Vite Frontend
│   ├── index.html                        # HTML5 template with civic meta & Google Fonts
│   ├── package.json                      # Frontend dependencies & scripts
│   ├── vite.config.js                    # Vite configuration with API proxy to port 5000
│   └── src/
│       ├── components/
│       │   ├── common/                   # Reusable UI (Button, Input, Select, Badge, Modal, Loader, Toast, EmptyState)
│       │   ├── issues/                   # IssueTimeline (visual stepper & audit trail)
│       │   └── layout/                   # Navbar, Footer, AdminSidebar, AdminLayout, ProtectedRoute
│       ├── context/                      # AuthContext, ToastContext
│       ├── pages/                        # Citizen & Public Pages (Home, Login, Register, ReportIssue, MyReports, IssueDetails, Profile)
│       │   └── admin/                    # Admin Pages (AdminDashboard, AdminIssues, AdminIssueDetails, AdminUsers, AdminLogin)
│       ├── services/                     # Centralized API client (api.js)
│       ├── styles/                       # Design system CSS tokens (variables, global, components, pages)
│       ├── App.jsx                       # Master Router & Role Guards
│       └── main.jsx                      # Application Entry Point
├── server/                               # Node.js + Express Backend
│   ├── package.json                      # Backend dependencies & scripts
│   ├── server.js                         # Express server entry point & static file serving
│   ├── .env.example                      # Environment variable template
│   ├── .env                              # Local environment configuration
│   ├── config/                           # MongoDB connection config (db.js)
│   ├── controllers/                      # authController, issueController, adminController
│   ├── middleware/                       # auth, role, upload (Multer), errorHandler
│   ├── models/                           # User.js, Issue.js (Mongoose schemas)
│   ├── routes/                           # authRoutes, issueRoutes, adminRoutes
│   ├── utils/                            # seed.js (Auto-seed admin & sample complaints)
│   └── uploads/                          # Stored evidence photos
├── package.json                          # Root package.json
└── README.md                             # Documentation
```

---

## 👥 User Roles & Features

### 1. Citizen Role
- **Citizen Account**: Register and log in securely with JWT.
- **Home Portal**: Civic hero banner, real-time KPI metrics, resolution process explanation, departmental category cards, and recent complaints feed.
- **Report Issue Form**: Title, Category, Priority (Low/Medium/High/Urgent), Detailed Description, Geolocation with "Use Current GPS", and photo attachment.
- **My Reports Dashboard**: Filter submissions by status (Submitted, Under Review, In Progress, Resolved, Rejected), search by keyword, edit or withdraw complaints while status is `Submitted`.
- **Issue Details Tracker**: Visual 4-step horizontal pipeline (`Submitted` → `Under Review` → `In Progress` → `Resolved` or `Rejected`), full timestamps, administrative remarks, and full-resolution photo viewer.
- **Citizen Profile**: View personal credentials and submission statistics summary.

### 2. Administrator Role
- **Admin Dashboard**: Live KPI metrics (Total issues, Pending/Submitted, Under Review, In Progress, Resolved, Rejected, Total Citizens), departmental category distribution, priority distribution, and recent complaints list.
- **Issue Management Console**: Full filterable table with search, category filter, status filter, and priority filter.
- **Quick Status Changer Modal**: Switch status (`Submitted`, `Under Review`, `In Progress`, `Resolved`, `Rejected`) and attach engineering notes/remarks.
- **Admin Issue Review Page**: In-depth inspection of citizen reporter contact info, photo evidence, and status history updater.
- **Moderation**: Delete duplicate or inappropriate submissions.
- **Citizens Directory**: Searchable list of registered citizens with report submission counts and contact information.

---

## 🔑 Administrator Account Setup

To create an administrator account securely, run the following interactive command in the `server` directory:

```bash
cd server
npm run create-admin
```

You will be prompted to enter your Admin Name, Email, and Password (password input is masked in the terminal and requires uppercase, lowercase, numbers, and special characters).

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd server
npm install
```

Create or verify `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/citizen_portal
JWT_SECRET=super_secret_citizen_portal_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run backend development server:
```bash
npm run dev
# Or to seed sample data:
npm run seed
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Run frontend development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new citizen
- `POST /api/auth/login` - Authenticate citizen or admin & return JWT
- `GET /api/auth/me` - Get current user profile and submission stats (Private)

### Citizen Issues (`/api/issues`)
- `POST /api/issues` - Submit new complaint with optional image upload (Private - Citizen)
- `GET /api/issues` - Public list of recent issues (Public, supports `?category=`, `?status=`, `?search=`, `?page=`, `?limit=`)
- `GET /api/issues/my` - Get logged-in citizen's complaints (Private)
- `GET /api/issues/:id` - Get complaint details by MongoDB `_id` or `issueId` (Public / Private)
- `PUT /api/issues/:id` - Update complaint if still in `Submitted` status (Private - Owner)
- `DELETE /api/issues/:id` - Delete complaint if still in `Submitted` status (Private - Owner)

### Admin Management (`/api/admin`)
- `GET /api/admin/stats` - Aggregate counts, category distribution, and priority metrics (Admin only)
- `GET /api/admin/issues` - Filtered table of all complaints (Admin only)
- `PUT /api/admin/issues/:id/status` - Update status and append admin remark & history log (Admin only)
- `DELETE /api/admin/issues/:id` - Delete inappropriate/invalid report (Admin only)
- `GET /api/admin/users` - Directory of registered citizens with complaint stats (Admin only)

---

## 🛡️ Security & Design Standards
- Salted password hashing with bcryptjs (10 rounds).
- Password field stripped automatically from all API responses (`select: false`).
- JWT-based authentication with Bearer token authorization header.
- Role-based authorization middleware protecting `/api/admin/*` and admin UI views.
- Fully responsive layout verified from 320px mobile viewport to widescreen monitors.
