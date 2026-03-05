const bookingRepository = require('../repositories/bookingRepository');
const flightRepository = require('../repositories/flightRepository');
const { getRedisClient } = require('../config/redis');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const LOCK_TTL = 300; // 5 minutes in seconds

const getSeatLockKey = (flightId, seatNumber) =>
  `seat_lock:${flightId}:${seatNumber}`;

class BookingService {
  async lockSeat(flightId, seatNumber, userId) {
    const flight = await flightRepository.findById(flightId);
    if (!flight) throw new AppError('Flight not found', 404);

    const seat = flight.seatMap.find((s) => s.seatNumber === seatNumber);
    if (!seat) throw new AppError('Seat not found', 404);
    if (seat.isBooked) throw new AppError('Seat is already booked', 409);

    const redis = getRedisClient();
    if (redis) {
      const lockKey = getSeatLockKey(flightId, seatNumber);
      const existing = await redis.get(lockKey);
      if (existing && existing !== userId.toString()) {
        throw new AppError('Seat is temporarily locked by another user', 409);
      }
      await redis.setEx(lockKey, LOCK_TTL, userId.toString());
    }

    return { flightId, seatNumber, lockedUntil: new Date(Date.now() + LOCK_TTL * 1000) };
  }

  async releaseSeat(flightId, seatNumber) {
    const redis = getRedisClient();
    if (redis) {
      const lockKey = getSeatLockKey(flightId, seatNumber);
      await redis.del(lockKey);
    }
  }

  async createBooking({ userId, flightId, seatNumber, passengerName, passengerEmail }) {
    const flight = await flightRepository.findById(flightId);
    if (!flight) throw new AppError('Flight not found', 404);

    const seat = flight.seatMap.find((s) => s.seatNumber === seatNumber);
    if (!seat) throw new AppError('Seat not found', 404);
    if (seat.isBooked) throw new AppError('Seat is already booked', 409);

    const redis = getRedisClient();
    if (redis) {
      const lockKey = getSeatLockKey(flightId, seatNumber);
      const lockHolder = await redis.get(lockKey);
      if (lockHolder && lockHolder !== userId.toString()) {
        throw new AppError('Seat is locked by another user', 409);
      }
    }

    const booking = await bookingRepository.create({
      userId,
      flightId,
      seatNumber,
      totalAmount: flight.price,
      passengerName,
      passengerEmail,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await flightRepository.updateSeats(flightId, seatNumber, true);

    if (redis) {
      const lockKey = getSeatLockKey(flightId, seatNumber);
      await redis.del(lockKey);
    }

    return booking;
  }

  async confirmBooking(bookingId, userId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.userId._id.toString() !== userId.toString()) {
      throw new AppError('Not authorized', 403);
    }
    if (booking.status === 'confirmed') throw new AppError('Booking already confirmed', 400);
    if (booking.status === 'cancelled') throw new AppError('Booking is cancelled', 400);

    return bookingRepository.updateStatus(bookingId, 'confirmed', 'paid');
  }

  async cancelBooking(bookingId, userId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.userId._id.toString() !== userId.toString()) {
      throw new AppError('Not authorized', 403);
    }
    if (booking.status === 'cancelled') throw new AppError('Booking already cancelled', 400);

    await flightRepository.updateSeats(booking.flightId._id, booking.seatNumber, false);
    return bookingRepository.updateStatus(bookingId, 'cancelled', 'refunded');
  }

  async getUserBookings(userId) {
    return bookingRepository.findByUser(userId);
  }

  async getBookingById(bookingId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
  }

  async getAllBookings() {
    return bookingRepository.findAll();
  }
}

module.exports = new BookingService();
