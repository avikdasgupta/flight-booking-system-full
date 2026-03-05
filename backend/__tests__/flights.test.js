jest.mock('../src/repositories/flightRepository');
jest.mock('../src/repositories/userRepository');
jest.mock('../src/config/database', () => jest.fn().mockResolvedValue());
jest.mock('../src/config/redis', () => ({ connectRedis: jest.fn(), getRedisClient: jest.fn(() => null) }));

process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const flightRepository = require('../src/repositories/flightRepository');
const userRepository = require('../src/repositories/userRepository');
const jwt = require('jsonwebtoken');

const adminUser = { _id: '64a0000000000000000000001', name: 'Admin', email: 'admin@example.com', role: 'admin' };
const regularUser = { _id: '64a0000000000000000000002', name: 'User', email: 'user@example.com', role: 'user' };

const adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET);
const userToken = jwt.sign({ id: regularUser._id }, process.env.JWT_SECRET);

const mockFlight = {
  _id: '64a0000000000000000000003',
  flightNumber: 'AI101',
  airline: 'Air India',
  origin: 'CCU',
  destination: 'DEL',
  departureTime: new Date(Date.now() + 86400000),
  arrivalTime: new Date(Date.now() + 90000000),
  price: 5000,
  totalSeats: 10,
  availableSeats: 10,
  seatMap: Array.from({ length: 10 }, (_, i) => ({
    seatNumber: `${Math.floor(i / 6) + 1}${String.fromCharCode(65 + (i % 6))}`,
    class: 'economy',
    isBooked: false,
  })),
};

describe('Flights API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userRepository.findById.mockResolvedValue(null);
    flightRepository.create.mockResolvedValue(mockFlight);
    flightRepository.findAll.mockResolvedValue({ flights: [mockFlight], total: 1, page: 1, pages: 1 });
    flightRepository.search.mockResolvedValue({ flights: [mockFlight], total: 1, page: 1, pages: 1 });
    flightRepository.findById.mockResolvedValue(mockFlight);
  });

  describe('POST /api/flights', () => {
    it('should allow admin to create a flight', async () => {
      userRepository.findById.mockResolvedValue(adminUser);
      const res = await request(app)
        .post('/api/flights')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          flightNumber: 'AI101',
          airline: 'Air India',
          origin: 'CCU',
          destination: 'DEL',
          departureTime: new Date(Date.now() + 86400000).toISOString(),
          arrivalTime: new Date(Date.now() + 90000000).toISOString(),
          price: 5000,
          totalSeats: 10,
        });
      expect(res.status).toBe(201);
      expect(res.body.data.flight.flightNumber).toBe('AI101');
    });

    it('should reject flight creation by non-admin', async () => {
      userRepository.findById.mockResolvedValue(regularUser);
      const res = await request(app)
        .post('/api/flights')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ flightNumber: 'AI101' });
      expect(res.status).toBe(403);
    });

    it('should reject unauthenticated flight creation', async () => {
      const res = await request(app).post('/api/flights').send({ flightNumber: 'AI101' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/flights', () => {
    it('should return list of flights', async () => {
      const res = await request(app).get('/api/flights');
      expect(res.status).toBe(200);
      expect(res.body.data.flights).toHaveLength(1);
    });
  });

  describe('GET /api/flights/search', () => {
    it('should search flights by origin and destination', async () => {
      const res = await request(app)
        .get('/api/flights/search')
        .query({ origin: 'CCU', destination: 'DEL' });
      expect(res.status).toBe(200);
      expect(res.body.data.flights.length).toBeGreaterThan(0);
    });

    it('should return empty for non-matching search', async () => {
      flightRepository.search.mockResolvedValue({ flights: [], total: 0, page: 1, pages: 0 });
      const res = await request(app)
        .get('/api/flights/search')
        .query({ origin: 'BOM', destination: 'MAA' });
      expect(res.status).toBe(200);
      expect(res.body.data.flights).toHaveLength(0);
    });
  });

  describe('GET /api/flights/:id', () => {
    it('should return flight by id', async () => {
      const res = await request(app).get(`/api/flights/${mockFlight._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.flight._id).toBe(mockFlight._id);
    });

    it('should return 404 for non-existent flight', async () => {
      flightRepository.findById.mockResolvedValue(null);
      const res = await request(app).get('/api/flights/000000000000000000000000');
      expect(res.status).toBe(404);
    });
  });
});
