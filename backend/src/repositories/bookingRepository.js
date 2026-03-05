const Booking = require('../models/Booking');

class BookingRepository {
  async create(bookingData) {
    return Booking.create(bookingData);
  }

  async findById(id) {
    return Booking.findById(id).populate('flightId', 'airline origin destination departureTime arrivalTime flightNumber').populate('userId', 'name email');
  }

  async findByUser(userId) {
    return Booking.find({ userId })
      .populate('flightId', 'airline origin destination departureTime arrivalTime flightNumber price')
      .sort({ createdAt: -1 });
  }

  async findByFlight(flightId) {
    return Booking.find({ flightId, status: { $ne: 'cancelled' } });
  }

  async updateStatus(id, status, paymentStatus) {
    const update = { status };
    if (paymentStatus) update.paymentStatus = paymentStatus;
    return Booking.findByIdAndUpdate(id, update, { new: true });
  }

  async findAll() {
    return Booking.find()
      .populate('userId', 'name email')
      .populate('flightId', 'airline origin destination departureTime')
      .sort({ createdAt: -1 });
  }
}

module.exports = new BookingRepository();
