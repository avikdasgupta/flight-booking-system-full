# API Specification

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require: `Authorization: Bearer <token>`

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional, defaults to "user"
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{ "email": "john@example.com", "password": "password123" }
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET /auth/profile
Get current user profile. **Protected**

**Response 200:**
```json
{
  "status": "success",
  "data": { "user": { "_id": "...", "name": "...", "email": "...", "role": "user" } }
}
```

---

## Flight Endpoints

### GET /flights
Get paginated list of all flights.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "flights": [...],
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

---

### GET /flights/search
Search flights with filters.

**Query Parameters:**
- `origin` (string, IATA code, e.g. CCU)
- `destination` (string, IATA code, e.g. DEL)
- `date` (string, ISO date, e.g. 2025-01-15)
- `page` (number, default: 1)
- `limit` (number, default: 10)

Results are cached in Redis for 60 seconds.

---

### GET /flights/:id
Get flight by ID.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "flight": {
      "_id": "...",
      "flightNumber": "AI101",
      "airline": "Air India",
      "origin": "CCU",
      "destination": "DEL",
      "departureTime": "2025-01-15T08:00:00.000Z",
      "arrivalTime": "2025-01-15T10:30:00.000Z",
      "price": 5000,
      "totalSeats": 120,
      "availableSeats": 85,
      "seatMap": [
        { "seatNumber": "1A", "class": "economy", "isBooked": false },
        ...
      ]
    }
  }
}
```

---

### POST /flights
Create a new flight. **Admin only**

**Request Body:**
```json
{
  "flightNumber": "AI101",
  "airline": "Air India",
  "origin": "CCU",
  "destination": "DEL",
  "departureTime": "2025-01-15T08:00:00.000Z",
  "arrivalTime": "2025-01-15T10:30:00.000Z",
  "price": 5000,
  "totalSeats": 120
}
```

---

## Booking Endpoints

### POST /bookings/lock-seat
Temporarily lock a seat (5-minute TTL). **Protected**

**Request Body:**
```json
{ "flightId": "...", "seatNumber": "1A" }
```

**Response 200:**
```json
{
  "status": "success",
  "data": { "flightId": "...", "seatNumber": "1A", "lockedUntil": "2025-01-15T08:05:00.000Z" }
}
```

---

### POST /bookings
Create a booking. **Protected**

**Request Body:**
```json
{
  "flightId": "...",
  "seatNumber": "1A",
  "passengerName": "John Doe",
  "passengerEmail": "john@example.com"
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "booking": {
      "_id": "...",
      "userId": "...",
      "flightId": "...",
      "seatNumber": "1A",
      "status": "pending",
      "paymentStatus": "unpaid",
      "totalAmount": 5000,
      "passengerName": "John Doe",
      "passengerEmail": "john@example.com"
    }
  }
}
```

---

### GET /bookings/my
Get current user's bookings. **Protected**

---

### GET /bookings/all
Get all bookings. **Admin only**

---

### GET /bookings/:id
Get booking by ID. **Protected**

---

### PATCH /bookings/:id/confirm
Confirm and pay for a booking. **Protected**

Updates `status: confirmed` and `paymentStatus: paid`.

---

### PATCH /bookings/:id/cancel
Cancel a booking. **Protected**

Updates `status: cancelled` and `paymentStatus: refunded`.

---

## Error Responses

All errors follow this format:
```json
{
  "status": "fail",
  "message": "Error description"
}
```

Common HTTP status codes:
- `400` Bad Request (validation errors)
- `401` Unauthorized (missing/invalid token)
- `403` Forbidden (insufficient permissions)
- `404` Not Found
- `409` Conflict (e.g. seat already booked)
- `429` Too Many Requests (rate limited)
- `500` Internal Server Error

---

## Rate Limiting

- General: 100 requests per 15 minutes per IP
- Auth endpoints: 20 requests per 15 minutes per IP
