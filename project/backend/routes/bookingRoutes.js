const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/', authenticateJWT, bookingController.createBooking);
router.get('/my', authenticateJWT, bookingController.getMyBookings);
router.delete('/:id', authenticateJWT, bookingController.cancelBooking);

module.exports = router;
