import { Router } from 'express';

const router = Router();

import adminController from '../controllers/adminController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

// Admin-only dashboard or analytics, for example
router.get('/dashboard', authenticateJWT, authorizeRoles('admin'), adminController.dashboard);

export default router;
