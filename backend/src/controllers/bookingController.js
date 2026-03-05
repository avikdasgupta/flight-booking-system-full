const bookingService = require('../services/bookingService');

class BookingController {
  async lockSeat(req, res) {
    const { flightId, seatNumber } = req.body;
    const result = await bookingService.lockSeat(flightId, seatNumber, req.user.id);
    res.status(200).json({ status: 'success', data: result });
  }

  async createBooking(req, res) {
    const { flightId, seatNumber, passengerName, passengerEmail } = req.body;
    const booking = await bookingService.createBooking({
      userId: req.user.id,
      flightId,
      seatNumber,
      passengerName,
      passengerEmail,
    });
    res.status(201).json({ status: 'success', data: { booking } });
  }

  async confirmBooking(req, res) {
    const booking = await bookingService.confirmBooking(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data: { booking } });
  }

  async cancelBooking(req, res) {
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data: { booking } });
  }

  async getUserBookings(req, res) {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.status(200).json({ status: 'success', data: { bookings } });
  }

  async getBookingById(req, res) {
    const booking = await bookingService.getBookingById(req.params.id);
    res.status(200).json({ status: 'success', data: { booking } });
  }

  async getAllBookings(req, res) {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json({ status: 'success', data: { bookings } });
  }
}

module.exports = new BookingController();
