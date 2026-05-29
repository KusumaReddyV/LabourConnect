# Labour Connect — MERN Stack

A full-stack labour hiring platform with role-based authentication, worker profiles, search & filter, booking/job requests, and admin management.

**Brand preserved:** brown `#864000`, gold `#FFD700`, orange `#a95507` — same visual identity as the original HTML site.

---

## Demo workers (MongoDB seed)

```bash
cd backend
npm run seed:workers
```

Creates 6 sample labour profiles (electrician, plumber, carpenter, welder, AC technician, painter) with reviews. Password for demo accounts: `Demo@12345`

---

## Frontend structure

```
frontend/src/
├── assets/
├── auth/ProtectedRoute.jsx
├── components/
│   ├── common/     Navbar, Footer, HireModal
│   └── ui/         Button, Badge, JobCard, LabourCard, StatCard, Skeleton…
├── context/        AuthContext, ToastContext
├── dashboards/
│   ├── labour/     Overview, Requests, Jobs, Profile, Notifications
│   ├── client/     Overview, Browse, Jobs, Favourites, Profile
│   └── admin/      Analytics, Users
├── hooks/useAsync.js
├── layouts/        MainLayout, DashboardLayout
├── pages/          Public pages only
├── routes/AppRoutes.jsx
├── services/api.js
├── styles/
└── utils/
```

---

## Folder structure

```
Labour Connect/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   ├── services/api.js
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
├── legacy/          # (optional) original PHP/HTML files at project root
└── README.md
```

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** 6+ (local or Atlas)

---

## MongoDB setup

**Local:**

```bash
# Start MongoDB service, then database is created automatically on first connect
# Default URI: mongodb://127.0.0.1:27017/labour_connect
```

**Atlas:** Create a cluster, copy connection string into `MONGODB_URI`.

---

## Backend setup

```bash
cd backend
npm install
copy .env.example .env    # Windows
# cp .env.example .env    # Mac/Linux
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/labour_connect
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Create admin user:**

```bash
npm run seed:admin
# Default: admin@labourconnect.com / Admin@12345
```

**Run backend:**

```bash
npm run dev
# API: http://localhost:5000/api/health
```

---

## Frontend setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
# App: http://localhost:5173
```

---

## Run commands (both)

**Terminal 1 — Backend:**

```bash
cd "c:\Users\vuppu\Desktop\Labour Connect\backend"
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd "c:\Users\vuppu\Desktop\Labour Connect\frontend"
npm run dev
```

**Production build:**

```bash
cd frontend && npm run build
cd backend && npm start
```

---

## API summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register/labour` | Public | Labour signup + profile + images |
| POST | `/api/auth/register/client` | Public | Client signup + profile |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Auth | Current user + profile |
| GET | `/api/labour/search` | Public | Search/filter labourers |
| GET | `/api/labour/public/:id` | Public | Labour profile + reviews |
| GET/PUT | `/api/labour/profile/me` | Labour | Own profile |
| GET | `/api/labour/jobs/requests` | Labour | Job requests |
| PUT | `/api/labour/jobs/:id/accept` | Labour | Accept job |
| PUT | `/api/labour/jobs/:id/reject` | Labour | Reject job |
| PUT | `/api/labour/jobs/:id/start` | Labour | Start ongoing |
| PUT | `/api/labour/jobs/:id/complete` | Labour | Complete job |
| POST | `/api/client/hire` | Client | Create booking |
| GET | `/api/client/jobs` | Client | Client jobs |
| GET | `/api/admin/users` | Admin | All users |
| PUT | `/api/admin/users/:id/block` | Admin | Block/unblock |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/analytics` | Admin | Stats |
| GET | `/api/notifications` | Auth | Notifications |
| GET/POST | `/api/reviews` | Mixed | Reviews |

---

## Auth flow

1. User registers as **labour** (multipart form with images) or **client** (JSON).
2. Password is bcrypt-hashed; JWT issued on register/login.
3. Token stored in `localStorage` as `lc_user`.
4. Axios attaches `Authorization: Bearer <token>`.
5. Login redirects by role:
   - `labour` → `/labour/dashboard`
   - `client` → `/client/dashboard`
   - `admin` → `/admin/dashboard`
6. `ProtectedRoute` blocks unauthorized access.

---

## Booking flow

1. Client browses `/browse` or `/client/services`.
2. Opens `/labour/:id` → **Hire Now**.
3. Fills job title, description, location, wage, date, timing.
4. `POST /api/client/hire` creates job with `status: pending`.
5. Labour sees request in dashboard → **Accept** or **Reject**.
6. Accepted → **Start Job** → `ongoing` → **Mark Completed**.
7. Labour `completedJobs` increments; client can leave a review.

**Job statuses:** `pending` → `accepted` → `ongoing` → `completed` (or `rejected`)

---

## Dashboard routing

| Role | Route | Features |
|------|-------|----------|
| Labour | `/labour/dashboard` | Requests, ongoing, completed, profile edit, earnings, notifications |
| Client | `/client/dashboard` | Jobs, search, favourites, profile, notifications |
| Admin | `/admin/dashboard` | Analytics, block/delete users |

---

## Deployment readiness

- [x] Environment variables via `.env`
- [x] CORS configured for frontend URL
- [x] JWT + role middleware
- [x] Password hashing
- [x] Input validation (express-validator)
- [x] Static uploads served at `/uploads`
- [ ] Add HTTPS, rate limiting, and helmet for production
- [ ] Use MongoDB Atlas + cloud storage (S3) for uploads in production
- [ ] Set strong `JWT_SECRET` and restrict `CLIENT_URL`

---

## Original PHP site

Legacy HTML/PHP files remain in the project root. The React app replaces them for day-to-day use. You can archive old files into a `legacy/` folder if desired.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB connection failed | Start MongoDB service or fix `MONGODB_URI` |
| CORS errors | Match `CLIENT_URL` in backend `.env` to frontend URL |
| 401 on API calls | Log in again; check token in localStorage |
| Images not showing | Ensure backend runs on port 5000; check `VITE_API_BASE` |

---

## License

MIT — Labour Connect © 2024–2026
