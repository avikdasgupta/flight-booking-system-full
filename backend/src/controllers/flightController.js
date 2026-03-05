const flightService = require('../services/flightService');

class FlightController {
  async createFlight(req, res) {
    const flight = await flightService.createFlight(req.body);
    res.status(201).json({ status: 'success', data: { flight } });
  }

  async getAllFlights(req, res) {
    const { page, limit } = req.query;
    const result = await flightService.getAllFlights({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    res.status(200).json({ status: 'success', data: result });
  }

  async searchFlights(req, res) {
    const { origin, destination, date, page, limit } = req.query;
    const result = await flightService.searchFlights({
      origin,
      destination,
      date,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    res.status(200).json({ status: 'success', data: result });
  }

  async getFlightById(req, res) {
    const flight = await flightService.getFlightById(req.params.id);
    res.status(200).json({ status: 'success', data: { flight } });
  }
}

module.exports = new FlightController();
