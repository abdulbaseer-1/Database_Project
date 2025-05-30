import { Router } from 'express';

const router = Router();
import busController from '../controllers/busController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';
import authorizeRoles from '../middleware/authorizeRoles.js';

router.get('/', busController.getAllBuses);
router.get('/bustable', busController.getBusForBookingsTable);
router.get('/filters',busController.getFilteredData);
router.get('/:id', busController.getBusById);

router.post('/', authenticateJWT, authorizeRoles('admin'), busController.createBus);
router.put('/:id', authenticateJWT, authorizeRoles('admin'), busController.updateBus);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), busController.deleteBus);

export default router;