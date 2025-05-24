import { Router } from 'express';

const router = Router();

import bookingController from '../controllers/bookingController.js';
import authenticateJWT from'../middleware/authenticateJWT.js';

router.post('/', authenticateJWT, bookingController.createBooking);
router.get('/my', authenticateJWT, bookingController.getMyBookings);
router.delete('/:id', authenticateJWT, bookingController.cancelBooking);

export default router;
