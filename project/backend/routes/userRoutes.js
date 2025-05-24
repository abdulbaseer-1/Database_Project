import { Router } from 'express';
import userController from '../controllers/userController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';

const router = Router();


// Route to fetch the authenticated user's profile
router.get('/me', authenticateJWT, userController.getProfile);

// Route to update the authenticated user's profile
router.put('/me', authenticateJWT, userController.updateProfile);

// Route to create a new user (registration)
router.post('/register', userController.createUser);

// Route to login and get a JWT token
router.post('/login', userController.loginUser);

// Route to delete the authenticated user
router.delete('/me', authenticateJWT, userController.deleteUser);

// Route to logout the user (clear JWT token or session)
router.post('/logout', authenticateJWT, userController.logoutUser);

export default router;
