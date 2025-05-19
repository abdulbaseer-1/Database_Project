const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', routeController.getAllRoutes);
router.get('/:id', routeController.getRouteById);

router.post('/', authenticateJWT, authorizeRoles('admin'), routeController.createRoute);
router.put('/:id', authenticateJWT, authorizeRoles('admin'), routeController.updateRoute);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), routeController.deleteRoute);

module.exports = router;
