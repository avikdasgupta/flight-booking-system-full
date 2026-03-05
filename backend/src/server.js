const app = require('./app');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await connectRedis().catch((err) => {
      logger.warn(`Redis connection failed (non-fatal): ${err.message}`);
    });
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (err) {
    logger.error(`Startup error: ${err.message}`);
    process.exit(1);
  }
};

start();
