const Flight = require('../models/Flight');

class FlightRepository {
  async create(flightData) {
    return Flight.create(flightData);
  }

  async findAll({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [flights, total] = await Promise.all([
      Flight.find().skip(skip).limit(limit).lean(),
      Flight.countDocuments(),
    ]);
    return { flights, total, page, pages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return Flight.findById(id);
  }

  async search({ origin, destination, date, page = 1, limit = 10 }) {
    const query = {};
    if (origin) query.origin = origin.toUpperCase();
    if (destination) query.destination = destination.toUpperCase();
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: start, $lte: end };
    }

    const skip = (page - 1) * limit;
    const [flights, total] = await Promise.all([
      Flight.find(query).skip(skip).limit(limit).lean(),
      Flight.countDocuments(query),
    ]);
    return { flights, total, page, pages: Math.ceil(total / limit) };
  }

  async updateSeats(flightId, seatNumber, isBooked) {
    return Flight.findOneAndUpdate(
      { _id: flightId, 'seatMap.seatNumber': seatNumber },
      {
        $set: { 'seatMap.$.isBooked': isBooked },
        $inc: { availableSeats: isBooked ? -1 : 1 },
      },
      { new: true }
    );
  }
}

module.exports = new FlightRepository();
