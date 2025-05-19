const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/:busId', locationController.getLiveLocation);
router.post('/', authenticateJWT, authorizeRoles('admin'), locationController.updateLocation);

module.exports = router;
