jest.mock('../src/repositories/bookingRepository');
jest.mock('../src/repositories/flightRepository');
jest.mock('../src/repositories/userRepository');
jest.mock('../src/config/database', () => jest.fn().mockResolvedValue());
jest.mock('../src/config/redis', () => ({ connectRedis: jest.fn(), getRedisClient: jest.fn(() => null) }));

process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const bookingRepository = require('../src/repositories/bookingRepository');
const flightRepository = require('../src/repositories/flightRepository');
const userRepository = require('../src/repositories/userRepository');
const jwt = require('jsonwebtoken');

const userId = '64a0000000000000000000001';
const flightId = '64a0000000000000000000002';
const bookingId = '64a0000000000000000000003';

const mockUser = { _id: userId, id: userId, name: 'Test User', email: 'user@example.com', role: 'user' };
const userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET);

const seatMap = Array.from({ length: 5 }, (_, i) => ({
  seatNumber: `1${String.fromCharCode(65 + i)}`,
  class: 'economy',
  isBooked: false,
}));

const mockFlight = {
  _id: flightId,
  flightNumber: 'AI202',
  airline: 'Air India',
  origin: 'DEL',
  destination: 'BOM',
  price: 3500,
  totalSeats: 5,
  availableSeats: 5,
  seatMap,
};

const mockBooking = {
  _id: bookingId,
  userId: { _id: userId, toString: () => userId },
  flightId: { _id: flightId },
  seatNumber: '1A',
  status: 'pending',
  paymentStatus: 'unpaid',
  totalAmount: 3500,
  passengerName: 'Test User',
  passengerEmail: 'user@example.com',
};

describe('Bookings API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userRepository.findById.mockResolvedValue(mockUser);
    flightRepository.findById.mockResolvedValue(mockFlight);
    flightRepository.updateSeats.mockResolvedValue(mockFlight);
  });

  describe('POST /api/bookings', () => {
    it('should create a booking', async () => {
      bookingRepository.create.mockResolvedValue(mockBooking);

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          flightId,
          seatNumber: '1A',
          passengerName: 'Test User',
          passengerEmail: 'user@example.com',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.booking.status).toBe('pending');
    });

    it('should reject booking for already booked seat', async () => {
      const bookedFlight = {
        ...mockFlight,
        seatMap: [{ seatNumber: '1A', class: 'economy', isBooked: true }, ...seatMap.slice(1)],
      };
      flightRepository.findById.mockResolvedValue(bookedFlight);

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ flightId, seatNumber: '1A', passengerName: 'X', passengerEmail: 'x@x.com' });

      expect(res.status).toBe(409);
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).post('/api/bookings').send({});
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/bookings/my', () => {
    it('should return user bookings', async () => {
      bookingRepository.findByUser.mockResolvedValue([mockBooking]);

      const res = await request(app)
        .get('/api/bookings/my')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.bookings).toHaveLength(1);
    });
  });

  describe('PATCH /api/bookings/:id/confirm', () => {
    it('should confirm a booking', async () => {
      const confirmedBooking = { ...mockBooking, status: 'confirmed', paymentStatus: 'paid' };
      bookingRepository.findById.mockResolvedValue(mockBooking);
      bookingRepository.updateStatus.mockResolvedValue(confirmedBooking);

      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/confirm`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.booking.status).toBe('confirmed');
    });
  });

  describe('PATCH /api/bookings/:id/cancel', () => {
    it('should cancel a booking', async () => {
      const cancelledBooking = { ...mockBooking, status: 'cancelled', paymentStatus: 'refunded' };
      bookingRepository.findById.mockResolvedValue(mockBooking);
      bookingRepository.updateStatus.mockResolvedValue(cancelledBooking);

      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.booking.status).toBe('cancelled');
    });
  });
});
