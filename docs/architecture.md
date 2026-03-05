# System Architecture

## Overview

SkyBook is a production-grade flight booking system built with a modern, scalable architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Next.js SSR Layer (Port 3000)               │
│  ┌────────────┐ ┌──────────────┐ ┌─────────────────────┐   │
│  │ Static     │ │ SSR Pages    │ │ Client Components   │   │
│  │ Pages      │ │ /flights     │ │ (React Hooks)       │   │
│  │            │ │ /flight/[id] │ │                     │   │
│  └────────────┘ └──────────────┘ └─────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│               Express.js API Layer (Port 5000)               │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│  │ Auth Routes │ │ Flight Routes│ │ Booking Routes     │   │
│  │ /api/auth   │ │ /api/flights │ │ /api/bookings      │   │
│  └──────┬──────┘ └──────┬───────┘ └────────┬───────────┘   │
│         │               │                   │               │
│  ┌──────▼───────────────▼───────────────────▼───────────┐  │
│  │              Controllers → Services → Repositories    │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
┌──────────▼──────────┐         ┌──────────▼──────────┐
│  MongoDB (Port 27017)│         │  Redis (Port 6379)  │
│  ┌────────────────┐ │         │  ┌────────────────┐  │
│  │ users          │ │         │  │ seat_lock:*    │  │
│  │ flights        │ │         │  │ flights:search │  │
│  │ bookings       │ │         │  └────────────────┘  │
│  └────────────────┘ │         └─────────────────────┘
└─────────────────────┘
```

## Key Components

### Frontend (Next.js 14)
- **App Router**: Uses Next.js 14 App Router for routing
- **Server Components**: Flight search and detail pages use SSR for SEO
- **Client Components**: Interactive forms and booking flow
- **API Client**: Centralized Axios instance with JWT interceptors

### Backend (Express.js)
- **Layered Architecture**: Controllers → Services → Repositories
- **Authentication**: JWT-based with bcrypt password hashing
- **Middleware**: Helmet, CORS, rate limiting, request logging
- **Error Handling**: Global error handler with operational vs programming errors

### Redis Usage
- **Seat Locking**: `seat_lock:{flightId}:{seatNumber}` with 5-minute TTL
- **Search Cache**: `flights:search:{params}` with 60-second TTL

### MongoDB Collections
- **users**: Authentication credentials and profile
- **flights**: Flight schedules and seat maps
- **bookings**: Booking records with status tracking

## Data Flow: Flight Booking

```
User selects seat
       ↓
Redis: Check seat lock (seat_lock:{flightId}:{seatNumber})
       ↓ (not locked)
MongoDB: Check seat availability in seatMap
       ↓ (available)
MongoDB: Create booking (status: pending)
MongoDB: Mark seat as booked in seatMap
Redis: Remove seat lock
       ↓
User confirms payment
       ↓
MongoDB: Update booking (status: confirmed, paymentStatus: paid)
```

## SSR Strategy

- `/flights` page: Fetches from API with `revalidate: 60` (ISR)
- `/flight/[id]` page: Fetches from API with `revalidate: 30` (ISR)
- Dynamic metadata generated per flight for SEO
- Structured data (JSON-LD) injected for search engines

## Security Measures

- Helmet.js HTTP security headers
- JWT token validation on protected routes
- Role-based access control (user/admin)
- Request rate limiting (100 req/15min general, 20 req/15min auth)
- Input validation with Mongoose schema
- CORS configured for allowed origins only
