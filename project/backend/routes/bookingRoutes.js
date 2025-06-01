import { Router } from 'express';

const router = Router();

import bookingController from '../controllers/bookingController.js';
import authenticateJWT from'../middleware/authenticateJWT.js';

router.post('/', authenticateJWT, bookingController.createBooking);
router.get('/', authenticateJWT, bookingController.getAllBookings);
router.get('/filters', authenticateJWT, bookingController.getBookingFilters);
router.get('/my', authenticateJWT, bookingController.getMyBookings);
router.delete('/:id', authenticateJWT, bookingController.cancelBooking);

export default router;
