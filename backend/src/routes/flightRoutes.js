const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/search', flightController.searchFlights);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.post('/', protect, restrictTo('admin'), flightController.createFlight);

module.exports = router;
