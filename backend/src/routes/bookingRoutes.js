const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.post('/lock-seat', bookingController.lockSeat);
router.post('/', bookingController.createBooking);
router.get('/my', bookingController.getUserBookings);
router.get('/all', restrictTo('admin'), bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/confirm', bookingController.confirmBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
