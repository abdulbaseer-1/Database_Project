import { Router } from 'express';

const router = Router();

import userController from '../controllers/userController.js';
import authenticateJWT from'../middleware/authenticateJWT.js';

router.get('/me', authenticateJWT, userController.getProfile);
router.put('/me', authenticateJWT, userController.updateProfile);

export default router;
