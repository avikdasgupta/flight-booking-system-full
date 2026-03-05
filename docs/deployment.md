# Deployment Guide

## Free Hosting Stack

| Service    | Provider                    | Free Tier                        |
|------------|-----------------------------|----------------------------------|
| Frontend   | Vercel                      | Unlimited personal projects      |
| Backend    | Vercel **or** Render        | Vercel: Serverless (free hobby); Render: 750 hours/month (spins down) |
| MongoDB    | MongoDB Atlas               | 512 MB M0 cluster                |
| Redis      | Redis Cloud                 | 30 MB database                   |

> **Which backend host should I choose?**
> - **Vercel** — Zero-config, instant deploys from GitHub, no cold-start spin-down delay. Ideal when you already host the frontend on Vercel. The Express app is wrapped as a single serverless function. Redis caching/locking is disabled when `REDIS_URL` is not set (non-fatal).
> - **Render** — Traditional long-running server. Better for WebSocket or long-polling workloads, but the free tier spins down after 15 minutes of inactivity (first request after idle takes ~30 s to respond).

---

## 1. MongoDB Atlas Setup (Free M0 Cluster)

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0** cluster (choose any region)
3. Go to **Database Access** → Add a database user (note the username and password)
4. Go to **Network Access** → Add IP `0.0.0.0/0` (allow all IPs)
5. Go to **Clusters** → Connect → **Drivers** → Copy the connection string
6. Replace `<username>`, `<password>`, and `<cluster>` in your `.env`:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/flight_booking?retryWrites=true&w=majority
   ```

> **Tip**: `flight_booking` is the database name — Atlas creates it automatically on first use.

---

## 2. Redis Cloud Setup

1. Sign up at [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud/)
2. Create a free database
3. Copy the **Public endpoint** and **Password**
4. Your Redis URL: `redis://default:password@host:port`

---

## 3. Backend on Vercel (Serverless)

> **Alternative**: see [Section 4](#4-backend-on-render-traditional-server) for the Render (traditional server) option.

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
4. Add environment variables:
   ```
   NODE_ENV=production
   MONGO_URI=<your-atlas-uri>
   JWT_SECRET=<your-secret-key-min-32-chars>
   JWT_EXPIRES_IN=7d
   REDIS_URL=<your-redis-cloud-url>   # optional — Redis is non-fatal
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
5. Click **Deploy**
6. Note your backend URL: `https://your-backend.vercel.app`

> **Tip**: The `backend/vercel.json` already configures `@vercel/node` to wrap the Express app as a single serverless function and route all requests to it — no extra configuration needed.

---

## 4. Backend on Render (Traditional Server)

1. Sign up at [render.com](https://render.com)
2. Click **New Web Service** → Connect your GitHub repo
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=<your-atlas-uri>
   JWT_SECRET=<your-secret-key-min-32-chars>
   JWT_EXPIRES_IN=7d
   REDIS_URL=<your-redis-cloud-url>
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
5. Click **Create Web Service**
6. Note your backend URL: `https://your-backend.onrender.com`

---

## 5. Frontend on Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app   # or your-backend.onrender.com
   API_BASE_URL=https://your-backend.vercel.app           # or your-backend.onrender.com
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```
5. Deploy

---

## 6. Local Docker Deployment

```bash
# Clone the repository
git clone https://github.com/yourusername/flight-booking-system-full.git
cd flight-booking-system-full

# Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Start all services
cd docker
docker-compose up --build

# Services available at:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# MongoDB:  mongodb://localhost:27017
# Redis:    redis://localhost:6379
```

---

## 7. Initial Admin Setup

After deployment, create an admin user (replace the URL with your backend URL):

```bash
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "securepassword123",
    "role": "admin"
  }'
```

---

## 8. Environment Variables Reference

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | ✅ |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) | ✅ |
| `REDIS_URL` | Redis connection URL | Optional |
| `PORT` | Server port (default: 5000) | Optional |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins | Optional |
| `NODE_ENV` | Environment (`production`/`development`) | Optional |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (client-side) | ✅ |
| `API_BASE_URL` | Backend API URL (server-side SSR) | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL for SEO | Optional |

---

## 9. CI/CD with GitHub Actions

The included `.github/workflows/ci.yml` automatically:

1. Runs backend tests on every push/PR
2. Lints and builds the frontend
3. Builds Docker images on every successful CI run
4. Deploys the frontend to Vercel on every push to `main`

### Required GitHub Secrets for Vercel deployment

Add the following secrets in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | How to obtain |
|--------|---------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Run `vercel whoami` or find in Vercel project settings |
| `VERCEL_PROJECT_ID` | Run `vercel link` inside `frontend/` and read `.vercel/project.json` |

To retrieve `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` locally:

```bash
cd frontend
npm install -g vercel
vercel login        # authenticate
vercel link         # link to your Vercel project (follow prompts)
cat .vercel/project.json
# → { "orgId": "...", "projectId": "..." }
```

Once the secrets are set, every push to `main` will automatically deploy the frontend to Vercel.
