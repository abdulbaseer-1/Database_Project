const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', busController.getAllBuses);
router.get('/:id', busController.getBusById);

router.post('/', authenticateJWT, authorizeRoles('admin'), busController.createBus);
router.put('/:id', authenticateJWT, authorizeRoles('admin'), busController.updateBus);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), busController.deleteBus);

module.exports = router;