const flightRepository = require('../repositories/flightRepository');
const { getRedisClient } = require('../config/redis');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const CACHE_TTL = 60; // seconds

class FlightService {
  async createFlight(flightData) {
    return flightRepository.create(flightData);
  }

  async getAllFlights(query) {
    return flightRepository.findAll(query);
  }

  async getFlightById(id) {
    const flight = await flightRepository.findById(id);
    if (!flight) throw new AppError('Flight not found', 404);
    return flight;
  }

  async searchFlights(params) {
    const redis = getRedisClient();
    const cacheKey = `flights:search:${JSON.stringify(params)}`;

    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          logger.info('Flight search cache hit');
          return JSON.parse(cached);
        }
      } catch (err) {
        logger.warn(`Redis cache read error: ${err.message}`);
      }
    }

    const result = await flightRepository.search(params);

    if (redis) {
      try {
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(result));
      } catch (err) {
        logger.warn(`Redis cache write error: ${err.message}`);
      }
    }

    return result;
  }
}

module.exports = new FlightService();
