const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  // Reuse existing connection (important for serverless environments like Vercel)
  if (mongoose.connection.readyState >= 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
