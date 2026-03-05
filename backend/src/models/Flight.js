const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    class: { type: String, enum: ['economy', 'business', 'first'], default: 'economy' },
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: [true, 'Flight number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    airline: {
      type: String,
      required: [true, 'Airline is required'],
      trim: true,
    },
    origin: {
      type: String,
      required: [true, 'Origin is required'],
      uppercase: true,
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      uppercase: true,
      trim: true,
    },
    departureTime: {
      type: Date,
      required: [true, 'Departure time is required'],
    },
    arrivalTime: {
      type: Date,
      required: [true, 'Arrival time is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'At least 1 seat required'],
    },
    availableSeats: {
      type: Number,
      min: [0, 'Available seats cannot be negative'],
    },
    seatMap: [seatSchema],
  },
  { timestamps: true }
);

flightSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
    if (!this.seatMap || this.seatMap.length === 0) {
      this.seatMap = Array.from({ length: this.totalSeats }, (_, i) => ({
        seatNumber: `${Math.floor(i / 6) + 1}${String.fromCharCode(65 + (i % 6))}`,
        class: 'economy',
        isBooked: false,
      }));
    }
  }
  next();
});

flightSchema.index({ origin: 1, destination: 1, departureTime: 1 });

module.exports = mongoose.model('Flight', flightSchema);
