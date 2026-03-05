# ✈️ SkyBook - Flight Booking System

A production-grade full-stack flight booking system built with Next.js, Express.js, MongoDB, and Redis.

---

## 🏗 Architecture

```
Browser → Next.js SSR → Express API → Redis (cache/locks) → MongoDB
```

**Frontend**: Next.js 16 (SSR + App Router) → Vercel  
**Backend**: Node.js + Express.js → Render  
**Database**: MongoDB (Mongoose) → Atlas  
**Cache/Lock**: Redis → Redis Cloud  
**CI/CD**: GitHub Actions  

See [docs/architecture.md](docs/architecture.md) for detailed diagrams.

---

## 🚀 Features

- JWT authentication with bcrypt
- Role-based access control (user/admin)
- Flight search with Redis caching (60s TTL)
- Interactive seat map with real-time availability
- Distributed seat locking via Redis (5-minute TTL)
- SSR flight search and detail pages for SEO
- SEO: meta tags, OpenGraph, JSON-LD, sitemap, robots.txt
- Request rate limiting, Winston logging, global error handling
- Docker containerization + CI/CD pipeline

---

## 📁 Project Structure

```
flight-booking-system-full/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   └── __tests__/
├── frontend/                # Next.js 16
│   ├── app/                 # App Router pages
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── utils/
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
├── .github/workflows/ci.yml
└── docs/
    ├── architecture.md
    ├── api-spec.md
    └── deployment.md
```

---

## 🛠 Local Setup

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Redis (local or Redis Cloud)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and Redis URL
npm install
npm run dev    # http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev    # http://localhost:3000
```

---

## 🐳 Docker Setup

```bash
cd docker
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

---

## 🧪 Testing

```bash
cd backend && npm test    # 21 tests: auth, flights, bookings
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/flight_booking
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🌐 SSR & SEO

Flight search (`/flights`) and flight details (`/flight/[id]`) pages use Next.js Server Components to fetch data on the server, enabling full HTML for search engine crawlers.

Each flight detail page generates dynamic metadata (title, description, OpenGraph, JSON-LD structured data) for maximum SEO impact.

---

## 🚀 Deployment

See [docs/deployment.md](docs/deployment.md) for full instructions.

**Free tier stack**: MongoDB Atlas + Redis Cloud + Render (backend) + Vercel (frontend)

---

## 📖 API Documentation

See [docs/api-spec.md](docs/api-spec.md) for full API reference.
