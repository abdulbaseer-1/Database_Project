const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRoles = require('../middleware/authorizeRoles');

// Admin-only dashboard or analytics, for example
router.get('/dashboard', authenticateJWT, authorizeRoles('admin'), adminController.dashboard);

module.exports = router;
