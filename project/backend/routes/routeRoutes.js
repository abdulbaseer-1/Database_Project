import { Router } from 'express';

const router = Router();

import routeController from '../controllers/routeController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRouteById);

router.post('/', authenticateJWT, authorizeRoles('admin'), routeController.createRoute);
router.put('/:id', authenticateJWT, authorizeRoles('admin'), routeController.updateRoute);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), routeController.deleteRoute);

export default router;
